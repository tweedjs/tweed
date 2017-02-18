export Engine from './Engine'
export Node from './Node'

import MutatingDecorator from './MutatingDecorator'
import Node from './Node'

export const mutating = MutatingDecorator.bind(null, false)
mutating.sync = MutatingDecorator.bind(null, true)
mutating.async = mutating

// This part makes JSX work even if someone is using a transpiler
// that converts to `React.createElement` instead of `Node`.
const g = typeof window === 'undefined' ? global : window
if (g.React == null) {
  g.React = {
    createElement: Node
  }
}
