import Renderer from './Renderer'
import { Node, NodeFactory } from '..'

export class DOMRenderer implements Renderer {
  constructor (element: Element | null)
  render (node: Node): void
}

export default function render (
  root: NodeFactory,
  element: Element | null
): void
