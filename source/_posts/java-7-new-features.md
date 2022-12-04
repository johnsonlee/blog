---
title: Java 7 新特性
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 07:00:00
---

Java 7 代号 *Dolphin* 是一个重大的更新，于 2011 年 7 月 7 日亮相，并在 2011 年7 月 28 日开放给开发者使用。开发周期被分类成十三个重要阶段，最后一个阶段在 2011 年 6 月 6 日完成。平均来看，每个里程碑各有 8 个版本（主要包括功能增强和漏洞修复）。

## String in switch Statement

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

## Type Inference for Generic Instance Creation

在 Java 7 之前，范型类的实例化时，都必须要带上类型参数，否则编译器会报 unchecked conversion warning，如在 Java 7 之前：

```java
ArrayList<String> list = new ArrayList<String>();
```

从 Java 7 开始，范型的类型参数要以省略了：

```java
ArrayList<String> list = new ArrayList<>();
```

在 Java 7 中，为 `<>` 这个符号取了一个好听的名字 -- *Diamond*

## Multiple Exception Handling

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

## Support for Dynamic Language

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

## Try with Resources

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

## New I/O

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

## Binary Literals

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

## Improved Compiler Warnings and Errors

Java 7 针对编译器警告和错误主要包括以下几个方面：

- Heap Pollution
- Variable Arguments Methods and Non-Reifiable Formal Parameters 
- Potential Vulnerabilities of Varargs Methods with Non-Reifiable Formal Parameters
- Suppressing Warnings from Varargs Methods with Non-Reifiable Formal Parameters

## Fork/Join Framework

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

## Garbage-First Collector (G1)

直到 *Oracle JDK 7 update 4* 版本才完全支持 G1 垃圾回收器，G1 主要应用于多核、堆内存较大的服务器的垃圾回收。G1 的实现原理是将堆内存划分成一系列大小相同的相邻的堆区域，然后执行并发全局标记阶段以确定整个堆中对象的活跃度，当标记阶段完成后，G1 便知道哪个区域空得多，就优先收集这些区域，这样会释放大量的空间，这也是其名字的由来。顾名思义， G1将其收集和压缩活动集中在堆中可能充满可回收对象的区域，即垃圾。 G1使用暂停预测模型来满足用户定义的暂停时间目标，并根据指定的暂停时间目标选择要收集的区域数。

## PermGen Removal

从 Java 7 开始，有一部分驻留在永生代的数据被移到了 Java 堆或 Native 堆中：

- 符号表移到了本地堆中
- Interned String 移到了 Java 堆中
- 类的静态成员移到了 Java 堆中

> 更多详情，请参考：https://www.oracle.com/java/technologies/javase/jdk7-relnotes.html