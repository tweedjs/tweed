# 0.5.0

**Breaking:**
* `Node` is renamed to `VirtualNode` to prevent rare collisions with the standard browser
  API constructor `Node`, supertype of `HTMLElement`.
* Removed the `HTTPRenderer`. Use the `StringRenderer` with whatever server instead.

**Changes:**
* `babel-runtime` and `babel-polyfill` are now included as actual dependencies, as opposed
  to peer dependencies. But with `*` as version constraint, so they will always be
  compatible with the version included in the application package.

# 0.4.0

Changes before this point are irrelevant. Read the docs instead.
