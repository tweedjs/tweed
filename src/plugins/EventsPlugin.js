export default class EventsPlugin {
  constructor (snabbdomModules) {
    this.snabbdomModules = snabbdomModules
  }

  consumeAttributes (data, attributes) {
    data.on = {}

    for (let a in attributes) {
      if (a === 'on') {
        for (let eventName in attributes[a]) {
          data.on[eventName] = attributes[a][eventName]
        }
        delete attributes[a]
        continue
      }
      if (a.slice(0, 3) === 'on-') {
        const eventName = a.slice(3)
        data.on[eventName] = attributes[a]
        delete attributes[a]
      }
    }
  }
}
