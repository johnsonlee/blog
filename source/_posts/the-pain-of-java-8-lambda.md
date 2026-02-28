---
title: Java 8 Lambda 之殇
categories:
  - Computer Science
  - Java
tags:
  - Java
  - Lambda
date: 2020-04-15 01:00:00
---

前段时间为 [booster-task-analyser](https://github.com/didi/booster/blob/master/booster-task-analyser) 做性能优化，不禁开始怀念 *Java* ，于是乎，又尝试用 *Java* 写点东西，但总是感觉很不爽，尤其是在 *lambda* 表达式中 *try-catch* ，太烦人了，本来就一行代码的事情，硬生生写成 6 行（效率就是被这么给降下来的），我当时就想，能不能让 *Java 8* 的 *lambda* 写起来更爽一点？

## Unchecked Exception

在 *Java* 中，只有两种类型的 *Throwable* 是不必强制 *try-catch* 的：

1. `RuntimeException`

  *Java* 的设计者认为 *RuntimeException* 是由于人为的原因引起的 —— 程序员的锅，所以不必 *catch*

1. `Error`

  *Java* 的设计者认为 *Error* 是最严重的异常，通常是无法恢复的，也没有别的办法处理 —— *catch* 也没用

基于这个理论，我们是否可以让 *lambda* 中需要 *catch* 的地方抛出 *RuntimeException* 呢？

其实，在 *Java 8* 中，*JDK* 中新增了 `UncheckedIOException` 这个类，为了在 *Stream API* 中更方便的使用 *Lambda* ，例如：

```java
public class BufferedReader extends Reader {

    public Stream<String> lines() {
        Iterator<String> iter = new Iterator<String>() {
            String nextLine = null;

            @Override
            public boolean hasNext() {
                if (nextLine != null) {
                    return true;
                } else {
                    try {
                        nextLine = readLine();
                        return (nextLine != null);
                    } catch (IOException e) {
                        throw new UncheckedIOException(e);
                    }
                }
            }

            @Override
            public String next() {
                if (nextLine != null || hasNext()) {
                    String line = nextLine;
                    nextLine = null;
                    return line;
                } else {
                    throw new NoSuchElementException();
                }
            }
        };
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
                iter, Spliterator.ORDERED | Spliterator.NONNULL), false);
    }

}
```

虽然，*UncheckedIOException* 能解决这个问题，但总是感觉用起来还是很傻，所以，我就在想，能不能将这段代码写得更简短呢？

## 造轮子

如下面这段代码：

```java
public void cat(Collection<File> files) {
    files.stream().map(file -> {
        try {
            return Files.readString(file.toPath());
        } catch (IOException e) {
            return "";
        }
    }).forEach(System.out::println);
}
```

如果能写成下面这样岂不是美哉（即使有一点点细微的差异也能接受）：

```java
public void cat(Collection<File> files) {
    files.stream()
            .map(file -> Files.readString(file.toPath()))
            .forEach(System.out::println);
}
```

既然是这样，是不是可以把 *lambda* 再包装一层？比如，写成这样也不错：

```java
public void cat(Collection<File> files) {
    files.stream()
            .map(file -> unchecked(() -> Files.readString(file.toPath())}))
            .forEach(System.out::println);
}
```

虽然上面的代码括号是多少了一点，但是，比起最开始的样子，已经美观了不少，那如何才能做到上面的写法能适应各种情况呢。

### 有返回值的方法

由于 *Java 8* 支持 *Functional Interface* ，有返回值的方法可以定义成为：

```java
@FunctionalInterface
public interface Procedure<R, E extends Throwable> {

    R invoke() throws E;

}
```

然后通过下面这个方法，将 *lambda* 包装一下：

```java
public static <R, E extends Throwable> R unchecked(final Procedure<R, E> procedure) {
    try {
        return procedure.invoke();
    } catch (final Error | RuntimeException e) {
        throw e;
    } catch (final Throwable e) {
        throw new UncheckedException(e);
    }
}
```

### 无返回值的方法

无返回值的方法可以定义成这样：

```java
@FunctionalInterface
public interface Block<E extends Throwable> {

    void invoke() throws E;

}
```

然后通过下面这个方法，将 *lambda* 包装一下：

```java
public static <E extends Throwable> void unchecked(final Block<? super E> block) {
    try {
        block.invoke();
    } catch (final Error | RuntimeException e) {
        throw e;
    } catch (final Throwable e) {
        throw new UncheckedException(e);
    }
}
```

OK，搞定！这个轮子可还行？

## 啰嗦的变量声明

用习惯了 *Kotlin* 再回到 *Java* 的世界，一切都显得很啰嗦，于是，我又想，能不能让 *Java* 的变量声明也能更短一点呢？想想 *JavaScript* 里的 *jQuery* 的 *$()* 的用法，还是挺别致的，正好 *$* 符在 *Java* 中是合法的标识符，那再造个轮子吧：

```java
public static <T> void $(final T object, final Consumer<? super T> consumer) {
    consumer.accept(object);
}

public static <T, R> R $(final T object, final Function<T, R> function) {
    return function.apply(object);
}

public static <A, B> void with(final A a, final B b, final BiConsumer<A, B> consumer) {
    consumer.accept(a, b);
}

public static <A, B, R> R with(final A a, final B b, final BiFunction<A, B, R> function) {
    return function.apply(a, b);
}
```

于是，在 *Java* 的世界里，我们可以像 *JavaScript* 一样玩耍了：

```java
$(new File("..."), (f) -> {
    
});
```

对这个轮子感兴趣的同学可以戳这里 👉 [lambda-support](https://github.com/johnsonlee/lambda-support)
