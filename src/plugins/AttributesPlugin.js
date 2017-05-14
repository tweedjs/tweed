const SHOULD_BE_PROPS = [
  'value'
]

export default class AttributesPlugin {
  constructor (snabbdomModules) {
    this.snabbdomModules = snabbdomModules
  }

  consumeAttributes (data, attributes) {
    data.attrs = {}
    data.props = {}

    for (let p in attributes) {
      if (SHOULD_BE_PROPS.indexOf(p) > -1) {
        data.props[p] = attributes[p]
      } else {
        data.attrs[p] = attributes[p]
      }
      delete attributes[p]
    }
  }
}
