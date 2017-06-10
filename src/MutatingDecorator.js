import { createSymbol, STATEFUL, MUTATING_FIELDS } from './Symbols'
import isArray from './isArray'
import EngineCollection from './EngineCollection'

export default function MutatingDecorator (sync, prototype, name, desc) {
  if (!prototype[STATEFUL]) {
    prototype[STATEFUL] = true
  }

  if (prototype[MUTATING_FIELDS] == null) {
    prototype[MUTATING_FIELDS] = []
  }

  prototype[MUTATING_FIELDS].push(name)

  const VALUE = createSymbol(`[[actual ${name}]]`)

  if (desc && desc.initializer) {
    let initialValue = desc.initializer()

    if (isArray(initialValue)) {
      wrapArray(sync, initialValue)
    }

    prototype[VALUE] = initialValue
  }

  const descriptor = {
    enumerable: true,
    configurable: false,
    get () {
      return this[VALUE]
    },
    set (newValue) {
      const oldValue = this[VALUE]

      if (isArray(newValue)) {
        wrapArray(sync, newValue, name)
      }

      this[VALUE] = newValue

      EngineCollection.instance
        .notify(this, name, sync, newValue, oldValue)
    }
  }

  Object.defineProperty(prototype, name, descriptor)

  return {}
}

const MUTATOR_METHODS = [
  'copyWithin', 'fill', 'pop', 'push',
  'reverse', 'shift', 'sort', 'splice', 'unshift'
]

function wrapArray (sync, subject, arrayPropName) {
  MUTATOR_METHODS.forEach((name) => {
    if (typeof subject[name] === 'function') {
      const method = subject[name]
      subject[name] = function () {
        const oldValue = process.env.NODE_ENV === 'production'
          ? this : this.slice()
        const returnValue = method.apply(this, arguments)
        const newValue = this
        ensureSetters(sync, this)
        EngineCollection.instance
          .notify(subject, arrayPropName, sync, newValue, oldValue)
        return returnValue
      }
    }
  })
}

function ensureSetters (sync, array) {
  if (!array[STATEFUL]) {
    array[STATEFUL] = true
  }

  if (array[MUTATING_FIELDS] == null) {
    array[MUTATING_FIELDS] = []
  }

  for (let i = 0; i < array.length; i++) {
    if (array[MUTATING_FIELDS].indexOf(i) !== -1) {
      continue
    }

    array[MUTATING_FIELDS].push(i)

    const INDEX = createSymbol(`[[actual ${i}]]`)

    array[INDEX] = array[i]

    Object.defineProperty(array, i, {
      enumerable: true,
      configurable: false,
      get () {
        return this[INDEX]
      },
      set (newValue) {
        const oldValue = this[INDEX]
        this[INDEX] = newValue
        EngineCollection.instance
          .notify(this, INDEX, sync, newValue, oldValue)
      }
    })
  }
}
