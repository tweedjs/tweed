export class Console {
  constructor (native) {
    this._native = native

    this._native.info = this._native.info || this._native.log
    this._native.warn = this._native.warn || this._native.log
    this._native.error = this._native.error || this._native.log
  }

  _styles = {
    'b': {
      enterBrowser: {
        'font-weight': 'bold'
      },
      exitBrowser: {
        'font-weight': 'normal'
      },
      enterTerminal: [
        1
      ],
      exitTerminal: null
    },

    'code': {
      enterBrowser: {
        'font-weight': 'bold',
        'border': '1px solid rgba(0,0,0,0.06)',
        'padding': '1px 3px 0px',
        'border-radius': '2px',
        'background': 'rgba(0,0,0,0.05)'
      },
      exitBrowser: {
        'font-weight': 'normal'
      },
      enterTerminal: [
        1
      ],
      exitTerminal: null
    },

    'danger': {
      enterBrowser: {
        'font-weight': 'bold',
        'color': '#d64747'
      },
      exitBrowser: {
        'font-weight': 'normal',
        'color': 'initial'
      },
      enterTerminal: [
        31
      ],
      exitTerminal: null
    }
  }

  _tagPattern = new RegExp(`<(\\/?)(${Object.keys(this._styles).join('|')})>`, 'g')

  _compile (markup, terminalRestoreCode) {
    if (typeof window === 'undefined') {
      return this._compileTerminal(markup, terminalRestoreCode)
    }
    if (process.env.NODE_ENV !== 'production') {
      // If we're in a test
      if (typeof expect !== 'undefined') {
        return this._compileTerminal(markup, terminalRestoreCode)
      }
    }
    return this._compileBrowser(markup)
  }

  _compileBrowser (markup) {
    let activeStyleRules = {}
    let styles = []

    const template = markup.replace(
      this._tagPattern,
      (_, closingSlash, tagName) => {
        const isClosing = closingSlash === '/'
        const style = isClosing
          ? this._styles[tagName].exitBrowser
          : this._styles[tagName].enterBrowser

        activeStyleRules = style

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

  _compileTerminal (markup, restoreCode) {
    return [markup.replace(
      this._tagPattern,
      (_, closingSlash, tagName) => {
        const isClosing = closingSlash === '/'
        const style = this._styles[tagName]

        const codes = isClosing
          ? (style.exitTerminal == null ? restoreCode : style.exitTerminal)
          : style.enterTerminal

        return codes.map((code) => `\x1b[${code}m`).join('')
      }
    )]
  }

  _compileArgs (args, terminalRestoreCode) {
    if (typeof args[0] === 'string') {
      args = [
        ...this._compile(args[0], terminalRestoreCode),
        ...args.slice(1)
      ]
    }

    return args
  }

  log (...args) {
    this._native.log(...this._compileArgs(args, [0]))
  }

  info (...args) {
    this._native.info(...this._compileArgs(args, [0]))
  }

  warn (...args) {
    this._native.warn(...this._compileArgs(args, [0, 33]))
  }

  error (...args) {
    this._native.error(...this._compileArgs(args, [0, 31]))
    throw new Error()
  }
}

export default new Console(console)
