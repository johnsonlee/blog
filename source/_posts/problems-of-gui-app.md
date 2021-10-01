---
title: GUI 应用的烦恼
date: 2021-10-01 23:00:00
categories: GUI
tags:
  - Java
  - Android
---

在移动互联网蓬勃发展的时代，出现了很多现代化的编程语言，*Write Once and Run Anywhere* 早已不再是 Java 所独有的特性，然而在 *Android* 系统推出之前，想要在嵌入式 *Linux* 系统之上比较方便的开发 *GUI* 程序还真不是一件简单的事情，虽然有 *Qt、GTK* 等强大的 *GUI* 开发框架，但是用 *C/C++* 语言开发始终不可避免的要面临的一个问题——内存管理，尽管 *C++* 有强大的 *boost* 库（已在 2011 年成为 *C++11* 的标准库）提供的智能指针能很好的解决内存的问题，但对于采用 *C* 语言来开发 *GUI* 的 *GTK* 来说，就不是那么容易了，尤其是对于要用 *C* 语言来开发应用程序的开发者来说，如何让内存管理变得更容易便成为了一个经久不衰的话题。

试想一下，当启动一个 *GUI* 应用的时候，首先进入到主界面，然后点击某个按钮，打开另一个界面，然后关闭界面返回到主界面，虽然只是简单的几个步骤，但如果要用 *C* 语言来实现，我们会面临以下的问题：

1. *UI* 控件的创建是应该在主线程还在子线程？
1. 处理点击事件的代码是应该在主线程执行还是在子线程执行？
1. 代码中创建出来的 *UI* 控件的内存到底由谁来释放？什么时候被释放？

首先，我们看一下 *Java Swing* 是如何创建 *UI* 控件的，代码如下所示：

```java
import javax.swing.*;

public class HelloWorld {
  public static void main(String[] argv) {
    JLabel label = new JLabel("Hello, world!", JLabel.CENTER);
    JFrame frame = new JFrame("Hello");
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.getContentPane().add(label);
    frame.setSize(200, 150);
    frame.setVisible(true);
  }
}
```

通过以上的例子，我们可以看到，*Swing* 应用是可以在主线程创建 *UI* 控件的，然而，根据 *Javadoc* 中的 [Swing's Threading Policy](https://docs.oracle.com/javase/8/docs/api/javax/swing/package-summary.html#threading) ，最好是在 *Swing* 的 *Event Dispatching Thread (EDT)* 中创建 *UI* 控件：

```java
import javax.swing.*;

public class HelloWorld {
  public static void main(String[] argv) {
    SwingUtilities.invokeLater(() -> {
      JLabel label = new JLabel("Hello, world!", JLabel.CENTER);
      JFrame frame = new JFrame("Hello");
      frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
      frame.getContentPane().add(label);
      frame.setSize(200, 150);
      frame.setVisible(true);
    });
  }
}
```

 尽管如此，*Swing* 也并没有强制约束必须在 *EDT* 线程中操作 *UI* ，对比一下 *Swing* ，我们再来看一下 Android 是如何创建 *UI* 控件的：

```java
public class MainActivity extends Activity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstance);
    TextView label = new TextView(this);
    label.setText("Hello, world!");
    setContentView(label);
  }

}
```

相比之下，尽管 *Android* 明确规范了 *UI* 的生命周期，但其实也并没有强制约束 *UI* 控件的创建必须在主线程中，这也是为什么 `AsyncLayoutInflater` 得以实现的原因，只不过 *Android* 对操作 *UI* 的行为做了约束 —— 必须在主线程中操作 *UI* ，否则会抛出 `ViewRootImpl$CalledFromWrongThreadException`，为了避免线程安全问题，最好还是在 *UI* 线程中创建控件，其实，大多数 *GUI* 系统中主线程就是 *UI* 线程，如：*Android、Cocoa、SWT、Qt、GTK* 等，当然 *AWT* 和 *Swing* 除外。

接下来，我们来看第 2 个问题 —— 点击事件处理的线程问题，除了像 *JavaScript* 这种天生就是单线程执行的语言以外，大部分编程语言默认就是多线程的环境，事件响应一般都是采用回调 *(Callback)* 的方式，在 *C* 语言中，回调一般是一个函数指针，如果要在回调中处理点击事件响应的逻辑，就需要将被点击的 *UI* 控件以参数的形式传递到回调函数中，代码如下所示：

```c
static void button_click_cb(
  GtkWidget* widget,
  gpointer data
) {
  ...
}

void main(int argc, char* argv[]) {
  GtkWidget* button;

  ...

  gtk_signal_connect(
    GTK_OBJECT(button),
    "clicked",
    GTK_SIGNAL_FUNC(button_click_cb),
    NULL
  );

  ...
}
```

众所周知，`main` 方法是从上到下同步执行的，当 `main` 方法执行完成后，程序就会自动退出，而实际上，*GUI* 应用从主线程启动后，会一直运行着，这说明主线程并没有退出，而是“停留”在某一个地方了，既然是“停留”在某一个地方了，那为什么 *UI* 并没有被卡住，反而还很流畅？

如果回调函数在主线程中执行，那么主线程是如何从“停留”的那个地方切换到回调函数的位置的呢？如果回调函数长时间不能返回或者死锁了，那整个 *GUI* 系统岂不是会被卡死而导致完全无法响应用户的操作，难道只能重启系统？如果要避免重启系统，如何才能解决呢？

如果回调函数在子线程中执行，那么就肯定会涉及到线程安全问题，因为被点击的控件是在主线程中创建的，那么这个控件对应的内存可以被主线程访问到，那如何才保证控件的线程安全问题？如果每次访问 *GUI* 控件都要用加锁的方式进行同步，这对于 *GUI* 应用来说，其性能会大打折扣，而且，对于开发者来说，很不友好，同步锁满天飞，还很容易造成死锁。

相信很多人对于 *Event Loop* 并不陌生，它不仅仅被广泛应用于 *GUI* 系统中，也被应用于跟 *GUI* 无关的系统中，像 *Node.js* 就是利用 *Event Loop* 来实现异步，这正好也解释了前面的一系列问题：

1. *UI* 事件回调方法在主线程中执行
2. 主线程之所以没有退出，是“停留”在 *Event Loop* 这儿了
3. *Event Loop* 由主线程来驱动，主线程并不是真正的停在 *Event Loop* 这儿不动了，而是在等队列里的消息，这些消息可以由任意线程发送到主线程，系统本身也会有一些任务需要在主线程中处理，例如：鼠标移动、点击、按下按钮以及一些系统事件等，这些任务以消息的形式发送到这个消息队列里，等待主线程在后续的 loop 中执行，每等到一个消息，主线程就会同步处理一个，这样就很好地解决了线程安全问题。
4.	为了防止主线程被卡住，系统会启动一个叫做“看门狗” *(Watchdog)* 的后台进程，等着其它进程来“投食”，如果超过一定时间还没有人来“投食”，看门狗就会“乱叫”——不同的系统其处理方式可能不一样，有的系统会弹出一个应用无响应 *(App Not Responding, ANR)* 的弹窗，让用户去选择是继续等待还是直接杀死无响应的进程，有的系统可能连问都不问直接杀死无响应的进程，而对于无需人工干预或者执行关键任务的系统而言，如嵌入式系统 *Linux，VxWorks，RT-Thread* 等，如果没有及时的“喂狗”，系统就会自动重启。

那么，所有的 *UI* 操作都只能在 *UI* 线程中完成吗？其实不尽然，在 *GUI* 系统中，大部分的 *UI* 控件都是通过 *UI* 线程来操作的，也就是说，是由 *CPU* 来完成渲染的，然而，像动画、视频的渲染对流畅度要求极高，为了追求 60 *FPS (Frames Per Second)* 的丝滑体验，仅仅靠 *CPU* 来完成渲染远远达不到要求，需要依靠 *GPU* 来加速，这就需要 *GUI* 系统在其视图体系中为 *GPU* 渲染留出相应的扩展能力，比如：`Android` 中的 `TextureView`，iOS 中的 `CALayer`，像 [Texture](https://texturegroup.org/) (`AsyncDisplayKit`) 就是基于 `CALayer` 在非 *UI* 线程中进行渲染从而达到更流畅的用户体验。

最后，我们来看第 3 个问题 —— *UI* 控件的内存的所有权问题，对于没有垃圾回收 *(Garbage Collection)* 机制的运行时来说，内存管理一般会通过引用计数 *(Reference Counting)* 来实现，只不过引用计数也分为自动引用计数 *(Automatic Reference Counting，ARC)* 和手动引用计数 *(Manual Reference Counting，MRC)* ，*GTK* 的内存管理属于典型的 *MRC* ，*Cocoa* 的内存管理则属于典型的 *ARC* ，之所以 *Cocoa* 能做到 *ARC* ，这也是 *Clang* 编译器和 *Objective-C* 运行时共同作用的结果，*Clang* 编译器能够在编译期间自动分析出内存的所有权，并在合适的位置插入编译器运行时提供的释放内存的函数调用，以代替开发者手动去处理内存释放的工作。对于采用 *ARC* 或者 *GC* 的 *GUI* 系统来说，内存的所有权都交给了运行时来控制，而对于采用 *MRC* 的 *GUI* 系统来说，为了避免内存泄漏，内存的管理工作都是由 *GUI* 系统来完成，*GUI* 系统会在合适的时机自行决定要不要释放内存，尽管大部分情况下开发者并不需要太关心 *UI* 控件的内存问题，但是也会存在一些场景需要开发者手动去处理引用计数问题。

从目前流行的编译型编程语言来看，除了 *Objective-C* 和 *Swift* 还在使用自动引用计数 *(ARC)* ，几乎都实现了垃圾回收 *(Garbage Collection)* 机制，那是不是 *GC* 比 *ARC* 更好呢？我觉得这个得从不同的角度来看：

1. 从开发者的角度来看，*GC* 对开发者更友好，几乎不用关心内存泄露问题
1. 从终端用户的角度来看，*GC* 带来的短暂的卡顿确实会影响用户的体验

尽管 *Java* 于 1995 年发布至今已经 20 多年，但 *Sun、Oracle* 以及 *Java* 社区从 *Java GC* 的优化从未停止过，这也是为什么会华为会推出方舟编译器的原因之一，方舟编译器的其中一个目标就是解决 *GC* 导致的短暂的卡顿问题，去 *GC* 而「以 *ARC* 为主，*GC* 为辅」是方舟编译器的主要技术方向，而 *ARC* 则跟前面提到的 *Clang* 编译器的思路一样 —— 借助编译器的静态分析能力在编译期间自动完成内存释放调用的插入。