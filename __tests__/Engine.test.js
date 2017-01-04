/** @jsx Node */

import { Engine, mutating, Node } from '../src'
import StringRenderer from '../src/render/StringRenderer'

describe('Engine', () => {
  let result

  const engine = new Engine(
    new StringRenderer((html) => { result = html })
  )

  beforeEach(() => {
    result = ''
  })

  test('it renders html', () => {
    engine.render({
      render () {
        return (
          <h1>Hello World</h1>
        )
      }
    })

    expect(result).toBe('<h1>Hello World</h1>')
  })

  test('it renders a stateful component', () => {
    class StatefulComponent {
      @mutating prop = 'before'

      // constructor () {
      //   this.prop = 'before'
      // }

      render () {
        return (
          <h1>{this.prop}</h1>
        )
      }
    }

    // mutating(StatefulComponent.prototype, 'prop')

    const c = new StatefulComponent()

    engine.render(c)

    expect(result).toBe('<h1>before</h1>')

    c.prop = 'after'

    expect(result).toBe('<h1>after</h1>')
  })
})
