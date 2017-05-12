export default class InnerHTMLPlugin {
  constructor (snabbdomModules) {
    this.snabbdomModules = snabbdomModules
  }

  consumeAttributes (data, attributes) {
    if ('innerHTML' in attributes) {
      if (process.env.NODE_ENV !== 'production') {
        require('../dev/messages/innerHTMLCanBeDangerous')
      }
      const html = attributes.innerHTML
      data.innerHTML = html
      delete attributes.innerHTML
    }
  }
}
