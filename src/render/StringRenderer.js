import Engine from '../Engine'
import toHTML from 'snabbdom-to-html'

export class StringRenderer {
  constructor (listener) {
    this._listener = listener
  }

  render (node) {
    this._listener(toHTML(node))
  }
}

export default function render (factory, listener) {
  const engine = new Engine(new StringRenderer(listener))

  engine.render(factory)
}
