import toHTML from 'snabbdom-to-html'

export default class StringRenderer {
  constructor (listener) {
    this._listener = listener
  }

  render (node) {
    this._listener(toHTML(node))
  }
}
