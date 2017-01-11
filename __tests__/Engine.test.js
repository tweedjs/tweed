/** @jsx Node */

import { Engine, mutating, Node } from '../src'
import { StringRenderer } from '../src/render/StringRenderer'

describe('Engine', () => {
  let renders
  let result

  const engine = new Engine(
    new StringRenderer((html) => {
      result = html
      renders++
    })
  )

  const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

  beforeEach(() => {
    renders = 0
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
    expect(renders).toBe(1)
  })

  test('it renders a stateful component', async () => {
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
    expect(renders).toBe(1)

    c.prop = 'after'
    await tick()

    expect(result).toBe('<h1>after</h1>')
    expect(renders).toBe(2)
  })

  test('mutating fields can be other components', async () => {
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
    expect(renders).toBe(1)

    root.child = new Child()
    await tick()

    expect(result).toBe('<div>before</div>')
    expect(renders).toBe(2)

    root.child.field = 'after'
    await tick()

    expect(result).toBe('<div>after</div>')
    expect(renders).toBe(3)
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
    expect(renders).toBe(1)
  })

  test('is batches multiple mutations', async () => {
    class A {
      @mutating f = 0
      render () {
        return <div>{this.f}</div>
      }
    }

    const a = new A()

    engine.render(a)

    expect(result).toBe('<div>0</div>')
    expect(renders).toBe(1)

    a.f++
    expect(result).toBe('<div>0</div>')
    expect(renders).toBe(1)

    await tick()
    expect(result).toBe('<div>1</div>')
    expect(renders).toBe(2)

    a.f++
    a.f++

    await tick()
    expect(result).toBe('<div>3</div>')
    expect(renders).toBe(3)
  })
})
