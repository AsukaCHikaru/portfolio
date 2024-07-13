---
created: 2023-06-05 09:32
title: "Refactor Blog 2023: Markdown Based Content"
published: 2023-06-19
language: en-US
pathname: refactor-blog-2023-markdown-based-content
category: Meta
tags: 
filename: Refactor Blog 2023 - Markdown Based Content (blog)
description: Embracing a different approach toward my own data, I made a change to the content hosting method of my blog.
updated: 2024-05-03
---
I changed the content hosting of this blog from notion (notion API) to markdown files.
# Motivations
## Notion API limit 
Some of the image links returned from the notion API only work for one hour. This is a spec. I can workaround it but it feels like a hustle.
## Mind integration with [obsidian.md](https://obsidian.md)
I've been heavily using obsidian lately. The notes helps me writing blog posts immensely. Some posts wrote themselves. This very post was wrote on obsidian too. I figured it's easier to write and publish the markdown files directly.
## I own my data
Most of my data are stored on somebody's server. And I either am okay with that or do not care that much. But the notes and blog posts are very personal things, so personal that I stopped entirely trusting some companies and store all my posts there. I wanted to make sure that if for some reason all my accounts are not accessible anymore, I still have all my posts.
# Stacks
- Markdown parser: [remark](https://remark.js.org/)
- Frontmatter parser: selfmade