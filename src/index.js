import { html } from 'snabbdom-jsx'

export Engine from './Engine'

export function Node (tagName, attributes, ...children) {
  return html(tagName, attributes || undefined, children.map(normalize))
}

function normalize (renderable) {
  if (renderable == null || typeof renderable !== 'object') {
    return renderable
  }

  if (typeof renderable.render === 'function') {
    return renderable.render()
  }

  return renderable
}

const g = typeof window === 'undefined' ? global : window

if (g.React == null) {
  g.React = {
    createElement: Node
  }
}
