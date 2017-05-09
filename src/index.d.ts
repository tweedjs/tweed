import Renderer from './render/Renderer'

/**
 * Represents a Virtual DOM VirtualNode.
 */
export interface VirtualNode {
  readonly attributes: Attributes
  readonly children?: (VirtualNode | string)[]
  readonly isTextNode: boolean
  readonly tagName?: string
  readonly text?: string
  readonly element: Node | null
}

/**
 * JSX elements accepts any sort of attribute.
 */
export interface Attributes {
  [name: string]: any
}

/**
 * If there is a render method available on an object,
 * Tweed will assume that it's an instance of a basic
 * component, and it will call render to receive the
 * actual VirtualNode.
 */
export interface VirtualNodeFactory {
  render (): VirtualNode
}

/**
 * These are all the types that can be sent as a child
 * to a VirtualNode. It should be Renderable[] at the end, but
 * TypeScript doesn't allow for recursive types.
 */
export type Renderable = VirtualNodeFactory | VirtualNode | string | null | undefined | number | any[]

/**
 * Creates a Virtual DOM VirtualNode. This is what JSX will
 * call after compilation. Therefore it must be
 * imported in every file that uses JSX.
 */
export function VirtualNode (
  tagName: string,
  attributes?: Attributes | null,
  ...children: Renderable[],
): VirtualNode

declare global {
  /**
   * Tells the TypeScript compiler to accept any kind of
   * element in JSX expressions.
   */
  namespace JSX {
    type Element = VirtualNode
    interface IntrinsicElements {
      [tagName: string]: any
    }
  }

  /**
   * This is to satisfy the TypeScript compiler in the case
   * that 'VirtualNode' has not been configured as the jsxFactory.
   */
  namespace React {
    function createElement (
      tagName: string,
      attributes?: Attributes | null,
      ...children: Renderable[],
    ): VirtualNode
  }
}

/**
 * This class is what drives the reactive aspects of
 * Tweed. It mounts itself on stateful objects, so
 * that whenever an update happens, the Engine rerenders
 * the entire VDOM structure.
 */
export class Engine {
  constructor (renderer: Renderer)
  render (factory: VirtualNodeFactory): void
}

/**
 * The type of the @mutating decorator.
 */
export type Mutating = PropertyDecorator

export type MutatingMode = {
  /**
   * The decorator @mutating.sync make mutations
   * trigger an update immediately, instead of
   * waiting a tick to account for any subsequent
   * mutations.
   */
  sync: Mutating

  /**
   * The @mutating.async is the default behaviour,
   * where a mutation doesn't trigger an update
   * immediately, but instead batches updates so
   * that multiple rerenders don't happen before
   * the browser can even paint the first change.
   */
  async: Mutating
}

/**
 * The @mutating decorator. This tells Tweed to
 * observe any changes to a particular property,
 * which will then trigger a rerender of the
 * Virtual DOM.
 */
export const mutating: Mutating & MutatingMode
