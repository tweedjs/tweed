# 0.5.0

**Breaking:**
* `Node` is renamed to `VirtualNode` to prevent rare collisions with the standard browser
  API constructor `Node`, supertype of `HTMLElement`.
* Removed the `HTTPRenderer`. Use the `StringRenderer` with whatever server instead.
* The Hooks API has been overhauled from the Snabbdom one.

**Changes:**
* `babel-polyfill` is no longer a peer dependency. Polyfill how you want.
* `babel-runtime` is now included as an actual dependency, as opposed to a peer
  dependency, but with `*` as version constraint, so it will always be compatible with
  any version included in the application package.
* `VirtualNode` instances expose a customized API on top of the Snabbdom interface. The
  TypeScript interface hides the Snabbdom interface as it is considered internal/private.

# 0.4.0

Changes before this point are irrelevant. Read the docs instead.
