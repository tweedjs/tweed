import assign from '../src/assign'

test('implements Object.assign', () => {
  const subject = { a: 2, c: 3 }
  const patchA = { a: 1 }
  const patchB = { b: 2 }

  const result = assign(subject, patchA, patchB)

  expect(result).toBe(subject)
  expect(result).toEqual({ a: 1, b: 2, c: 3 })
})
