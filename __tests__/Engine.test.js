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

      render () {
        return (
          <h1>{this.prop}</h1>
        )
      }
    }

    const c = new StatefulComponent()

    engine.render(c)

    expect(result).toBe('<h1>before</h1>')

    c.prop = 'after'

    expect(result).toBe('<h1>after</h1>')
  })

  test('mutating fields can be other components', () => {
    class Root {
      @mutating child

      render () {
        return <div>{this.child}</div>
      }
    }

    class Child {
      @mutating field = 'before'

      render () {
        return this.field
      }
    }

    const root = new Root()

    engine.render(root)

    expect(result).toBe('<div>undefined</div>')

    root.child = new Child()

    expect(result).toBe('<div>before</div>')

    root.child.field = 'after'

    expect(result).toBe('<div>after</div>')
  })

  test('it can handle circular dependencies', () => {
    class A {
      @mutating b
      field = 123
      render () {
        return <div>{this.b}</div>
      }
    }
    class B {
      @mutating a
      render () {
        return <div>{this.a.field}</div>
      }
    }

    const a = new A()
    const b = new B()

    a.b = b
    b.a = a

    engine.render(a)

    expect(result).toBe('<div><div>123</div></div>')
  })
})
