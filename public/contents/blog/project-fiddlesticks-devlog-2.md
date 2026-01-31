---
created: 2026/01/27 14:32
title: "Project Fiddlesticks Devlog #2"
description: I refactored the combat loop mechanic, an essential component in my indie game Project Fiddlesticks.
published: 2026-01-30
updated: 2026-01-30
language: en-US
category: development
topic: game development
pathname: project-fiddlesticks-devlog-2
thumbnail: project-fiddlesticks-devlog-2_1.webp
thumbnail-direction: portrait
featured:
---
Project Fiddlesticks 0.2.1 is out! In this version, alongside many other improvements, I refactored the hero and mob state machines in a more modular fashion. One critical bug in 0.2.0 was that mobs may freeze and become unattackable, making the game unable to proceed. This was because the combat loop state machine implementation was, essentially, a plate of spaghetti that I hated to look at; hero state machine was the tomato and mob state machines were the meatballs; they were all entangled in an unmaintainable way.

# Issue
In this turn-based classic roguelike there are two parties: hero (player) and mobs (enemy), whose turns proceed alternately. Hero turn comes at game start, then all mobs take their action, hero moves again after that. This loop of two parties' action can be interpreted as a finite state machine, that is, hero turn as the entry state, which transitions into and from mob state. This mental model of "handling a finite state machine" lead to the decision of implementing the combat state in [XState](https://stately.ai/docs/xstate), the framework used in hero and mob state machines. That was a mistake.

For XState state machines to form hierarchy and communicate, they became strongly coupled with each other. The combat state controlled when and who to take turn action; hero state and mob states had to send the "action complete" signal to parent machines for the transition checks as well. Every state machines were deeply dependent on each other, even the most basic unit tests for each state required all parties being in scope to function. On top of that, implementing the combat state in XState forces the mechanic design to match XState philosophy, which was another cognitive load too heavy to bear. As I wrestled with XState, trying to implement a certain part of the feature, the tests wobbled as well, causing more trouble then accomplishment. My stamina, or, patience, eventually ran out, thus version 0.2.0 was out when it "kind of worked", but in reality, it was not an acceptable build. Some test players encountered combat freeze at the first enemy.

![A flow chart of game state, level state, hero state and mob states, sending various events to each other.](project-fiddlesticks-devlog-2_1.webp)(Flow chart of state machines. Implementing this with timeouts between was a hustle that badly killed my patience.)

# Decoupling XState
Discard of combat state in XState was necessary. For the record, it was probably a me problem; I believe there is a way to do this elegantly in XState, and I do not plan to decouple hero and mob from XState for now, as they are still functional as well as easy to maintain. But as both my time and energy were limited, I figured that moving forward without XState combat state was the optimal move this project needed. Also, as mentioned above that hero state and mob states were deeply coupled with combat state, they needed a revamp as well. After working on the rewrite, I finally recognized the old design's issue: there were two layers of abstraction in mob states. Below is old mob state machine's all possible states:

```ts
export const MOB_STATE = {
  IDLE: 'IDLE',
  IN_ACTION: 'IN_ACTION',
  ATTACK: 'ATTACK',
  ACTION_OVER: 'ACTION_OVER',
  DEAD: 'DEAD',
} as const;

const MOB_IDLE_SUBSTATE = {
  READY: 'READY',
  HIT: 'HIT',
  DEAD: 'DEAD',
  MOB_TURN_TRANSITION: 'MOB_TURN_TRANSITION',
} as const;
```

This list of states represents two different things: mob's action status (`IDLE`, `ATTACK`, `DEAD`) and mob's state machine status (`IN__ACTION`, `ACTION__OVER`, `MOB__TURN__TRANSITION`). The entanglement of these two concerns disrupted the mental model, making the code messy and eventually sabotaged the game. By isolating combat state into a different model, the vision toward a simple state machine design became clear. Here is the refactored mob states:

```ts

const MOB_STATE = {
  IDLE: 'IDLE',
  AGGRO: 'AGGRO',
  ATTACK: 'ATTACK',
  DEAD: 'DEAD',
} as const;

const MOB_IDLE_SUBSTATE = {
  READY: 'READY',
  HIT: 'HIT',
} as const;
```

The states are clearer now; it's about the mob's in-game action.

# Combat loop

As for the combat loop, I implemented it as a custom React hook. The mechanic itself is extremely simple: transition between hero turn and mob turn base on hero and mob **AP**, or action point. Move or attack uses AP, and one's turn is over when all AP is used. Below is the full list of executions in a combat loop:

1. Start in `HERO__TURN`. Wait for hero **ATTACK** or **MOVE** action.
2. When hero **AP** is equal to or less than zero, transition to `MOB__TURN`.
3. In `MOB__TURN`, mobs in level take action in turn. Each mob checks if hero is in vision if it is in `IDLE` state. If yes, it transitions to `AGGRO` state, in which it may **ATTACK** or **MOVE** toward hero. One mob take actions until its **AP** is equal to or less than zero. If no, mob skips turn. `DEAD` mobs skip turn as well.
4. When all mobs have consumed their **AP**, transition to `HERO__TURN`.

The hook's responsibility is to monitor hero and mobs' AP and proceed on the state transition. First, the hero's one:

```ts
const useTurn = ({ heroActorRef }) => {
  const [turnState, setTurnState] = useState<'HERO_TURN' | 'MOB_TURN'>('HERO_TURN');
  const turnStateRef = useRef(turnState);
  
  useEffect(() => {
    turnStateRef.current = turnState;
  }, [turnState])
  
  useEffect(() => {
    if (!heroActorRef) {
      return;
    }
    const subscription = heroActorRef.subscribe((snapshot) => {
      if (turnStateRef.current !== 'HERO_TURN' || snapshot.context.ap > 0) {
        return;
      }
      setTurnState('MOB_TURN');
    });
    
    return () => subscription.unsubscribe();
  }, [heroActorRef])
```

The XState [subscription API](https://stately.ai/docs/actors#subscriptions) suits this part very well. The transition from `HERO__TURN` to `MOB__TURN` only depends on two things:
1. AP is no larger than zero.
2. It is `HERO__TURN`.
Here I used another effect to update `turnStateRef` instead of directly depending on `turnState`, as it would make the turn state setting effect depending on turn state itself, a common anti-pattern for React effects.

Next is the mob turn. The effect does below things:
- only work in `MOB___TURN`
- only work for mobs not in `DEAD` state
- each mob take action in turn, until all AP is used

The first two tasks are simple conditions; the third is the main task of this effect. The mob taking action part, however, has been encapsulated in mob state machine; all it requires is just to send a `TAKE__TRUN` event to them. This abstraction I did previously made implementing mob turn mechanic extremely simple. 

```ts
// useTurn.ts
mob.send({
	type: MOB_EVENT.TAKE_TURN,
	heroPosition: heroSnapshot.context.position,
	grid,
	mobPositions,
	heroActorRef,
});

// `TAKE_TURN` action depends on mob state using the `guard` API
// mobState.ts
...
states: {
	[MOB_IDLE_SUBSTATE.READY]: {
		on: {
			[MOB_EVENT.TAKE_TURN]: [
				{
					target: `#mobState.${MOB_STATE.AGGRO}`,
					guard: and([
						'heroInVision',
						not('heroInAttackRange'),
						'hasApForMove',
					]),
					actions: 'move',
				},
				{
					target: `#mobState.${MOB_STATE.AGGRO}`,
					guard: and([
						'heroInVision',
						or(['heroInAttackRange', not('hasApForMove')]),
					]),
				},
			],
...
	[MOB_STATE.AGGRO]: {
		on: {
		[MOB_EVENT.TAKE_TURN]: [
			{
				target: MOB_STATE.ATTACK,
				guard: and(['heroInAttackRange', 'hasApForAttack']),
				actions: ['attack', 'deductAttackAp'],
			},
			{
				guard: and([not('heroInAttackRange'), 'hasApForMove']),
				actions: 'move',
			},
		],
```

Each mob acts until all AP is used, therefore after each `TAKE__TURN` event, check mob API, start a timeout to keep multiple actions from being compressed into one frame, then wrap all of the above into a loop.

```ts
eligibleMobs.forEach(async (mob) => {
	const heroSnapshot = heroActorRef.getSnapshot();
	if (heroSnapshot.context.hp <= 0) {
		return;
	}
	while (true) {
		const mobPositions = eligibleMobs
		.filter((m) => m !== mob)
		.map((m) => m.getSnapshot().context.position);
	
		mob.send({...});
	
		const afterSnapshot = mob.getSnapshot();
	
		if (!afterSnapshot.matches('AGGRO') || afterSnapshot.context.ap <= 0) {
			break;
		}
	
		await new Promise((resolve) => setTimeout(resolve, 150));
	}
}
```

The last part of turn is the end. After a short delay for clarity, regenerate hero and mobs' AP, set turn state to `HERO__TURN`, and it's a new turn waiting to start.

```ts
await new Promise((resolve) => setTimeout(resolve, AP_REGEN_DELAY_MS));

heroActorRef.send({ type: HERO_EVENT.REGEN_AP });
mobs
	.filter((mob) => mob.getSnapshot().value !== 'DEAD')
	.forEach((mob) => {
		mob.send({ type: MOB_EVENT.REGEN_AP });
	});

setTurnState('HERO_TURN');
```

Voila! The combat loop works with less than 150 lines of code. Compare to the abomination before, this implementation is way easier to read, maintain and test. While XState was not the one to blame, decoupling combat state from it did very much help me constructing a simpler mental model. I'm also happy that I was able to do this in the React way–makes the tech stack decision meaningful.

![A simpler flowchart with hero and mob states monitored by useTurn](project-fiddlesticks-devlog-2_2.webp.webp)(Flowchart after refactoring. Way simpler and more elegant now.)

With this refactoring, v0.2.1 is a critical bug-free (many minor issues still exist) build that is playable at [https://grapegummygames.itch.io/project-fiddlesticks](https://grapegummygames.itch.io/project-fiddlesticks). The gameplay could be rather dull, as it only has the bare-bone components; many features are on the roadmap, including character progression, loot qualities, improved dungeon generation, and more, all of them I'm looking forward to implement as well as talk about in future devlog entries.