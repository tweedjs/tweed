export default class HooksPlugin {
  consumeAttributes (data, attributes) {
    data.hook = {}

    for (let a in attributes) {
      if (a === 'hook') {
        for (let hookName in attributes[a]) {
          data.hook[hookName] = attributes[a][hookName]
        }
        delete attributes[a]
        continue
      }
      if (a.slice(0, 5) === 'hook-') {
        const hookName = a.slice(5)
        data.hook[hookName] = attributes[a]
        delete attributes[a]
      }
    }
  }
}
