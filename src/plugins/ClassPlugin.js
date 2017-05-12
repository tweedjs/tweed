export default class ClassPlugin {
  constructor (snabbdomModules) {
    this.snabbdomModules = snabbdomModules
  }

  consumeAttributes (data, attributes) {
    data.class = {}

    for (let a in attributes) {
      if (process.env.NODE_ENV !== 'production') {
        if (a === 'className') {
          require('../dev/messages/classNameIsDeprecated')
        }
      }

      if (a === 'class' || a === 'className') {
        const classNames = attributes[a]
        delete attributes[a]

        if (typeof classNames === 'string') {
          classNames.split(' ').forEach((c) => {
            data.class[c] = true
          })
        } else if (typeof classNames === 'object') {
          for (let name in classNames) {
            data.class[name] = classNames[name]
          }
        } else {
          throw new Error(`Invalid ${a} attribute. Must be object or string.`)
        }

        continue
      }

      if (a.slice(0, 6) === 'class-') {
        const className = a.slice(6)
        const active = attributes[a]
        delete attributes[a]

        data.class[className] = active
      }
    }
  }
}
