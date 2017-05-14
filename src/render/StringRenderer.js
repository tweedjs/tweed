import Engine from '../Engine'
import init from 'snabbdom-to-html/init'

import ClassPlugin from '../plugins/ClassPlugin'
import EventsPlugin from '../plugins/EventsPlugin'
import HooksPlugin from '../plugins/HooksPlugin'
import StylePlugin from '../plugins/StylePlugin'
import InnerHTMLPlugin from '../plugins/InnerHTMLPlugin'
import InnerHTMLPluginDriver from '../plugins/InnerHTMLPlugin.string'

import AttributesPlugin from '../plugins/AttributesPlugin'

Engine.plugins = [
  new ClassPlugin([require('snabbdom-to-html/modules/class')]),
  new EventsPlugin([]), // Noop but consumes attributes
  new HooksPlugin([]),
  new StylePlugin([require('snabbdom-to-html/modules/style')]),
  new InnerHTMLPlugin([InnerHTMLPluginDriver]),
  new AttributesPlugin([
    require('snabbdom-to-html/modules/attributes'),
    require('snabbdom-to-html/modules/props')
  ])
]

const toHTML = init(Engine.snabbdomModules)

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
