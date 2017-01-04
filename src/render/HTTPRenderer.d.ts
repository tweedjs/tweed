import Renderer from './Renderer'
import { Node } from '..'

export interface ServerResponse {
  writeHead (statusCode: number, headers?: any): void
  end (str: string, cb?: Function): void
}

export default class HTTPRenderer implements Renderer {
  constructor (response: ServerResponse)
  render (node: Node): void
}
