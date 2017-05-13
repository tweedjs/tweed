/** @jsx VirtualNode */

import { Engine, mutating, VirtualNode } from '../src'
import { StringRenderer } from '../src/render/StringRenderer'
import RenderablePromisePlugin from '../src/plugins/RenderablePromisePlugin'

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

    expect(result).toBe('<div></div>')
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

  test('it can watch arrays', async () => {
    class A {
      @mutating arr = []
      render () {
        return <div>{this.arr.join(',')}</div>
      }
    }

    const a = new A()

    engine.render(a)

    expect(result).toBe('<div></div>')
    expect(renders).toBe(1)

    a.arr.push(1)
    await tick()
    expect(result).toBe('<div>1</div>')
    expect(renders).toBe(2)

    a.arr.push(2, 3)
    await tick()
    expect(result).toBe('<div>1,2,3</div>')
    expect(renders).toBe(3)

    a.arr[1] = 10
    await tick()
    expect(result).toBe('<div>1,10,3</div>')
    expect(renders).toBe(4)
  })

  test('mutations can be synchronous', () => {
    class A {
      @mutating.sync prop = 'before'

      render () {
        return (
          <h1>{this.prop}</h1>
        )
      }
    }

    const c = new A()

    engine.render(c)

    expect(result).toBe('<h1>before</h1>')
    expect(renders).toBe(1)

    c.prop = 'after'

    expect(result).toBe('<h1>after</h1>')
    expect(renders).toBe(2)
  })

  test('class attribute', () => {
    engine.render({ render: () =>
      <div className='x' />
    })
    expect(result).toBe('<div class="x"></div>')

    engine.render({ render: () =>
      <div class='y' />
    })
    expect(result).toBe('<div class="y"></div>')

    engine.render({ render: () =>
      <div class={{ a: true, b: true, c: false }} />
    })
    expect(result).toBe('<div class="a b"></div>')
  })

  test('it can render const components', () => {
    engine.render({ render: <div>x</div> })
    expect(result).toBe('<div>x</div>')

    engine.render({ render: () => <div>{{ render: <div>x</div> }}</div> })
    expect(result).toBe('<div><div>x</div></div>')
  })

  test('it can render a mutating component directly', () => {
    class MutatingComponent {
      @mutating.sync field = 'before'
      render = () => {
        return (
          <in>{this.field}</in>
        )
      }
    }

    const mutatingComponent = new MutatingComponent()

    engine.render({ render: () => <out><x>{mutatingComponent}</x></out> })

    expect(engine.isWatching(mutatingComponent)).toBe(true)

    expect(result).toBe('<out><x><in>before</in></x></out>')

    mutatingComponent.field = 'after'

    expect(result).toBe('<out><x><in>after</in></x></out>')
  })

  test('it can render a Promise', async () => {
    Engine.plugins.push(
      new RenderablePromisePlugin()
    )

    const promise = new Promise(
      (resolve) => setTimeout(resolve, 10)
    ).then(() => 123)

    engine.render({ render: () => console.log(promise) || <div>{promise}</div> })
    expect(result).toBe('<div></div>')

    await promise
    await tick()

    expect(result).toBe('<div>123</div>')
  })
})
