---
created: 2023/06/01 23:21
title: "Refactor Blog: (3) Headless CMS"
published: 2021-03-28
language: en-US
pathname: refactor-blog-3-headless-cms
category: Meta
tags: 
filename: Refactor Blog - (3) Headless CMS (blog)
---
Building my blog from scratch means dealing with content management by myself: the APIs, the server, and the databases. Each task would be a new challenge for me and likely cost more time than the whole blog building.

In the old versions of my blog, I put all the contents in the source. Every time I wrote new posts, I had to commit and deploy again. In this way, I avoided the backend, but it also lowered my motivation to write blogs, because I had to commit and deploy for every new post.

Fortunately, headless CMS solves this problem perfectly. I decided to use headless CMS for this refactoring, for I consider it would be the best solution in this scenario. Also, I figured that having experience using headless CMS would be a good thing.

# Choices

This is the first time I use headless CMS. I did some research to discover the best service that fits my requirements, which are:

- cheap: if my blog has more traffic in the future, maybe I'll increase the budget for the CMS, but right now, I'm not going to invest too much
- easy to use: I want it as easy as possible for me to write and publish blog posts
- easy to dev: for a paid solution, I want it to take as little time as possible to implement

Contentful ends up becoming my choice among several candidates.

# Implementation

Contentful provides many APIs, but the two APIs of entry and entry collection are enough for my usage. It also provides API test tools with token input, so the API part is comprehensive and easy to use.

The biggest problem I faced during implementation was the type of API data. I looked for @types, but there was no well-maintained type package. I ended up writing the type by myself, checking the dev tool.

# Usage

I like the content model and content pattern a lot. The content model is easy to learn and modify. So easy that I was not stuck when designing the content model at all, then found myself having to edit it after because I didn't think carefully enough.

I've published several posts since then, and I'm pretty happy so far. Usually, I have my article finished in notion, and I only need to set the metadata manually, copy-paste the article, and the post is published. The data updates immediately; it's the best part of my Contentful experience so far.

# Future

There is one concern over Contentful: the price. I have not met the limit of free usage yet, and I don't think I would meet it soon, but even the cheapest plan hardly surpasses my budget. If that day comes, I will be very likely migrating to other services.

One of the potential alternatives I'm interested in is the notion API. I write all of my posts on notion, and I enjoy using it a lot. If the notion API is capable of being the headless CMS, I would consider it very seriously.