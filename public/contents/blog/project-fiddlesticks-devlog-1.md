---
created: 2025/07/13 14:53
title: "Project Fiddlesticks Devlog #1"
description: In Project Fiddlestcks, my latest indie game project, I implemented a vision algorithm, trying to capture the classic Rogue experience.
published: 2025-07-13
updated: 2025-07-15
language: en-US
category: development
topic: game development
pathname: project-fiddlesticks-devlog-1
thumbnail: project-fiddlesticks-devlog-1_1.png
thumbnail-direction: landscape
featured: false
---
This is the first dev log of my current indie game project: Project Fiddlesticks. As of July 9th 2025, it is under development for v0.2.0.

![A long swordman in a grid-based dungeon. He can see a zombie lurking in the darkness.](project-fiddlesticks-devlog-1_1.png)(In-game rendering. Captured on M3 Pro. All content subject to change.)

Project Fiddlesticks is a roguelite dungeon crawler, which you play as an adventurer, dwelling into the never-ending underground labyrinth. The inspiration of it came from many classics: Rogue, Diablo II, Darkest Dungeon, and World of Warcraft. Maybe there will be more. The shape of this project has not fixed yet, as it is now at merely its second iteration. You can find v0.1.0 at [here](https://grapegummygames.itch.io/project-fiddlesticks).

# Direction
I want to talk about the technology behind Project Fiddlesticks for a bit, because the direction of this game is heavily influenced by the choice of the stack. There was first the notion about the tech, then came the notion of the game. 

I do web development for a living. Until Project Fiddlesticks, I've always used dedicated game engines such as Unity3D or Godot in my game projects. Trying to work my idea out with these alien tools was always a hustle, and the incongruity between my professional and hobby stack has taken a toll on me. This time, I decided to make something with the technology I'm familiar with. And I double downed at it–I explicitly chose [React](https://react.dev/) as the rendering engine.

React is one of the most popular front-end framework in the world, but it is not known for making games. With this constraint my options was limited. To avoid the performance issues I needed a turn-based idea, and the vision became very clear after I played classic Rogue for studying purpose.

I always had ideas about fantasy dungeon crawler, classic Rogue showed me that with great direction, great game feeling and atmosphere can be built with simple system and aesthetics.

# Prototype
I spent about a month to build this idea into v0.1.0, its first prototype. Compared to my past games the stack choice worked wonder; I spent less time on researching yet wrote better code with greater velocity and delivered a better result. After v0.1.0 release I was certain React plus [XState](https://stately.ai/docs/xstate) is an underrated stack for making games. Yes they have their clear cons, but for many web devs with a game dev aspiration, I believe this stack has great potential. Learning it was the biggest reward of building v0.1.0.

v0.1.0 has a limited gameplay, but to me it also showed promise. The dungeon dwelling game loop was solid. The random mob and item generation, while still simple, grasped the feeling I wanted to explore. Furthermore, the shortcomings were very clear–more nuances on exploration and combat were desperately needed. These two are therefore the main upgrades in v0.2.0.

# Vision and information
The thing I was most impressed by classic Rogue was how it capitalized on *vision*. For a game with a majority of exploration gameplay, how and how much information to give player impacts the whole gameplay and overall playing experience. As I introduced grid-based movement in v0.2.0, vision was a critical part which I could not skip.

I created an algorithm to calculate block visibility base on distance from character and obstacles. First, the farer the block is from player the darker it is.

![A 5x5 grid, each cell with a value. At the bottom right it's 1.0, then drops by distance. At the top row and left column they are 0.0. ](project-fiddlesticks-devlog-1_2.png)(At four blocks from player it is nothing but darkness.)

Then, obstacles block light therefore create shadow. A shade block's visibility is the average of the two adjacent blocks nearer to player.

![The second grid. There are two 0.0 blocks in the middle, and blocks behind them have lower values.](project-fiddlesticks-devlog-1_3.png)(In this case, hero is at bottom right, so a block's visibility is the average of its right and bottom blocks' visibilities.)

Multiply these two vision score and we get something more like it.

![The multiplied value of previous two blocks.](project-fiddlesticks-devlog-1_4.png)(This is the key part of the algorithm, and where my muse started. Divide all factors impacting vision, then multiply them.)

Finally I clamp everything that is under 0.15. This is what in-game vision looks like:

![Similar to the previous block, only blocks with a value lower than 0.15 are clamped to zero.](project-fiddlesticks-devlog-1_5.png)(The result. Not perfect but in game the atmosphere was pretty on point with my image.)

I came out with the multiplying approach without any research. Until the implementation was completed I did not know this approach was similar to an algorithm called *recursive shadowcasting*. Granted it was way simpler, and there is some awkward spot here and there, but playing with it in the demo, I feel like it is good enough for the game at its current state. When turning around a corner there may be suddenly a big room, a corridor with its end buried in darkness, or a mob lurking. The algorithm managed to bring that feeling and I'm happy I made it.

![](project-fiddlesticks-devlog-1_6.mp4)

Another big implementation between me and v0.2.0 release will be, I reckon, mob AI. Perhaps I will have to write an A star pathfinding from scratch. I'll leave that part to the next episode.