---
created: 2023/06/04 23:56
title: Next.js App Font Not Loaded on Remote Machine Issue
published: 2023-06-05
language: en-US
pathname: nextjs-app-font-not-loaded-on-remote-machine-issue
description: Debugging note of a source loading issue that never reproduces on the dev machine.
updated: 2025-01-11
category: research
topic: web development
thumbnail: nextjs-app-font-not-loaded-on-remote-machine-issue_2.png
---

# TL;DR

`@next/font` config `display: option` will switch to fallback if the font takes more than 100ms to load. To ensure the font loading, use `display: swap`.

# Issue

This blog is built in Next.js. When I first released it, there was an issue that the font only loads on my development machine. It reproduces on every remote machine, even if I access the dev server from the same wifi.

## Configuration

I hosted my font using local .woff2 file, which I downloaded as .otf from [google font](https://fonts.google.com/) then converted to .woff2 from the first converter I found on google.

The font file is loaded from a `<link>` element in `_document.tsx`.

```tsx
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
        rel="preload"
        href="/fonts/NotoSerifJP-Regular.woff2"
        as="font"
        type="font/woff2"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

Then I set the font face in `global.css` and applied the `font-family` to `body`.

```css
@font-face {
  font-family: "NotoSerifJP";
  font-style: normal;
  font-weight: 400;
  font-display: optional;
  src: url(/fonts/NotoSerifJP-Regular.woff2) format(woff2);
}

html,
body {
  font-family: "NotoSerifJP";
}
```

## Behavior

When access either the dev server or the prod environment from the development machine, the font loads successfully. But when access from any other single machine on the world, the font won't load and the app switches back to default sans font.

The font file is successfully fetched on either machine, but on the remote machine the fetched font's content becomes the default sans font. I used some online .woff2 preview tool and it clearly shows that the downloaded .woff2 file is the default sans font. Such issue didn't happen on the development machine.

![](nextjs-app-font-not-loaded-on-remote-machine-issue_1.png)(Font file response on development machine)

![](nextjs-app-font-not-loaded-on-remote-machine-issue_2.png)(Font file response on remote machine)

## Attempts

I tried the configurations shown in [this youtube video](https://www.youtube.com/watch?v=L8_98i_bMMA).
(It was super easy to understand, turns out it was a Vercel's developer's channel.)

I discarded the local .woff2 file and tried `@next/font`. Since I was using Tailwindcss, I set the font variable and the `tainwind.config.js` configurations.

After above configuration, the latin part of the font started to load on remote machine. Only the Japanese and Chinese parts remain the default sans font.

## Root Cause

When creating font const using `@next/font`, the `display` option is defaulted to `optional`, which will switch to fallback font if the loading time is over 100ms.

Since I was using [Noto Serif JP](https://fonts.google.com/noto/specimen/Noto+Serif+JP?query=noto+se), the Japanese subset is way heavier than the latin set, which makes the Japanese part fallbacks to default font.

When I was hosting the .woff2 file instead of using `@next/font`, I didn't set the subset rules, hence made the whole font file too big to load, thus on every remote machine the font fallbacks. Only on the development machine, the font was not loaded through http but local disc, which it makes the below 100ms line.

## Solution

Use `display: swap` to ensure font loading.

It causes some [FOUT](https://fonts.google.com/knowledge/glossary/fout), but it's a way lesser evil compare to the origin issue.

# References

- [@next/font で初回読み込み時にフォントが適用されない](https://www.satoooh.org/posts/next-font-display)
