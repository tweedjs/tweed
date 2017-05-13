import { mutating } from '..'

let awaitedPromises = []
let awaitedRenderablePromises = []
let awaitedRenderablePromiseStacks = []

export default class RenderablePromisePlugin {
  snabbdomModules = [{ update: this.update }]

  consumeAttributes () {}

  transformRenderable (renderable) {
    if (typeof renderable === 'object' && typeof renderable.then === 'function') {
      if (awaitedPromises.indexOf(renderable) > -1) {
        return awaitedRenderablePromises[awaitedPromises.indexOf(renderable)]
      }

      const p = new RenderablePromise(renderable)

      if (process.env.NODE_ENV !== 'production') {
        p.__stack = new Error().stack
      }

      return p
    }
  }

  update (oldVNode, newVNode) {
    const oldTracked = oldVNode._ownTrackedChildren || []
    const newTracked = newVNode._ownTrackedChildren || []

    for (let i = 0; i < oldTracked.length; i++) {
      const tracked = oldTracked[i]

      if (process.env.NODE_ENV !== 'production') {
        if (
          oldTracked[i] instanceof RenderablePromise &&
          newTracked[i] instanceof RenderablePromise &&
          oldTracked[i] !== newTracked[i] &&
          oldTracked[i].__stack === newTracked[i].__stack
        ) {
          ;(typeof window !== 'undefined' ? global : window).dontMakePromisesInRenderStack = newVNode.__stack
          require('../dev/messages/dontMakePromisesInRender')
        }
      }

      if (newTracked.indexOf(tracked) > -1) {
        continue
      }

      const index = awaitedRenderablePromises.indexOf(tracked)
      if (index === -1) {
        continue
      }

      awaitedPromises.splice(index, 1)
      awaitedRenderablePromises.splice(index, 1)
      if (process.env.NODE_ENV !== 'production') {
        awaitedRenderablePromiseStacks.splice(index, 1)
      }
    }
  }
}

class RenderablePromise {
  @mutating value = null

  constructor (promise) {
    this._promise = promise

    awaitedPromises.push(promise)
    awaitedRenderablePromises.push(this)

    promise.then((v) => {
      this.value = v
    })
  }

  render () {
    return this.value
  }
}
