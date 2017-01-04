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

export default class DOMRenderer {
  constructor (element) {
    this._root = element
  }

  render (node) {
    this._root = patch(this._root, node)
  }
}
