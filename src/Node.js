import { html } from 'snabbdom-jsx'
import isArray from './isArray'

export default function Node (tagName, attributes, ...children) {
  if (
    attributes != null &&
    typeof attributes['class'] === 'string'
  ) {
    attributes.className = attributes['class']
    delete attributes['class']
  }
  return html(tagName, attributes || undefined, children.filter(invalid).map(normalize))
}

function invalid (renderable) {
  if (renderable == null) {
    return false
  }

  if (renderable === '') {
    return false
  }

  return true
}

function normalize (renderable) {
  if (isArray(renderable)) {
    return renderable.map(normalize)
  }

  if (typeof renderable !== 'object') {
    return String(renderable)
  }

  if (typeof renderable.render === 'function') {
    return renderable.render()
  }

  return renderable
}
