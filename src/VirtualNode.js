import isArray from './isArray'
import Engine from './Engine'

export class VirtualTextNode {
  constructor (text) {
    this.text = text
    this.attributes = {}
    this.isTextNode = true
  }

  toString () {
    return this.text
  }

  toPureSnabbdomVNode () {
    return {
      sel: undefined,
      data: undefined,
      children: undefined,
      elm: undefined,
      text: this.text,
      key: undefined
    }
  }
}

export class VirtualNode {
  /**
   * Creates a new Virtual DOM Node.
   *
   * @param string       tagName    The tag name of the DOM node
   * @param any          attributes Attributes on the DOM node
   * @param Renderable[] children   DOM child nodes
   */
  constructor (tagName, attributes, children) {
    this.tagName = tagName
    this.attributes = attributes == null ? {} : attributes
    this.children = this._renderChildren(
      this._transformRenderables(children).filter(this._isRenderable)
    )

    if (process.env.NODE_ENV !== 'production') {
      this.__stack = process.env.NODE_ENV === 'test' ? '' : new Error().stack
    }
  }

  /**
   * Filters out children that should not be rendered
   * at all.
   *
   * @param any renderable
   *
   * @returns Renderable
   */
  _isRenderable (renderable) {
    if (renderable == null) {
      return false
    }

    if (renderable === '') {
      return false
    }

    return true
  }

  _transformRenderables (renderables) {
    return renderables.map(this._transformRenderable)
  }

  _transformRenderable (renderable) {
    for (let i = 0; i < Engine.plugins.length; i++) {
      const plugin = Engine.plugins[i]

      if (typeof plugin.transformRenderable === 'function') {
        const res = plugin.transformRenderable(renderable)

        if (res != null) {
          return res
        }
      }
    }
    return renderable
  }

  isTextNode = false

  get element () {
    return this.elm || null
  }

  toString () {
    if (this._circularCheck) {
      return '[circular]'
    }

    this._circularCheck = true

    if (this.children == null || this.children.length === 0) {
      return this.tagName + ' {}'
    }

    const inner = this.children.map((c) => c.toString()).join('\n  ')

    this._circularCheck = false

    return this.tagName +
      ' {\n  ' +
      inner +
      '\n}'
  }

  _trackedChildren = null

  _renderChildren (childRenderable) {
    const { children, tracked } = childRenderable.reduce(VirtualNode._renderChild, {
      children: [],
      tracked: []
    })

    if (process.env.NODE_ENV !== 'production') {
      this._ownTrackedChildren = tracked
    }

    this._trackedChildren = [
      ...tracked,
      ...children.reduce((a, c) => {
        if (c._trackedChildren != null) {
          return a.concat(c._trackedChildren)
        }
        return a
      }, [])
    ]

    return children
  }

  static _renderChild ({ children, tracked }, renderable) {
    if (renderable == null) {
      return { children, tracked }
    }

    if (typeof renderable === 'string') {
      return {
        children: [
          ...children,
          new VirtualTextNode(renderable)
        ],
        tracked
      }
    }

    if (isArray(renderable)) {
      const { children: reducedChildren, tracked: reducedTracked } =
        renderable.reduce(VirtualNode._renderChild, { children: [], tracked: [] })

      return {
        children: [
          ...children,
          ...reducedChildren
        ],
        tracked: [
          ...tracked,
          ...reducedTracked
        ]
      }
    }

    if (typeof renderable !== 'object') {
      return VirtualNode._renderChild({ children, tracked }, String(renderable))
    }

    if (renderable.render != null) {
      if (typeof renderable.render === 'function') {
        return VirtualNode._renderChild({
          children,
          tracked: [ ...tracked, renderable ]
        }, renderable.render())
      }

      return VirtualNode._renderChild({ children, tracked }, renderable.render)
    }

    return {
      children: [ ...children, renderable ],
      tracked
    }
  }

  toPureSnabbdomVNode () {
    return {
      sel: this.sel,
      data: this.data,
      children: this.children.map((c) => c.toPureSnabbdomVNode()),
      elm: this.elm,
      text: this.text,
      key: this.key
    }
  }

  /**
   * @internal
   * @see snabbdom
   */
  get data () {
    return this._data != null
      ? this._data
      : (this._data = this._createSnabbdomData())
  }

  /**
   * Creates the data property for the snabbdom
   * vnode. Should be considered unsafely mutable
   * and is referenced in the snabbdom "modules" (plugins).
   *
   * @returns Object
   */
  _createSnabbdomData () {
    let data = {}
    let attributes = {}

    if ('key' in this.attributes) {
      data.key = this.attributes.key
      delete this.attributes.key
    }

    // Shallow copy
    for (let p in this.attributes) {
      attributes[p] = this.attributes[p]
    }

    Engine.plugins.forEach((p) =>
      // This method may mutate data freely, and also
      // remove items from attributes, but not mutate
      // any of the attribute values
      p.consumeAttributes(data, attributes, this)
    )

    return data
  }

  /**
   * @internal
   * @see snabbdom
   */
  get sel () {
    return this.tagName
  }

  /**
   * @internal
   * @see snabbdom
   */
  text = undefined

  /**
   * @internal
   * @see snabbdom
   */
  elm = undefined

  /**
   * @internal
   * @see snabbdom
   */
  key = undefined
}

export default (tagName, attributes, ...children) =>
  new VirtualNode(tagName, attributes, children)
