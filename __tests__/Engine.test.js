/** @jsx Node */

import { Engine, Node } from '../src'
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
})
