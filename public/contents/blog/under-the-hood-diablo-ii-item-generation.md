---
created: 2024/09/21 12:43
title: "Under the Hood: Diablo II Item Generation"
description: A system design research turned into a reconciliation with a game I didn't know I was so in love with, so I wrote a research note to express my appreciation.
published: 2024-11-08
updated: 2024-11-08
language: en-US
pathname: under-the-hood-diablo-ii-item-generation
category: research
topic: game development
---

Growing up as a teenager in the 2000s, from _Starcraft_ to _World of Warcraft_, the juggernaut _Blizzard Entertainment_ dominated the computer game industry and countless nights of mine. It would be an understatement to say I _loved_ their games—I almost failed university thanks to WoW, and _Warcraft III_ inspired my game developer dream, thereby directly influenced my chosen profession as a software engineer. Among the games created during their prime, however, **Diablo II** stands in an interesting place. For tens of hours (which was very low for Diablo II), I mindlessly pressed buttons in the dark land where evil roams, and I surely had fun, but I was not _obsessed_ with it, nor did I ever consider to properly know the game. Nonetheless, in that time it was difficult to avoid seeing discussions about Baal runs, cow levels, or treasure classes.

That was why when I had to design a loot generation system in my game, Diablo II was the first candidate for reference that popped into my mind. I knew that Diablo II's anatomy was studied by communities in the world, and there were more than enough resources on how it works as a carefully crafted system. I had no doubt it would enlighten me immensely on game design; what I did not expect was that the more I studied about Diablo II, the more I was impressed and in love with this game, more than 20 years after its release.

The research of the Diablo II item generation system was not exactly smooth. Though there were many valuable archives, and without them I wouldn't have managed to comprehend the whole topic, there was not a single source that included the full item generation mechanic while being easy to read and digest. So I decided to write one myself. I hope to help the next person who aspires to take on this topic.

That being said, the topic of Diablo II item generation involves a lot of components, and I won't be covering them all. More precisely, this post will NOT discuss:

- Horadric cube crafting
- Vendor and gambling
- Duplicating
- Special item modification, such as Charsi imbuing or Larzuk socketing
- Runewords
- Magic find strategy
- The full details of every mathematical formula used in item generation
- TC upgrade

Instead, this post will focus on:

- The overall process of equipment generation system, from the monster kill to how each property of the item is decided
- My impression and interpretation of why each component was designed in its way

This will be a long read. Find a seat at your campfire, be ready to stay a while and listen...

# In the beginning was the base type

Today is a great day. You just finished yet another _Mephisto_ run and five items dropped: a normal item, a _magic_ item, a _rare_ item, a _set_ item, and finally, an _unique_ item with the iconic dark gold-colored item label. Being unidentified, on the label the unique item's name is not shown but only a short string: _Shako_. If you are an experienced player, however, you would have known this unique item, when identified, has the name of _Harlequin Crest_.

::d2-shako-unidentified|Unidentified unique shako. Hover to show item card.

This is because every item in the game has one and only one **base type**. When you kill a zombie just outside of _Rogue Encampment_ and it drops a white _Sash_ with no magic enhancement, _Sash_ is its base type; when you check _Akara_'s item and there is a blue _Deadly Scepter of Self-Repair_, _Scepter_ is its base type; the _Harlequin Crest_ finally dropped, _Shako_ is its base type. No matter what quality an item is, where or from whom it dropped, an item always has a base type.

What's the base type's role in an item? What's its impact on an item? The answer is: almost everything. From an item's icon and model to its level requirement and attribute requirements; if it's a weapon, then its damage and attack speed; if it's an armor, then it's defense and weight—base type sets the foundation of an item. Base type _is_ the foundation of an item.

## Quality of the type

There are hundreds of base types in the game; each provides a different amount of combat power to the player's character, some more, some less. Because of the nature of the progression system, items appearing in later stages of the game tend to have more power than ones in the early game, and the base type is designed to reflect that. **Quality Level**, or **qLvl**, while not displayed in the game at all, is defined in every base type to indicate its power level. For example, _Short Sword_, the default weapon on a newly created Paladin, has a qLvl of 1; _Mighty Scepter_, the base type of the unique item _Heaven's Light_ often used by Paladin, on the other hand, has a qLvl of 62.

During the playthrough, you may have noticed some items have identical icons and models. For instance, _Crystal Sword_, _Dimensional Blade_, and _Phase Blade_ all have the same wave-y light blue sword look. This is because these three base types are related: _Dimensional Blade_, whose qLvl is 37, is the **exceptional** version of the _Crystal Sword_ base type whose qLvl is 11, and _Phase Blade_ is the **elite** version with the qLvl of 73. Normal, exceptional, and elite—these are the three variations of a base type family with respective qLvls.

::d2-crystal-sword-family|Crystal Sword, Dimensional Blade, and Phase Blade.

## Such an unique type

One of the most intriguing parts of Diablo II is the indefinite amount of item roll variation; items with the same base type may be trash or godtier, depending on their quality and power modifier combination. God only knows what a drop's power is going to be.

For many base types, there is one variation, however, that can be predicted as soon as its label is shown on the ground—the **unique item**. Each unique item has a special name and a set of fixed modifiers instead of a random combination. They are such iconic and _unique_ entities that almost every base type has at most _one_ unique and _one_ set item in that type. Take the case of _Diadem_: there is only one set item _M'avina's True Sight_ and one unique item _Griffon's Eye_ with this type. You won't find another unique item with the _Diadem_ base type. This is why when the unidentified unique _Shako_ was mentioned earlier, I could be sure the unique item is going to be _Harlequin Crest_—it is the only one unique quality _Shako_ type item.

::d2-diadem-set-unique|A normal diadem, set diadem M'avina's True Sight, and unique diadem Griffon's Eye

Base type is the cornerstone of an item. Being a role-playing game, it requires a huge amount of content, including many usable weapons and armors. Base types give more depth to the items, with each type's name itself containing rich history and imagination behind it. The normal-exceptional-elite pair design reduced the amount of assets needed while providing a sense of progression. Items seen in early game may also appear in late game, with the same appearance but different power.

My favorite part of the game is definitely the unique items. Every time a dark gold-colored item drops, the excitement surges. In a game where the gameplay is pursuing better loots over and over, while unique items are not necessarily always the most optimal choices power-wise, to me they are the pinnacle of the loot-finding journey. Binding them to base types is a natural design decision; it gives a promise that every type of item might be a treasure, a highlight of the run.

# Treasure class: the pinball machine

Back to the drop. You killed Mephisto, and he dropped some items. How does the game decide if the drop should be _Harlequin Crest_? Or, how does the game decide if the drop should be _any_ item in the first place? It is a 1 in 2035 chance for hell Mephisto to drop the unique Shako; there is no way the game rolls a 2035-dimensions dice for every single possible drop, right?

As you probably have guessed, the answer is no. Instead, the game rolls many small dice. Imagine a pinball machine with plenty of nails and holes on it, all serve as obstacles to prevent the marble from reaching the bottom, where many rewards lie, each one represents a different base type.

::d2-pinball|Treasure class works like a pinball machine.

Every time a player kills a monster, a marble is given as an attempt: if it reaches the bottom, one of the possible base types is selected; but if it falls into a hole before reaching the bottom? Another pinball machine starts then, this time slightly easier to reach the bottom, but also with slightly less powerful rewards. This selection chain keeps going, until the marble finally reaches one of the rewards.

::d2-pinball-list|When a TC doesn't reach its rewards, it fall backs to a lower level TC.

Each pinball machine is a drop table called **Treasure Class**, or **TC**.

## TC composition

Let's take a proper look at TC. TC can be categorized into four types by its composition; the smallest one is just a single base type, or, to be precise, the code of a base type. For example, `amu` for _Amulet_, `rin` for _Ring_, and `r01` to `r33` for runes.

### Small TC

Small TCs contain several base type codes. It looks like this in JSON format:

```json
{
  "name": "Runes 1",
  "picks": 1,
  "items": [
    {
      "type": "r01",
      "probability": 3
    },
    {
      "type": "r02",
      "probability": 2
    }
  ]
}
```

::d2-tc-runes-1|The Runes 1 small TC.

For now, we will ignore the `picks` property. The chance to roll a certain item in a TC is:
$$\frac{\text{target item weight}}{\text{all item weight sum}}$$
So, for above example, the chance for TC `Runes 1` to roll `r01`—the code of the _El_ rune—is
$$\frac{3}{3+2} = 60\text{\%}$$
Notice that TCs containing weapons and armor are a little different. I'll talk about it later.

### Medium TC

Medium TCs contains base types as well as small TCs. It looks like this:

```json
{
  "name": "Runes 2",
  "picks": 1,
  "items": [
    {
      "type": "Runes 1",
      "probability": 2
    },
    {
      "type": "r03",
      "probability": 3
    },
    {
      "type": "r04",
      "probability": 2
    }
  ]
}
```

::d2-tc-runes-2|The Runes 2 medium TC which includes Runes 1 as its child.

For `Runes 2`, there is a 3/7 chance to roll _Tir_ (rune number 3), 2/7 chance to roll _Nef_ (rune number 4), and a 2/7 chance for the selection to fall back to TC `Runes 1`. In this case the chance to roll _El_ from `Runes 2` is:
$$\frac{2}{7}\times \frac{3}{5}=\frac{6}{35}\approx17.142\text{\%}$$

### Large TC

Large TC is the start line of the pinball fallback scheme, that is, they are directly assigned to monsters as their drop tables, instead of only being used as another TC's composition. Here is the TC assigned to nightmare Diablo:

```json
{
  "name": "Diablo (N)",
  "picks": 7,
  "unique": 983,
  "set": 983,
  "rare": 983,
  "magic": 1024,
  "items": [
    {
      "type": "NoDrop",
      "probability": 15
    },
    {
      "type": "gld",
      "probability": 5
    },
    {
      "type": "Act5 (N) Equip A",
      "probability": 52
    },
    {
      "type": "Act5 (N) Junk",
      "probability": 5
    },
    {
      "type": "Act5 (N) Good",
      "probability": 3
    }
  ]
}
```

::d2-tc-diablo-n|The nightmare difficulty Diablo TC.

As you can see, there are more properties in large TC than medium or small TC, but I'm going to ignore them for now.

The first-level dependencies in large TC, like the example above, are often named after and coupled to act and difficulty, which both have a very specific position in the linear game progression. By using the same TCs across monsters appearing in the same act, the tedious labor of copy-pasting the same drops is saved, along with eliminating the worry of mistakes. This design effortlessly maintains the power consistency of drop pools in nearby areas.

This structure of cascading dependencies also enables the developers to freely fine-tune parent TC roll chances without affecting child TC roll chances and vice versa. If one monster already has a million drops assigned and suddenly there is one more to be added, the only work required is to add it to the monster's large TC. All other medium TCs will remain perfectly untouched.

## The unlucky empty drop

`NoDrop`, as its name suggests, results in an empty roll when selected. The probability works like any other TC, so for example, below _Countess Rune_ TC has a 5/(5 + 15) = 25% chance to roll nothing in one pick iteration.

```json
{
  "name": "Countess Rune",
  "picks": "3",
  "items": [
    {
      "type": "NoDrop",
      "probability": 5
    },
    {
      "type": "Runes 4",
      "probability": 15
    }
  ]
}
```

::d2-tc-countess-rune|The normal difficulty Countess Rune TC.

### More is more (drops)

In games that have more than one player, however, the `NoDrop` chance changes. In the empty drop chance formula, one additional constant is added, which is decided by the below conditional:

- starts at 0
- +1 by player who kills the monster
- +1 for each player that is partied and is within two screens to the kill
- +0.5 for each other player in the game, partied or not
- round down

This constant is inversely proportional to the empty roll chance, therefore the more players participating in the monster kill, the lower the `NoDrop` chance is.

Also, since the constant rounds down, odd numbers of party members that are not participating in the kill not only do not contribute to lowering the empty roll chance, because monster stats scale with in-game player count, by making the monsters harder to kill, they actually decrease the farm efficiency. It is obvious that Blizzard wants to encourage players to play together as much as possible through the empty roll chance optimization.

## Marble count

It may seem natural that bosses drop more items than minions, but what is exactly the deciding factor behind it? The answer is the **picks** property in TC. Being an integer, it is the count of the selection iteration executed in this specific TC—the number of marbles given for this particular pinball machine. To give some examples, most small and medium TCs have 1, the Act 3 _Council Members_ have 3, and all Act bosses have 7.

Blizzard also provided a way to ensure some items are always picked in its TC. When the `picks` is a negative number, the selection ignores `NoDrop` and always returns each item's `probability` times. Take the Countess for an example:

```json
{
  "name": "Countess",
  "picks": -2,
  "items": [
    {
      "type": "Countess Item",
      "probability": "1"
    },
    {
      "type": "Countess Rune",
      "probability": "1"
    }
  ]
}
```

::d2-tc-countess|The normal difficulty Countess TC

This is why Countess is the go-to place for rune farms. The `-2` picks make sure both items are always picked their probability times, which is 1 time each. Since **Countess Rune** contains nothing but rune TCs with 3 `picks`, it is written in the game configuration file that the Countess always drops some runes.

## Weapon and armor TCs

Now that we know how TC works, let's finally look at the TCs that contain armor and weapon base types. Armor and weapon TCs are a special breed, as they are not statically stated in game files like the TC introduced above, but generated at runtime when the game is launching. Armor TCs are named `armoX` and weapon ones `weapX`, where `X` is an integer with a range from 3 to 87 with the step of 3, i.e., the weapon TCs are named `weap3`, `weap6`, all the way to `weap87`. Each TC contains base types with qLvl in that step of 3, so `weap3` contains all the weapon base types with iLvl 1 to 3, and `weap6` 4 to 6, all the way to `weap87` with base types from level 85 to 87. Remember the number 87; we will meet it again in later parts.

```json
{
  "name": "armo87",
  "picks": 1,
  "items": [
    {
      "type": "ci3", // Diadem
      "probability": 1
    },
    {
      "type": "urn", // Corona
      "probability": 1
    },
    {
      "type": "uar", // Sacred Armor
      "probability": 1
    },
    {
      "type": "uhg", // Ogre Gauntlets
      "probability": 1
    },
    {
      "type": "uhb", // Myrmidon Greaves
      "probability": 1
    },
    {
      "type": "uhc", // Colossus Girdle
      "probability": 1
    },
    {
      "type": "drf", // Dream Spirit
      "probability": 1
    },
    {
      "type": "baf", // Guardian Crown
      "probability": 1
    },
    {
      "type": "paf", // Voxtex Shield
      "probability": 1
    },
    {
      "type": "nef", // Bloodlord Skull
      "probability": 1
    }
  ]
}
```

::d2-tc-armo-87|The dynamically generated level 87 armor TC

These weapon and armor base types are never directly referred to in small, medium, and large TCs but are only accessible from weapon or armor TCs. Therefore, weapon and armor TCs are always the final step of a TC selection. In them, one base type is picked, and an item instance of the particular base type is generated.

```json
{
  "name": "Act 5 (H) Melee C",
  "picks": 1,
  "items": [
    {
      "type": "weap81",
      "probability": 2
    },
    {
      "type": "weap84",
      "probability": 6
    },
    {
      "type": "weap87",
      "probability": 14
    },
    {
      "type": "weap87",
      "probability": 1
    },
    {
      "type": "armo81",
      "probability": 1
    },
    {
      "type": "armo84",
      "probability": 3
    },
    {
      "type": "armo87",
      "probability": 7
    },
    {
      "type": "armo87",
      "probability": 1
    },
    {
      "type": "Act 5 (H) Melee B",
      "probability": 1530
    }
  ]
}
```

::d2-tc-act-5-h-melee-c|The TC used in hell Act 5 which includes the armo87 TC.

Treasure classes are the backbone of the Diablo II item generation system. It defines what monster, in what area and difficulty, should drop what item, with what probability and quality. By grouping items into hundreds of small unions containing each other, a web of complex drop tables is formed to support the illusion of an indefinite amount of possible drops on every single monster kill, yet on a bigger picture, these drops beautifully align to the game progression and ensure a smooth player experience. Random, yet organized.

# It is all about the levels

Now the drop's base type selection process is over, but there are still many properties to be decided. Base type surely determines many aspects of an item, but an item's combat power is not completed tied to the base type's qLvl—Baal may drop a _Short Sword_ if his TC selection falls back all the way to the lowest level weapon TC, but it is still going to be a better _Short Sword_ dropped in normal Act 1.

The difference between them is the generated item instance's level, or **iLvl**.

Talking about level the number, the _level_ player sees the most is their character's level. By game progression the character level naturally increases. Everybody plays with a different pace, but the level when a player hits a certain area should converge in a reasonable range. For instance, it is likely to finish normal Act 1 with level around 12 to 15. This is very much intentional by the developers. In other words, the Catacombs—the last area of Act 1—are designed for characters level 12 to 15. In fact, the map itself has a level tied to it too. It is called area level, or **aLvl**. Normal difficulty Catacombs level 1 and 2 have an aLvl of 11, while level 3 and 4's aLvl is 12. The max aLvl in the game is, the same as the highest TC level, 87.

What aLvl affects is the level of the monsters in that area. The monster levels, or **mLvl**, for ordinary monsters, are exactly equal to the aLvl of the area the monster is in (except in normal difficulty, where all mLvls are predefined), except for the champion, unique, and super unique monsters.

Some monsters in the game have a name label in blue color and several power modifiers, such as _Extra Strong_ or _Lighting Enchanted_. They are called **champions** and have a +2 mLvl bonus. Some monsters always spawn at the same place and have a unique name in gold color, such as _Corpsefire_ the zombie in _Den of Evil_. They are called **uniques** and have a +3 mLvl bonus. Finally, there are **super uniques** such as _Diablo_ or _Andariel_, whose mLvl are unrelated to its spawn area.

For example, as mentioned above, normal Catacombs level 4's aLvl is 12. That means all normal monsters in it have a mLvl of 12, except for champions whose mLvl would be 13. _Andariel_'s mLvl, stated in the configuration file, is 12. There are no uniques in Catacombs level 4 so we will use _Corpsefire_ again: normal _Den of Evil_ aLvl is 1, so _Coprsefire_'s mLvl would be 4.

::d2-monster-champions|A random champion monster, unique champion monster Corpsefire, and Act 1 boss Andariel.

Now finally back to iLvl: a monster can only drop items with iLvl equal to or lower than its mLvl. In most cases, iLvl is equal to mLvl. This is why items dropped in later stages of the game are better than the ones dropped in the early stage—the monsters dropping them are stronger and leveled higher.

Essentially, the item powers are tightly coupled to the monster it dropped from, and therefore tied to the area where the dropping happened. The developers don't have to manually fine-tune every single monster and item's level but only have to make sure the area level is right, then the items' power are going to align with the game's difficulty curve.

# Quality roll

Another item property—maybe the most important one by far—is the item's _quality_. A white _Shako_ and a gold _Shako_ are two entirely different breeds. What are the dice Blizzard rolls to decide an item's quality?

We have seen the factors in TC mentioned above. Let's look at the specific part again:

```json
{
	"name": "Diablo",
	"picks": 7,
	"unique": 983,
	"set": 983,
	"rare": 983,
	"magic": 1024,
	"items": [...]
```

::d2-tc-diablo|Quality chances in the Diablo TC.

The properties `unique`, `set`, `rage`, and `magic` are, as you might have guessed, the properties to decide a drop's quality. They are numbers that range from 0 to 1024. After the base type is decided, the game goes back to the starting TC to check the above numbers for the quality deciding process. The check proceeds in the order of **unique > set > rare > magic**. The game will, from a very complicated formula, use parameters such as iLvl, the base type's qLvl, the character's magic find chance, and the quality number in TC to check. A quality is selected if its respective check is passed.

::d2-quality-check-process|Only when unique, rare, and magic quality checks all fail, an item becomes normal quality.

The closer the quality number is to 1024, the higher the chance to pass the check, as 1024 means always pass. That is, in the above Diablo TC, the check for magic quality will always pass, which means Diablo will never drop a white item.

## Better chance to find magic item

The _X% Better Chance of Getting Magic items_ property gained from items, often called **MF**, is used as a variable during the quality check. The game first fine-tunes **Effective MF** respectively for each quality with the following formula:
$$EMF = floor(\frac{(MF+100)\times\text{quality factor}}{(MF+100) + \text{quality factor}})$$

The `quality factor` is a series of constants defined individually for each quality:

::d2-mf-quality-factor-table|The qualities and their quality factors table. For magic items the Effective MF equals to MF.

Say the character's MF is 400, effective MF for uniques is approximately 167, while for rare items it is 250. Effective MF is then used in the quality roll formula to get the number ranging from 0 to 1024.

MF, being the only way players can manipulate the quality roll process, is always a heavily discussed topic regarding the gear-grinding gameplay. Blizzard paid attention to the calculation process to make sure that it is not imbalanced that the game feels "solved" by mindlessly stacking MF.

# Affixes and sockets

After the item's base type, level, and quality are decided, it's finally time to roll the item's details: sockets and affixes.

## Sockets

::d2-socket-item|A 3 socket claymore.

Items with sockets can be socketed with certain items to enhance their power, such as gems, and more importantly, runes. Since blizzard added in 1.09, _Runewords_—item with set of runes socketed in a specific order—makes item with the right amount of sockets highly valuable. Because to make a Runeword item, the number of sockets must exactly match the number of runes required, the way to increase the chance of finding an item with a certain number of sockets becomes important knowledge. Below is the mechanic behind it.

For normal items, socket number selection is extremely simple—essentially, the game rolls a six-dimensions dice, and the roll result is the socket number. Yes, that's it. But you don't see one sixth of the drops having six sockets. That is because the nuances on the socket rolling are mostly on the item's _max socket number_.

Aligned with other item modifiers, an item's max socket number is affected by its iLvl and base type. For every base type there are three predefined numbers, each represents the maximum socket number for item under level 25, level 40, and item over level 41. Take _Crystal Sword_ for example:

::d2-max-socket-number-table-fig| Max socket number in each level for Crystal Sword.

If you want a Crystal Sword to make the popular runewords _Spirit_ which requires exactly 4 sockets, farming in areas lower than level 25 would be a waste of time—a 4 socket one will never drop. Farming in areas leveled too high would also be inefficient—5 socket and 6 socket ones added to the pool reduces the chance to roll a 4 socket one.

What if the rolled number—from a six-dimensions dice—is bigger than the max socket number? It falls back to the max socket number, simply enough. So if an iLvl 24 Crystal Sword rolls a 6 under the hood, it is still a 3 socket one.

::d2-socket-number-chance-table-fig| The chance to roll each socket number for Crystal Sword.

Magic items may have sockets if they have the affixes that add sockets: _Mechanic's_ (+ 1 or 2 sockets), _Artisan's_ (+3 sockets), and _Jeweler's_ (+ 4 sockets). Rare items work mostly the same, but only _Mechanic's_ are eligible. The socket number can not be bigger than the base type's max socket number.

Most unique and set items do not have sockets at all, only very few have sockets as one of their fixed attributes.

## Affixes

If base type is the bone of an item, then the affixes are its soul. All items above normal quality have affixes that enhance the item with certain types of power, such as _+10-20 to Attack Rating_, _+5-10% Better Chance of Getting Magic Items_ mentioned above, or the very powerful _+2 to All Skills_.

::d2-magic-item|A magic quality hunter's bow.

Set and unique items have fixed affixes, which means every time they drop, the item with the same unique name will always have the same set of affixes. But for magic and rare items, affixes are selected from a wide pool, and every drop is different from the others.

The affix pool, similar to sockets, is affected by item level and base type. It would be more reasonable for _+10-20% Enhanced Damage_ to roll on weapons and _+10-30% Enhanced Defense_ on armor. Like this example, though, the pool differences among each base type are not as big as sockets—_Great Axe_ and _Cleaver_ are different base types but have identical affix pool—but base types are still one factor to decide affix pool.

The item level, on the other hand, plays a bigger role than base type. A _10-20% Enhanced Damage_ affix may be valuable in early game, but in late game you would want something such as _201-300% Enhanced Damage_. If the latter is dropped at level 5, then you wouldn't look at any other items in the same slot for a long time. To avoid that, every affix has a level aligned to its power. When an item drops, the **max eligible affix level** is determined based on its iLvl and base type's qLvl. All affixes in the base type's affix pool under that level are eligible for selection.

The final step works pretty similar to base type selection in a TC. Each affix has a selection probability property like base type, and the chance for a specific affix to be selected is:
$$\frac{\text{target affix probability}} {\text{all affixes probability sum}}$$

### Prefix and suffix

We have been concluding these item modifiers as _affixes_, but there are in fact two types of them: the **prefixes** and the **suffixes**. When a magic item drops, besides its base type, there are additional strings on its name, such as _Victorious Grim Wand of Brilliance_, with the _Grim Wand_ being the base type, _Victorious_ the prefix, and _of Brilliance_ the suffix. The name of a prefix or suffix is tied to the affix's effect: for above example, _Victorious_ represents the _+5 to Mana after each Kill_, and _of Brilliance_ the _+9 to Energy_.

::d2-magic-item-two-affixes|A magic grim wand with a prefix and a suffix.

Obviously a magic item cannot have two prefixes or suffixes at the same time—this is why a magic item can only have 1 or 2 affixes; it's either one with a prefix, one with a suffix, or one with both. Rare items have randomly generated names that are irrelevant to their affixes, so they can have 3 to 6 affixes. Set and unique items have fixed affixes, that is, for two set or unique items with the same name, although the number part of the affixes may differ, they always have the same set of affixes.

# Summary

There goes the final step of the item generation! Let's summarize the entire process.

1. Player kills a monster.
2. **TC selection** starts at the monster's assigned TC. The selection continues until a **base type** or `NoDrop` is selected.
3. An item instance with the base type selected in step 2 is generated. The item's level (**iLvl**) is calculated based on the killed monster's level and uniqueness.
4. The game rolls the item's quality (_unique_, _set_, _rare_, or _magic_) base on many factors, including its **iLvl**, the base type's **quality level**, and the player's **MF%**.
5. The game rolls the rest item properties: affixes for magic and rare items, and socket numbers for normal items.

# Afterword

During my teen years, I spent a lot of time playing video games, some of them were made by Blizzard, more were not, and Diablo II was not even in my top five favorites during that time. Every time I hear the iconic guitar from _Wilderness_ or _Rogue_, however, I feel like back home. I guess there was really something that I only got to taste no other than from the dark land and the lord of terror, but I don't know what that is. As part of the research, I also tried some entries from the genre, namely Path of Exile, Last Epoch, and its own sequels, Diablo III and Diablo IV. While all of them do improve the gameplay in some aspects, none seems to have the secret spice that ignites the fire in me like Diablo II does. In fact, even after I finished this research and writing, I still haven't found the answer.

All I know for sure is that I didn't give the game the appreciation it deserved at the time. That is why I'm really happy to be able to write on this topic. After 20 years, I finally learned to appreciate this masterpiece, and this writing is the embodiment of it. It is a labor of love; a love letter to the Blizzard I once knew but not anymore, and all the beautiful memories they gave me.

I tried to explain all the components and process of the item generation system as easy to understand as possible, including showing item images and item cards on hover (or click in mobile.) Many implementations were added to this site solely to support all the reading experience improvements for this very post. To be honest, I'm far from satisfied, and I could spend so much more time on polishing. But that is exactly why I decided to release it as is now. Doing too much polishing is like stacking too much MF%; it isn't always the most optimal way to reach the goal. Besides, my next project has been waiting for a while.

If you reached all the way to here, I sincerely thank you. If there are any incorrect parts, please let me know. Otherwise, I hope you enjoyed it or recalled some of the joyful memories from the game.

# References

- [Item Generation (purediablo.com)](https://www.purediablo.com/diablo-2/item-generation)
- [Drop Calculator (maxroll.gg)](https://maxroll.gg/d2/d2-drop-calculator)
- [https://d2r.world](https://d2r.world)
- [https://diablo2.io](https://diablo2.io)
- [https://diablo-archive.fandom.com](https://diablo-archive.fandom.com)
- [https://github.com/fabd/diablo2](https://github.com/fabd/diablo2)
- [【討論】解開 TC 的奧秘 (gamer.com.tw)](https://forum.gamer.com.tw/G2.php?bsn=00742&parent=659&sn=1690)
