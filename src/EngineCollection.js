let INSTANCE

export default class EngineCollection {
  _engines = []
  _isDirty = false

  static get instance () {
    return INSTANCE || (INSTANCE = new EngineCollection())
  }

  connectEngine (engine) {
    this._engines.push(engine)
  }

  notify (obj, prop, sync, newValue, oldValue) {
    if (sync) {
      this._notify()
      return
    }

    if (this._isDirty) { return }
    this._isDirty = true

    this._tick(() => {
      this._isDirty = false
      this._notify()
    })
  }

  _notify () {
    for (let i = 0; i < this._engines.length; i++) {
      this._engines[i].rerender()
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
