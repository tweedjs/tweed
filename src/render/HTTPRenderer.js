import StringRenderer from './StringRenderer'

const DEFAULT_LOGGER = {
  warn: console.error.bind(console)
}

export default class HTTPRenderer {
  constructor (response, logger = DEFAULT_LOGGER) {
    let locked = false
    this._parent = new StringRenderer((html) => {
      if (locked) {
        logger.warn(new Error(
          'The UI automatically re-rendered after initial render. The new render ' +
          "wasn't sent to the client. Make sure you're not assigning to a mutating " +
          'property twice in its constructor.\n\n' +

          "For anything client specific, add a 'mounted' callback to the component " +
          "and call that after 'engine.render(...)' in the client entry file."
        ))
        return
      }

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
