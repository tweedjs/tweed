export default class AttributesPlugin {
  constructor (snabbdomModule) {
    this.snabbdomModule = snabbdomModule
  }

  consumeAttributes (data, attributes) {
    data.attrs = {}

    for (let p in attributes) {
      data.attrs[p] = attributes[p]
      delete attributes[p]
    }
  }
}
