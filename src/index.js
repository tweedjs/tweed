import './dev'

import MutatingDecorator from './MutatingDecorator'
import VirtualNode from './VirtualNode'
import * as Hooks from './hooks'
import global from './global'

export { Hooks }
export Engine from './Engine'
export VirtualNode from './VirtualNode'

export const mutating = MutatingDecorator.bind(null, false)
mutating.sync = MutatingDecorator.bind(null, true)
mutating.async = mutating

// This part makes JSX work even if someone is using a transpiler
// that converts to `React.createElement` instead of `VirtualNode`.
if (global.React == null) {
  global.React = {
    createElement: VirtualNode
  }
}

export const Node = process.env.NODE_ENV !== 'production'
  ? () => require('./dev/messages/apiHasChangedForVirtualNodes')
  : undefined
