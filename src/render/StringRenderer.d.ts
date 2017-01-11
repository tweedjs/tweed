import Renderer from './Renderer'
import { Node, NodeFactory } from '..'

export class StringRenderer implements Renderer {
  constructor (listener: (html: string) => void)
  render (node: Node): void
}

export default function render (
  root: NodeFactory,
  listener: (html: string) => void
): void
