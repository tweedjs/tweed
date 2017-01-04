const createSymbol = typeof Symbol === 'undefined' ? String : Symbol

export const UPDATE = createSymbol('[[UPDATE]]')
export const STATEFUL = createSymbol('[[STATEFUL]]')
export const WATCHED = createSymbol('[[WATCHED]]')

export default class Engine {
  constructor (renderer) {
    this._renderer = renderer
  }

  render (factory) {
    this._watch(factory, this.render.bind(this, factory))

    this._renderer.render(factory.render())
  }

  _watch (obj, rerender) {
    if (typeof obj !== 'object' || obj == null) {
      return obj
    }

    if (this._isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        this._watch(obj[i], rerender)
      }
    } else {
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          this._watch(obj[prop], rerender)
        }
      }
    }

    const isAlreadyWatched = obj[WATCHED]
    const isNotStateful = !obj[STATEFUL]
    const isNotWatchable = typeof obj.render !== 'function'

    if (isAlreadyWatched || isNotStateful || isNotWatchable) {
      return
    }

    obj[UPDATE] = rerender

    obj[WATCHED] = true
  }

  _isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }
}
