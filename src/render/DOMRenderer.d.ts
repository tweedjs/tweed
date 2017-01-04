import Renderer from './Renderer'
import { Node } from '..'

export default class DOMRenderer implements Renderer {
  constructor (element: Element | null)
  render (node: Node): void
}
