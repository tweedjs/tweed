export default class StylePlugin {
  constructor (snabbdomModule) {
    this.snabbdomModule = snabbdomModule
  }

  consumeAttributes (data, attributes) {
    data.style = {}

    for (let a in attributes) {
      if (a === 'style') {
        for (let styleProp in attributes[a]) {
          data.style[styleProp] = attributes[a][styleProp]
        }
        delete attributes[a]
        continue
      }
      if (a.slice(0, 6) === 'style-') {
        const styleProp = a.slice(6)
        data.style[styleProp] = attributes[a]
        delete attributes[a]
      }
    }
  }
}
