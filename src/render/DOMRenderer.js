import Engine from '../Engine'
import { init } from 'snabbdom/es/snabbdom'

import ClassPlugin from '../plugins/ClassPlugin'
import EventsPlugin from '../plugins/EventsPlugin'
import HooksPlugin from '../plugins/HooksPlugin'
import StylePlugin from '../plugins/StylePlugin'
import InnerHTMLPlugin from '../plugins/InnerHTMLPlugin'
import InnerHTMLPluginDriver from '../plugins/InnerHTMLPlugin.dom'
import RenderablePromisePlugin from '../plugins/RenderablePromisePlugin'

import AttributesPlugin from '../plugins/AttributesPlugin'

import classModule from 'snabbdom/es/modules/class'
import eventListenersModule from 'snabbdom/es/modules/eventlisteners'
import styleModule from 'snabbdom/es/modules/style'
import attributesModule from 'snabbdom/es/modules/attributes'
import propsModule from 'snabbdom/es/modules/props'

Engine.plugins = [
  new ClassPlugin([classModule]),
  new EventsPlugin([eventListenersModule]),
  new HooksPlugin([]),
  new StylePlugin([styleModule]),
  new InnerHTMLPlugin([InnerHTMLPluginDriver]),
  new RenderablePromisePlugin(),
  new AttributesPlugin([
    attributesModule,
    propsModule
  ])
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
