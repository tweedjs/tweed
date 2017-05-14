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
            if (c) {
              data.class[c] = true
            }
          })
        } else if (classNames != null && typeof classNames === 'object') {
          for (let name in classNames) {
            if (classNames[name]) {
              data.class[name] = classNames[name]
            }
          }
        } else if (typeof classNames === 'undefined') {
          // Skip undefined
        } else {
          if (process.env.NODE_ENV !== 'production') {
            const message = `Invalid <code>${a}</code> attribute. Must be object or string, but was <code>${classNames}</code>.`
            const stack = new Error().stack
            const unique = stack + message
            this.__informedAboutInvalid = this.__informedAboutInvalid || {}

            if (unique in this.__informedAboutInvalid) {
              continue
            }

            this.__informedAboutInvalid[message] = true

            require('../dev/Console').default.error(message)
          }
        }

        continue
      }

      if (a.slice(0, 6) === 'class-') {
        const className = a.slice(6)
        const active = attributes[a]
        delete attributes[a]

        if (className) {
          data.class[className] = !!active
        }
      }
    }
  }
}
