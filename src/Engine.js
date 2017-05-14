import { UPDATE, STATEFUL, MUTATING_FIELDS } from './Symbols'
import isArray from './isArray'

let ENGINE_INSTANCE_ID = -1

export default class Engine {
  _isDirty = false

  static plugins = []

  constructor (renderer) {
    this._renderer = renderer

    if (process.env.NODE_ENV !== 'production') {
      this.__id = ++ENGINE_INSTANCE_ID
    }
  }

  static get snabbdomModules () {
    const getModules = (p) => p.snabbdomModules

    return this.plugins
      .filter(getModules)
      .map(getModules)
      .reduce((a, b) => a.concat(b))
  }

  render (factory) {
    const rerender = this.render.bind(this, factory)

    this._watchedObjects = []
    this._watch(factory, rerender)

    const vdom = typeof factory.render === 'function'
      ? factory.render()
      : factory.render

    this._renderer.render(vdom)

    if (vdom._trackedChildren != null) {
      vdom._trackedChildren.forEach(
        (c) => this._watch(c, rerender)
      )
    }

    if (process.env.NODE_ENV !== 'production') {
      require('./dev/introspection/onRender').default(this, factory, vdom)
    }
  }

  isWatching (obj) {
    return this._watchedObjects.indexOf(obj) > -1
  }

  _watch (obj, rerender) {
    if (typeof obj !== 'object' || obj == null) {
      return obj
    }

    const isWatched = this._watchedObjects.indexOf(obj) !== -1

    if (!isWatched) {
      this._watchedObjects.push(obj)

      if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          this._watch(obj[i], rerender)
        }
      } else {
        for (const prop in obj) {
          const mutFields = obj[MUTATING_FIELDS]
          if ((obj.hasOwnProperty && obj.hasOwnProperty(prop)) || (mutFields && mutFields.indexOf(prop) !== -1)) {
            this._watch(obj[prop], rerender)
          }
        }
      }

      const isStateful = !!obj[STATEFUL]

      if (isStateful) {
        obj[UPDATE] = (sync = false) => {
          if (sync) {
            rerender()
            return
          }

          if (this._isDirty) { return }

          this._isDirty = true

          this._tick(() => {
            this._isDirty = false
            rerender()
          })
        }
      }
    }
  }

  _tick (callback) {
    if (typeof requestIdleCallback !== 'undefined') {
      /* global requestIdleCallback */
      return requestIdleCallback(callback, { timeout: 100 })
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      /* global requestAnimationFrame */
      return requestAnimationFrame(callback)
    }

    setTimeout(callback)
  }
}
