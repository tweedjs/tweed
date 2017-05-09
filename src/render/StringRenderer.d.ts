import Renderer from './Renderer'
import { VirtualNode, VirtualNodeFactory } from '..'

export class StringRenderer implements Renderer {
  constructor (listener: (html: string) => void)
  render (node: VirtualNode): void
}

export default function render (
  root: VirtualNodeFactory,
  listener: (html: string) => void
): void
