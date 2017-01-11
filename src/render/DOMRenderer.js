import Engine from '../Engine'
import { init } from 'snabbdom'

import ClassPlugin from 'snabbdom/modules/class'
import PropsPlugin from 'snabbdom/modules/props'
import StylePlugin from 'snabbdom/modules/style'
import EventsPlugin from 'snabbdom/modules/eventlisteners'

const patch = init([
  ClassPlugin,
  PropsPlugin,
  StylePlugin,
  EventsPlugin
])

export class DOMRenderer {
  constructor (element) {
    if (element == null) {
      throw new Error('Root element was null.')
    }

    this._root = element
  }

  render (node) {
    this._root = patch(this._root, node)
  }
}

export default function render (factory, element) {
  const engine = new Engine(new DOMRenderer(element))

  engine.render(factory)
}
