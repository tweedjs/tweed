import { createSymbol, UPDATE, STATEFUL, MUTATING_FIELDS } from './Symbols'
import isArray from './isArray'

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
      if (this[UPDATE] && isArray(this[VALUE]) && this[VALUE][UPDATE] == null) {
        this[VALUE][UPDATE] = this[UPDATE]
      }
      return this[VALUE]
    },
    set (newValue) {
      const oldValue = this[VALUE]

      if (isArray(newValue)) {
        wrapArray(sync, newValue)
      }

      this[VALUE] = newValue

      if (UPDATE in this) {
        this[UPDATE](sync, newValue, oldValue)
      }
    }
  }

  Object.defineProperty(prototype, name, descriptor)

  return {}
}

const MUTATOR_METHODS = [
  'copyWithin', 'fill', 'pop', 'push',
  'reverse', 'shift', 'sort', 'splice', 'unshift'
]

function wrapArray (sync, subject) {
  MUTATOR_METHODS.forEach((name) => {
    if (typeof subject[name] === 'function') {
      const method = subject[name]
      subject[name] = function () {
        const returnValue = method.apply(this, arguments)
        if (this[UPDATE]) {
          ensureSetters(sync, this)
          this[UPDATE](sync)
        }
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
        if (this[UPDATE]) {
          this[UPDATE](sync, newValue, oldValue)
        }
      }
    })
  }
}
