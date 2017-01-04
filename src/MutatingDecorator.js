import { UPDATE, STATEFUL } from './Engine'

export default function MutatingDecorator (prototype, name, desc) {
  if (!prototype[STATEFUL]) {
    prototype[STATEFUL] = true
  }

  const createSymbol = typeof Symbol === 'undefined' ? String : Symbol
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
