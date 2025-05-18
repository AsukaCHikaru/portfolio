---
created: 2023/04/29 16:51
title: First Game Jam Postmortem
published: 2023-05-23
language: en-US
pathname: first-game-jam-postmortem
description: I attended a game jam for the first time in my life. It was the best decision I made as an indie game developer in many years.
updated: 2024-05-03
category: retrospective
topic: game development
---

I joined [Gamedev.js Jam 2023](https://itch.io/jam/gamedevjs-2023). The first game jam I've ever attended.

In late 2022 I decided to commit to indie game development in 2023; attending game jam was one of my goals. But I was thinking about (and only knew) the major ones, [Brackeys](https://itch.io/jam/brackeys-9), [GMTK](https://itch.io/jam/gmtk-jam-2022), etc.

In late March 2023, I found out a colleague is also a fellow indie game developer. An experienced one, actually. He has joined jams several times and recommended I join Gamedev.js Jam 2023.

At the time I was building the prototype of my (hopefully) first commercial release. I could see all the benefits of joining a jam; my only concern was the aftermath of changing projects in the middle of building one. Then my colleague told me one of the effects of attending game jams:

> Gamejams help you stay small, and help you get good at discarding ideas xD

Scope creep has always been an issue since I start making games. I had to keep reminding myself to be careful before adding those cool new features. The last time I had a public release was in 2009. I needed a finished game, and to achieve that I needed to be aware of the scope. This was the reason I decided to join the jam.

# Planning

The theme of the jam was "Time."

Although the jam announcement explicitly says that attendees can interpret the theme however they like, I wanted to make time the absolute core of the gameplay instead of being only part of it.

It took me three days to reach an idea I was excited enough to move to the next step. I took inspirations mainly from two resources:

- Rent (2005): a musical drama movie, which was an adaption of my wife's favorite Broadway musical.
- Stacklands (2022): a card-based village building survivor with equilibrium-chasing flavor.

From Rent I was inspired by that life may be measured by all the decisions made and all the struggles coped with. Then I thought facing and dealing with all these obstacles in life aligns with the popping cards mechanic in Stacklands, and its equilbrium-chasing gameplay.

The game is named "How Do You Measure a Year." It is directly borrowed from the lyrics of one song in Rent. The game is a time-management simulation, where players need to schedule their day routine, and try to reach balance between money, health and mental.

I focused mostly on gameplay, and if the progress is good, I may spare some time on art. No plan for audio was made.

# Building

Although this was a "Gamedev.js" jam, I checked that Unity3D-made games are eligible as long as it runs on a browser. Considering I'm likely going to keep use Unity as my main tool to build game in the foreseable future, I decided to go with it.

The coding of basic mechanics was smooth. However, for some reason I thought the submission deadline was around early May, but it was actually late April, four days before I found out the truth.

Unfortunately my coding did not speed up even after I knew the deadline was near. I've had the outline of the gameplay in my head, but mechanic details were not figured out, and that severely killed my flow and productivity.

I took the deadline day off to do a final sprint. Thanks to that I barely managed to finish up the main gameplay, but still I had to massively cut narratives and leave art and audio totally untouched.

After I built the game to where I considered it was in submittable status and there was no time enough to make impactable changes, I clicked the build button and submitted it. Then I found out there was a major visual bug -- not directly affecting gameplay but a key part of UI. That was about 40 minutes before the deadline.

I tried to solve the issue. It was not fixed. I tried another approach. It was not ideal but it works at least. I clicked build and shipped it. The time was 17 minutes before the deadline. And that concludes my first ever jam game building.

# Reviews

I later realized there was another critical bug: the good ending screen where when a year passed in in-game time, the game should pause and the player's yearly statics should be displayed. That screen does not appear. The player's one year is not measured at all! This game's name doesn't even make sense!

Besides that, due to lack of art and UI polishing, this game does not have the most intuitive controls. New players are most likely to see the game over-screen several times before having a grasp of what the game is about. I was expecting people to open the game, get frustrated about the UI, then leave with a bad review or not even one.

The second day after the deadline, I woke up and found two reviews on my page. Both were positive; one specifically said that after the reviewer understood the mechanics, they were impressed with how the player action and game statics dynamic works. A lot of kind words.

I could not ask for a better way to start a day, or to conclude my first jam.

Later, my friends also said that they had fun, with reactions I aimed for while designing the gameplay.

> I work twelve hours a day and my save is dropping still??

> I quit to exercise for helping my health and my savings are gone in less than two weeks

> Is that how you are supposed to feel with a minimal wage? I know both my health and mental need help but I can't afford to quit

Their overall review may be biased (love ya hommies), but the reactions were not. My gameplay worked the way I wanted. People played my game and they had fun. It was a magical moment.

# Reviewing

I was deeply impressed by how itch.io crafted its jam community system. For every comment a submission received, the reviewer's submission is shown below their comment. It's very natural for a reviewee to review the reviewer's submission, thus the connections between creator and player are built.

I've been looking for an indie dev community where I'm comfortable enough to start or join a conversation since last year. Discord, Reddit, you name it. The closest one so far was [mastodon.gamedev.place](https://mastodon.gamedev.place). But itch.io, or at least this jam, helped me to have the most connection with fellow indie devs and players. And it was so elegant!

# Result

On May 9th the result was announced. Out of 202 entries, my entry "How Do You Measure a Year" got 80th overall.

With 7th in "theme" and 10th in "innovation" criteria.

Even the 80th overall was beyond my expectation, let alone getting top ranks in two idea-related criteria.

After all these years, studying game design theories, reviewing games after playing, and most importantly, forging game ideas only in my head without actually building one, I didn't know if those time were ever meaningful, if I was just pretending I'm chasing my dream.

Now I know there are people like my idea.

It's a small jam, I know. My entry had only 16 ratings, I know. But it was a confidence boost I needed badly. I gained so much by joining this jam, but maybe this is the most precious one.

# Lesson

I was just happy that I finally got to finish a game. My first public release in 14 years! Hooray! This was more like merely a promise kept from myself to myself that I'm done only talking about being a indie dev.

I'm also happy now I see the path toward my next release more clearly. I found some critical issues that I have to resolve, including:

- Invest more time in art. No matter what platform I'm going to release on, the first thing players see are the thumbnail and screenshots. Gameplay doesn't matter if I can't get people interested, and I believe art is the key.
- Spend more time planning and documenting before building. I encountered severe flow and motivation loss while building my entry, because I only had an outline of the idea, so I had to stop and figure out the details before writing the code for every component of the game, which killed the momentum. Worst case scenario it may kill the whole project.

These are not "issues," but still something I found out (again) and plan to keep doing in the future:

- Access to a large variety of art pieces helps immensely. I played Stacklands not because I was studying it, but only because I wanted that equilibrium kick. Turns out it inspired my entry's core gameplay. The same goes for the Rent movie. Everything may be my muse.
- Gamejam is such a good way for finding small-scoped ideas. I'm considering completing my entry and making it my first commercial release. I see this as a solid path for the first several releases of my studio.
- Playtesting and getting feedback is important and necessary. Also, it's impossible to find a team or even an audience without showing people what you're capable of.

And there goes my first jam. Extremely glad I decided to join it. Still tons of work to do, but I see possibilities lie before me.
