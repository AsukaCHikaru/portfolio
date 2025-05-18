---
created: 2023/06/01 23:19
title: "Refactor Blog: (2) SSR"
published: 2021-03-26
language: en-US
pathname: refactor-blog-2-ssr
description: After the Webpack setup for this site, I also implemented server-side-rendering from scratch.
category: retrospective
topic: web development
---

One of the reasons I choose Gatsby last time I wrote my blog site is to have SSR. SEO matters, isn't it?

I gained experience setting up SSR in my job, and this is how I apply that experience in my project.

# The Idea

First, let's talk about React (and most of the MVVM frameworks) app without SSR. They are an HTML template with a js file. Everything about the app is in the js file; the HTML is merely a host for the app.

When the user's browser requests data of the app from the server, the HTML is provided. A blank HTML page with some metadata is rendered.

Then the HTML requests the data of the js file from the `<script>` tag. The js file is fetched then executed. The logic inside starts working. Then the app is created and attached to a specific HTML element.

The problem is that search engines can't observe the actual app in the first render. Therefore, for the search engines, the app is always a blank page.

The solution is SSR -- server-side rendering. When the app is requested, the server runs the app, prints them into strings, then sends them with the HTML. For the browsers or the search engines, they get the whole app in the first render.

# Dependencies

- [express](http://expressjs.com/) for handling requests and responses

# Setting up the server

Receive requests and send HTML. The HTML will be a string instead of a file for inserting stringified app.

```ts
import * as Express from "express";

const APP_PORT = process.env.PORT || 3000;
const app = Express();
const renderer = () => {
  app.get("*", (req: Express.Request, res: Express.Response) => {
    res.send(`
			<!DOCTYPE HTML>
			<html>
				<head>
					<!-- insert metadata here -->
				</head>
				<body>
					<div id="app-root"></div>
				</body>
			</html>
		`);
  });
};

app.use(renderer);
app.listen(APP_PORT, () => {
  console.log(`Server is listening on ${APP_PORT}`);
});
```

# Library setups

I'm only using the major libraries for this app. Fortunately, some of them provide APIs for SSR setup. The common idea of libraries' SSR setup is getting the stringified part of each library from their API, then passing them into the HTML template.

## React

[Document](https://reactjs.org/docs/react-dom-server.html#gatsby-focus-wrapper)

React's API for SSR is `ReactDOMServer.renderToString(element)`. Pass the app in JSX format as the element parameter.

```ts
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

import { App } from "../client/App";

let htmlBody;

try {
  htmlBody = ReactDOMServer.renderToString(<App />);
} catch (error) {
  console.error(error);
}
```

## React Helmet

[Document](https://github.com/nfl/react-helmet#server-usage)

Helmet's API for SSR is `Helmet.renderStatic()`. You have to call it after `ReactDOMServer.renderToString`.

```ts
import { Helmet } from "react-helmet";

let htmlBody;
let helmet;

try {
  htmlBody = ReactDOMServer.renderToString(<App />);
  helmet = Helmet.renderStatic();
} catch (error) {
  console.error(error);
}
```

## React Router DOM

[Document](https://reactrouter.com/web/guides/server-rendering)

Wrap the app with a `StaticRouter`.

```ts
import { StaticRouter } from "react-router-dom";

let htmlBody;
let context;

app.get("*", (req: Express.Request, res: Express.Response) => {
	try {
		htmlBody = ReactDOMServer.renderToString(
			<StaticRouter location={req.url} context={context}>
				<App />
			</StaticRouter>
		);
	} catch(error) {
		console.error(error);
	}
};
```

## styled-components

[Document](https://styled-components.com/docs/advanced#server-side-rendering)

Use `sheet.collectStyles` to wrap the app, then use `sheet.getStyleTags` to collect all of the app's styles.

Finally, pass the styles into the HTML's head.

```ts
import { ServerStyleSheet } from "styled-components";

const sheet = new ServerStyleSheet();
let htmlBody = "";
let styleTags = "";

try {
  htmlBody = ReactDOMServer.renderToString(sheet.collectStyles(<App />));
  styleTags = sheet.getStyleTags();
} catch (error) {
  console.error(error);
} finally {
  sheet.seal();
}
```

## Redux

[Document](https://redux.js.org/recipes/server-rendering)

Redux's SSR setup is the most complex one. The contents of the store have to be prepared and passed to the HTML during the request.

The way to prepare the store is different for each application. For my blog, I fetch the post or the post list data for the respective request URL, then convert the data to the store type.

Once the store is prepared, wrap the app with a `Provider`, and get the `initialState` with the API Redux provided.

```ts
import { createStore } from "redux";
import { Provider } from "react-redux";

import { rootReducer, RootState } from "../client/service/reducer";

app.get("*", (req: Express.Request, res: Express.Response) => {
	// pass request because store is likely dependent on request URL
	const yourStore = yourStoreInitiator(req);
	const preloadedStore: RootState = {
		// your store state
	};

	let htmlBody = "";
	const store = createStore(rootReducer, preloadedState);

	try {
		htmlBody = ReactDOMServer.renderToString(
			<Provider store={store}>
				<App />
			</Provider>
		);
	} catch (error) {
		console.error(error);
	}

	// store.getState() returns object so we have to manually stringify it
	const initialState = JSON.stringify(store.getState());
};
```

## HTML handler

Since the HTML is frequently edited with several library parts, an isolated handler makes it easier.

```ts
const getFullHTML = (
  htmlBody: string,
  styleTags: string,
  initialState: string,
  helmet?: HelmetData
) => {
  return `
    <!DOCTYPE html>
    <html ${helmet?.htmlAttributes.toString()}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${styleTags}
        ${helmet?.title.toString()}
        ${helmet?.meta.toString()}
        ${helmet?.link.toString()}
        <style>
          @import url('<https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap>');
          @import url('<https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400&display=swap>');
        </style>
      </head>
      <body ${helmet?.bodyAttributes.toString()}>
        <div id="app-root">${htmlBody}</div>
        <script>window.__INITIAL_STATE__ = ${initialState}</script>
        <script defer src="main.bundle.js" type="text/javascript" charset="utf-8"></script>
        <script defer src="vendor.bundle.js" type="text/javascript" charset="utf-8"></script>
      </body>
    </html>
  `;
};
```

## Combine each part

Finally, combine all of the setups above.

```ts
import * as Express from "express";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Helmet, HelmetData } from "react-helmet";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import { createStore } from "redux";
import { ServerStyleSheet } from "styled-components";

import { App } from "../client/App";
import { rootReducer, RootState } from "../client/service/reducer";

export const renderer = (
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction,
) => {
	app.get("*", (req: Express.Request, res: Express.Response) => {
	const yourStore = yourStoreInitiator(req);
	const preloadedStore: RootState = { /* your state */ };

	let htmlBody = "";
	const context = {};
  const sheet = new ServerStyleSheet();
  let styleTags = "";
	const store = createStore(rootReducer, preloadedState);
	let helmet;

	try {
	  htmlBody = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <Provider store={store}>
	        <StaticRouter location={req.url} context={context}>
            <App />
	        </StaticRouter>
        </Provider>
      )
    );
    helmet = Helmet.renderStatic();
    styleTags = sheet.getStyleTags();
  } catch (error) {
    console.error(error);
  } finally {
    sheet.seal();
  }
  const initialState = JSON.stringify(store.getState());

  const fullHTML = getFullHTML(htmlBody, styleTags, initialState, helmet);
	res.send(fullHTML);
};
```

You can use `curl -X GET localhost:3000` to check if the express server is returning the whole app in the first easily.
