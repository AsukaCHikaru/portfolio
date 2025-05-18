---
created: 2024/12/26 15:24
title: Thoughts on Building a Game with XState
description: After hearing about XState's good reputation for years, I used it to build the prototype for my game. These are my thoughts.
published: 2025-01-04
updated: 2025-01-04
language: en-US
pathname: thoughts-on-building-a-game-with-xstate
category: note
topic: game development
---

For the prototyping of [Project Fiddlesticks](https://grapegummygames.itch.io/project-fiddlesticks), my latest indie game project, I used [React](https://react.dev) and [XState](https://xstate.js.org/) as the building blocks. Finite state machines are essential components in games, and for a few years I have heard a lot of good things about XState as a finite state machine library; this is my first time using it, and it lived up to its reputation. After finishing the prototype, I decided to write up my thoughts on using XState in game development.

# Head first XState

Below is an example of a basic state machine that represents the most basic behavior of a mob: it is `alive` by default, loses `hp` when taking `damage`, and enters `dead` state if hp drops to zero.

```ts
const mobStateMachine = setup({
  types: {
    context: {} as { hp: number; maxHp: number },
    input: {} as { maxHp: number },
    events: {} as { type: "damage"; damage: number },
  },
}).createMachine({
  id: "mobState",
  initial: "alive",
  context: ({ input }) => ({
    hp: input.maxHp,
    maxHp: input.maxHp,
  }),
  states: {
    alive: {
      on: {
        damage: {
          target: "hit",
          actions: assign({
            hp: ({ context, event }) => Math.max(context.hp - event.damage, 0),
          }),
        },
      },
    },
    hit: {
      always: [
        {
          target: "alive",
          guard: ({ context }) => context.hp > 0,
        },
        {
          target: "dead",
          guard: ({ context }) => context.hp === 0,
        },
      ],
    },
    dead: {
      type: "final",
    },
  },
});
```

Such objects created by the `createMachine` API function similarly to blueprints—describing how the state machine should work but not performing the work itself. The actual state machines that execute in the program are called **actors**, which are instances created by the state machine factory.

A working actor for above state machine model looks like this:

```ts
const mobActor = createActor(mobStateMachine, {
  input: { maxHp: 5 },
});
mobActor.start();

console.log("mob state:", mobActor.getSnapshot().value); // "mob state: alive"
console.log("mob hp:", mobActor.getSnapshot().context.hp); // "mob hp: 5"

mobActor.send({ type: "damage", damage: 3 });

console.log("mob state:", mobActor.getSnapshot().value); // "mob state: alive"
console.log("mob hp:", mobActor.getSnapshot().context.hp); // "mob hp: 2"

mobActor.send({ type: "damage", damage: 3 });

console.log("mob state:", mobActor.getSnapshot().value); // "mob state: dead"
console.log("mob hp:", mobActor.getSnapshot().context.hp); // "mob hp: 0"
```

# Robust, precise

Writing entity behavior in XState is straightforward, and after getting a grasp of it, fast. The event-based transitions guarantees that all behavior changes are predictable and traceable, which significantly reduces the cognition load during development. The eventless transitions, such as `always` or `after`, on the other hand, while demand more awareness, make it simple and natural for describing conversion states.

XState provides abundant APIs, which enables creating the entire entity behavior in the state machine model, while exposing only the `send` API, which listens to nothing but the intended events for the current state. The encapsulation of logics makes the state machine robust, which is perhaps my favorite part of XState.

# Context-rich

Finite state machine is the backbone of an entity, but in a real game, an entity is more than just its states. For a killable mob, unless all attacks are instant-deaths such as spikes in _Mega Man_, a `hp` property would be necessary.

XState provides a **contexts** API to integrate properties that changes with state changes or cause state changes, in the state machine itself. This is the integral component that enables the creation of the entire behavior model in XState.

# Solid hierarchy

Some state machines are designed to interact with one another, whether as siblings or parent-child. XState has it covered with the `spawn` API for vertical hierarchy, or the `system` API for more general communication among actors. This feature further improves encapsulation by eliminating unnecessary event calls from the user side. It took me a while to comprehend how the actors are supposed to communicate, but the design assures safety and structure.

# It reacts well

It might be easy to take it granted for libraries providing sufficient integration with React, but I really appreciate the native support for React from the [@xstate/react](https://stately.ai/docs/xstate-react) package, which makes using XState in React a walk in the park.

# Conclusion

Creating a game with XState was enjoyable, and I plan to continue using it, possibly even for my future projects.
