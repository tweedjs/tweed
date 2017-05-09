import MutatingDecorator from './MutatingDecorator'
import VirtualNode from './VirtualNode'

export * from './hooks'

export Engine from './Engine'
export VirtualNode from './VirtualNode'

export const mutating = MutatingDecorator.bind(null, false)
mutating.sync = MutatingDecorator.bind(null, true)
mutating.async = mutating

// This part makes JSX work even if someone is using a transpiler
// that converts to `React.createElement` instead of `VirtualNode`.
const g = typeof window === 'undefined' ? global : window
if (g.React == null) {
  g.React = {
    createElement: VirtualNode
  }
}
