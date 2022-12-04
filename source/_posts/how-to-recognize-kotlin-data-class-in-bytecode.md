---
title: 如何识别 Kotlin 的 data class
categories:
  - Computer Science
  - Kotlin
tags:
  - JVM
  - Kotlin
date: 2020-09-22 00:00:00
---

最近做字节码相关的朋友求救：“森哥，ASM 怎么才能识别 kotlin 的 data class?”，我想，这是啥需求还要区分 *data class* 和非 *data class* ，后来一问，原来是要把工程中所有实现了 `Serializable` 接口的 *Java* 类和 *Kotlin* 的 *data class* 单独提取出来，将 *Redis* 中的 *POJO* 缓存进行可视化。

研究了一下 *data class* 的字节码，发现还是有一些特征的，比如：

```kotlin
data class User(val name: String, val age: Int)
```

编译成字节码如下：

```
public final class User
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_FINAL, ACC_SUPER
Constant pool:
    #1 = Utf8               User
    #2 = Class              #1            // User
    #3 = Utf8               java/lang/Object
    #4 = Class              #3            // java/lang/Object
    #5 = Utf8               name
    #6 = Utf8               Ljava/lang/String;
    #7 = Utf8               Lorg/jetbrains/annotations/NotNull;
    #8 = Utf8               getName
    #9 = Utf8               ()Ljava/lang/String;
   #10 = NameAndType        #5:#6         // name:Ljava/lang/String;
   #11 = Fieldref           #2.#10        // User.name:Ljava/lang/String;
   #12 = Utf8               this
   #13 = Utf8               LUser;
   #14 = Utf8               age
   #15 = Utf8               I
   #16 = Utf8               getAge
   #17 = Utf8               ()I
   #18 = NameAndType        #14:#15       // age:I
   #19 = Fieldref           #2.#18        // User.age:I
   #20 = Utf8               <init>
   #21 = Utf8               (Ljava/lang/String;I)V
   #22 = String             #5            // name
   #23 = Utf8               kotlin/jvm/internal/Intrinsics
   #24 = Class              #23           // kotlin/jvm/internal/Intrinsics
   #25 = Utf8               checkParameterIsNotNull
   #26 = Utf8               (Ljava/lang/Object;Ljava/lang/String;)V
   #27 = NameAndType        #25:#26       // checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
   #28 = Methodref          #24.#27       // kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
   #29 = Utf8               ()V
   #30 = NameAndType        #20:#29       // "<init>":()V
   #31 = Methodref          #4.#30        // java/lang/Object."<init>":()V
   #32 = Utf8               component1
   #33 = Utf8               component2
   #34 = Utf8               copy
   #35 = Utf8               (Ljava/lang/String;I)LUser;
   #36 = NameAndType        #20:#21       // "<init>":(Ljava/lang/String;I)V
   #37 = Methodref          #2.#36        // User."<init>":(Ljava/lang/String;I)V
   #38 = Utf8               copy$default
   #39 = Utf8               (LUser;Ljava/lang/String;IILjava/lang/Object;)LUser;
   #40 = NameAndType        #34:#35       // copy:(Ljava/lang/String;I)LUser;
   #41 = Methodref          #2.#40        // User.copy:(Ljava/lang/String;I)LUser;
   #42 = Utf8               toString
   #43 = Utf8               java/lang/StringBuilder
   #44 = Class              #43           // java/lang/StringBuilder
   #45 = Methodref          #44.#30       // java/lang/StringBuilder."<init>":()V
   #46 = Utf8               User(name=
   #47 = String             #46           // User(name=
   #48 = Utf8               append
   #49 = Utf8               (Ljava/lang/String;)Ljava/lang/StringBuilder;
   #50 = NameAndType        #48:#49       // append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
   #51 = Methodref          #44.#50       // java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
   #52 = Utf8               , age=
   #53 = String             #52           // , age=
   #54 = Utf8               (I)Ljava/lang/StringBuilder;
   #55 = NameAndType        #48:#54       // append:(I)Ljava/lang/StringBuilder;
   #56 = Methodref          #44.#55       // java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
   #57 = Utf8               )
   #58 = String             #57           // )
   #59 = NameAndType        #42:#9        // toString:()Ljava/lang/String;
   #60 = Methodref          #44.#59       // java/lang/StringBuilder.toString:()Ljava/lang/String;
   #61 = Utf8               hashCode
   #62 = NameAndType        #61:#17       // hashCode:()I
   #63 = Methodref          #4.#62        // java/lang/Object.hashCode:()I
   #64 = Utf8               java/lang/Integer
   #65 = Class              #64           // java/lang/Integer
   #66 = Utf8               (I)I
   #67 = NameAndType        #61:#66       // hashCode:(I)I
   #68 = Methodref          #65.#67       // java/lang/Integer.hashCode:(I)I
   #69 = Utf8               java/lang/String
   #70 = Class              #69           // java/lang/String
   #71 = Utf8               equals
   #72 = Utf8               (Ljava/lang/Object;)Z
   #73 = Utf8               Lorg/jetbrains/annotations/Nullable;
   #74 = Utf8               areEqual
   #75 = Utf8               (Ljava/lang/Object;Ljava/lang/Object;)Z
   #76 = NameAndType        #74:#75       // areEqual:(Ljava/lang/Object;Ljava/lang/Object;)Z
   #77 = Methodref          #24.#76       // kotlin/jvm/internal/Intrinsics.areEqual:(Ljava/lang/Object;Ljava/lang/Object;)Z
   #78 = Utf8               Lkotlin/Metadata;
   #79 = Utf8               mv
   #80 = Integer            1
   #81 = Integer            16
   #82 = Utf8               bv
   #83 = Integer            0
   #84 = Integer            3
   #85 = Utf8               k
   #86 = Utf8               d1
   #87 = Utf8                \n\n\n\n\n\\\t\n
                                             20B00¢J\t
                                                      0HÆJ\t
                                                            0HÆJ\r0HÆJ00HÖJ\t0HÖJ\t0HÖR0R0\\t\n¨
   #88 = Utf8               d2
   #89 = Utf8
   #90 = Utf8               other
   #91 = Utf8               kotlinx
   #92 = Utf8               User.kt
   #93 = Utf8               RuntimeInvisibleAnnotations
   #94 = Utf8               Code
   #95 = Utf8               LineNumberTable
   #96 = Utf8               LocalVariableTable
   #97 = Utf8               RuntimeInvisibleParameterAnnotations
   #98 = Utf8               StackMapTable
   #99 = Utf8               SourceFile
  #100 = Utf8               RuntimeVisibleAnnotations
{
  public final java.lang.String getName();
    descriptor: ()Ljava/lang/String;
    flags: ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #11                 // Field name:Ljava/lang/String;
         4: areturn
      LineNumberTable:
        line 1: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   LUser;
    RuntimeInvisibleAnnotations:
      0: #7()

  public final int getAge();
    descriptor: ()I
    flags: ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #19                 // Field age:I
         4: ireturn
      LineNumberTable:
        line 1: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   LUser;

  public User(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=3
         0: aload_1
         1: ldc           #22                 // String name
         3: invokestatic  #28                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
         6: aload_0
         7: invokespecial #31                 // Method java/lang/Object."<init>":()V
        10: aload_0
        11: aload_1
        12: putfield      #11                 // Field name:Ljava/lang/String;
        15: aload_0
        16: iload_2
        17: putfield      #19                 // Field age:I
        20: return
      LineNumberTable:
        line 1: 6
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      21     0  this   LUser;
            0      21     1  name   Ljava/lang/String;
            0      21     2   age   I
    RuntimeInvisibleParameterAnnotations:
      0:
        0: #7()
      1:

  public final java.lang.String component1();
    descriptor: ()Ljava/lang/String;
    flags: ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #11                 // Field name:Ljava/lang/String;
         4: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   LUser;
    RuntimeInvisibleAnnotations:
      0: #7()

  public final int component2();
    descriptor: ()I
    flags: ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #19                 // Field age:I
         4: ireturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   LUser;

  public final User copy(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)LUser;
    flags: ACC_PUBLIC, ACC_FINAL
    Code:
      stack=4, locals=3, args_size=3
         0: aload_1
         1: ldc           #22                 // String name
         3: invokestatic  #28                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
         6: new           #2                  // class User
         9: dup
        10: aload_1
        11: iload_2
        12: invokespecial #37                 // Method "<init>":(Ljava/lang/String;I)V
        15: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      16     0  this   LUser;
            0      16     1  name   Ljava/lang/String;
            0      16     2   age   I
    RuntimeInvisibleAnnotations:
      0: #7()
    RuntimeInvisibleParameterAnnotations:
      0:
        0: #7()
      1:

  public static User copy$default(User, java.lang.String, int, int, java.lang.Object);
    descriptor: (LUser;Ljava/lang/String;IILjava/lang/Object;)LUser;
    flags: ACC_PUBLIC, ACC_STATIC, ACC_SYNTHETIC
    Code:
      stack=3, locals=5, args_size=5
         0: iload_3
         1: iconst_1
         2: iand
         3: ifeq          11
         6: aload_0
         7: getfield      #11                 // Field name:Ljava/lang/String;
        10: astore_1
        11: iload_3
        12: iconst_2
        13: iand
        14: ifeq          22
        17: aload_0
        18: getfield      #19                 // Field age:I
        21: istore_2
        22: aload_0
        23: aload_1
        24: iload_2
        25: invokevirtual #41                 // Method copy:(Ljava/lang/String;I)LUser;
        28: areturn
      StackMapTable: number_of_entries = 2
        frame_type = 11 /* same */
        frame_type = 10 /* same */

  public java.lang.String toString();
    descriptor: ()Ljava/lang/String;
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: new           #44                 // class java/lang/StringBuilder
         3: dup
         4: invokespecial #45                 // Method java/lang/StringBuilder."<init>":()V
         7: ldc           #47                 // String User(name=
         9: invokevirtual #51                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        12: aload_0
        13: getfield      #11                 // Field name:Ljava/lang/String;
        16: invokevirtual #51                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        19: ldc           #53                 // String , age=
        21: invokevirtual #51                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        24: aload_0
        25: getfield      #19                 // Field age:I
        28: invokevirtual #56                 // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
        31: ldc           #58                 // String )
        33: invokevirtual #51                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        36: invokevirtual #60                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
        39: areturn
    RuntimeInvisibleAnnotations:
      0: #7()

  public int hashCode();
    descriptor: ()I
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: getfield      #11                 // Field name:Ljava/lang/String;
         4: dup
         5: ifnull        14
         8: invokevirtual #63                 // Method java/lang/Object.hashCode:()I
        11: goto          16
        14: pop
        15: iconst_0
        16: bipush        31
        18: imul
        19: aload_0
        20: getfield      #19                 // Field age:I
        23: invokestatic  #68                 // Method java/lang/Integer.hashCode:(I)I
        26: iadd
        27: ireturn
      StackMapTable: number_of_entries = 2
        frame_type = 78 /* same_locals_1_stack_item */
          stack = [ class java/lang/String ]
        frame_type = 65 /* same_locals_1_stack_item */
          stack = [ int ]

  public boolean equals(java.lang.Object);
    descriptor: (Ljava/lang/Object;)Z
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=2
         0: aload_0
         1: aload_1
         2: if_acmpeq     42
         5: aload_1
         6: instanceof    #2                  // class User
         9: ifeq          44
        12: aload_1
        13: checkcast     #2                  // class User
        16: astore_2
        17: aload_0
        18: getfield      #11                 // Field name:Ljava/lang/String;
        21: aload_2
        22: getfield      #11                 // Field name:Ljava/lang/String;
        25: invokestatic  #77                 // Method kotlin/jvm/internal/Intrinsics.areEqual:(Ljava/lang/Object;Ljava/lang/Object;)Z
        28: ifeq          44
        31: aload_0
        32: getfield      #19                 // Field age:I
        35: aload_2
        36: getfield      #19                 // Field age:I
        39: if_icmpne     44
        42: iconst_1
        43: ireturn
        44: iconst_0
        45: ireturn
      StackMapTable: number_of_entries = 2
        frame_type = 42 /* same */
        frame_type = 1 /* same */
    RuntimeInvisibleParameterAnnotations:
      0:
        0: #73()
}
SourceFile: "User.kt"
RuntimeVisibleAnnotations:
  0: #78(#79=[I#80,I#80,I#81],#82=[I#80,I#83,I#84],#85=I#80,#86=[s#87],#88=[s#13,s#89,s#5,s#89,s#14,s#89,s#21,s#16,s#17,s#8,s#9,s#32,s#33,s#34,s#71,s#89,s#90,s#61,s#42,s#91])
```

从上面的字节码中，我们可以发现 *data class* 有这么几个特点：

1. 类是 *final* 的
1. 构造方法是带参数的，参数个数与 *getter* 数量相等
1. 重写了 `equals(Object)`, `hashCode()` 和 `toString()` 方法

另外，还发现有几个特别的方法：

1. `copy(String, int)`
1. `copy$default(User, String, int, int, Object)`
1. `component1()`
1. `component2()`

这算是 *Kotlin* 的 *data class* 的特征吗？让我们来看看 *Kotlin* 官方对 [data class](https://kotlinlang.org/docs/reference/data-classes.html) 的描述：

> 编译器会自动根据 *data* 类主构造方法中声明的所有属性生成以下成员：
> 
> 1. `equals()` / `hashCode()` 方法对
> 1. 格式为 `"User(name=John, age=42)"` 的 `toString()` 方法
> 1. 对应声明顺序的 `componentN()` 方法
> 1. `copy()` 方法

所以，通过以上特征，已经可以很容易的区分 *data* 类和非 *data* 类了，如果要做到万无一失的话，可以考虑把 `copy$default(...)` 这个 `ACC_SYNTHETIC` 特征加上。
