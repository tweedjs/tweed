import * as hooks from '../hooks'

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
    'pre': hooks.PreHook,
    'init': hooks.InitHook,
    'create': hooks.CreateHook,
    'insert': hooks.InsertHook,
    'prepatch': hooks.PrePatchHook,
    'update': hooks.UpdateHook,
    'postpatch': hooks.PostPatchHook,
    'destroy': hooks.Destroy,
    'remove': hooks.RemoveHook,
    'post': hooks.PostHook
  }

  _wrapHook (hookName, listener) {
    return (...args) => listener(new this._hooks[hookName](...args))
  }
}
