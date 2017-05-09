import isArray from './isArray'
import Engine from './Engine'

class VirtualTextNode {
  constructor (text) {
    this.text = text
    this.attributes = {}
    this.isTextNode = true
  }

  toString () {
    return this.text
  }
}

class VirtualNode {
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
    this._childRenderable = children.filter(this._isRenderable)
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

  isTextNode = false

  get element () {
    return this.elm || null
  }

  /**
   * Public getter for the child nodes. Memoized.
   *
   * @returns (VirtualNode | string)[] | undefined
   */
  get children () {
    return this._children != null
      ? this._children
      : (this._children = this._renderChildren())
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

  _renderChildren () {
    return this._childRenderable.reduce(VirtualNode._renderChild, [])
  }

  static _renderChild (children, renderable) {
    if (typeof renderable === 'string') {
      return [
        ...children,
        new VirtualTextNode(renderable)
      ]
    }

    if (isArray(renderable)) {
      return [
        ...children,
        ...renderable.reduce(VirtualNode._renderChild, [])
      ]
    }

    if (typeof renderable !== 'object') {
      return VirtualNode._renderChild(children, String(renderable))
    }

    if (typeof renderable.render === 'function') {
      return VirtualNode._renderChild(children, renderable.render())
    }

    return [ ...children, renderable ]
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
