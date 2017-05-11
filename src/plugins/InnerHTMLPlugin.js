export default class InnerHTMLPlugin {
  constructor (snabbdomModule) {
    this.snabbdomModule = snabbdomModule
  }

  consumeAttributes (data, attributes) {
    if ('innerHTML' in attributes) {
      const html = attributes.innerHTML
      data.innerHTML = html
      delete attributes.innerHTML
    }
  }
}
