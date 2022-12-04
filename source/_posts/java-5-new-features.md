---
title: Java 5 新特性
categories:
  - Computer Science
  - Java
tags:
  - Java
date: 2021-05-07 05:00:00
---

J2SE 5.0 代号为 *Tiger* 。这个在 2004 年 9 月 30 日发布的版本原本以 1.5 编号，也就是仍然使用内部版本编号。这个数字辈改变是为了“更好地反映成熟度、稳定性、可扩展性和 J2SE 的安全水准”。这个版本中增加了若干个重要的新语言功能，根据 *JSR 176* 开发。

## Generic

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

## Enhanced for Loop

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

## Typesafe Enum

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

## Varargs

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

## Static Import

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

## Annotation

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


> 更多详情，请参考：https://docs.oracle.com/javase/1.5.0/docs/guide/language/
