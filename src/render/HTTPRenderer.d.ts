import Renderer from './Renderer'
import { VirtualNode, VirtualNodeFactory } from '..'

export interface ServerResponse {
  writeHead (statusCode: number, headers?: any): void
  end (str: string, cb?: Function): void
}

export interface Logger {
  warn (error: Error): void
}

export class HTTPRenderer implements Renderer {
  constructor (response: ServerResponse, logger?: Logger)
  render (node: VirtualNode): void
}

export default function render (
  root: VirtualNodeFactory,
  response: ServerResponse,
  logger?: Logger
): void
