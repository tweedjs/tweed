import StringRenderer from './StringRenderer'

export default class HTTPRenderer {
  constructor (response) {
    this._parent = new StringRenderer((html) => {
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      })

      response.end(html)
    })
  }

  render (node) {
    this._parent.render(node)
  }
}
