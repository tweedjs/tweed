export class PreHook {
}

export class InitHook {
  constructor (node) {
    this.node = node
  }
}

export class CreateHook {
  constructor (emptyVnode, vnode) {
    this.old = emptyVnode
    this.new = vnode
    this.element = vnode.element
  }
}

export class InsertHook {
  constructor (node) {
    this.node = node
    this.element = node.element
  }
}

export class PrePatchHook {
  constructor (oldNode, node) {
    this.old = oldNode
    this.new = node
    this.element = node.element
  }
}

export class UpdateHook {
  constructor (oldNode, node) {
    this.old = oldNode
    this.new = node
    this.element = node.element
  }
}

export class PostPatchHook {
  constructor (oldNode, node) {
    this.old = oldNode
    this.new = node
    this.element = node.element
  }
}

export class Destroy {
  constructor (node) {
    this.node = node
    this.element = node.element
  }
}

export class RemoveHook {
  constructor (node, callback) {
    this.node = node
    this.done = callback
  }
}

export class PostHook {
}
