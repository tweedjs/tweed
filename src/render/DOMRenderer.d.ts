import Renderer from './Renderer'
import { VirtualNode, VirtualNodeFactory } from '..'

export class DOMRenderer implements Renderer {
  constructor (element: Element | null)
  render (node: VirtualNode): void
}

export default function render (
  root: VirtualNodeFactory,
  element: Element | null
): void
