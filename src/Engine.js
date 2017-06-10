import EngineCollection from './EngineCollection'

let ENGINE_INSTANCE_ID = -1

export default class Engine {
  static plugins = []

  constructor (renderer) {
    this._renderer = renderer

    if (process.env.NODE_ENV !== 'production') {
      this.__id = ++ENGINE_INSTANCE_ID
    }

    EngineCollection.instance.connectEngine(this)
  }

  static get snabbdomModules () {
    const getModules = (p) => p.snabbdomModules

    return this.plugins
      .filter(getModules)
      .map(getModules)
      .reduce((a, b) => a.concat(b))
  }

  render (factory) {
    this.rerender = this.render.bind(this, factory)

    const vdom = typeof factory.render === 'function'
      ? factory.render()
      : factory.render

    this._renderer.render(vdom)

    if (process.env.NODE_ENV !== 'production') {
      require('./dev/introspection/onRender').default(this, factory, vdom)
    }
  }
}
