# Tweed

Tweed is a UI library similar to [React](https://facebook.github.io/react/), but in an
object oriented style.

## The problem
React uses a top-down functional reactive architecture, with a narrow focus on pure
functions and a one-way data flow. Component A renders Component B, which renders
Component C in turn. To make components reusable, all components implicitly receives a
list of `children` components, which they can choose whether or not to render.

```javascript
const MyComponentTakesChildren = ({ children }) => (
  <div>{children}</div>
)
const MyComponentDoesnt = () => (
  <div>Hard Coded!</div>
)
```

If a component needs to distinguish between multiple passed down components, it can just
as well receive components as props:

```javascript
<MyComponent
  childA={<div>Child A</div>}
  childB={<div>Child A</div>}
/>
```

Although this results in JSX which is quite far from semantic HTML. Furthermore, if a
component needs to polymorphically send properties to a child, the solution is to send
down the component constructor:

```javascript
const MyComponent = ({ child: Child }) => (
  <Child polymorphic='value' />
)

<MyComponent
  child={SpecialChild}
/>
```

Ultimately, we end up with confusing JSX which doesn't really encourage you to value
polymorphism and restrictions on source code dependencies.

Object Oriented programming teaches us to decouple code by hiding implementation and
depending on abstractions.

Tweed doesn't treat components as nodes in the Virtual DOM, but simply lets you organize
your UI in an OOP style dependency graph, which then collectively renders the v-dom.

```typescript
interface Greeting {
  greet (name: string): Node
}

class Greeter {
  constructor (
    private readonly _greeting: Greeting
  ) {}

  render () {
    return <div>{this._greeting.greet('World')}</div>
  }
}

class BasicGreeting implements Greeting {
  greet (name: string) {
    return <h1>Hello {name}</h1>
  }
}

class CoolGreeting implements Greeting {
  greet (name: string) {
    return <h1>Yo {name}</h1>
  }
}

new Greeter(new BasicGreeting()).render() // => <div><h1>Hello World</h1></div>
new Greeter(new CoolGreeting()).render() // => <div><h1>Yo World</h1></div>
```

Note that the above example is completely stateless. We have no assignments. We also have
no inheritance, only object oriented composition.

In OOP, we know to be careful about state, and to make it clear what is mutable and what's
not. Tweed requires you to be explicit about mutable properties, albeit for technical
reasons.

```typescript
class Counter {
  @mutating private _count = 0

  render () {
    return (
      <button on-click={() => this._count++}>
        Clicked {this._count} times
      </button>
    )
  }
}
```

---

# Usage

## Components

#### Babel
```javascript
// src/Counter.js

import { mutating, Node } from 'tweed'

export default class Counter {
  @mutating _times = 0

  render () {
    return (
      <button on-click={() => this._times++}>
        Clicked {this._times} times
      </button>
    )
  }
}
```

#### TypeScript
```typescript
// src/Counter.tsx

import { mutating, Node } from 'tweed'

export default class Counter {
  @mutating private _times = 0

  render (): Node {
    return (
      <button on-click={() => this._times++}>
        Clicked {this._times} times
      </button>
    )
  }
}
```

#### ES5
```typescript
// src/Counter.js

var tweed = require('tweed')
var mutating = tweed.mutating
var Node = tweed.Node

function Counter () {
  this._times = 0
}

mutating(Counter.prototype, '_times')

Counter.prototype.render = function () {
  var _this = this

  return (
    Node('button', {'on-click': function () { _this._times++ }},
      'Clicked ' + this._times + ' times'
    )
  )
}
```

## Rendering

### Client side

```javascript
#### ES6 + Babel
// src/main.js

import { Engine } from 'tweed'
import DOMRenderer from 'tweed/render/dom'

import Counter from './Counter'

const engine = new Engine(
  new DOMRenderer(document.querySelector('#app'))
)

engine.render(new Counter())
```

#### TypeScript
```typescript
// src/main.ts

import { Engine } from 'tweed'
import DOMRenderer from 'tweed/render/dom'

import Counter from './Counter'

const engine = new Engine(
  new DOMRenderer(document.querySelector('#app'))
)

engine.render(new Counter())
```

#### ES5
```javascript
// src/main.js

var Engine = require('tweed').Engine
var DOMRenderer = require('tweed/render/dom').default

var Counter = require('./Counter')

const engine = new Engine(
  new DOMRenderer(document.querySelector('#app'))
)

engine.render(new Counter())
```

### Server side

#### ES6 + Babel
```javascript
// src/render.js

import { Engine } from 'tweed'
import StringRenderer from 'tweed/render/string'

import Counter from './Counter'

export default function render (callback) {
  const engine = new Engine(
    new StringRenderer(callback)
  )

  engine.render(new Counter())
}
```

#### TypeScript
```typescript
// src/render.ts

import { Engine } from 'tweed'
import StringRenderer from 'tweed/render/string'

import Counter from './Counter'

export default function render (callback: (string) => void): void {
  const engine = new Engine(
    new StringRenderer(callback)
  )

  engine.render(new Counter())
}
```

#### ES5
```javascript
// src/render.js

var Engine = require('tweed').Engine
var StringRenderer = require('tweed/render/string').default

var Counter = require('./Counter')

module.exports = function render (callback) {
  var engine = new Engine(
    new StringRenderer(callback)
  )

  engine.render(new Counter())
}
```

---

## Installing
```shell
> npm install tweed
```

---

## Building

#### Babel
```shell
> npm install --dev babel-cli tweed-babel-config
```

```json
// .babelrc
{
  "extends": "tweed-babel-config/config.json"
}
```

```shell
> babel src --out-dir dist
```

#### TypeScript
```shell
> npm install --dev typescript tweed-typescript-config
```

```json
// tsconfig.json
{
  "extends": "./node_modules/tweed-typescript-config/config",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

```shell
> tsc
```

#### ES5
ES5 does not require any build step, you can move straight on to linking.

---

## Linking with Webpack
```shell
> npm install --dev webpack
```

#### Babel
```shell
> npm install --dev babel-loader
```

```javascript
// webpack.config.js

const { resolve } = require('path')

module.exports = {
  entry: './src/main',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.js$/,
      exclude: /node_modules/
    }]
  }
}
```

#### TypeScript
```shell
> npm install --dev ts-loader
```

```typescript
// webpack.config.js

const { resolve } = require('path')

module.exports = {
  entry: './src/main',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [{
      loader: 'ts',
      test: /\.tsx?$/,
      exclude: /node_modules/
    }]
  }
}
```

#### ES5
```javascript
// webpack.config.js

const { resolve } = require('path')

module.exports = {
  entry: './src/main',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
```
