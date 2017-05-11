import Engine from '../Engine'
import { init } from 'snabbdom'

import ClassPlugin from '../plugins/ClassPlugin'
import EventsPlugin from '../plugins/EventsPlugin'
import HooksPlugin from '../plugins/HooksPlugin'
import StylePlugin from '../plugins/StylePlugin'
import InnerHTMLPlugin from '../plugins/InnerHTMLPlugin'
import InnerHTMLPluginDriver from '../plugins/InnerHTMLPlugin.dom'

import AttributesPlugin from '../plugins/AttributesPlugin'

Engine.plugins = [
  new ClassPlugin(require('snabbdom/modules/class')),
  new EventsPlugin(require('snabbdom/modules/eventlisteners')),
  new HooksPlugin(),
  new StylePlugin(require('snabbdom/modules/style')),
  new InnerHTMLPlugin(InnerHTMLPluginDriver),
  new AttributesPlugin(require('snabbdom/modules/attributes'))
]

const patch = init(Engine.snabbdomModules)

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
