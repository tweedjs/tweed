export default function (o, ...os) {
  for (let i = 0; i < os.length; i++) {
    const oo = os[i]
    for (let p in oo) {
      o[p] = oo[p]
    }
  }
  return o
}
