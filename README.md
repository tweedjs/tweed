# Tweed

Tweed is a UI library similar to [React](https://facebook.github.io/react/), but in an
object oriented style.

---

## Installing
```shell
$ npm install tweed
```

Or with [CLI](https://github.com/tweed/tweed-cli):

```shell
$ npm install --global tweed-cli
$ tweed new my-blog
```

---

## Overview

Here is what a `Counter` looks like:

<details>
<summary>JavaScript (Babel)</summary>
```javascript
// src/Counter.js

import { mutating, VirtualNode } from 'tweed'

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
</details>

<details>
<summary>TypeScript</summary>
```typescript
// src/Counter.tsx

import { mutating, VirtualNode } from 'tweed'

export default class Counter {
  @mutating private _times = 0

  render (): VirtualNode {
    return (
      <button on-click={() => this._times++}>
        Clicked {this._times} times
      </button>
    )
  }
}
```
</details>

<details>
<summary>JavaScript (ES5)</summary>
```javascript
// src/Counter.js

var tweed = require('tweed')
var mutating = tweed.mutating
var n = tweed.VirtualNode

var Counter = module.exports = function Counter () {
  this._times = 0
}

mutating(Counter.prototype, '_times')

Counter.prototype.render = function () {
  var _this = this

  return (
    n('button', {'on-click': function () { _this._times++ }},
      'Clicked ' + this._times + ' times'
    )
  )
}
```
</details>

### Rendering
To render the component to the DOM, use the `Engine` class, which requires a `Renderer`.
For browsers we use the `DOMRenderer`, available at `'tweed/render/dom'`:

<details>
<summary>JavaScript (Babel)</summary>
```javascript
// src/main.js

import render from 'tweed/render/dom'
import Counter from './Counter'

render(new Counter(), document.querySelector('#app'))
```
</details>

<details>
<summary>TypeScript</summary>
```typescript
// src/main.ts

import render from 'tweed/render/dom'
import Counter from './Counter'

render(new Counter(), document.querySelector('#app'))
```
</details>

<details>
<summary>JavaScript (ES5)</summary>
```javascript
// src/main.js

var render = require('tweed/render/dom').default
var Counter = require('./Counter')

render(new Counter(), document.querySelector('#app'))
```
</details>

### Server side rendering
Rendering on the server works exactly the same, but instead of mounting the Virtual DOM on
the actual DOM, we want to render the app once into a string. This can be accomplished
with the `StringRenderer` which takes a function `(html: string) => void` as its single
constructor argument, which can then be hooked up to any server. The `StringRenderer` is
available at `'tweed/render/string'`.

However, if you want to write a simple native Node server, there is an `HTTPRenderer` as
well at `'tweed/render/http'`, which takes the request and response objects as constructor
arguments:

<details>
<summary>JavaScript (Babel + Node)</summary>
```javascript
// src/server.js

import { createServer } from 'http'
import render from 'tweed/render/http'

import Counter from './Counter'

const server = createServer((req, res) => {
  render(new Counter(), res)
})

server.listen(1337, () => console.log('http://localhost:1337'))
```
</details>

<details>
<summary>TypeScript</summary>
```typescript
// src/server.ts

import { createServer, IncomingMessage, ServerResponse } from 'http'
import render from 'tweed/render/http'

import Counter from './Counter'

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  render(new Counter(), res)
})

server.listen(1337, () => console.log('http://localhost:1337'))
```
</details>

<details>
<summary>JavaScript (Node)</summary>
```javascript
// src/server.js

const { createServer } = require('http')
const render = require('tweed/render/http').default

const Counter = require('./Counter')

const server = createServer((req, res) => {
  render(new Counter(), res)
})

server.listen(1337, () => console.log('http://localhost:1337'))
```
</details>

---

# Why?
So why does the world need yet another JavaScript UI library? Tweed attempts to solve a
very specific "problem" with React, if you're used to object oriented program
architecture.

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
your UI in an OOP style dependency tree, which then collectively renders the v-dom.

```typescript
interface Greeting {
  greet (name: string): VirtualNode
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

As a user, you are responsible for creating all the instances of the classes _before_
Tweed mounts them to the DOM. Those instances are then persistent, as opposed to with
React, where class components are reinstantiated on every render (if not handled
differently with mechanisms like `shouldComponentUpdate`).

This is a performance benefit, because for every state change, update, and repaint, it
boils down to a simple call to `render` on the root component. It's the equivalent of
calling `toString` but for VDOM nodes instead of strings. And no data is being passed
either. The state of the tree is persistent as well. Deciding to opt for a more functional
and immutable way of managing state is entirely up to you.

---

> You can read more about the architecture of a Tweed app
> [here](https://medium.com/@emilniklas/e1a818bb314f).
