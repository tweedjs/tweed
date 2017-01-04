import { html } from 'snabbdom-jsx'

export Engine from './Engine'
export mutating from './MutatingDecorator'

export function Node (tagName, attributes, ...children) {
  return html(tagName, attributes || undefined, children.map(normalize))
}

function normalize (renderable) {
  if (renderable == null || typeof renderable !== 'object') {
    return String(renderable)
  }

  if (typeof renderable.render === 'function') {
    return renderable.render()
  }

  return renderable
}

// This part makes JSX work even if someone is using a transpiler
// that converts to `React.createElement` instead of `Node`.
const g = typeof window === 'undefined' ? global : window
if (g.React == null) {
  g.React = {
    createElement: Node
  }
}
