import Renderer from './Renderer'
import { Node } from '..'

export interface Logger {
  warn (error: Error): void
}

export default class DOMRenderer implements Renderer {
  constructor (element: Element | null, logger?: Logger)
  render (node: Node): void
}
