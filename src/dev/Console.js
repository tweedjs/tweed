export class Console {
  constructor (native) {
    this._native = native

    this._native.info = this._native.info || this._native.log
    this._native.warn = this._native.warn || this._native.log
    this._native.error = this._native.error || this._native.log
  }

  _styles = {
    'b': {
      enter: {
        'font-weight': 'bold'
      },
      exit: {
        'font-weight': 'normal'
      }
    },

    'i': {
      enter: {
        'font-style': 'italic'
      },
      exit: {
        'font-style': 'normal'
      }
    }
  }

  _compile (markup) {
    let activeStyleRules = {}
    let styles = []

    const template = markup.replace(
      new RegExp(`<(\\/?)(${Object.keys(this._styles).join('|')})>`, 'g'),
      (_, closingSlash, tagName) => {
        const isClosing = closingSlash === '/'
        const style = isClosing
          ? this._styles[tagName].exit
          : this._styles[tagName].enter

        Object.assign(activeStyleRules, style)

        styles.push(
          Object.keys(activeStyleRules)
            .map((k) => `${k}: ${activeStyleRules[k]}`)
            .join(';')
        )

        return '%c'
      }
    )

    return [template, ...styles]
  }

  _compileArgs (args) {
    if (typeof args[0] === 'string') {
      args = [
        ...this._compile(args[0]),
        ...args.slice(1)
      ]
    }

    return args
  }

  info (...args) {
    this._native.info(...this._compileArgs(args))
  }

  warn (...args) {
    this._native.warn(...this._compileArgs(args))
  }

  error (...args) {
    this._native.error(...this._compileArgs(args))
    throw new Error()
  }
}

export default new Console(console)
