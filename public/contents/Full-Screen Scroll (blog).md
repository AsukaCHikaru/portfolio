---
created: 2023/06/01 23:12
title: Full-Screen Scroll
published: 2021-02-11
language: en-US
pathname: full-screen-scroll
category: Web Development
tags:
  - React.js
filename: Full-Screen Scroll (blog)
---
## TL;DR:

- `overflow-y: hidden` for html and body, and `overflow-y: scroll` for the scroller element
- Use recursive `window.requestAnimationFrame` to set `scrollTop`

In my latest project [CHIKA Music Awards 2020](https://2020.musicawards.asukachikaru.com/) I focused more on user experience and visual effects. One of the features I used to achieve that was full-screen scrolling.

First, let's talk about the definition of full-screen scrolling. In short, it looks like this:

![[full-screen-scroll_1.gif]]
#nullcaption

And the literal definition of full-screen scrolling includes the below specs:

- Triggered by scroll or touchmove events
- The scroll distance equal to visible area height
- Smooth scrolling
- Scroll exactly one page every time, no scroll momentum

Some libraries have taken care of the problem for me, but as a side project, I try to challenge myself as much as possible instead of only focusing on getting things done. So I implemented full-page scrolling from scratch. I used Vue3 for this project, but the idea should be universal.

## Triggering the event

Obviously, we need `scroll` event. But in mobile devices, we should use `touchmove` event.

The concept of detecting the scrolling direction is simple: when the event fires for the first time, save the scroller element `scrollTop` value (or the touch `screenY` value in the `touchmove` event). During the second time, compare the values to the previous ones.

```js
// Add event listener. Or you can bind them to the component directly in Vue or React
document.querySelector('.scroll').addEventListener('scroll', handleScroll);

// Necessary variables for the event callback.
// I placed them here for clarity.
// Place them anywhere that fits the architecture of your project.
let scroller; // the scroller element
let currentY; // the current scrollTop of the scroller
let currentPageY; // the y value of the current page
let scrollDirection; // 1 or -1
let isScrolling;

// The event callback
const handleScroll = (e) => {
  // for scroll we don't need the event argument,
  // but for touchmove event callback we have to use it for the touch y value
  if (!scroller) {
    return;
  }
  
  currentY = scroller.scrollTop;
  // currentY = e.touches[0].screenY; for touchmove

  if (!isScrolling && currentY !== currentPageY) {
    if (currentY > currentPageY) {
      scrollDirection = -1;
    }
    if (currentY < currentPageY) {
      scrollDirection = 1;
    }
    isScrolling = true;
    window.requestAnimationFrame(scrollTo);
  }
}
```

## Get scroll height

First, prepare a scroller element. The scroller should contain all of the contents, and the height should be 100% of the visible area height.

For PC, this is easy: set the scroller's height (and all of its ancestors') to `100vh`, then get `window.innerHeight`, and we should be good. But for mobile devices, we have to deal with the problem that the browser address bar might hide during scrolling, which causes the visible area height to be inconsistent.

[The URL bar hides when the root element scrolls down](https://github.com/bokand/root-scroller/blob/master/explainer.md), in which the root element means the `<html>` element. Therefore, to avoid URL bar hides during scrolling, it is necessary to prevent root element from scrolling while scrolling the contents.

According to the [standard CSS overflow definition](https://www.w3.org/TR/CSS2/visufx.html#overflow), by default both `<html>` and `<body>` has `overflow: auto`. Set both to `overflow: hidden` , and we locked up `<html>` and `<body>` for good.

The next step is to give the scroller `overflow: scroll`. Now when you scroll the viewport, `<html>` and `<body>` don't move at all, only the scroller is scrolling, and the URL bar will not hide. Notice that if there are any container elements between the scroller and the body, their overflow values also need to be `hidden`.

```css
html {
  height: 100vh;
  overflow-y: hidden;
}

body {
  height: 100%;
  overflow-y: hidden;
}

.scroller {
  height: 100%;
  overflow-y: scroll;
}
```

The visible area height should be consistent now, and we should get window height without too much trouble.

## Smooth scrolling

`.scrollTo` is initiative and efficient, but it's not very reliable. I've encountered scenarios that it wouldn't work (no effect at all). I haven't discovered the root cause, but it feels like `.scrollTo` gets canceled when called too frequently.

I gave up the one-liner and went for another approach: [window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). This function prepares a frame to execute all the things inside the callback. This approach is inspired by [vue-scrollto](https://github.com/rigor789/vue-scrollto).

The callback has a single argument timestamp: `DOMHighResTimeStamp`, which is essentially a number. When scroll animation starts, save the initial timestamp and then compare the timestamp in each call with the initial timestamp to determine if the elapsed time has exceeded the designated scroll animation duration. If the scroll is not finished yet, call `window.requestAnimationFrame` inside the callback recursively.

For the scroll effect, set the scroller's scrollTop directly.

`scroller.scrollTop = {the y position after each scroll step}`

`scroll-behavior: "smooth"` doesn't apply when changing a div's `scrollTop` value in this way; this is why we need to use `requestAnimationFrame` to create an animation.

```js
let scrollDuration;
let scrollDirection; // 1 or -1
let scrollStartTime;
let scroller;
let currentY;
let scrollDistance; // window height, likely 100vh
let isScrolling;

const scrollTo = (timestamp: DOMHighResTimeStamp) => {
  if (!scrollStartTime) {
    scrollStartTime = timestamp;
  }

  const elapsedTime = timestamp - scrollStartTime;
  const progress = Math.min(elapsedTime / scrollDuration, 1);
  scroller.scrollTop = currentY + scrollDistance * progress * scrollDirection;

	if (elapsedTime < duration) {
    window.requestAnimationFrame(scrollTo);
  } else {
    currentY = scroller.scrollTop;
    scrollStartTime = undefined;
    scrollDirection = undefined;
    isScrolling = false;
  }
};
```

## Remove the momentum

When the user scrolls the screen hence triggers the `scroll` or `touchmove` event, it's unlikely that the event only fires once. We can have the conditioning to prevent our full-screen scroll from repeatedly called, but the other scrolls caused by the user's finger remains, even after the full-screen scroll finishes. Removing the scroll momentum is the necessary polishing for the full-screen scroll effect.

There are two ways to disable scroll temporarily: `pointerEvent: none`, and —you might have guessed it— `overflow: hidden`. I found overflow more reliable, for `pointerEvent` didn't work in some `touchmove` scenario.

When the scroll starts (calling `window.requestAnimationFrame` for the first time), add the above CSS property to the scroller element, and all the scrolls that after the first callback should take no effect. Thus we removed the momentum successfully.

---

I finished the full-screen scroll effect with the above approach. It works fine in macOS, win, and mobile platforms. I believe there are other ways to do this, but I'm quite happy with the result I came up with.