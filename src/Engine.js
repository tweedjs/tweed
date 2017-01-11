import { UPDATE, STATEFUL, MUTATING_FIELDS } from './Symbols'

export default class Engine {
  _isDirty = false

  constructor (renderer) {
    this._renderer = renderer
  }

  render (factory) {
    this._watchedObjects = []
    this._watch(factory, this.render.bind(this, factory))

    this._renderer.render(factory.render())
  }

  _watch (obj, rerender) {
    if (typeof obj !== 'object' || obj == null) {
      return obj
    }

    const isWatched = this._watchedObjects.indexOf(obj) !== -1

    if (!isWatched) {
      this._watchedObjects.push(obj)

      if (this._isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          this._watch(obj[i], rerender)
        }
      } else {
        for (const prop in obj) {
          const mutFields = obj[MUTATING_FIELDS]
          if (obj.hasOwnProperty(prop) || mutFields && mutFields.indexOf(prop) !== -1) {
            this._watch(obj[prop], rerender)
          }
        }
      }
    }

    const isStateful = !!obj[STATEFUL]

    if (isStateful) {
      obj[UPDATE] = () => {
        if (this._isDirty) { return }

        this._isDirty = true

        this._tick(() => {
          this._isDirty = false
          rerender()
        })
      }
    }
  }

  _tick (callback) {
    if (typeof requestIdleCallback !== 'undefined') {
      /* global requestIdleCallback */
      return requestIdleCallback(callback)
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      /* global requestAnimationFrame */
      return requestAnimationFrame(callback)
    }

    setTimeout(callback)
  }

  _isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }
}
