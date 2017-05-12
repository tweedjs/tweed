import { VirtualNode } from '../../VirtualNode'

export let renderHistory = []

export default function (engine, factory) {
  renderHistory[engine.__id] = renderHistory[engine.__id] || createHistory()

  const factoryCopy = deepCopy(factory)

  renderHistory[engine.__id].push({
    time: Date.now(),
    engine,
    factory: factoryCopy,
    navigateTo: () => {
      engine.render(factoryCopy)
    }
  })
}

function createHistory () {
  let history = []
  history.replay = () => {
    if (history.length === 0) { return }

    const startTime = history[0].time

    history.forEach((frame) => {
      const offset = frame.time - startTime

      setTimeout(() => {
        frame.navigateTo()
      }, offset)
    })
  }
  return history
}

let objectsBeingCopied = []
let copiesBeingCreated = []

function deepCopy (object) {
  if (objectsBeingCopied.indexOf(object) > -1) {
    return copiesBeingCreated[objectsBeingCopied.indexOf(object)]
  }

  let copy = Object.create(Object.getPrototypeOf(object))

  objectsBeingCopied.push(object)
  copiesBeingCreated.push(copy)

  for (let p in object) {
    if (typeof object[p] === 'object' && object[p] != null) {
      if (object[p] instanceof VirtualNode) {
        copy[p] = object[p]
      } else {
        copy[p] = deepCopy(object[p])
      }
    } else {
      copy[p] = object[p]
    }
  }

  objectsBeingCopied.splice(objectsBeingCopied.indexOf(object), 1)
  copiesBeingCreated.splice(copiesBeingCreated.indexOf(copy), 1)

  return copy
}

;(typeof window === 'undefined' ? global : window).renderHistory = renderHistory
