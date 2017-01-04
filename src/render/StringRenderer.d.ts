import Renderer from './Renderer'
import { Node } from '..'

export default class StringRenderer implements Renderer {
  constructor (listener: (html: string) => void)
  render (node: Node): void
}
