---
title: The Troubles of GUI Applications
categories:
  - Computer Science
  - Graphics
tags:
  - Java
  - Android
date: 2021-10-01 23:00:00
lang: en
i18n_key: problems-of-gui-app
---

In the booming era of mobile internet, many modern programming languages emerged. *Write Once and Run Anywhere* is no longer exclusive to Java. Yet before *Android* came along, developing *GUI* applications on embedded *Linux* wasn't straightforward. Despite powerful frameworks like *Qt* and *GTK*, developing in *C/C++* always means confronting memory management. While *C++* has the powerful *boost* library (standardized in *C++11*) with smart pointers that handle memory well, *GTK* in *C* doesn't have it so easy -- especially for application developers. How to make memory management easier has been an enduring topic.

Imagine launching a *GUI* application: you enter the main screen, tap a button to open another screen, then close it to return. Simple steps, but implementing this in *C* raises several questions:

1. Should *UI* widgets be created on the main thread or a worker thread?
1. Should click event handlers execute on the main thread or a worker thread?
1. Who owns the memory of *UI* widgets created in code? When is it freed?

Let's first look at how *Java Swing* creates *UI* widgets:

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

As we can see, *Swing* applications can create *UI* widgets on the main thread. However, according to [Swing's Threading Policy](https://docs.oracle.com/javase/8/docs/api/javax/swing/package-summary.html#threading) in the *Javadoc*, it's best to create *UI* widgets on the *Event Dispatching Thread (EDT)*:

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

Even so, *Swing* doesn't strictly enforce that *UI* operations must happen on the *EDT*. Now compare with how Android creates *UI* widgets:

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

Although *Android* explicitly defines the *UI* lifecycle, it doesn't actually enforce that *UI* widget creation must happen on the main thread -- which is why `AsyncLayoutInflater` is possible. What *Android* does enforce is that *UI operations* must happen on the main thread; otherwise, a `ViewRootImpl$CalledFromWrongThreadException` is thrown. To avoid thread-safety issues, it's best to create widgets on the *UI* thread. In fact, in most *GUI* systems the main thread *is* the *UI* thread -- *Android*, *Cocoa*, *SWT*, *Qt*, *GTK*, etc. -- with *AWT* and *Swing* being the exceptions.

Now for the second question -- the threading of click event handlers. Aside from inherently single-threaded languages like *JavaScript*, most languages default to a multi-threaded environment. Event handling typically uses callbacks. In *C*, a callback is a function pointer. To handle a click event in a callback, you pass the clicked *UI* widget as a parameter:

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

As we know, the `main` function executes synchronously from top to bottom. Once `main` finishes, the program exits. Yet in practice, a *GUI* application keeps running after starting from the main thread. This means the main thread hasn't exited -- it's "parked" somewhere. But if it's parked, why doesn't the *UI* freeze? It's actually still quite smooth.

If the callback executes on the main thread, how does execution jump from where the main thread is "parked" to the callback function? If the callback blocks or deadlocks, wouldn't the entire *GUI* system become unresponsive? Would you have to restart the system? And if you want to avoid restarting, how do you solve this?

If the callback executes on a worker thread, there are thread-safety issues: the clicked widget was created on the main thread, so its memory is accessible from the main thread. How do you ensure thread safety? If every *GUI* widget access requires synchronization via locks, performance suffers dramatically. For developers, it's hostile -- locks everywhere, with deadlocks waiting to happen.

Many are familiar with the *Event Loop*. It's widely used not just in *GUI* systems but also in non-*GUI* systems -- *Node.js* uses it for asynchronous execution. This answers all the questions above:

1. *UI* event callbacks execute on the main thread
2. The main thread hasn't exited because it's "parked" in the *Event Loop*
3. The *Event Loop* is driven by the main thread. It's not truly frozen -- it's waiting for messages in a queue. Any thread can send messages to this queue, and the system itself has tasks that must run on the main thread (mouse movement, clicks, button presses, system events, etc.). These are sent as messages to the queue, waiting for the main thread to process them in subsequent loop iterations. One message per iteration -- this elegantly solves the thread-safety problem.
4. To prevent the main thread from getting stuck, the system runs a background process called a *Watchdog* that waits to be "fed." If no one feeds it within a certain time, it "barks" -- different systems handle this differently. Some display an *App Not Responding (ANR)* dialog letting the user choose to wait or kill the unresponsive process. Some kill the process without asking. For systems that require no human intervention or run critical tasks -- embedded systems like *Linux*, *VxWorks*, *RT-Thread* -- if the watchdog isn't fed in time, the system reboots automatically.

So must all *UI* operations happen on the *UI* thread? Not necessarily. In *GUI* systems, most *UI* widgets are operated by the *UI* thread, meaning *CPU*-rendered. But animations and video demand extremely high frame rates. To achieve 60 *FPS (Frames Per Second)* silky smoothness, the *CPU* alone is far from sufficient -- *GPU* acceleration is needed. This requires the *GUI* system's view hierarchy to provide extension points for *GPU* rendering. For example, `TextureView` in *Android* and `CALayer` in *iOS*. [Texture](https://texturegroup.org/) (`AsyncDisplayKit`) leverages `CALayer` to render on non-*UI* threads for a smoother user experience.

Finally, the third question -- memory ownership of *UI* widgets. For runtimes without *Garbage Collection (GC)*, memory management typically uses *Reference Counting*. This splits into *Automatic Reference Counting (ARC)* and *Manual Reference Counting (MRC)*. *GTK*'s memory management is classic *MRC*. *Cocoa*'s is classic *ARC*. *Cocoa* achieves *ARC* through the combined work of the *Clang* compiler and the *Objective-C* runtime -- *Clang* can analyze memory ownership at compile time and insert runtime-provided memory deallocation calls at the right places, sparing developers from manual memory management. For *GUI* systems using *ARC* or *GC*, the runtime controls memory ownership. For *MRC*-based *GUI* systems, the system itself handles memory management at appropriate times to avoid leaks. While developers rarely need to worry about *UI* widget memory in most cases, there are scenarios requiring manual reference counting.

Among popular compiled languages today, aside from *Objective-C* and *Swift* still using *ARC*, nearly all have implemented *Garbage Collection*. So is *GC* better than *ARC*? It depends on the perspective:

1. From the developer's perspective, *GC* is friendlier -- you almost never worry about memory leaks
1. From the end user's perspective, *GC*-induced brief stutters do affect the experience

Despite *Java* being around for over 20 years since 1995, *Sun*, *Oracle*, and the *Java* community have never stopped optimizing the *GC*. This is one reason Huawei developed the Ark Compiler, whose goal includes solving *GC*-induced stutters. Moving away from *GC* toward "primarily *ARC*, supplemented by *GC*" is the Ark Compiler's main technical direction. Its *ARC* approach follows the same idea as the *Clang* compiler mentioned earlier -- leveraging the compiler's static analysis to automatically insert memory deallocation calls at compile time.
