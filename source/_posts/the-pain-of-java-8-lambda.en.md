---
title: The Pain of Java 8 Lambda
lang: en
i18n_key: the-pain-of-java-8-lambda
categories:
  - Computer Science
  - Java
tags:
  - Java
  - Lambda
date: 2020-04-15 01:00:00
---

I was recently doing performance optimization for [booster-task-analyser](https://github.com/didi/booster/blob/master/booster-task-analyser) and found myself missing *Java*. So I tried writing something in *Java* again, but it felt painful -- especially `try-catch` inside *lambda* expressions. What should be a one-liner bloats into six lines. (This is exactly how productivity dies.) I started wondering: can we make *Java 8* lambdas less miserable?

## Unchecked Exception

In *Java*, only two types of *Throwable* don't require a `try-catch`:

1. `RuntimeException`

  The *Java* designers considered *RuntimeException* to be the programmer's fault, so catching it isn't mandatory.

1. `Error`

  The *Java* designers considered *Error* to be the most severe kind of exception -- typically unrecoverable with no way to handle it. Catching it wouldn't help.

Based on this reasoning, can we make lambdas throw `RuntimeException` whenever a checked exception would otherwise need catching?

As it happens, *Java 8* introduced `UncheckedIOException` in the *JDK* specifically to make *Lambda* usage more convenient in the *Stream API*. For example:

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

While *UncheckedIOException* solves the problem, it still feels clunky. So I wondered: can we make this more concise?

## Rolling Our Own

Consider this code:

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

Wouldn't it be nice to write it like this instead (even with a minor difference)?

```java
public void cat(Collection<File> files) {
    files.stream()
            .map(file -> Files.readString(file.toPath()))
            .forEach(System.out::println);
}
```

What if we wrap the lambda in another layer? Something like this would work:

```java
public void cat(Collection<File> files) {
    files.stream()
            .map(file -> unchecked(() -> Files.readString(file.toPath())}))
            .forEach(System.out::println);
}
```

A few extra parentheses, sure, but much cleaner than the original. So how do we make this wrapper work for all cases?

### Methods with Return Values

Since *Java 8* supports *Functional Interfaces*, methods with return values can be defined as:

```java
@FunctionalInterface
public interface Procedure<R, E extends Throwable> {

    R invoke() throws E;

}
```

Then wrap the lambda with this method:

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

### Methods without Return Values

Methods without return values can be defined as:

```java
@FunctionalInterface
public interface Block<E extends Throwable> {

    void invoke() throws E;

}
```

Then wrap the lambda with this method:

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

OK, done! Not a bad little wheel to reinvent.

## Verbose Variable Declarations

After getting used to *Kotlin*, going back to *Java* makes everything feel verbose. So I thought: can we shorten *Java*'s variable declarations too? Thinking of *jQuery*'s `$()` pattern in *JavaScript*, and since `$` is a legal identifier in *Java*, let's build another utility:

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

Now in the *Java* world, we can play like *JavaScript*:

```java
$(new File("..."), (f) -> {

});
```

If you're interested in this little utility, check it out here: [lambda-support](https://github.com/johnsonlee/lambda-support)
