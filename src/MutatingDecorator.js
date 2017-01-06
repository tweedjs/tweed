import { createSymbol, UPDATE, STATEFUL, MUTATING_FIELDS } from './Symbols'

export default function MutatingDecorator (prototype, name, desc) {
  if (!prototype[STATEFUL]) {
    prototype[STATEFUL] = true
  }

  if (prototype[MUTATING_FIELDS] == null) {
    prototype[MUTATING_FIELDS] = []
  }

  prototype[MUTATING_FIELDS].push(name)

  const VALUE = createSymbol(`[[actual ${name}]]`)

  if (desc && desc.initializer) {
    prototype[VALUE] = desc.initializer()
  }

  const descriptor = {
    enumerable: true,
    configurable: false,
    get () {
      return this[VALUE]
    },
    set (newValue) {
      const oldValue = this[VALUE]

      this[VALUE] = newValue

      if (UPDATE in this) {
        this[UPDATE](newValue, oldValue)
      }
    }
  }

  Object.defineProperty(prototype, name, descriptor)

  return {}
}
