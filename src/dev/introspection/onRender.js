const globl = typeof window === 'undefined'
  ? global
  : window

const listeners = '__TWEED_ON_RENDER_LISTENERS__'

globl[listeners] = globl[listeners] || []

globl[listeners].all = globl[listeners].all || []

export default function (engine, factory, vnode) {
  if (vnode.__DONT_NOTIFY_DEVTOOLS__) {
    return
  }
  globl[listeners].forEach((l) => l(engine, factory, vnode))
  globl[listeners].all.push([engine, factory, vnode])
}
