import Renderer from './render/Renderer'

export interface Node {
  sel?: string
  data?: any
  children?: Renderable[]
  elm?: Node
  text?: string
  key: any
}

export interface Attributes {
  [name: string]: string
}

export interface NodeFactory {
  render (): Node
}

export type Renderable = NodeFactory | Node | string | null | undefined | number | any[]

export function Node (
  tagName: string,
  attributes?: Attributes | null,
  ...children: Renderable[],
): Node

declare global {
  namespace JSX {
    type Element = Node
    interface IntrinsicElements {
      [tagName: string]: any
    }
  }

  namespace React {
    function createElement (
      tagName: string,
      attributes?: Attributes | null,
      ...children: Renderable[],
    ): Node
  }
}

export class Engine {
  constructor (renderer: Renderer)
  render (factory: NodeFactory): void
}
