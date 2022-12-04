---
title: 第一个 UI 控件
date: 2021-12-19 00:00:00
categories: Web
tags:
  - HTML
  - JavaScript
---

尽管我使用 *Java* 编程已有十年有余，但其实 *JavaScript* 才是我最早掌握的一门编程语言，虽然 *C* 语言是大学生的必修课，但我真不敢说在当时我已经掌握了它，在 *Web 2.0* 的时代，最流行的开发工具便是网页三剑客，*Dreamwaver* 的所见即所得让很多初学者也能写出一个可以运行的 *Web* 应用，我便是其中一个。

## 武功秘籍

刚开始学习 *Web* 开发时，页面布局基本上都是通过 *Dreamwaver* 的可视化设计器来完成，如果要实现动态的效果，就得从网上找别人写好的 *JavaScript* 脚本，对于非科班出身的我来说，虽然大概能看懂代码的逻辑，但完全不知道那段脚本中使用到的属性、方法都是从哪里来的，我怎么知道还有没有别的属性和方法，这一问题困扰了我很久，直到有一天，一位朋友给我一个 *CHM* 格式的电子文档 ——《HTML编程指南》。

这本《HTML编程指南》对于我来说，简直就是一本武功秘籍，从这里，我终于知道了原来有种东西叫 *API* 规范，而这份文档中，给出了 *HTML* 中所有 *API* 的定义以及如何使用的例子，从这份文档中，我学会了如何通过操作 *HTML DOM* 结构来实现一些动态的效果，以及如何通过处理事件来实现动态的交互，还有当时 *Web* 端最流行的技术 —— *AJAX(Asynchronous JavaScript and XML)* ，在当时那个年代据说会写 *AJAX* 就能找到一份不错的 *Web* 开发的工作。

## 树形菜单

从最开始的只能靠复制别人的代码才能写出一些动态的效果，到后来能自己独立实现一些动态效果，对于我来说，无疑是一个重要的里程碑。有一次在登录学校内网的课程系统的时候，发现网页上的树形结构的菜单很有意思，当时我就在想：能不能自己实现一个树形结构的菜单呢？回到宿舍就开始动手了，经过一番研究发现，如果只是单纯的实现视觉上的静态树形结构，其实并不难，用 HTML 的 `<DIV>` 或者 `<UL>` 元素嵌套，再加上一点点 *CSS* 就能做到相同的效果，但问题是，如何通过 *JavaScript* 脚本来动态的创建一个树形菜单，以及让树形菜单的节点可以动态的添加和删除？

由于 *HTML* 中只有 *DOM Element*，并没有完整的树形控件的概念，如果我们要用 *DOM* 来实现树形控件，就需要使用一系列 *DOM* 元素来拼装，与其说树形控件是视觉上的树形结构，不如说是逻辑上的树形结构，从 *DOM* 的角度来说，*DOM* 节点之间的关系并不等同于树形控件上的节点之间关系，比如：树形控件上的父子节点并不能简单地用一个 *DOM* 元素嵌套另一个 *DOM* 元素来实现，因为每个树形节点上除了有标题，还有节点图标（*icon*）、状态图标（展开或折叠状态）以及子节点等等，所以，仅用一个 *DOM* 元素是无法表达出这么多信息，需要用多个 *DOM* 元素来完成一个树形节点的表达，如下图所示：

```
  ┌───────────────────────── Node Container ──────────────────────┐
  │                                                               │
  │ ┌──────────────────── Node Self Container ──────────────────┐ │
  │ │                                                           │ │
  │ │ ┌ indent ┐ ┌ icon ─┐ ┌ state ┐ ┌───────── label ────────┐ │ │
  │ │ │        │ │       │ │       │ │                        │ │ │
  │ │ │        │ │       │ │       │ │                        │ │ │
  │ │ └────────┘ └───────┘ └───────┘ └────────────────────────┘ │ │
  │ │                                                           │ │
  │ └───────────────────────────────────────────────────────────┘ │
  │                                                               │
  │ ┌────────────────── Node Children Container ────────────────┐ │
  │ │                                                           │ │
  │ │                                                           │ │
  │ └───────────────────────────────────────────────────────────┘ │
  │                                                               │
  └───────────────────────────────────────────────────────────────┘
```

因此，要实现一个树形控件，就需要将视觉结构和逻辑结构分离，然后通过逻辑结构来组织视觉结构，所谓视觉结构，就是 *HTML* 中的 *DOM* 元素，而逻辑结构，就是面向对象编程中的抽象的概念——类（*Class*）， 例如：我们可以使用 *TreeView* 来表示整个树形控件，用 *TreeNode* 表示树形结构中的节点，每个节点都有一个父节点和一个子节点的列表，用码则可以这样表示：

### TreeNode

```javascript
function TreeNode(label, parent) {
  // 父节点
  this.parent = parent;
  // 子节点列表
  this.children = [];
  // 该节点最外层的 DOM 容器
  this.container = document.createElement("DIV");
  // 该节点自身内容的 DOM 容器
  this.selfContainer = document.createElement("DIV");
  // 所有子节点的 DOM 容器
  this.childrenContainer = document.createElement("DIV");
  // 表示缩进的 DOM 元素
  this.indent = document.createElement("SPAN");
  // 表示展开/折叠状态的 DOM 元素
  this.state = document.createElement("IMG");
  // 表示图标的 DOM 元素
  this.icon = document.createElement("IMG");
  // 表示标题的 DOM 元素
  this.label = document.createElement("SPAN");
  this.label.innerText = label;
  // 表示折叠状态
  this.isFolded = false;
  
  this.container.appendChild(this.selfContainer);
  this.container.appendChild(this.childrenContainer);
  this.selfContainer.appendChild(this.indent);
  this.selfContainer.appendChild(this.state);
  this.selfContainer.appendChild(this.icon);
  this.selfContainer.appendChild(this.label);

  // ...

  // 通过单击状态图标来展开或折叠此节点
  this.state.onclick = this.toggle;
  // 通过双击标题来展开或折叠此节点
  this.label.ondblclick = this.toggle;

  /**
   * 折叠或展开该节点
   */
  this.toggle = function (event) {
    if (isFolded) {
      unfold(event);
    } else {
      fold(event);
    }
  }

  /**
   * 折叠该节点
   */
  this.fold = function (event) {
    // TODO: ...
    this.isFolded = true;
  }

  /**
   * 展开该节点
   */
  this.unfold = function (event) {
    // TODO: ...
    this.isFolded = false;
  }

  /**
   * 计算该节点的深度
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
  this.root = root; // 树控件的根节点

  // ...

  /**
   * 将该树形控件附着到指定的 DOM 元素上
   */
  this.attachTo = function (element) {
    element.appendChild(root.container);
  }

  /**
   * 将该树形控件从指定的 DOM 元素上分离
   */
  this.detachFrom = function (element) {
    element.removeChild(root.container);
  }
}

```

然后，我们就可以通过代码来动态构建树形控件了，代码如下所示：

```javascript
function createTreeView() {
  var root = new TreeNode("根节点", null);
  var treeView = new TreeView(root);
  var node1 = new TreeNode("子节点-1", root);
  var node2 = new TreeNode("子节点-2",  root);

  // TODO: ...

  treeView.attachTo(document.body);
}
```

## 架构的本源

如此，通过简单地抽象和封装，一个可复用的树形控件就可以很容易的实现了，这对于当时的我来说，感觉掌握了面向对象与抽象，就掌握了架构设计的精髓，而实际上，这仅仅只是个开始，对于一个复杂的系统，我们还需要进行更高层次的抽象，这也是为什么会有像 *MVC*、*MVP* 以及 *MVVM* 之类的架构设计模式存在的原因。
