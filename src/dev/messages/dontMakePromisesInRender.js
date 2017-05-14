import console from '../Console'

const stack = (typeof window !== 'undefined' ? global : window).dontMakePromisesInRenderStack

const rendersInStack = stack.split('\n').filter((l) => /render/.test(l))

console.error(
  "Is seems like you're making a <code>Promise</code> from " +
  'within a <code>render</code> method. Move the call to the ' +
  'constructor instead. ' + (rendersInStack.length > 0
    ? 'Maybe check out these locations:\n' + rendersInStack.join('\n')
    : ''
  )
)
