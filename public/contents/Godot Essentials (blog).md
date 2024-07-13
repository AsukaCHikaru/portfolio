---
created: 2024-04-09 17:17
filename: Godot Essentials (blog)
title: Godot Essentials
description: The biggest lessons I learned in my first Godot project.
published: 2024-04-21
updated: 2024-05-03
language: en-US
pathname: godot-essentials
category: Game Development
tags:
  - Godot
---
I chose Godot as the game engine for my last project, instead of Unity3D, the engine I have been using for the last five years. This was my first Godot project ever.

I learned many things during the process; below are the ones I consider the most essential parts for a Godot project as an amateur Unity3D developer. Please forgive me for skipping the details; I aim to focus on the "what" and "why" instead of the "how" in this article.
# Think in composition
The most basic building block in Godot is [*node*](https://docs.godotengine.org/en/stable/classes/class_node.html) . It is the equivalent of component in Unity3D. There are many types of node, each with different function and purpose. A node can contain another node to make a node tree. This tree of nodes is called [*scene*](https://docs.godotengine.org/en/stable/getting_started/introduction/key_concepts_overview.html#scenes), the equivalent of Prefab in Unity3D. During development you may create enemy scenes, item scenes, platform scenes, and so on.

Now assume you want to make two slightly different enemy. Say an Orc warrior and an Orc chief. They are mostly the same, but the Orc chief has an additional ability.

One obvious approach is inheritance. Make an `Enemy` class for the common enemy logic such as AI or hitbox, then an `Orc` class to inherit it, and an `OrcChief` class to inherit `Orc`. The additional ability is implemented on `OrcChief` or as an independent ability class.

With Godot node, make a node for the ability, add it to the `OrcChief` scene, and it's done. Add the ability node to any other enemy scene and they have the ability too. It's also possible to attach or detach nodes in runtime, makes it easy to dynamically adjust enemy power without instancing a new one.

Applying the Single Responsibility Principle is natural with Godot's modular design. As a complex system is divided into several nodes, the boundary of each part of logic becomes clear. Node system visualizes the abstract borderline between components, massively saving cognition cost during development. 

It was an "Eureka!" moment when I figured out this. The development became way easier and smoother after that.
# Node group for quick access
Since system is divided into nodes, accessing nodes from another node is unavoidable. There are many ways to achieve this, one is through [*node groups*](https://docs.godotengine.org/en/stable/tutorials/scripting/groups.html). The groups system works like tag: a node can be assigned to as many groups as you want, and can be accessed from group name with the `get_nodes_in_group` or `get_fist_node_in_group` API.

Group is especially handy for accessing remote nodes: nodes that are not in the same scene with the invoker node, which makes it difficult to access by nodes' relative path. It also decouples the relation between the caller and the receiver(s), since the access is through group instead of direct reference.

I adapted this two months into the development; it was two months too late.
# Signals to decouple
Another essential method to access remote nodes is through [*signals*](https://docs.godotengine.org/en/stable/getting_started/introduction/key_concepts_overview.html#signals). It is Godot's interpretation of the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern).

It only takes one line of code to set up a signal to trigger a function, and one line to emit a signal. It is even code-less to bind a built-in node's event to a function in script. Say you want to detect units entering an area, just double click the `body_entered` event from inspector, press `Connect` and it's done.

I appreciate Godot's effort to make the signal system easy to use. The explicit guidance saves us new developers' huge amount of time.
# Mouse filter, root of GUI interaction
I don't have proof, but I reckon every new Godot developer once struggled against UI and mouse interaction priority. Godot's approach to this is the [Mouse filter](https://docs.godotengine.org/en/stable/classes/class_control.html#class-control-property-mouse-filter).

When a mouse interacts with a `Control` node -- the base node for all GUI controls -- the mouse interaction event is always registered in the lowest level in the node tree. For example, if the node tree from top to down is panel node > container node > button node, the click event will first fire on the button. Depending on the button's mouse filter setting, it may handle the event, ignore the event, or pass the event to its parent.

If you find your UI not triggered when there is nothing wrong with the code, it may because its child node's mouse filter is set to `stop` which makes the node intercepting the event, where it should be `pass` or `ignore`.

The mouse filter setting is hidden in every `Control` node's inspector along with many other properties, but it is a critical part of how UI works in Godot. I wish Godot document emphasizes more on it.
# Themes for extensive styling
Adjusting a single GUI node's appearance in Godot is not as straightforward as it is in Unity3D. Godot prefers styling through a [theme](https://docs.godotengine.org/en/stable/tutorials/ui/gui_skinning.html#basics-of-themes) and applying it to the nodes, instead of adjust nodes' style separately. It is a trade off of efficiency between project-wise style setting and single node style setting.

At first I was confused because even finding the style setting panels took some effort. But I expect the theme system thrives in extensive style settings, and I look forward to it.