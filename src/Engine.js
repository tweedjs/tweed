export default class Engine {
  constructor (renderer) {
    this._renderer = renderer
  }

  render (factory) {
    this._renderer.render(factory.render())
  }
}
