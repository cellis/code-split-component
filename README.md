### VERSION 2 REWRITE

The below docs are invalid.  This branch is in active, major development.

-----

# ✂️ code-split-component

Declarative code splitting for your Wepback 2 bundled React projects, with SSR support.

```jsx

import CodeSplit from 'code-split-component'

<CodeSplit module={System.import('../Foo')}>
  { Foo => Foo && <Foo /> }
</CodeSplit>
```

---

___Great Appreciation!___

This idea for this library has been completely inspired (ripped off) from Sunil Pai's original work. I highly recommend you go check it out: [`react-modules`](https://github.com/threepointone/react-modules)

There are a few crucial differences between this library and his:

  - This library expects code splitting as the default behavior (i.e. use of the `System.import` Webpack 2 API) - it only requires use of the Babel plugin when you want to support server side rendering. `react-modules` is kind of inverse to this. It expects you to use the standard `require` API and then transpiles them to use Webpack's code splitting API.
  - This library only supports Webpack 2, where `react-modules` probably supports both versions (unconfirmed).
  - `react-modules` has way more features.

---

## TOCs

 - [About](https://github.com/ctrlplusb/code-split-component#about)
 - [Installation](https://github.com/ctrlplusb/code-split-component#installation)
 - [Usage](https://github.com/ctrlplusb/code-split-component#usage)
 - [Example](https://github.com/ctrlplusb/code-split-component#example)
 - [Combining with React Router 4](https://github.com/ctrlplusb/code-split-component#combining-with-react-router-4)
 - [Babel Plugin](https://github.com/ctrlplusb/code-split-component#babel-plugin)
 - [Server Side Rendering (SSR) Support](https://github.com/ctrlplusb/code-split-component#server-side-rendering-ssr-support)
 - [React Hot Loader v3 Support](https://github.com/ctrlplusb/code-split-component#react-hot-loader-v3-support)


## About

This library consists of a React component allowing you to declaratively use Webpack 2's code splitting feature within your projects.

In addition to the component it also ships with a Babel 6 plugin that will allow you to use the component in a server side rendering context and support `react-hot-loader` v3.

## Installation

`npm install code-split-component --save`

## Usage

Firstly import the component.

```js
import CodeSplit from 'code-split-component';
```

When using the component you must provide either a "module" or "modules" prop to it. The "module" prop must contain a single `System.import` (e.g. `System.import('./Foo')`), whilst the "modules" prop accepts an array of them.  

Then you need to define a callback `function` as a child to the `CodeSplit` component.  This `function` will receive a single argument containing the result of fetching your code split module(s).  

If you used the `module` then the argument will contain the module. However, if the module hasn't been loaded from the server yet this value will be null.

If you used the `modules` prop then you will get an array that will be the same length as the arguments you provided to the `modules` prop.  If the modules haven't been fetched from the server yet then each position within the array will contain nulls.  Once all the modules have been fetched the array will contain the resolved modules and they will be in the same array index as specified within the `modules` prop.

__NOTE:__ We provide an array initialized with null values as this makes destructuring far easier to use against it, without having the need to do empty array checks.  See the examples.

__"module" example:__

```jsx
import CodeSplit from 'code-split-component'

<CodeSplit module={System.import('../Foo')}>
  { Foo => (Foo ? <Foo /> : <div>Loading...</div>) }
</CodeSplit>
```

__"modules" example:__

```jsx
import CodeSplit from 'code-split-component'

<CodeSplit modules={[System.import('./Foo'), System.import('./Bar')]}>
  { ([Foo, Bar]) => Foo && Bar && <div><Foo /><Bar /></div> }
</CodeSplit>
```

## Example

There is a React Router 4 based example in the `/example` folder.

The example includes hot module reloading backed by a standard Webpack 2 hot reloading configuration (i.e. not using `react-hot-loader` v3).

Clone this repo and then run the following commands:

```
npm install
npm run example
```

## Combining with React Router 4

You can easily combine React Router 4's declaritive API with this one to get code split routes:

```jsx
<Match
  pattern="/about"
  render={routerProps =>
    <CodeSplit module={System.import('./About')}>
      { About => About && <About {...routerProps} /> }
    </CodeSplit>
  }
/>
```

Zing!

## Babel Plugin

A Babel plugin has been included in the project to allow you to control the behavior of the component, i.e. it allows you enable/disable the code splitting feature.  When code splitting is disabled any `System.import` statements used by the `CodeSplit` components are transpiled into standard `require` statements.  This can be useful for the following cases:

 - Disabling code splitting for your entire project without making code changes.
 - Supporting server side rendering bundles.
 - Supporting `react-hot-loader` v3.

By default if you include the plugin within your Babel configuration it will disable code splitting.

```json
{
  "plugins": ["code-split-component/babel"]
}
```

The plugin also ships with a configuration options, allowing you to specify if code splitting should be disabled or not. This can be useful when dynamically generating your Babel configuration.

```js
  const babelConfig = {
    plugins: [
      [
        // Our plugin
        'code-split-component/babel',
        // We could call a function, query a process.env.X var or
        // something else for example to determine whether or not
        // to disable the code splitting feature.
        { enableCodeSplitting: shouldWeDisableCodeSplitting() }
      ]
    ]
  }
```

## Server Side Rendering (SSR) Support

Using the `System.import` API on the server is not recommended as it results in a `Promise`, which is asynchronous.  Therefore when doing SSR you will likely only see a blank space or a "loading" indicator showing where the component will be loaded.  When the application is served the client will go off and fetch the required component however you lose a lot of the power and benefit of doing a pre-render on the server.

In order to resolve this issue it is recommended that you use the provided a [Babel plugin](https://github.com/ctrlplusb/code-split-component#babel-plugin) and transpile your server bundle to ensure that the `System.import` statements for your `CodeSplit` instances will be converted into synchronous `require` statements.

To see a full example of this I recommend you check out my [`react-universally`](https://github.com/ctrlplusb/react-universally) starter kit. This starter kit provides you with a minimal configuration to get going with a server side rendering React application.  It bundles both the client and server code using Webpack & Babel. I haven't completed the integration of `code-split-component` into the starter kit yet, however, you can preview the current usage within the [`next`](https://github.com/ctrlplusb/react-universally/tree/next) branch.

## React Hot Loader v3 Support

Unfortunately RHL3 doesn't like our `CodeSplit` loaded modules. It only partially supports hot reloading of any modules that were loaded via the `CodeSplit` component, requiring you to change and save a component a minimum of two times before an update is rendered to the screen.  In order to resolve this I recommend that you disable code splitting using the [Babel plugin](https://github.com/ctrlplusb/code-split-component#babel-plugin) whilst in development mode.

___NOTE:___ Standard Webpack HMR seems to work fine without having to disable code splitting. The example in this project includes a standard Webpack HMR configuration.

To see a full example of this I recommend you check out my [`react-universally`](https://github.com/ctrlplusb/react-universally) starter kit. This starter kit provides you with a minimal configuration to get going with a server side rendering React application.  It bundles both the client and server code using Webpack & Babel. I haven't completed the integration of `code-split-component` into the starter kit yet, however, you can preview the current usage within the [`next`](https://github.com/ctrlplusb/react-universally/tree/next) branch.
