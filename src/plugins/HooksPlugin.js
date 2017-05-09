export default class HooksPlugin {
  consumeAttributes (data, attributes) {
    data.hook = {}

    for (let a in attributes) {
      if (a === 'hook') {
        for (let hookName in attributes[a]) {
          data.hook[hookName] = this._wrapHook(hookName, attributes[a][hookName])
        }
        delete attributes[a]
        continue
      }
      if (a.slice(0, 5) === 'hook-') {
        const hookName = a.slice(5)
        data.hook[hookName] = this._wrapHook(hookName, attributes[a])
        delete attributes[a]
      }
    }
  }

  _hooks = {
    'pre': class PreHook {
    },
    'init': class InitHook {
      constructor (node) {
        this.node = node
      }
    },
    'create': class CreateHook {
      constructor (emptyVnode, vnode) {
        this.old = emptyVnode
        this.new = vnode
        this.element = vnode.element
      }
    },
    'insert': class InsertHook {
      constructor (node) {
        this.node = node
        this.element = node.element
      }
    },
    'prepatch': class PrePatchHook {
      constructor (oldNode, node) {
        this.old = oldNode
        this.new = node
        this.element = node.element
      }
    },
    'update': class UpdateHook {
      constructor (oldNode, node) {
        this.old = oldNode
        this.new = node
        this.element = node.element
      }
    },
    'postpatch': class PostPatchHook {
      constructor (oldNode, node) {
        this.old = oldNode
        this.new = node
        this.element = node.element
      }
    },
    'destroy': class Destroy {
      constructor (node) {
        this.node = node
        this.element = node.element
      }
    },
    'remove': class RemoveHook {
      constructor (node, callback) {
        this.node = node
        this.done = callback
      }
    },
    'post': class PostHook {
    }
  }

  _wrapHook (hookName, listener) {
    return (...args) => listener(new this._hooks[hookName](...args))
  }
}
