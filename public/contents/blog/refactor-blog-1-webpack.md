---
created: 2023/06/01 23:15
title: "Refactor Blog: (1) Webpack"
published: 2021-03-09
language: en-US
pathname: refactor-blog-1-webpack
description: In this year's annual blog refactoring, I withdrew from using boilerplate build tools and configured Webpack myself.
category: retrospective
topic: web development
---

Recently, I rewrote my [blog](https://asukawang.com/blog) for the second time. Every time, I rewrite to solve particular problems.

The previous version's problems are the architecture: I used [Gatsby](https://www.gatsbyjs.com/) for v2, and I didn't enjoy it. There are many plugins that I don't fully understand, and they handle a lot of things. I don't know what's under the hood of my blog while building it.

I wanted more control over my project.

That's why after I felt I had grasped enough knowledge to start a project from scratch, I started the rewrite straightaway. This time -- for the first time -- I'm not using `npx create-react-app` or `gatsby new`. I'm writing every line of the configs by myself.

If you've struggled with all those config setups, ex. `webpack.config.js`, `babelrc`, `tsconfig.json` -- I know the feeling. I used to be afraid of dealing with them, but not anymore. I hope this article helps others to achieve that too.

# Dependencies

I used React and Typescript for this project. The minimum dependencies for this architecture are:

- webpack, webpack-cli, @babel/core
- babel-loader, @babel/preset-react
- ts-loader, @babel/preset-typescript
- babel-plugin-styled-components
- @babel/preset-env, @babel/plugin-proposal-class-propoties, @babel/plugin-proposal-object-rest-spread, webpack-node-externals
- all the @types

# .babelrc

Some of the syntaxes or features that React development needs are not supported by all browsers yet. To ensure the project works in all environments, the source code needs to be compiled into a backward-compatible version. That's what babel does.

```json
{
  "presets": [
    "@babel/preset-react",
    // tell babel it has to compile React
    "@babel/preset-typescript"
    // tell babel it has to compile Typescript
  ],
  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    // enables above features of JavaScript in development
    "babel-plugin-styled-components"
    // I used styled-components in this project, this is the plugin to help babel process it
  ]
}
```

# tsconfig.json

The configurations for typescript.

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "lib": ["DOM", "ES2020"],
    "strict": true,
    "noImplicitAny": true,
    "moduleResolution": "Node",
    "jsx": "react"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## includes

Define the paths with `.ts` files that need to be compiled.

## excludes

The opposite of `includes`, define the paths that do NOT need compiling.

## compilerOptions

Most of the typescript compiling options

### target

The js (ECMA) version of the output. Use `ES5` or a newer version without worrying about compatibility issues because babel will compile again.

### module

Which pattern to use regarding modules (export). Use `commonJS` for applications running on node.

### lib

Other libraries to be used in compilation. Add `DOM` if features like `document` or `window` are used.

### moduleResolution

How ts compilation deals with modules (import). Use `node` to mock node's way to resolve module importing.

### jsx

How to deal with `.jsx` files. Since we're developing React app, use `react`.

# webpack.client.config.ts

I split the webpack configs for the front-end and the SSR server for clarity. Also, I write both my webpack config files in typescript instead of javascript, but it's totally optional. I only did so because I wanted to try. Choose the one you're more comfortable with.

```ts
import * as webpack from "webpack";
import { resolve } from "path";

const config: webpack.Configuration = {
  mode: "development",
  entry: "./src/client/index.tsx",
  context: resolve(__dirname),
  output: {
    filename: "[name].bundle.js",
    path: resolve(__dirname, "dist", "static"),
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        CONTENTFUL_TOKEN: JSON.stringify(process.env.CONTENTFUL_TOKEN || ""),
        CONTENTFUL_SPACE_ID: JSON.stringify(
          process.env.CONTENTFUL_SPACE_ID || ""
        ),
      },
    }),
  ],
  devtool: "inline-source-map",
};

export default config;
```

## mode

Mostly changes the value of `process.env.NODE_ENV` on `DefinePlugin`. This can be set in command line parameter `--mode` too. I set this to `develop` and add `--mode production` in scripts for production building.

## entry

The starting point of the project; the root file for every other file imported or used. Likely the `index.js` in `src` folder for MVVM frameworks.

There might be multiple entry files in an optimized setup. I plan to do it in the future.

## context

The reference directory for the path of entry and loaders. The default value is the webpack config file's location, so it shouldn't be a big problem without it. However, it's still recommended to set context, so the configuration is independent of its location when dealing with paths.

## output

The building result. This can be very optimized and complex, but I'm only using the minimum configuration here: `filename` for, well, the output filename, and `path` for the output folder path.

## module

Options for specifying where (target files)and how (which tool)to build the source codes. One of the most important parts of webpack configuration.

### test

The paths of target files, using regular expressions.

### use

The loaders for building. At default, webpack can only parse `.js` and `.json` files, so we need to add custom loaders for packaging other types of files.

Pass an array to use multiple loaders for the same target. The loaders' applying order depends on their order in the array: from last to first (from right to left/ from bottom to top).

For packaging `.ts` files, you can add `configFile` in `use` to specifying the typescript config you want to use.

### exclude

The opposite of `test`, specifying the file you wish not to package, like node modules.

## resolve

The configurations for the modules.

### extensions

The extensions for the files of the modules. Add the extensions that cover all of the files of the modules. Without this option, webpack may be unable to read some modules.

## plugins

Miscellaneous tools to customize the build. I'm only adding `DefinePlugin` to define the environment variables in this configuration.

## devtool

Build output is suppressed and sometimes uglified. It protects the source code, but it may make debugging more difficult too.

`devtool` generates a map between the output and the source, so the console logs can display which line of the source code is causing the error.

# webpack.server.config.ts

The webpack configurations for SSR server code. The idea is the same as the client part, but there are some differences too.

```ts
import * as webpack from "webpack";
import { resolve } from "path";
import * as nodeExternals from "webpack-node-externals";

const config: webpack.Configuration = {
  mode: "development",
  entry: "./src/server/index.ts",
  context: resolve(__dirname),
  output: {
    filename: "server.bundle.js",
    path: resolve(__dirname, "dist", "server"),
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        CONTENTFUL_TOKEN: JSON.stringify(process.env.CONTENTFUL_TOKEN || ""),
        CONTENTFUL_SPACE_ID: JSON.stringify(
          process.env.CONTENTFUL_SPACE_ID || ""
        ),
        PORT: JSON.stringify(process.env.PORT) || 3000,
      },
    }),
  ],
};

export default config;
```

## target

The environment that the output is supposed to run on. The default value is `web`, which is the browser-like environment. For the nodejs applications, use `node`.

## externals

Excludes modules that are expected to be provided in the running environment. I use this to exclude node modules.

## node

Configurations for the node-related parts in the source. I set `__dirname` and `__filename` so these two's behaviors are not changed during building.
