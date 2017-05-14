import Renderer from './render/Renderer'

/**
 * Represents a Virtual DOM Node.
 */
export interface VirtualNode {
  readonly attributes: HookAttributes & Attributes
  readonly children?: VirtualNode[]
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

export interface HookAttributes {
  'hook-pre'?: (hook: PreHook) => any
  'hook-init'?: (hook: InitHook) => any
  'hook-create'?: (hook: CreateHook) => any
  'hook-insert'?: (hook: InsertHook) => any
  'hook-prepatch'?: (hook: PrePatchHook) => any
  'hook-update'?: (hook: UpdateHook) => any
  'hook-postpatch'?: (hook: PostPatchHook) => any
  'hook-destroy'?: (hook: Destroy) => any
  'hook-remove'?: (hook: RemoveHook) => any
  'hook-post'?: (hook: PostHook) => any

  hook?: {
    pre?: (hook: PreHook) => any,
    init?: (hook: InitHook) => any,
    create?: (hook: CreateHook) => any,
    insert?: (hook: InsertHook) => any,
    prepatch?: (hook: PrePatchHook) => any,
    update?: (hook: UpdateHook) => any,
    postpatch?: (hook: PostPatchHook) => any,
    destroy?: (hook: Destroy) => any,
    remove?: (hook: RemoveHook) => any,
    post?: (hook: PostHook) => any
  }
}

export class PreHook {}

export class InitHook {
  constructor (node: VirtualNode)

  readonly node: VirtualNode
}

export class CreateHook {
  constructor (old: VirtualNode, newNode: VirtualNode)

  readonly old: VirtualNode
  readonly new: VirtualNode
  readonly element: Node
}

export class InsertHook {
  constructor (node: VirtualNode)

  readonly node: VirtualNode
  readonly element: Node
}

export class PrePatchHook {
  constructor (old: VirtualNode, newNode: VirtualNode)

  readonly old: VirtualNode
  readonly new: VirtualNode
  readonly element: Node
}

export class UpdateHook {
  constructor (old: VirtualNode, newNode: VirtualNode)

  readonly old: VirtualNode
  readonly new: VirtualNode
  readonly element: Node
}

export class PostPatchHook {
  constructor (old: VirtualNode, newNode: VirtualNode)

  readonly old: VirtualNode
  readonly new: VirtualNode
  readonly element: Node
}

export class Destroy {
  constructor (node: VirtualNode)

  readonly node: VirtualNode
  readonly element: Node
}

export class RemoveHook {
  constructor (node: VirtualNode, callback: () => void)

  readonly node: VirtualNode

  done (): void
}

export class PostHook {}

/**
 * If there is a render method available on an object,
 * Tweed will assume that it's an instance of a basic
 * component, and it will call render to receive the
 * actual VirtualNode.
 */
export interface VirtualNodeFactory {
  readonly render: VirtualNode | (() => VirtualNode)
}

export interface RenderableFactory {
  readonly render: Renderable | (() => Renderable)
}

/**
 * These are all the types that can be sent as a child
 * to a VirtualNode.
 */
export type Renderable = RenderableFactory | VirtualNode | string | null | undefined | number | RenderableArray | RenderableFactory

/**
 * Should really just be Renderable[], but that would
 * create a recursive type, and TypeScript does not
 * support that.
 */
export type RenderableArray = (
  RenderableFactory | VirtualNode | string | null | undefined | number | any[] | RenderableFactory
)[]

/**
 * Should really just be () => Renderable, but that would
 * create a recursive type, and TypeScript does not
 * support that.
 */
export type RenderableFunction = () =>
  RenderableFactory | VirtualNode | string | null | undefined | number | RenderableArray

/**
 * Creates a Virtual DOM VirtualNode. This is what JSX will
 * call after compilation. Therefore it must be
 * imported in every file that uses JSX.
 */
export function VirtualNode (
  tagName: string,
  attributes?: HookAttributes & Attributes | null,
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
      [tagName: string]: HookAttributes & Attributes
    }
  }

  /**
   * This is to satisfy the TypeScript compiler in the case
   * that 'VirtualNode' has not been configured as the jsxFactory.
   */
  namespace React {
    const createElement: typeof VirtualNode
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
