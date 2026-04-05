---
title: "My First UI Widget"
lang: en
i18n_key: my-first-ui-widget
categories:
  - Computer Science
  - Graphics
tags:
  - HTML
  - JavaScript
date: 2021-12-19 00:00:00
---

Although I've been programming in *Java* for well over a decade, *JavaScript* was actually the first programming language I ever learned. *C* was a required course in college, but I can't honestly say I had mastered it at that point. In the *Web 2.0* era, the most popular development tools were the "Big Three" -- and *Dreamweaver*'s WYSIWYG editor made it possible for even beginners to build a working web application. I was one of them.

## The Secret Manual

When I first started learning web development, page layouts were mostly done through *Dreamweaver*'s visual designer. If you wanted dynamic effects, you had to find someone else's *JavaScript* snippets online. As a self-taught non-CS-major, I could roughly follow the logic, but had no idea where the properties and methods used in those scripts came from. How was I supposed to know what else was available? This question plagued me for a long time -- until one day, a friend gave me an electronic document in *CHM* format: *"The HTML Programming Guide."*

That guide was like a martial-arts manual to me. For the first time, I learned that something called an *API* specification existed, and this document laid out every *API* definition in *HTML* along with usage examples. From it, I learned how to manipulate the *HTML DOM* to create dynamic effects, how to handle events for interactive behavior, and the hottest web technology of the time -- *AJAX (Asynchronous JavaScript and XML)*. Rumor had it that knowing *AJAX* alone could land you a decent web development job back then.

## The Tree Menu

Going from copying other people's code to independently implementing dynamic effects was a major milestone for me. One day, while logging into my university's intranet course system, I noticed the tree-structured menu on the page and found it fascinating. Could I build one myself? I went straight back to the dorm and got to work. After some research, I realized that creating a static tree structure visually wasn't hard -- you could nest HTML `<DIV>` or `<UL>` elements with a bit of *CSS*. The real question was: how do you dynamically create a tree menu with *JavaScript*, allowing nodes to be added and removed on the fly?

Since *HTML* only has *DOM Elements* and no built-in concept of a tree widget, implementing one requires assembling multiple *DOM* elements. A tree widget is less about visual tree structure and more about logical tree structure. From the *DOM*'s perspective, the relationships between *DOM* nodes don't map directly to tree widget node relationships. For example, parent-child nodes in the tree widget can't simply be represented by nesting one *DOM* element inside another, because each tree node has a title, an icon, a state indicator (expanded or collapsed), child nodes, and more. A single *DOM* element can't express all that information -- multiple elements are needed, as shown below:

```
  +------------------------------ Node Container ----------------------------+
  |                                                                          |
  | +------------------------ Node Self Container -------------------------+ |
  | |                                                                      | |
  | | +- indent -+ +- icon --+ +- state -+ +---------- label -----------+ | |
  | | |          | |         | |         | |                            | | |
  | | |          | |         | |         | |                            | | |
  | | +----------+ +---------+ +---------+ +----------------------------+ | |
  | |                                                                      | |
  | +----------------------------------------------------------------------+ |
  |                                                                          |
  | +---------------------- Node Children Container -----------------------+ |
  | |                                                                      | |
  | |                                                                      | |
  | +----------------------------------------------------------------------+ |
  |                                                                          |
  +--------------------------------------------------------------------------+
```

To implement a tree widget, we need to separate the visual structure from the logical structure and use the logical structure to organize the visual one. The visual structure consists of *HTML DOM* elements; the logical structure is the object-oriented concept of a *Class*. For example, we can use *TreeView* to represent the whole tree widget and *TreeNode* for each node, where every node has a parent and a list of children:

### TreeNode

```javascript
function TreeNode(label, parent) {
  // Parent node
  this.parent = parent;
  // List of child nodes
  this.children = [];
  // Outermost DOM container for this node
  this.container = document.createElement("DIV");
  // DOM container for this node's own content
  this.selfContainer = document.createElement("DIV");
  // DOM container for all child nodes
  this.childrenContainer = document.createElement("DIV");
  // DOM element representing indentation
  this.indent = document.createElement("SPAN");
  // DOM element representing expand/collapse state
  this.state = document.createElement("IMG");
  // DOM element representing the icon
  this.icon = document.createElement("IMG");
  // DOM element representing the label
  this.label = document.createElement("SPAN");
  this.label.innerText = label;
  // Whether the node is collapsed
  this.isFolded = false;

  this.container.appendChild(this.selfContainer);
  this.container.appendChild(this.childrenContainer);
  this.selfContainer.appendChild(this.indent);
  this.selfContainer.appendChild(this.state);
  this.selfContainer.appendChild(this.icon);
  this.selfContainer.appendChild(this.label);

  // ...

  // Click the state icon to expand or collapse this node
  this.state.onclick = this.toggle;
  // Double-click the label to expand or collapse this node
  this.label.ondblclick = this.toggle;

  /**
   * Toggle this node between collapsed and expanded
   */
  this.toggle = function (event) {
    if (isFolded) {
      unfold(event);
    } else {
      fold(event);
    }
  }

  /**
   * Collapse this node
   */
  this.fold = function (event) {
    // TODO: ...
    this.isFolded = true;
  }

  /**
   * Expand this node
   */
  this.unfold = function (event) {
    // TODO: ...
    this.isFolded = false;
  }

  /**
   * Calculate the depth of this node
   */
  this.getDepth = function () {
    var depth = 0;
    for (var p = this.parent; p != null; p = p.parent) {
      depth++;
    }
    return depth;
  }

}
```

### TreeView

```javascript
function TreeView(root) {
  this.root = root; // Root node of the tree widget

  // ...

  /**
   * Attach this tree widget to the specified DOM element
   */
  this.attachTo = function (element) {
    element.appendChild(root.container);
  }

  /**
   * Detach this tree widget from the specified DOM element
   */
  this.detachFrom = function (element) {
    element.removeChild(root.container);
  }
}

```

Now we can dynamically build a tree widget with code:

```javascript
function createTreeView() {
  var root = new TreeNode("Root Node", null);
  var treeView = new TreeView(root);
  var node1 = new TreeNode("Child Node 1", root);
  var node2 = new TreeNode("Child Node 2",  root);

  // TODO: ...

  treeView.attachTo(document.body);
}
```

## The Origin of Architecture

Through simple abstraction and encapsulation, a reusable tree widget becomes straightforward to implement. At the time, I felt that mastering object-oriented programming and abstraction meant mastering the essence of architecture design. In reality, it was only the beginning. For complex systems, we need higher levels of abstraction -- which is exactly why architectural patterns like *MVC*, *MVP*, and *MVVM* exist.
