# 0.5.0

**Breaking:**
* `Node` is renamed to `VirtualNode` to prevent rare collisions with the standard browser
  API constructor `Node`, supertype of `HTMLElement`.
* Removed the `HTTPRenderer`. Use the `StringRenderer` with whatever server instead.
* The Hooks API has been overhauled from the Snabbdom one.
* Snabbdom is configured with the `attributes` module instead of the `props` module, which
  means that DOM API setters like `readOnly={true}` is not available. Use
  `readonly={true}` like in HTML instead. `innerHTML` is still supported, and `className`
  still works but is deprecated (see below).

**Changes:**
* `babel-polyfill` is no longer a peer dependency. Polyfill how you want.
* `babel-runtime` is now included as an actual dependency, as opposed to a peer
  dependency, but with `*` as version constraint, so it will always be compatible with
  any version included in the application package.
* `VirtualNode` instances expose a customized API on top of the Snabbdom interface. The
  TypeScript interface hides the Snabbdom interface as it is considered internal/private.

**Deprecations:**
* The `className` attribute is deprecated. Use `class` instead.

# 0.4.0

Changes before this point are irrelevant. Read the docs instead.
