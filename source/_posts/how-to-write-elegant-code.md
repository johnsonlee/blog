---
title: 如何编写优雅的代码
date: 2021-05-06 00:00:00
categories: 架构师训练营
tags:
  - Android
  - Java
---

最近 review 了几个同学的代码，总的来说，逻辑上没什么大毛病，但是，写出来的代码感觉还不够优雅，一个很简单的逻辑还要绕来绕去，对于架构师来说，并不是设计出来的架构越复杂越难懂才越牛逼，真正优秀的架构师的设计通常都是非常通俗易懂的，正所谓大道至简，设计出一个复杂的架构来解决一个复杂的问题并不是最牛的，而能够把一个复杂的问题用一个简单的架构来解决的才是真正的大牛，对于 coding 也是同样的道理，那究竟什么样的代码才算是优雅的呢？

## 代码复杂度

代码优不优雅，并不只是主观上的感受，是可以通过科学的手段来测量的，一般我们采用循环复杂度 (Cyclomatic Complexity) ，这一概念由 [Thomas J. McCabe, Sr.](https://en.wikipedia.org/w/index.php?title=Thomas_J._McCabe,_Sr.) 在 1976 年提出。循环复杂度根据程序的控制流图 (control-flow graph) 来计算，一个程序的循环复杂度等于其线性独立路径的数量，说人话就是：代码里条件/分支（`for`, `if-else`, `try-catch`, `&&`, `||`, ...）越多，代码越复杂，一个程序的复杂度可以用下面的公式来定义：

```
M = E - N + 2P
```

- `M` - 复杂度
- `E` - 控制流图中的边 (Edge) 的个数
- `N` - 控制流图中的节点 (Node) 的个数
- `P` - 

> 参考：https://en.wikipedia.org/wiki/Cyclomatic_complexity

将上面的公式进行简化后，再翻译成代码就是：

```kotlin
class CyclomaticComplexityVisitor : ASTVisitor {

    var cyclomatic = 1

    override fun visit(node: CatchClause) {
        cyclomatic++
    }

    override fun visit(node: ConditionalExpression) {
        cyclomatic++
    }

    override fun visit(node: InfixExpression) {
        cyclomatic++ 
    }

    override fun visit(node: DoStatement) {
        cyclomatic++
    }

    override fun visit(node: ForStatement) {
        cyclomatic++
    }

    override fun visit(node: IfStatement) {
        cyclomatic++
    }

    override fun visit(node: SwitchCase) {
        cyclomatic++
    }

    override fun visit(node: WhileStatement) {
        cyclomatic++
    }

    override fun visit(node: WhileStatement) {
        cyclomatic++
    }
}
```

> 详细代码请参考：[CyclomaticComplexityVisitor](https://github.com/johnsonlee/architecture-evaluation-tool/blob/master/de.cau.cs.se.software.evaluation/src/de/cau/cs/se/software/evaluation/transformation/CyclomaticComplexityVisitor.xtend)

## 语言特性

如何有效的降低代码复杂度呢？其中最重要的一点就是 —— 尽可能的使用语言自身的特性来简化代码，要写得一手好码，就得掌握一门编程语言，像 Java 这门语言，从 *JDK 1.0* 到 *Java 17* 几乎每个大版本都有增加新的特性。写 *Kotlin* 也是同样的道理，相比之下，*Kotlin* 更容易写出简洁而优雅的代码，这也是为什么 *SonarQube* 默认的 *Kotlin* 的复杂度为 *15* 而 *Java* 是 *30* 。

## Java 5

> https://docs.oracle.com/javase/1.5.0/docs/guide/language/

### Generic

代码中使用范型能带来很多好处：
1. 编译期的强类型检查
1. 消除类型转换
    下面是没有使用范型的代码：
    ```java
    List list = new ArrayList();
    list.add("hello");
    String s = (String) list.get(0);
    ```
    当使用范型后：
    ```java
    List<String> list = new ArrayList<String>();
    list.add("hello");
    String s = list.get(0);
    ```
1. 实现通用的算法，减少代码冗余

### Enhanced for Loop

在 Java 5.0 之前，循环迭代数组只能通过普通的 `for` 循环：

```java
for (int i = 0; i < array.length; i++) {
    item = array[i]
}
```
或者
```java
for (int i = 0; i < list.size(); i++) {
    item = list.get(i)
}
```
或者
```java
for (Iterator<Object> it = list.iterator(); it.hasNext();) {
    item = it.next()
}
```
从 Java 5.0 开始，无论是迭代数组或者集合，都可以采用统一的 `for-each` 循环了：

```java
for (item : arrayOrList) {
    // ...
}
```
采用 `for-each` 的好处是在没有启用 JIT 的情况下，`for-each` 相对于普通 `for` 循环，性能有明显提升，在启用 JIT 的情况下，二者性能差异不大，但对于开发者来说，我们使用 *Java* 就是为了消除平台之间的差异，除非对性能有特殊的要求，不然，我们应该优先使用 `for-each`，那 `for-each` 是如何做到对数组和集合的迭代方式进行统一的呢？

```java
public static void main(String[] args) {
    for (String arg : args) {
    }
}
```

编译器生成的字节码如下：

```
 0: aload_0
 1: astore_1
 2: aload_1
 3: arraylength
 4: istore_2
 5: iconst_0
 6: istore_3
 7: iload_3
 8: iload_2
 9: if_icmpge     23
12: aload_1
13: iload_3
14: aaload
15: astore        4
17: iinc          3, 1
20: goto          7
23: return
```

对编译器生成的字节码反编译之后的代码如下：

```java
public static void main(String[] var0) {
    String[] var1 = var0;
    int var2 = var0.length;

    for(int var3 = 0; var3 < var2; ++var3) {
        String var10000 = var1[var3];
    }
}
```

可以看到，编译器对 `for` 循环做了优化 —— 把对数组 `length` 的访问作为变量放到了 `for` 循环体的外面，那通过 `for-each` 迭代集合在字节码上有什么不一样呢？以下面的代码为例：

```java
public static void main(String[] args) {
    for (String arg : Arrays.asList(args)) {
    }
}
```

编译器生成的字节码如下：

```
 0: aload_0
 1: invokestatic  #2                  // Method java/util/Arrays.asList:([Ljava/lang/Object;)Ljava/util/List;
 4: invokeinterface #3,  1            // InterfaceMethod java/util/List.iterator:()Ljava/util/Iterator;
 9: astore_1
10: aload_1
11: invokeinterface #4,  1            // InterfaceMethod java/util/Iterator.hasNext:()Z
16: ifeq          32
19: aload_1
20: invokeinterface #5,  1            // InterfaceMethod java/util/Iterator.next:()Ljava/lang/Object;
25: checkcast     #6                  // class java/lang/String
28: astore_2
29: goto          10
32: return
```

反编译过来就是：

```java
public static void main(String[] var0) {
    String var2;
    for(Iterator var1 = Arrays.asList(var0).iterator(); var1.hasNext(); var2 = (String)var1.next()) {
    }
}
```

原来，`for-each` 在迭代集合时，采用的是 `Iterator` 的方式，而在迭代数组的时候，采用的是优化后的普通 `for` 循环的方式。

### Autoboxing / Unboxing

Autoboxing & Unboxing 可以帮助我们在原始数据类型及其对应的包装类之间自动进行隐式转换，避免产生大量冗余的代码，例如：

```java
Integer a = 100;
```

编译器会自动生成如下字节码：

```
   bipush        100
-> invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
   astore_1
```

从字节码中，我们可以看出，自动装箱其实是编译器自动将 `100` 转换成了 `Integer.valueOf(100)`，而自动拆箱则是自动调用 `Integer.intValue()` 方法，例如：

```java
int a = new Integer(100);
```

编译器生成的字节码如下：

```
   new           #2                  // class java/lang/Integer
   dup
   bipush        100
   invokespecial #3                  // Method java/lang/Integer."<init>":(I)V
-> invokevirtual #4                  // Method java/lang/Integer.intValue:()I
   istore_1
```

### Typesafe Enum

在 Java 5.0 之前是没有真正的枚举类的，如果要使用枚举一般用 `int` 类型的数值，但这带来了很多问题：

1. 类型不安全，可以使用任意的 `int` 值作为参数，编译器无法对参数的有效性和合法性进行检查
1. 没有命名空间，只能通过变量前缀来区分，容易引起命名冲突
1. 引用关系脆弱，因为 `int` 类型作为枚举通常在常量，会被编译器内联到代码中，如果后续要修改枚举值或者在中间插入新的枚举值导致之前的枚举值顺序变更的话，所有用到了这些枚举值的代码必须要重新编译才能正确运行
1. 对日志不友好，打印到日志中的 `int` 值完全无法知道它代表的是什么意思

从 Java 5.0 开始，可以通过 `enum` 关键来定义类型安全的枚举，如下所示：

```java
public enum Color {
    RED, GREEN, BLUE
}
```

很早之前，在 *Android* 官方的 [Performance Tips](https://developer.android.com/training/articles/perf-tips) 一文中有一节是 *Avoid Enums Where You Only Need Ints* ，里面有提到避免使用 `Enum` 类型，因为 `Enum` 会占用更多的内存，但后来，这一节被移除了，至于原因，还是跟 *Android* 的 *Runtime* 有关系，*Android* 早期的 *Runtime* 还是 *Dalvik* ，在内存分配方面很弱，所以，推荐开发者尽量少用 *Enum* ，而从 *Android* *5.0* 开始已经是 *ART* 了，`Enum` 的内存问题可以忽略了。

### Varargs

可变参数必须作为方法的最后一个参数，如下所示：

```java
public void printf(String format, Object... args) {
}
```

可变参数 `Object...` 跟 `Object[]` 有什么区别呢？让我们来看一下字节码：

```
public void printf(java.lang.String, java.lang.Object...);
    descriptor: (Ljava/lang/String;[Ljava/lang/Object;)V
    flags: ACC_PUBLIC, ACC_VARARGS
    Code:
      stack=0, locals=3, args_size=3
         0: return
      LineNumberTable:
        line 11: 0
```

原来，`args` 的类型实际上还是 `Object[]` ，`Object...` 只不过是一个语法糖而已，如果再声明一个同名方法且最后一个参数是 `Object[]` 会怎么样？

```java
class VarArgs {
    public void printf(String format, Object... args) {
    }

    public void printf(String format, Object[] args) {
    }
}
```

结果可想而知，编译器报错如下：

```
VarArgs.java:5: error: cannot declare both printf(String,Object[]) and printf(String,Object...) in VarArgs
    public void printf(String format, Object[] args) {
                ^
1 error
```

### Static Import

在 Java 5.0 之前，访问类的静态成员必须使用其类名来限定，如下所示：

```java
double r = Math.cos(Math.PI * theta);
```

为了解决这个问题，通常会把静态成员定义在接口中，并从该接口继承，但其实这并不是一个好主意，问题在于，一个类对另一个类的静态成员的使用属于实现细节，当一个类实现一个接口时，接口中的成员将成为该类的公共 API 的一部分，然而实现细节不应泄漏到公共 API 中，为了正确的解决这一问题，Java 5.0 引入了静态导入，如下所示：

```java
import static java.lang.Math.PI;
import static java.lang.Math.cos;

double r = cos(PI * theta);
```

### Annotation

很多 API 需要大量样板代码，例如：要写一个 *JAX-RPC web service* ，必须提供一个接口和对应的实现类，这样导致大量冗余的样板代码，在 *Java 5.0* 之前，*Java* 公提供了有限的临时注释，如 `@deprecated` ，从 *1.5* 开始，*Java* 提供了自定义注解的能力，并提供了 [APT](https://docs.oracle.com/javase/1.5.0/docs/guide/apt/index.html) 在编译期间对注解进行处理。

Java 是如何做到在不改变 *class* 文件结构的情况下增加对 *Annotation* 的支持的呢？这得从 *ClassFile* 的结构说起，如下所示：

```
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

*ClassFile* 结构的末尾是一个 *attribute_info* 数组，参见[Java 虚拟机规范](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7)，*Annotation* 作为 *attribute_info* 的形式存在于 *class* 文件中，根据 *JVM* 规范中的定义，*Java 5.0* 支持以下几种形式：

1. `RuntimeVisibleAnnotations` - 运行时可见的注解
1. `RuntimeInvisibleAnnotations` - 运行时不可见的注解
1. `RuntimeVisibleParameterAnnotations` - 运行时可见的形参注解
1. `RuntimeInvisibleParameterAnnotations` - 运行时不可见的形参注解
1. `AnnotationDefault` - 注释方法的默认值

注解在运行时是否可见，取决于声明注解时，使用的 `@RetentionPolicy`，从 *Java* 源代码中，可以看到，`@RetentionPolicy` 有以下 3 种：

1. `SOURCE` - 在源代码中保留注解
1. `CLASS` - 在 *class* 文件中保留注解
1. `RUNTIME` - 在运行时保留注解

`RetentionPolicy` 与注解的可见性的对应关系为：

|`RetentionPolicy`| Visibility         |
|:---------------:|:------------------:|
| `SOURCE`        | `RuntimeInvisible` |
| `CLASS`         | `RuntimeInvisible` |
| `RUNTIME`       | `RuntimeVisible`   |

所以，如果想在运行时能够访问到自定义的 *Annotation* ，则需要将其 `RetentionPolicy` 声明为 `RetentionPolicy.RUNTIME` ，否则，运行时将无法访问到。

## Java 6

> https://www.oracle.com/java/technologies/javase/features.html

### Scripting

*Java SE 6.0* 中增加了对脚本语言的支持，脚本框架通过服务发现机制支持第三方脚本引擎，并将基于 *Mozilla Rhino* 的 *JavaScript* 引擎作为默认的脚本引擎，这使得在 *Java* 中调用 *JavaScript* 成为可能

```java
import javax.script.*;
public class EvalScript {
    public static void main(String[] args) throws Exception {
        ScriptEngineManager factory = new ScriptEngineManager();
        ScriptEngine engine = factory.getEngineByName("JavaScript");
        engine.eval("print('Hello, World')");
    }
}
```

### Java Compiler API

很多应用会在运行时动态生成和编译代码，比如：*JSP web server* ，在 *Java SE 6.0* 之前，想要动态生成代码只能通过这 2 种方式：

1. 临时生成 `.java` 文件，然后通过 `Runtime.exec()` 来调用 `javac`，这种方法是相当的不优雅
1. Hack `javac` 的内部结构，并使用 *Java* 接口，虽然可以工作，但是没有文档，也不受支持，还不能使用第三方供应商的编译器

事实上，在 *Java SE 5.0* 中，*Sun* 已经提供了 *Java Compiler API* ，只不过是非标准的 API，在 *Java SE 6.0* 中，*Java Compiler API* 被标准化了

```java
public class Compiler {
    public static void main(String[] args) throws Exception {
        String fullQuanlifiedFileName = "compile" + java.io.File.separator + "Target.java";     
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        FileOutputStream err = new FileOutputStream("err.txt");
        int compilationResult = compiler.run(null, null, err, fullQuanlifiedFileName);
        if (compilationResult == 0) {
            System.out.println("Done");
        } else {
            System.out.println("Fail");
        }
    }
}
```

### JDBC 4.0

*JDBC 4.0* 主要包括：

- 增加了新的 `javax.sql.DataSource` 实现
- 自动加载 *JDBC* 驱动，从 *Java SE 6.0* 开始，不需要在应用中手动调用 `Class.forName(String)` 来加载驱动了，当应用请求连接的时候，`DriverManager` 会自动查找合适的 *JDBC* 驱动
- 新增了更优雅的 `SQLException` 的子类
- 引入了包装的 JDBC 对象的概念，应用可以通过该机制在标准 JDBC 对象（例如 `Connections`，`Statement` 和 `ResultSets`）中查找特定于供应商的扩展
- 新增了 `Statement` 事件，它允许连接池监听 `Statement` 的关闭和错误事件
- 为 `CallableStatement`, `PreparedStatement`, 和 `ResultSet` 增加了 *Streaming API*

### Collection Framework Enhancements

#### 新增的接口

- [Deque](https://docs.oracle.com/javase/6/docs/api/java/util/Deque.html)
- [BlockingDeque](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/BlockingDeque.html)
- [NavigableSet](https://docs.oracle.com/javase/6/docs/api/java/util/NavigableSet.html)
- [NavigableMap](https://docs.oracle.com/javase/6/docs/api/java/util/NavigableMap.html)
- [ConcurrentNavigableMap](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentNavigableMap.html)

#### 新增的类

- [ArrayDeque](https://docs.oracle.com/javase/6/docs/api/java/util/ArrayDeque.html)
- [ConcurrentSkipListSet](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentSkipListSet.html)
- [ConcurrentSkipListMap](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/ConcurrentSkipListMap.html)
- [LinkedBlockingDeque](https://docs.oracle.com/javase/6/docs/api/java/util/concurrent/LinkedBlockingDeque.html)
- [AbstractMap.SimpleEntry](https://docs.oracle.com/javase/6/docs/api/java/util/AbstractMap.SimpleEntry.html)
- [AbstractMap.SimpleImmutableEntry](https://docs.oracle.com/javase/6/docs/api/java/util/AbstractMap.SimpleImmutableEntry.html)

#### 重构后实现新增接口的类

- [LinkedList](https://docs.oracle.com/javase/6/docs/api/java/util/LinkedList.html)
- [TreeSet](https://docs.oracle.com/javase/6/docs/api/java/util/TreeSet.html)
- [TreeMap](https://docs.oracle.com/javase/6/docs/api/java/util/TreeMap.html)

#### 新增的方法

- [newSetFromMap(Map)](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#newSetFromMap(java.util.Map))
- [asLifoQueue(Deque)](https://docs.oracle.com/javase/6/docs/api/java/util/Collections.html#asLifoQueue(java.util.Deque))

### Jar & Zip Enhancements

新增两个带压缩功能的流：

- [DeflaterInputStream](https://docs.oracle.com/javase/6/docs/api/java/util/zip/DeflaterInputStream.html)
- [InflaterOutputStream](https://docs.oracle.com/javase/6/docs/api/java/util/zip/InflaterOutputStream.html)

### Reflection Enhancements

在 *Java SE 5.0* 中，`java.lang.Class` 类中与反射相关的方法的返回值或参数都是泛化的

- [getInterfaces()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getInterfaces())
- [getClasses()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getClasses())
- [getConstructors()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getConstructors())
- [getMethod(String, Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getMethod(java.lang.String,%20java.lang.Class...))
- [getConstructor(Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getConstructor(java.lang.Class...))
- [getDeclaredClasses()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredClasses())
- [getDeclaredConstructors()](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredConstructors())
- [getDeclaredMethod(String, Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredMethod(java.lang.String,%20java.lang.Class...))
- [getDeclaredConstructor(Class...)](https://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Class.html#getDeclaredConstructor(java.lang.Class...))

使用这些方法的代码在编译的过程中会产生警告，为了消除这些警告，在 *Java SE 6.0* 中，这些方法的返回值和参数类型增加了范型类型。

### Serialization Enhancements

- 新增了 [java.io.ObjectStreamClass.lookupAny(Class)](https://docs.oracle.com/javase/6/docs/api/java/io/ObjectStreamClass.html#lookupAny(java.lang.Class)) 用于获取不可序列化类的 `ObjectStreamClass` 实例
- 修复延迟 GC 的 bug, 这是由于 `ObjectOutputStream` 和 `ObjectInputStream` 的可序列化类和子类在序列化操作中被长时间的强引用，因此可能无限期地延迟定义该类的 `ClassLoader` 的垃圾回收

### VM Enhancements

- 增加了 *DTrace* 探针
- 在原有的并行 GC 的基础之上增加了并行压缩，在 *Java SE 5.0* 中，并行收集器会并行执行年轻代的收集，但 full GC 是单线程执行，在 *Java SE 6.0* 中，并行压缩通过并行执行 full GC 将 GC 性能大大提升
- 对 *CMS (Concurrent Mark Sweep)* 收集器进行了增强，通过 *-XX:+ExplicitGCInvokesConcurrent* 可以让 `System.gc()` 或 `Runtime.getRuntime().gc()` 并行执行
- 将年轻代的默认大小从 *4MB* 调到 *16MB*
- 用于年轻代的总堆的比例从1/15增加到1/7
- 默认情况下会使用幸存者空间，并且其默认大小已增加。(在以前的版本中，默认情况下，*CMS* 收集器禁用了幸存者空间）
- *CMS* 收集器使用多个线程在具有多个处理器的平台上并行执行并发标记任务（先前的版本中仅使用单个线程进行并发标记）


### Instrumentation Enhancements

- 支持 *class* 文件重新转换
    - [Instrumentation.retransformClasses(Class...)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#retransformClasses(java.lang.Class...))
    - [Instrumentation.addTransformer(ClassFileTransformer, boolean)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#addTransformer(java.lang.instrument.ClassFileTransformer,%20boolean))
    - [Instrumentation.isModifiableClass(Class)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isModifiableClass(java.lang.Class))
    - [Instrumentation.isRetransformClassesSupported()](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isRetransformClassesSupported())
- 支持 native 方法注入
    - [Instrumentation.setNativeMethodPrefix(ClassFileTransformer, String)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#setNativeMethodPrefix(java.lang.instrument.ClassFileTransformer,%20java.lang.String))
    - [Instrumentation.isNativeMethodPrefixSupported()](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#isNativeMethodPrefixSupported())
- 支持向 `ClassLoader` 的搜索路径中追加 *JAR*
    - [Instrumentation.appendToBootstrapClassLoaderSearch(JarFile)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#appendToBootstrapClassLoaderSearch(java.util.jar.JarFile))
    - [Instrumentation.appendToSystemClassLoaderSearch(JarFile)](https://docs.oracle.com/javase/6/docs/api/java/lang/instrument/Instrumentation.html#appendToSystemClassLoaderSearch(java.util.jar.JarFile))

### JVM TI (Tool Interface)

*Java SE 6.0* 对 *JVM TI* 进行了增强

- Support for transformation of class files
- Enhanced heap walking support 
    - allows access to primitive values (the value of Strings, arrays, and primitive fields)
    - allows the tag of the referrer to be set, thus enabling more efficient localized reference graph building
    - provides more extensive filtering abilities
    - is extensible, allowing abilities to grow in future versions of JVM TI
- More class information
- Support for instrumenting native methods
- Enhanced support for instrumentation under the system class loader
- Support for early return from a method
- Monitor stack depth information
- Support for resource exhaustion notification

## Java 7

### String in switch Statement

在其它语言中早已支持的特性，在 Java 7 姗姗来迟，无论怎么样，在 switch-case 中使用 String 让代码简洁了许多。这一特性其实是通过 String 的 hashCode() 实现 switch-case，如下面这段代码：

```java
public static int getDayOfWeek(String dayOfWeek) {
    switch (dayOfWeek) {
        case "Monday": return 1;
        case "Tuesday": return 2;
        case "Wednesday": return 3;
        case "Thursday": return 4;
        case "Friday": return 5;
        case "Saturday": return 6;
        case "Sunday": return 0;
        default: throw new IllegalArgumentException("Invalid day of the week: " + dayOfWeekArg);
    }
}
```

生成的字节码如下：

```
public static int getDayOfWeek(java.lang.String);
    descriptor: (Ljava/lang/String;)I
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=4, locals=3, args_size=1
         0: aload_0
         1: astore_1
         2: iconst_m1
         3: istore_2
         4: aload_1
         5: invokevirtual #2                  // Method java/lang/String.hashCode:()I
         8: lookupswitch  { // 7
             -2049557543: 146
             -1984635600: 76
             -1807319568: 160
              -897468618: 104
               687309357: 90
              1636699642: 118
              2112549247: 132
                 default: 172
            }
        76: aload_1
        77: ldc           #3                  // String Monday
        79: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
        82: ifeq          172
        85: iconst_0
        86: istore_2
        87: goto          172
        90: aload_1
        91: ldc           #5                  // String Tuesday
        93: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
        96: ifeq          172
        99: iconst_1
       100: istore_2
       101: goto          172
       104: aload_1
       105: ldc           #6                  // String Wednesday
       107: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
       110: ifeq          172
       113: iconst_2
       114: istore_2
       115: goto          172
       118: aload_1
       119: ldc           #7                  // String Thursday
       121: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
       124: ifeq          172
       127: iconst_3
       128: istore_2
       129: goto          172
       132: aload_1
       133: ldc           #8                  // String Friday
       135: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
       138: ifeq          172
       141: iconst_4
       142: istore_2
       143: goto          172
       146: aload_1
       147: ldc           #9                  // String Saturday
       149: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
       152: ifeq          172
       155: iconst_5
       156: istore_2
       157: goto          172
       160: aload_1
       161: ldc           #10                 // String Sunday
       163: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
       166: ifeq          172
       169: bipush        6
       171: istore_2
       172: iload_2
       173: tableswitch   { // 0 to 6
                       0: 216
                       1: 218
                       2: 220
                       3: 222
                       4: 224
                       5: 226
                       6: 229
                 default: 231
            }
       216: iconst_1
       217: ireturn
       218: iconst_2
       219: ireturn
       220: iconst_3
       221: ireturn
       222: iconst_4
       223: ireturn
       224: iconst_5
       225: ireturn
       226: bipush        6
       228: ireturn
       229: iconst_0
       230: ireturn
       231: new           #11                 // class java/lang/IllegalArgumentException
       234: dup
       235: new           #12                 // class java/lang/StringBuilder
       238: dup
       239: invokespecial #13                 // Method java/lang/StringBuilder."<init>":()V
       242: ldc           #14                 // String Invalid day of the week:
       244: invokevirtual #15                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
       247: aload_0
       248: invokevirtual #15                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
       251: invokevirtual #16                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
       254: invokespecial #17                 // Method java/lang/IllegalArgumentException."<init>":(Ljava/lang/String;)V
       257: athrow
```

不难看出实现的原理其实是：`lookuptable` + `String.equals(Object)` + `tableswitch`

### Type Inference for Generic Instance Creation

在 Java 7 之前，范型类的实例化时，都必须要带上类型参数，否则编译器会报 unchecked conversion warning，如在 Java 7 之前：

```java
ArrayList<String> list = new ArrayList<String>();
```

从 Java 7 开始，范型的类型参数要以省略了：

```java
ArrayList<String> list = new ArrayList<>();
```

在 Java 7 中，为 `<>` 这个符号取了一个好听的名字 -- *Diamond*

### Multiple Exception Handling

Java 7 引入另一个简化语法的功能便是多异常处理，在 Java 7 之前，`try-catch` 块中，一个 `catch` 块一次只能捕获一个异常，像 `java.lang.reflect.**` 包下的 API，会抛出一系列异常，有了这一特性，一个 `catch` 块就能处理所有的异常了，例如：

```java
try {
    Class<?> clazz = Class.forName("com.example.Main");
    Method method = clazz.getMethod("main", String[].class);
    method.invoke(clazz, new String[] {});
} catch (ClassNotFoundException | NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
    e.printStackTrace();
}
```

除了能处理多个异常外，Java 7 对于异常重抛也做了更多包容性类型检查，例如，在 Java 7 之前：

```java
static class FirstException extends Exception { }
static class SecondException extends Exception { }

public void rethrowException(String exceptionName) throws Exception {
    try {
        if (exceptionName.equals("First")) {
            throw new FirstException();
        } else {
            throw new SecondException();
        }
    } catch (Exception e) {
        throw e;
    }
}
```

然而，在 Java 7 中，可以通过指定抛出的异常类型为 `FirstException` 和 `SecondException`，即使 `catch` 块中是 `Exception` 类型，编译器也能够判断出是抛 `FirstException` 还是 `SecondException`，例如：

```java
public void rethrowException(String exceptionName) throws FirstException, SecondException {
    try {
          // ...
    } catch (Exception e) {
        throw e;
    }
}
```

### Support for Dynamic Language

众所周知，Java 语言是静态类型语言，一旦程序被编译完成，程序中的一切类型信息都将确定下来，静态类型对于程序的运行速度来说，优势是显而易见的，但是，在 Java 7 之前想要支持其它动态语言在 JVM 之上高效的运行却很困难，像 *JavaScript* ，*Ruby* 等。因此，Java 7 引入了 `invokedynamic` 指令，将 `invokedynamic` 的调用站点通过一个 `bootstrap` 方法来链接到另一个方法，如下面的例子所示：

```ruby
def addtwo(a, b)
    a + b;
end
```

`+` 即为 `invokedynamic` 的调用站点，当编译器发出 `invokedynamic` 指令调用 `+` 时，运行时系统知道有 `adder(Integer, Integer)` 这个方法，便链接 `invokedynamic` 的调用站点到 `adder` 方法上：

```java
class IntegerOps {
    public static Integer adder(Integer x, Integer y) {
        return x + y;
    }
}

class Example {
    public static CallSite mybsm(MethodHandles.Lookup callerClass, String dynMethodName, MethodType dynMethodType) throws Throwable {
        MethodHandle mh = callerClass.findStatic(Example.class, "IntegerOps.adder", MethodType.methodType(Integer.class, Integer.class, Integer.class));

        if (!dynMethodType.equals(mh.type())) {
            mh = mh.asType(dynMethodType);
        }

        return new ConstantCallSite(mh);
    }
}
```

在上面的例子中，`IntegerOps` 属于动态语言运行系统时附带的库。

### Try with Resources

`try-with-resources` 是一个非常实用的特性，特别是 I/O 操作，如在 Java 7 之前，需要主动关闭流：

```java
static String readFirstLineFromFileWithFinallyBlock(String path) throws IOException {
    BufferedReader br = new BufferedReader(new FileReader(path));
    try {
        return br.readLine();
    } finally {
        if (br != null) {
            br.close();
        }
    }
}
```

而在 Java 7 中，可以变得更简洁：

```java
static String readFirstLineFromFile(String path) throws IOException {
      try (BufferedReader br = new BufferedReader(new FileReader(path))) {
        return br.readLine();
      }
}
```

当然，它唯一的缺点是 `try` 不支持表达式或变量。

### New I/O

Java 7 引入的 New I/O API 亦称 NIO.2 或 AIO（Asynchronous I/O），NIO.2 的更新主要包括：

- File System API
  - *java.nio.file.\**
  - *java.nio.file.attribute.\**
- Channels API
  - Socket Channel API
    - Multicast
  - Asynchronous I/O
    - Future style API
    - Callback style API
- Miscellaneous
  - Infinibind (IB) Sockets Direct Protocol (SDP)
  - Stream Control Transport Protocol (SCTP)

想要深入了解，请参见：[Java Tutorials: Java NIO.2](https://docs.oracle.com/javase/tutorial/essential/io/fileio.html)

### Binary Literals

*Binary Literals* 也是一个比较实用特性，在 Java 7 之前，表示二进制只能通过十六进制来实现，而在 Java 7 中可以直接使用二进制（以 `0b` 或者 `0B` 作为前缀），如：

```java
// An 8-bit 'byte' value:
byte aByte = (byte)0b00100001;

// A 16-bit 'short' value:
short aShort = (short)0b1010000101000101;

// Some 32-bit 'int' values:
int anInt1 = 0b10100001010001011010000101000101;
int anInt2 = 0b101;
int anInt3 = 0B101; // The B can be upper or lower case.

// A 64-bit 'long' value. Note the "L" suffix:
long aLong = 0b1010000101000101101000010100010110100001010001011010000101000101L;
```

### Underscore in Number Literals

这个特性感觉有点鸡肋，可能是为了使长数字具有更好的辨识度，如：

```java
long creditCardNumber = 1234_5678_9012_3456L;
long socialSecurityNumber = 999_99_9999L;
float pi = 	3.14_15F;
long hexBytes = 0xFF_EC_DE_5E;
long hexWords = 0xCAFE_BABE;
long maxLong = 0x7fff_ffff_ffff_ffffL;
byte nybbles = 0b0010_0101;
long bytes = 0b11010010_01101001_10010100_10010010;
```

值得注意的是，下划线只能位于数字之间，而不能位于数字的首尾以及小数点两边，如：

```java
float pi1 = 3_.1415F;      // Invalid; cannot put underscores adjacent to a decimal point
float pi2 = 3._1415F;      // Invalid; cannot put underscores adjacent to a decimal point
long socialSecurityNumber1
  = 999_99_9999_L;         // Invalid; cannot put underscores prior to an L suffix

int x1 = _52;              // This is an identifier, not a numeric literal
int x2 = 5_2;              // OK (decimal literal)
int x3 = 52_;              // Invalid; cannot put underscores at the end of a literal
int x4 = 5_______2;        // OK (decimal literal)

int x5 = 0_x52;            // Invalid; cannot put underscores in the 0x radix prefix
int x6 = 0x_52;            // Invalid; cannot put underscores at the beginning of a number
int x7 = 0x5_2;            // OK (hexadecimal literal)
int x8 = 0x52_;            // Invalid; cannot put underscores at the end of a number

int x9 = 0_52;             // OK (octal literal)
int x10 = 05_2;            // OK (octal literal)
int x11 = 052_;            // Invalid; cannot put underscores at the end of a number
```

### Improved Compiler Warnings and Errors

Java 7 针对编译器警告和错误主要包括以下几个方面：

- Heap Pollution
- Variable Arguments Methods and Non-Reifiable Formal Parameters 
- Potential Vulnerabilities of Varargs Methods with Non-Reifiable Formal Parameters
- Suppressing Warnings from Varargs Methods with Non-Reifiable Formal Parameters

### Fork/Join Framework

Java 7 引入的 *fork/join* 框架是 `ExecutorService` 接口的一种实现，它充分利用了多核的优势，它被设计用于执行能拆分的任务，利用一切可用的处理能力来提升应用的性能。*fork/join* 框架的核心是 [ForkJoinPool](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html)，它派生自 `AbstractExecutorService`，并实现了 *work-stealing* 核心算法。使用方式参考下面的例子：

```java
public class ForkBlur extends RecursiveAction {
	protected static int sThreshold = 100000;

    private int[] mSource;
    private int mStart;
    private int mLength;
    private int[] mDestination;

    // Processing window size; should be odd.
    private int mBlurWidth = 15;

    public ForkBlur(int[] src, int start, int length, int[] dst) {
        mSource = src;
        mStart = start;
        mLength = length;
        mDestination = dst;
    }

    protected void computeDirectly() {
        int sidePixels = (mBlurWidth - 1) / 2;
        for (int index = mStart; index < mStart + mLength; index++) {
            // Calculate average.
            float rt = 0, gt = 0, bt = 0;
            for (int mi = -sidePixels; mi <= sidePixels; mi++) {
                int mindex = Math.min(Math.max(mi + index, 0), mSource.length - 1);
                int pixel = mSource[mindex];
                rt += (float)((pixel & 0x00ff0000) >> 16) / mBlurWidth;
                gt += (float)((pixel & 0x0000ff00) >>  8) / mBlurWidth;
                bt += (float)((pixel & 0x000000ff) >>  0) / mBlurWidth;
            }

            // Reassemble destination pixel.
            int dpixel = (0xff000000) | (((int)rt) << 16) | (((int)gt) << 8) | ((int)bt);
            mDestination[index] = dpixel;
        }
    }

    protected void compute() {
        if (mLength < sThreshold) {
            computeDirectly();
            return;
        }

        int split = mLength / 2;
        invokeAll(new ForkBlur(mSource, mStart, split, mDestination),
                  new ForkBlur(mSource, mStart + split, mLength - split, mDestination));
    }
}

public class Example {
    public static void main(String[] args) {
        ForkBlur fb = new ForkBlur(src, 0, src.length, dst);
        ForkJoinPool pool = new ForkJoinPool();
        pool.invoke(fb);
    }
}
```

### Garbage-First Collector (G1)

直到 *Oracle JDK 7 update 4* 版本才完全支持 G1 垃圾回收器，G1 主要应用于多核、堆内存较大的服务器的垃圾回收。G1 的实现原理是将堆内存划分成一系列大小相同的相邻的堆区域，然后执行并发全局标记阶段以确定整个堆中对象的活跃度，当标记阶段完成后，G1 便知道哪个区域空得多，就优先收集这些区域，这样会释放大量的空间，这也是其名字的由来。顾名思义， G1将其收集和压缩活动集中在堆中可能充满可回收对象的区域，即垃圾。 G1使用暂停预测模型来满足用户定义的暂停时间目标，并根据指定的暂停时间目标选择要收集的区域数。

### PermGen Removal

从 Java 7 开始，有一部分驻留在永生代的数据被移到了 Java 堆或 Native 堆中：

- 符号表移到了本地堆中
- Interned String 移到了 Java 堆中
- 类的静态成员移到了 Java 堆中

## Java 8

### Lambda Expressions

Lambda 表达式算是 Java 8 最大的亮点了，它提供了一种使用表达式来清晰而简明的表示仅有单个方法的接口，同时，Lambda 表达式也提供了相应的集合库来简化对集合的遍历、过滤、提取数据操作，而且，新的并发特性极大的提高了在多线程环境中的性能。

下面是一个 [Runnable](https://docs.oracle.com/javase/8/docs/api/java/lang/Runnable.html) 的 Lambda 表达式例子：

```java
public class RunnableLambda {
    public static void main(String[] args) {
        Runnable runnable = () -> System.out.println("Hello, world");
    }
}
```

当主体中只有一条语句时，可以省略 `{}` 和 `return`

### Method References

为了能在 Lambda 表达式中使用 JDK 中已经存在的 API 而不是为原有的 API 再实现一个 Lambda 表达式，Java 8 引入了方法引用，使得 Java 8 具备了函数式编程的特性。

静态方法引用语法如下：

```java
Class::staticMethod
```

实例方法引用语法如下：

```java
object::instanceMethod
```

以下是一个简单的例子：

```java
public class MethodReferenceTest1 {
    public static void main(String[] args) {
    	Consumer<String> echo = s -> System.out.println(s);
    	echo("Hello, world!");
    }
}
```

上面的例子还可以用方法引用来实现：

```java
public class MethodReferenceTest2 {
    public static void main(String[] args) {
    	Consumer<String> echo = System.out::println;
    	echo("Hello, world!");
    }
}
```

### Default Methods

在 Java 8 中引入默认方法的目的是为了让已经存在的接口可以添加新的方法而不需要让已经实现该接口的类做任何修改，甚至不用重新编译就可以使用该接口的最新版本，同时也弥补了 Java 在函数式编程方面的不足，像在 JavaScript 中的 *for-each* 循环，Java 8 通过为 [Iterable](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html) 增加了 [forEach](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html#forEach-java.util.function.Consumer-) 默认方法实现了。

```java
public class ForEachTest {
    public static void main(String[] args) {
        Arrays.asList(args).forEach(System.out::println);
    }
}
```

### Stream API

Stream API 作为 Java 8 的一大亮点，旨在为数据流处理提供更高效的方式，而不像 J2EE 那样对数据的聚合操作和批量操作完全依赖于关系型数据库。它提供了串行和并行两种模式，并行模式基于 Java 7 提供的  [Fork/Join 框架](#Fork-Join-Framework)，充分利用多核处理器的优势，使得用 Java 8 能轻松的编写高性能的并发程序。

#### filter

对数据流进行进滤：

```java
Integer[] nums = {1, 2, 3, 4, 5, 6};
Integer[] evens = Stream.of(nums).filter(n -> n % 2 == 0).toArray(Integer[]::new);
```

#### map

将数据流映射成一个新的数据流：

```java
String[] words = { "hello", "java 8", "world" };
List<String> output = Arrays.stream(words)
		.map(String::toUpperCase)
		.collect(Collectors.toList());
```

#### flatMap

对数据流进行降维，使其扁平化：

```java
List<List<Integer>> numbers = Arrays.asList(
	Arrays.asList(1),
	Arrays.asList(2, 3),
	Arrays.asList(4, 5, 6)
);
List<Integer> list = numbers.stream()
		.flatMap(Collection::stream)
		.collect(Collectors.toList());
```

#### findAny

从数据流中查找元素：

```java
String[] words = { "hello", "java 8", "world" };
Optinal<String> result = Arrays.stream(words)
		.filter(it -> it.contains("java"))
		.findAny();
```

#### parallelStream

采用并行方式从 `Person` 数据流中提取 `email`：

```java
List<Person> roaster = ...;

List<String> emails = roaster.parallelStream()
		.filter(it -> it.age > 20)
		.map(it -> it.email)
		.collect(Collectors.toList());
```

### Annotations Improvement

从 JDK 1.5 开始，Java 就提供了 *Annotation* 的功能，允许开发者定义和使用自定义的 *Annotation* 类型，以及通过 *Annotation Processing Tool (APT)* 实现更多丰富的功能。例如，流行的 *Spring* 框架中的依赖注入、切面编程等。为了更好地帮助开发者提升代码的质量和可读性，以及自动化代码分析的准确性，Java 8 对 *Annotation* 引入了 *Type Annotation* 和 *Repeating Annotation* 。

#### Type Annotation

在 Java 8 中可以在任何使用类型的地方使用 *Annotation*

```java
@NonNull Map<String, Node> nodes = createNodes();

TreeNode node = (@NonNull TreeNode) nodes.get("root");
```

自定义 *Type Annotation* ：

```java
@Target({ElementType.TYPE_PARAMETER, ElementType.TYPE_USE})
public  @interface MyAnnotation {
}
```

#### Repeating Annotation

在 Java 8 之前，同一个 *Annotation* 在同一个地方只能标注一次，而在 Java 8 中，可以使用重复的 *Annotation*

```java
@Schedule(dayOfMonth="last")
@Schedule(dayOfWeek="Fri", hour="23")
public void doPeriodicCleanup() { ... }
```

自定义 *Repeating Annotation* ：

```java
@Repeatable(Schedules.class)
public @interface Schedule {
    String dayOfMonth() default "first";
    String dayOfWeek() default "Mon";
    int hour() default 12;
}
```

声明 *Repeating Annotation* 的容器：

```java
public @interface Schedules {
    Schedule[] value();
}
```

有了 *Type Annotation* 以及可插拔的类型检查器，开发者可以编写更强大的且更不易出错的代码。

### Type Inference

Java 8 的编译器在类型推断方面的增强主要表现在对范型的推断上。

#### 范型方法

```java
public class BoxDemo {

    public static <U> void addBox(U u, List<Box<U>> boxes) {
        Box<U> box = new Box<>();
        box.set(u);
        boxes.add(box);
    }

    public static <U> void outputBoxes(java.util.List<Box<U>> boxes) {
        int counter = 0;
        for (Box<U> box: boxes) {
            U content = box.get();
            System.out.println("Box #" + counter + " contains [" + content.toString() + "]");
            counter++;
        }
    }
}
```

有了类型推断，在调用范型方法的时候便可以像调用普通方法一样：

```java
BoxDemo.addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

不用像 Java 8 以前需要在尖括号中指定类型：

```java
BoxDemo.<Integer>addBox(Integer.valueOf(10), listOfIntegerBoxes);
```

#### 范型类型实例化

在 Java 8 中实例化范型类型不用指定类型，如集合的实例化，在 Java 8 以前：

```java
List<String> list = new ArrayList<String>();
```

在 Java 8 中可以这样：

```java
List<String> list = new ArrayList<>();
```

#### 目标类型

在 Java 7 中编译器就支持利用目标类型来推断泛型方法调用的参数类型，如：

```java
List<String> empty = Collections.emptyList();
```

但是，将范型方法的返回值直接作为另一个方法的范型参数在 Java 8 以前是不支持的，如定义了这样一个方法：

```java
void processStringList(List<String> stringList) {
    ...
}
```

在 Java 7 中得这样调用：

```java
processStringList(Collections.<String>emptyList());
```

而在 Java 8 中，可以像调用普通方法一样：

```java
processStringList(Collections.emptyList());
```

### Method Parameter Reflection

在 Java 8 中，任何方法以及构造函数的形参名称可以通过 [java.lang.reflect.Executable.getParameters](https://docs.oracle.com/javase/8/docs/api/java/lang/reflect/Executable.html#getParameters--) 来获取，然而，默认情况下，*.class* 文件并不存储形参名称，因为很多工具并不希望包含形参名称的 *.class* 文件占用更多的静态和动态的空间。特别是，这些工具处理的 *.class* 文件会变得更大，Java 虚拟机得使用更多的内存加载 *.class* 文件。

如果要在 *.class* 文件中保留形参名称，并允许 *Reflection API* 能够获取到形参名称，需要在编译源代码的时候为 *javac* 编译器指定 *-parameter* 选项。

### Nashorn JavaScript Engine

在 Java 7 之前，JDK 附带了一个基于 *Mozilla Rhino* 的 *JavaScript* 脚本引擎，在 Java 8 中则附带了一个以 *Oracle Nashorn* 命名的新引擎，该引擎基于 *JSR 292* 和 `invokedynamic` 的实现方式更符合 *ECMA Script* 规范，而且运行时性能更好。深入了解 *Nashorn* ，请参见：[Oracle Nashorn: A Next-Generation JavaScript Engine for the JVM](https://www.oracle.com/technetwork/articles/java/jf14-nashorn-2126515.html)

### Concurrent Accumulators

在 Java 8 中引入并发累加器主要是为了弥补 *Atomic Number* 在高竞争情况下的吞吐量问题，在低竞争的情况下，并发累加器与 *Atomic Number* 几乎没有什么不同。并发累加器一般配合 *Stream API* 使用，譬如在收集统计数据方面，而不是在细粒度的同步控制方面。

### Parallel Operations

在 Java 8 中提供了很多并行操作的 API，如 `Collection.parallelStream()`，`Arrays.parallelSort()` 等，这些 API 都是基于 Java 7 引入的 [Fork/Join 框架](#Fork-Join-Framework)。

### Date and Time API

在 Java 8 中引入的 *java.time* 包提供了一套日期和时间的综合模型，并在 [JSR 310: Date and Time API](http://jcp.org/en/jsr/detail?id=310) 下开发，虽然是基于国际标准化组织（ISO）的日历系统，但也支持常用的全球日历。

### PermGen and Metaspace

为了解决 *java.lang.OutOfMemoryError: PermGen space ...* 的问题， Java 8 彻底移除了永生代，并将类的原数据移到 *Metaspace* 中，用于表示 class 原数据的类也被移除。原有的 *PermSize* 和 *MaxPermSize* 选项也从 JDK 8 中移除，取而代之的是 *MaxMetaspaceSize* 选项，可以通过 *MaxMetaspaceSize* 设置用于类元数据的 *Native* 内存量，默认情况下，*Metaspace* 的大小根据运行时的需要动态调整。一旦类元数据的使用量达到 *MaxMetaspaceSize* 时，将会触发 *dead class* 和 *class loader* 的垃圾回收。显然，为了限制这种垃圾回收的频率和延迟，这种垃圾回收需要进行适当的监测和调整，过多的 *Metaspace* 垃圾回收可能是由于类或者类加载器内存泄漏导致。

### Security Enhancement

- TLS 1.1 and TLS 1.2 默认开启
- 新增 [AccessController.doPrivileged](https://docs.oracle.com/javase/8/docs/api/java/security/AccessController.html#doPrivileged-java.security.PrivilegedAction-java.security.AccessControlContext-java.security.Permission...-)
- 更强的基于 AES 的密码加密算法
  - PBEWithSHA256AndAES_128
  - PBEWithSHA512AndAES_256
- SSL/TLS 服务器名称指示（Server Name Indication）
- 支持 AEAD 算法
- 增强版的 keystore 
- SHA-224 Message Digests
- 加强对国家安全局 B 套件的支持
- 更好的支持高熵随机数生成
- 64-bit PKCS11 for Windows
- 弱加密默认被禁用

## Java 9

### Java Platform Module System

模块化算是 Java 9 的重量级特性了，它提供了类似 OSGi 框架的功能，模块有依赖的概念，可以导出公共 API 并隐藏实现细节。其主要的目的是提供模块化的 JVM，使之能在低端设备上运行，JVM 只能运行应用所需的那些模块和 API，关于模块的详细描述，参见：[Module Summary](http://cr.openjdk.java.net/~mr/jigsaw/ea/module-summary.html)。从 Java 9 开始，像 *com.sun.\** 这些 JVM 内部的 API 在应用程序中不再可访问了。

类似于 *package-info.java*，模块的描述是在 *module-info.java* 中，如：

```java
module com.example.modules.car {
    requires com.example.modules.engines;
    exports com.example.modules.car.handling;
}
```

想要深入了解 Java 9 的模块化，参见：[Project Jigsaw: Module System Quick-Start Guide](http://openjdk.java.net/projects/jigsaw/quick-start)

### New HTTP Client

在 Java 9 中引入了期待已久的 `HttpURLConnection` 的替代方案，新的 API 位于 `java.net.http` 包中，支持 *HTTP/2*  协议和 *Web Socket* 握手，其性能与 *Apache Http Client* 、*Netty* 以及 *Jetty* 相当。

通过新的 *HTTP Client API* ，可以快速创建 `GET` 请求：

```java
HttpRequest request = HttpRequest.newBuilder()
  .uri(new URI("https://postman-echo.com/get"))
  .GET()
  .build();

HttpResponse<String> response = HttpClient.newHttpClient()
  .send(request, HttpResponse.BodyHandler.asString());
```

### Process API

Java 9 中对访问和管理系统进程进行了增强，通过  `java.lang.ProcessHandle` 可以访问更多进程相关的信息：

```java
ProcessHandle self = ProcessHandle.current();
long PID = self.getPid();
ProcessHandle.Info procInfo = self.info();

Optional<String[]> args = procInfo.arguments();
Optional<String> cmd =  procInfo.commandLine();
Optional<Instant> startTime = procInfo.startInstant();
Optional<Duration> cpuUsage = procInfo.totalCpuDuration();
```

通过 `destroy()` 停止运行的子线程：

```java
childProc = ProcessHandle.current().children();
childProc.forEach(procHandle -> {
    assertTrue("Could not kill process " + procHandle.getPid(), procHandle.destroy());
});
```

### The Java Shell

Java 9 引入 了 *jshell* 命令行工具，允许在命令行中直接运行代码片段，而无需将代码放在类里面，类似于其它基于 JVM 的语言，如 Groovy，Scala。之所以推出 *jshell*，其主要原因在 Java 语言相对于其它语言来说，上手的门槛略高，像 *python* 直接在命令行下就能完成 *hello world*，而 Java 还需要打开编辑器，再声明一个类，然后编译完才能运行，实在是太烦琐了，完全不利于 Java 向教学语言的转化。

除了命令行之外，*jshell* 还提供了 API，允许其它工具集成 *jshell* 的功能。

## Multi-Release JAR Files

在 Java 9 中引入了一个比较有趣的特性是支持同一个 jar 针对多个不同的 Java 版本进行发布，通过在 *MANIFEST.MF* 文件中设置 `Multi-Release: true`，该 jar 文件就变成了 *Multi-Release JAR (MRJAR)*，Java 运行时将根据当前的主版本选择合适的 jar 版本。该文件的结构如下：

```
jar root
  - A.class
  - B.class
  - C.class
  - D.class
  - META-INF
    - versions
      - 9
        - A.class
        - B.class
      - 10
        - A.class
```

- 当 JDK < 9 时，只有根目录中的类对 Java 运行时是可见的
- 在 JDK 9 上，*A.class* 和 *B.class* 将从 *root/META-INF/versions/9/* 中加载
- 在 JDK 10 上， *A.class* 将从 *root/META-INF/versions/10/* 中加载

*Multi-Release Jar* 使得项目可以维护针对不同 Java 平台的不同版本的代码，而且分发代码只需要一个 jar，一个版本（Maven artifact 版本）就够了。为了实现这个特性，自然免不了修改处理 JAR 的 API，比如：`JarFile` 和 `URLClassLoader`。此外，许多 JDK 工具为了适应新的格式也被改造过，如：*java*，*javac*，*jar*。

### Multi-Resolution Images

JDK 9 中新增了一个新的接口 [MultiResolutionImage](http://download.java.net/java/jdk9/docs/api/java/awt/image/MultiResolutionImage.html) 及其基础实现类 [BaseMultiResolutionImage](http://download.java.net/java/jdk9/docs/api/java/awt/image/BaseMultiResolutionImage.html)，它可以封装几种不同尺寸的图像变体，当给定了宽高，它可以用于选择最好的图像变体。

### Reactive Stream Flow API

在 JDK 9 中引入了 [java.util.concurrent.Flow](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Flow.html) 类，它提供了一套 *Reactive Stream* 相关的标准的接口集，这些接口通过发布-订阅机制让数据流的生产者与消费者之前进行异步通信，类似于 [RxJava](https://github.com/ReactiveX/RxJava)。

### Make G1 the Default Garbage Collector

在 Java 9 之前，服务器上的默认垃圾回收器是并行 GC，客户端的默认垃圾回收器是串行 GC，在 Java 9 中，服务器的默认 的 GC 改为从 Java 7 开始引入的 G1 垃圾回收器。

G1 是一个并行的、低暂停的垃圾回收器，对于具有较大堆空间的多核机器特别适用。关于 G1 垃圾回收器的概述，参见：[Getting Started with the G1 Garbage Collector](http://www.oracle.com/technetwork/tutorials/tutorials-1876574.html)。除此之外，并发标记清除（CMS）回收器已经被废弃。

### Compact Strings

Java 9 对 `String` 类作了内部优化，以减少内存消耗。因为大多数字符串并不需要 2 个字节表示的字符。实现的原理是在将字符数组改为字节数组，并在字节数组中增个一个字节用于表示字节数组的编码：

- Latin-1 占用 1 个字节
- UTF-16 占用 2 个字节

字符串根据要存储的内容确定字节数组的编码。

这个更改是内部的，不影响 `String` 对外的 API 以及其相关的类，如 `StringBuilder`、`StringBuffer` 等。若要禁用字符串压缩，可以使用 *-XX:-CompactStrings*  选项。

### Stack-Walking API

在 Java 9 之前，只能通过 `sun.reflect.Reflection` 遍历线程栈帧，特别是 `sun.reflect.Reflection::getCallerClass()`。有一些库依赖于这个方法，但是已经被废弃掉了，取而代之的是 JDK 9 提供的标准的 API -- [StackWalker](https://docs.oracle.com/javase/9/docs/api/java/lang/StackWalker.html)，它通过延迟访问栈帧来提高性能。应用程序可以通过这个 API 来遍历调用栈，并在类中过滤。这个类中，有两个方法值得注意：

- `public &lt;T&gt; T walk(Function&lt;Stream&lt;StackFrame&gt;, T&gt; function)` - 从顶部帧开始对当前线程栈帧进行遍历，并对栈帧应用指定的 *Function*。
- `public Class<?> getCallerClass()` - 返回调用此方法的类

`StackWalker` 是线程安全的，它可以在多线程环境中使用同一实例遍历线程栈帧。

### Compiler Control

Java 9 提供了一种通过编译器指令选项来控制 Java 虚拟机编译的途径，控制的级别包括：

- 运行时可管理的
- 特定的方法

编译器指令用于告诉 JVM 如何编译，它能精确的控制到方法上下文。指令可以用于编写 JVM 测试程序，而且测试过程中不需要重新启动整个 JVM，对于绕过一些 JVM 的 bug 也是非常的实用。

在程序启动时，通过在命令行可以指定指令文件，如下所示：

```bash
java -XX:+UnlockDiagnosticVMOptions -XX:CompilerDirectivesFile=File_A.json TestProgram
```

还可以通过诊断命令从正在运行的程序中添加或删除指令，也可以在程序启时开启自动打印指令栈[^1]，如下所示：

```bash
java -XX:+UnlockDiagnosticVMOptions -XX:+CompilerDirectivesPrint -XX:CompilerDirectivesFile=File_A.json TestProgram 
```

想要深入了解，请参见：[Oracle JDK 9: Compiler Control](https://docs.oracle.com/javase/9/vm/compiler-control1.htm)。

### Segmented Code Cache

在 Java 9 中，代码缓存由原来的一个堆分成了多个堆，每个堆都包含一个特定类型的编译代码，这样做的好处是能够分离出不同属性的代码，编译代码有 3 种不同的顶级类型：

- JVM internal(non-method) code

  主要包含非方法的代码，如编译器缓冲区和字节码解释器，此代码类型会一直驻存在代码缓存中

- Profiled-Code

  包含了一些经过简单优化的、生命周期很短的方法

- Non-profiled Code

  包含完全优化的，*non-profiled* 方法，可能有很长的生命周期

非方法代码堆的大小固定为 3MB，用于 JVM 内部和编译器缓冲区，编译器缓冲区的大小根据编译器线程 C1/C2 的数量调整，剩下的代码缓存空间则均分给 *profiled* 和 *non-profiled* 代码堆。代码堆的大小也可以通过命令行开关来控制：

- -XX:NonMethodCodeHeapSize

  设置包含非方法代码的代码堆大小

- -XX:ProfiledCodeHeapSize

  设置包含 *profiled* 代码的代码堆大小

- -XX:NonProfiledCodeHeapSize

  设置包含 *non-profiled* 代码的代码堆大小

### Dynamic Linking of Language-Defined Object Models

Java 9 推出动态链接这一特性主要是为 JVM 进程中的多种编程语言提供一种在运行时进行互操作的能力，这样对象可以在不同的 runtime 之间进行传递，由一种语言的编译器发出 `invokedynamic` 调用站点，由其它的语言的链接器来链接，比如，Java 8 推出的 [Nashorn](../java-se-8/#nashorn-javascript-engine)，但 *Nashorn* 的局限性在于它是专门为 *JavaScript* 语言提供的 JVM 引擎，而不能广泛地应用于其它语言，但 *Nashorn* 证明了通过 `invokedynamic` 实现跨语言的互调是可行的。

在 JDK 8 中 *jdk.internal.dynalink.\** 包下的代码作为 *Nashorn* 的内部依赖在 JDK 9 中作为 [jdk.dynalink](https://docs.oracle.com/javase/9/docs/api/jdk.dynalink-summary.html) 模块被公开。

### JVM Compiler Interface

对于做编译器优化的开发者来说，*JVM CI* 无疑是一个很值得期待的特性，它允许 Java 写的编译器能被 JVM 用来进行动态编译。在 Java 9 中，它被当作一个实验性的特性引入。

### Version-String Scheme

在过去的 20 多年里，Java 的版本管理一直比较混乱。 前两个主要版本是 JDK 1.0 和 JDK 1.1。 从 1.2 到 1.5，平台被称为 J2SE (标准版本)。 从 1.5 开始，版本控制变成了 Java 5，然后是 Java 6，等等。 然而，当你使用已安装的 Java 8 运行 Java 版本时，输出仍然是 1.8 而不是 8。 甲骨文收购 Sun 后推出的当前版本版本版本方案如下：

- 对于 *Limited Updates Release*（没有重要的安全修复），版本号是 20 的倍数
- 对于重要补丁更新（修复安全漏洞），版本号的计算方法是在先前的 *Limited Updates Release* 基础上以 5 的倍数递增，当版本号不为奇数的话，再加 1 凑成奇数

#### Version Numbers

从 Java 9 开始，版本号的格式改为：*\$MAJOR.\$MINOR.\$SECURITY.\$PATCH*

 - *MAJOR* - 主版本号，对于 JDK 9 来说， *MAJOR = 9*
 - *MINOR* - 次版本号，随着 bug 修复及标准 API 的增强的发布而递增
 - *SECURITY* - 安全级别，随着重要安全修复的发布而递增，当 *MINOR* 递增时，*SECURITY* 会重置为 `0`
 - *PATCH* - 非安全性修复的补丁版本

 #### Version Strings

 版本字符串是由 *Version Number*  加上一些其它信息（如：early-access release identifier 或 build number）组成：

- *\$VNUM(-\$PRE)?\\+\$BUILD(-\$OPT)?*
- *\$VNUM-\$PRE(-\$OPT)?*
- *\$VNUM(+-\$OPT)?*

其中：

- *PRE* - 预发布标识
- *BUILD* - build number
- *OPT* - 其它可选信息，如：时间戳

下面是现有和即将推出的对 JDK 9 进行版本控制的方案对比：

| Release Type | long (Existing) | short (Existing) | long (New) | short (New) |
| ------------ | --------------- | ---------------- | ---------- | ----------- |
| Early Access | 1.9.0-ea-b19    | 9-ea             | 9-ea+19    | 9-ea        |
| Major        | 1.9.0-b100      | 9                | 9+100      | 9           |
| Security #1  | 1.9.0_5-b20     | 9u5              | 9.0.1+20   | 9.0.1       |
| Security #2  | 1.9.0_11-b12    | 9u11             | 9.0.2+12   | 9.0.2       |
| Minor #1     | 1.9.0_20-b62    | 9u20             | 9.1.2+62   | 9.1.2       |
| Security #3  | 1.9.0_25-b15    | 9u25             | 9.1.3+15   | 9.1.3       |
| Security #4  | 1.9.0_31-b08    | 9u31             | 9.1.4+8    | 9.1.4       |
| Minor #2     | 1.9.0_40-b45    | 9u40             | 9.2.4+45   | 9.2.4       |

### Remove the JVM TI hprof Agent

在 Java 9 之前，prof JVM native agent 被用来转储堆、追踪 CPU，之所以移除它是因为有了更好的替代方案 -- [jmap](https://docs.oracle.com/javase/7/docs/technotes/tools/share/jmap.html) 和 [Java VisualVM](https://visualvm.github.io/)。

### Remove the jhat Tool

*jhat* 工具是用来在浏览器中查看堆的 dump 信息，之所以被移除也是因为有了更好的替代方案。

### Compile for Older Platform Versions

在 Java 9 之前是使用 *-source* 选项设置语言规范，用 *-target* 选项生成特定版本的字节码，尽管如此，由于编译器会把已编译的类链接到当前 JDK 版本的平台 API，这会导致运行时的问题（除非重载 bootclasspath）。在 Java 9 中，为能能够编译成旧的版本，这些选项由 *--release* 替代。

*--release* 等价于 *-source N -target N -bootclasspath &lt;bootclasspath-from-N&gt;*

JDK 9 通过维护旧版本的 API 签名数据来实现这一特性，这些签名数据位于：*$JDK_HOME/lib/ct.sym*

### Applet API deprecated

由于 web 浏览器对 Java 插件的支持越来越少，Applet API 在 Java 9 中被废弃，但不确定将来是否会被删除。

### Java 语言的一些小变化

- 允许在私有实例方法上使用 `@SafeVargs`。 `@SafeVarargs` 注释只能应用于不能重写的方法，包括静态方法和最终实例方法。 私有实例方法是 `@SafeVargs` 可以容纳的另一个用例。
- Java SE 7 中的 *try-with-resources* 语句要求对语句管理的每个资源声明一个新的变量，而在 Java SE 9 中 允许有效的 `final` 变量作为资源在 *try-with-resources* 语句中使用。
- 如果参数类型的推导类型是可表示的，则允许带有匿名类的 `<>` 操作符。 由于推导类型使用了具有 `<>` 操作符的匿名类构造函数可能不属于由签名属性支持的一组类型，所以  Java SE 7 中禁止使用带匿名类的 `<>` 操作符。
- 禁止 `_` 作为标识符
- 接口支持 `private` 方法，从而使接口的非抽象方法能够在它们之间共享代码。

## Java 10

### Local-Variable Type Inference

为了提高开发者体验，同时保持 Java 对静态类型安全的承诺，JDK 10 允许开发者省去平常不必要的本地变量类型声明，从而改善开发人员的体验。 例如：

```java
var list = new ArrayList<String>();  // infers ArrayList<String>
var stream = list.stream();          // infers Stream<String>
```

在上面的例子中，标识符 `var` 不是一个关键字，而是一个保留的类型名称，这样`var` 作为变量、方法包或者包名也不会受影响。

>  本地变量类型推导仅限于带有初始化器的局部变量、增强 `for-loop` 中的索引以及用传统的 `for` 循环声明的局部变量；不能用于方法、构造函数、方法返回值、字段、`catch` 或其它任何类型的变量声明。

### Consolidate the JDK Forest into a Single Repository

这个新的 Java 10 功能是关于内部管理的，它将把 JDK 众多代码库合并成一个代码库。

### Garbage-Collector Interface

在 JDK 10 增加了不同垃圾回收器的代码隔离，并引入了一个干净的接口，这意味着从 JDK 构建中排除 GC 更容易，同时也更容易增加新的 GC 而不影响代码库。关于 G1 垃圾回收以及 G1 与并发标记清除垃圾回收器的差异，请参考 [Java 内存管理](https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/garbage_collect.html)。

### Parallel Full GC for G1

在 JDK 10 中还有一个有趣的特性，它通过全量并发 GC 来改善 G1 在最坏情况下的延迟。如果你还记得 Java 9 的发布，G1 被设计为 JVM 的默认 GC，用于避免全量 GC。但是当并发回收不能快速的回收内存时，它最终会回落到全量 GC  上，这就产生了一个问题。这种改变使全量 GC 算法并行化，以便在不太可能出现 G1 全量 GC 的情况下，可以在并发回收时使用相同数量的线程来提高整体性能。

### Application Class-Data Sharing

类数据共享早在 Java 5 中就已经被引入，它允许将一组类被预处理成一个共享的存档文件，然后在运行时进行内存映射，以减少启动时间，当多个 JVM 共享相同的存档文件时，它还可以减少动态内存的占用。

### Thread-Local Handshakes

Thread-Local 握手这个功能为提高虚拟机性能奠定了基础，因为它可以在不执行全局 VM 保存点的情况下，在应用程序的线程上执行一个回调。这意味着 JVM 可以停止单独的线程，而不仅仅是所有的线程。

### Remove the Native-Header Generation Tool (javah)

*javah* 是在编译 JNI 代码时，用于生成头文件的工具，在 Java 10 被移除，并由 *javac* 取而代之。

### Additional Unicode Language-Tag Extensions

在 Java SE 9 中支持的 *BCP 47 Unicode* 语言标记的扩展名是 *ca* 和 *nu* ，在 Java 10 中，增加了对以下附加扩展的支持：

- cu (currency type) - 货币类型
- fw (first day of week) - 每周第一天
- rg (region override) - 区域覆盖
- tz (time zone) - 时区

为了支持这些附加扩展，Java 10 对下面 API 进行了更改：

- `java.text.DateFormat::get*Instance` 返回基于 `ca`， `rg`， `tz` 扩展的实例
- `java.text.DateFormatSymbols::getInstance` 返回基于 `rg `扩展的实例
- `java.text.DecimalFormatSymbols::getInstance` 返回基于 `rg` 扩展的实例
- `java.text.NumberFormat::get*Instance` 返回基于 `nu`，`rg` 扩展的实例
- `java.time.format.DateTimeFormatter::localizedBy` 返回基于 `ca`，`rg`，`tz` 扩展的实例
- `java.time.format.DateTimeFormatterBuilder::getLocalizedDateTimePattern` 返回基于 `rg` 扩展的模式字符串
- `java.time.format.DecimalStyle::of` 返回基于 `nu`，`rg` 扩展的 `DecimalStyle` 实例
- `java.time.temporal.WeekFields::of` 返回基于 `fw`，`rg` 扩展的 `WeekFields` 实例
- `java.util.Calendar::{getFirstDayOfWeek,getMinimalDaysInWeek}` 返回基于 `fw`，`rg` 扩展的值
- `java.util.Currency::getInstance` 返回基于 `cu`，`rg` 扩展的 `Currency` 实例
- `java.util.Locale::getDisplayName` 返回包含这些 Unicode 扩展的 `display name` 的字符串
- `java.util.spi.LocaleNameProvider` 有新的 SPI 作为这些 Unicode 扩展的键和类型

### Heap Allocation on Alternative Memory Devices

这听起来是一个非常酷的功能，它允许 HotSpot 虚拟机将 Java 对象堆分配到由用户指定的替代内存设备上。这一特性可以在多 JVM 环境中指定低优先级进程使用 *NV-DIMM* 内存，而将 *DRAM* 分配给高优先级进程。

### Experimental Java-Based JIT Compiler

基于 Java 的 JIT 编译器 [Graal](https://www.graalvm.org/) 是 Java 9 中引入的实验性 AOT(Ahead-of-Time) 编译器，它使用 Java 9 引入的 JVM 编译器接口。作为一个实验性的 JIT 编译器，*Graal* 主要用于测试和调试工作，通过下面的 JVM 参数即可开启 *Graal*：

```
-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler
```

### Root Certificates

这是 Java 10 带来的另一个重要变化。 它将提供一组默认的根证书颁发机构，使 Open JDK 更吸引开发者。它还旨在减小 Open JDK 和 Oracle JDK 之间的差异，像 TLS 这样关键的安全组件将在 Open JDK 中默认工作。

### Time-Based Release Versioning

随着 JDK 10 的发布，Java 已经采用了一种新的发布节奏ーー每六个月。 关于这是否是一种切实可行的方法，人们有很多争论。 很多人说每六个月就有新功能是好事，尽管很多人抱怨采用 JDK 的时间太少了。

## Java 11

### Local-Variable Syntax for Lambda Parameters

早在 Java 10 中就引入了本地变量类型推断，但仅支持普通的变量声明，而在 Java 11 中引入了更强大的类型推断，支持 *Lambda* 参数，如：

```java
(var x, var y) -> x.process(y);
```

等同于：

```java
(x, y) -> x.process(y);
```

⚠️ 值得注意的是，在使用 `var` 声明参数类型的时候，必须所有参数同时都用 `var` 声明，以下是错误的例子：

```java
(var x, y) -> x.process(y);
(var x, int y) -> x.process(y);
```

### Launch Single-File Source-Code Programs

自从 Java 9 引入了 *jshell* ，Java 语言开始朝着脚本语言的方向演化，在 Java 11 中，我们可以在类 Unix 系统上使用 *shebang* 标识符直接运行单个 *.java* 文件，如：

```java
#!/usr/bin/java --source 11

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java 11!);
    }
}
```

然后在命令行中直接执行：

```shell
java Main.java
```

### Unicode 10

Java 11 开始支持 [Unicode Standard](http://www.unicode.org/standard/standard.html) [Version 10.0](http://unicode.org/versions/Unicode10.0.0/)，主要包含以下的类：

- *java.lang* : `Character` and `String`
- *java.awt.font* : `NumericShaper`
- *java.text* : `Bidi`, `BreakIterator`, and `Normalizer`

### HTTP Client (Standard)

从 Java 9 开始引入的 *HTTP Client* 在 Java 11 中被标准化，在 Java 11 中，*HTTP Client* 的实现几乎全部重写，由原来 HTTP/1.1 阻塞式的实现改为完全异步。在新的实现中，数据流能够更好的被追踪，大大的降低了概念的数量和代码的复杂度，并使得在 HTTP/1.1 和 HTTP/2 之间的重用性最大化

### Lazy Allocation of Compiler Threads

在 Java 11 中增加了一个新的命令行标志：*-XX:+UseDynamicNumberOfCompilerThreads* 用于动态地控制编译器线程。在默认开启的分层编译模式中，无论可用内存和编译请求的数量如何，虚拟机都会在多 CPU 系统上启动了大量的编译线程。 因为即使是空闲时，线程也会消耗内存（几乎所有时间都是如此），这会导致资源的低效使用。

为了解决这个问题，Java 11 已经更改了实现方式，在启动期间只启动每种类型的一个编译器线程，并动态处理后续线程的启动和关闭。 它由新的命令行标志 *-XX:+UseDynamicNumberOfCompilerThreads* 控制，默认开启。

### ZGC - A Scalable Low-Latency Garbage Collector

ZGC 是一个可伸缩的低延迟垃圾收集器， 它旨在实现以下目标：

- 暂停时间不得超过 10 毫秒
- 暂停时间不会随着堆或实时设置大小而增加
- 处理大小从几百兆到多兆字节不等的信息

ZGC 是一个并发的垃圾收集器，这意味着所有繁重的工作（标记、压缩、参考处理、字符串表清理等）都是在 Java 线程继续执行的时候完成的。 这极大地限制了垃圾收集对应用程序响应时间的负面影响。

从 ZGC 与 G1 的 benchmark 对比来看，简直令人惊叹，仅用了不到 2 毫秒：

|                    |         ZGC          |           G1            |
| -----------------: | :------------------: | :---------------------: |
|                avg | 1.091ms (+/-0.215ms) | 156.806ms (+/-71.126ms) |
|    95th percentile |       1.380ms        |        316.672ms        |
|    99th percentile |       1.512ms        |        428.095ms        |
|  99.9th percentile |       1.663ms        |        543.846ms        |
| 99.99th percentile |       1.681ms        |        543.846ms        |
|                max |       1.681ms        |        543.846ms        |

作为 Java 11 的一个实验特征，开启 ZGC 需要通过 *-XX:+UnlockExperimentalVMOptions* 选项与 *-XX:+UseZGC* 选项结合使用，不过它有如下限制：

- 只能在 linux / x64上使用。
- 不支持 *Compressed Oops*[^2] 和 *Compressed Class Pointers*[^3]，*XX:+UseCompressedOops* 和 *-XX:+UseCompressedClassPointers* 选项默认禁用
- 不支持类卸载，*XX:+*ClassUnloading* 和 *-XX:+ClassUnloadingWithConcurrentMark* 选项默认禁用
- 不支持使用 ZGC 与 Graal 一起使用

### Epsilon - A No-Op Garbage Collector

*Epsilon GC* 是 Java 11 引入的一个新的实验性无操作垃圾收集器。 *Epsilon GC* 仅处理内存分配，并且不实现任何内存回收机制。 它对性能测试非常有用，可以与其他 GC 的成本/收益进行对比。 它可用于在测试中方便地断言内存占用和内存压力。 在极端情况下，它可能对非常短暂的任务很有用，其中内存回收将在 JVM 终止时发生，或者在低垃圾应用程序中获得最后一次延迟改进。

### Low-Overhead Heap Profiling

Java 11 中提供一种低开销的 Java 堆分配方式，旨在实现：

- 低开销足以在默认情况下持续启用
- 可以通过一个定义明确的程序接口（JVMTI）访问
- 可以对所有分配进行采样（不限于在一个特定堆区域或特定方式的分配）
- 可以以一种独立于实现的方式定义（不依赖任何特定的 GC 算法或 VM 实现）
- 可以提供关于活的和死的 Java 对象的信息

### Nest-Based Access Control

在Java SE 11中，Java 虚拟机支持将类和接口放到新的访问控制上下文中，称为嵌套。嵌套允许类和接口在逻辑上属于同一代码实体，但是被编译为不同的类文件，以访问彼此的私有成员，而无需编译器插入可访问性扩展桥接方法。嵌套是 Java SE 平台的低级机制；Java 编程语言的访问控制规则没有变化。通过生成新的类文件属性（将顶级类（或接口）及其所有嵌套类和接口放在同一个嵌套中），*javac* 编译器在编译 Java 源代码中的嵌套类和接口时使用嵌套。在检查私有构造函数，方法或字段的可访问性时，Java 虚拟机则使用这些属性，包括通过核心反射和 `java.lang.invoke.MethodHandles.Lookup` API。嵌套中的成员通过 `java.lang.Class` 的 `getNestHost` 和 `getNestMembers` 方法暴露出来。

由于嵌套成员记录在顶级类或接口（嵌套宿主）的类文件中，因此该类文件必须在运行时存在，以允许执行访问控制检查。 一般情况下都不会有问题，因为通常都是直接使用顶级类或接口。 在某些顶级类或接口仅作为嵌套类或接口的持有者并且未使用的代码中，打包工具可能已经从库或应用程序的分发中删除了该类文件。 使用基于嵌套的访问控制，如果任何嵌套类或接口需要访问彼此的私有成员，将抛出 `NoClassDefFoundError` 或 `ClassNotFoundException`。

### Key Agreement with Curve25519 and Curve448

在 Java 10 中新增了一个使用 *Curve25519* 和 *Curve448* 的密钥协商方案的实现，如 [RFC 7748 - Elliptic Curves for Security](https://tools.ietf.org/html/rfc7748) 所述。 此实现可以作为一个 Java 加密体系结构服务，但尚未纳入 TLS 1.3 实现。

### ChaCha20 and Poly1305 Cryptographic Algorithms

Java 10 实现了 [RFC 7539 - ChaCha20 and Poly1305 for IETF Protocols](https://tools.ietf.org/html/rfc7539) 中指定的 *ChaCha20* 和 *ChaCha20-poly1305* 密码。 *ChaCha20* 是一种更新的流密码，可以替代旧的、不安全的 *RC4* 流密码，示例如下：

```java
Cipher chaCha20 = Cipher.getInstance("ChaCha20");
Cipher chaCha20Poly1305 = Cipher.getInstance("ChaCha20-Poly1305");
```

### Transport Layer Security (TLS) 1.3 

Java 11 中包含了 [RFC 8446 - The Transport Layer Security (TLS) Protocol Version 1.3](https://tools.ietf.org/html/rfc8446) 的实现，对于 TLS 1.3，新的标准算法名称定义如下：

- TLS protocol version name: *TLSv1.3*
- `SSLContext` algorithm name: *TLSv1.3*
- TLS cipher suite names for TLS 1.3: *TLS_AES_128_GCM_SHA256*, *TLS_AES_256_GCM_SHA384*
- *keyType* for `X509KeyManager`: *RSASSA-PSS*
- *authType* for `X509TrustManager`: *RSASSA-PSS*

⚠️ 请注意 TLS 1.3 与之前的版本并不直接兼容。 虽然 TLS 1.3 可以以向后兼容模式实现，但在升级到 TLS 1.3 时仍然需要考虑到几个兼容性风险：

1. TLS 1.3 uses a half-close policy, while TLS 1.2 and prior versions use a duplex-close policy. For applications that depend on the duplex-close policy, there may be compatibility issues when upgrading to TLS 1.3.
2. The signature_algorithms_cert extension requires that pre-defined signature algorithms are used for certificate authentication. In practice, however, an application may use unsupported signature algorithms.
3. The DSA signature algorithm is not supported in TLS 1.3. If a server is configured to only use DSA certificates, it cannot upgrade to TLS 1.3.
4. The supported cipher suites for TLS 1.3 are not the same as TLS 1.2 and prior versions. If an application hard-codes cipher suites which are no longer supported, it may not be able to use TLS 1.3 without modifying the application code.
5. The TLS 1.3 session resumption and key update behaviors are different from TLS 1.2 and prior versions. The compatibility impact should be minimal, but it could be a risk if an application depends on the handshake details of the TLS protocols.

### Removal of Thread.destroy() and Thread.stop(Throwable) 

`Thread.destroy()` 和 `Thread.stop(Throwable)` 在很早之前就被废弃了，在 Java 11 中终于被移除

### Removal of JMC from the Oracle JDK

在 Java 11 中，Java Mission Control (JMC) 被移除，作为一个独立的软件包单独发布

### Removal of JavaFX from the Oracle JDK

JavaFX 也被移除，作为一个独立的软件包单独发布，下载地址：[openjfx.io](https://openjfx.io/)

### Removal of Java EE and CORBA Modules

在 Java 9 中被废弃的 Java EE 和 CORBA 在 Java 11 中被移除

### Deprecation of Nashorn JavaScript Engine

在 Java 8 中此入的 *Nashorn JavaScript Engine* 在 Java 11 中被废弃了，预计在将来的某个版本中移除

### Deprecation of Pack200 Tools and API

*Pack200* 工具及其 API 被废弃

### Readonly System Properties

在 Java 11 中，这些系统属性会在虚拟机启动时被缓存：

- *java.home*
- *user.home*
- *user.dir*
- *user.name*

在启动后通过 `System::setProperty` 修改这些属性并不会生效

### `java.lang.ref.Reference` Does Not Support Cloning

在 Java 11 中，调用 `java.lang.ref.References::clone` 方法会抛出 `CloneNotSupportedException`
