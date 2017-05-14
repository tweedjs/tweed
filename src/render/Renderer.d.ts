import { VirtualNode } from '..'

interface Renderer {
  render (node: VirtualNode): void
}

export default Renderer
