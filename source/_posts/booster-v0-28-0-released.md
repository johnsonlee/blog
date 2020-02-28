---
title: Booster v0.28.0 发布
date: 2019-12-29 22:32:11
categories: Booster
tags:
  - booster
---

v0.28.0 版本更新内容：

1. 解决 transform 过程中个别 JAR 存在重复的 *Zip Entry* 导致编译失败的问题[^1]

  国内很多 APP 都用到了 *pinyin4j* 这个库，以 [pinyin4j-0.25.0](https://repo1.maven.org/maven2/com/belerweb/pinyin4j/2.5.0/pinyin4j-2.5.0.jar) 为例：

  ```bash
  unzip -l pinyin4j-2.5.0.jar | head -n -2 | tail -n +4 | awk '{print $NF}' | sort | uniq -c
  ```

  结果如下：

  ```bash
         2 META-INF/maven/com.belerweb/pinyin4j/pom.properties
         2 META-INF/maven/com.belerweb/pinyin4j/pom.xml
  ```

  当 booster 在对 *pinyin4j-2.5.0.jar* 进行 transform 的过程中重新创建 *JAR* 文件时，会调用 [JarOutputStream#putNextEntry(ZipEntry)](https://docs.oracle.com/javase/8/docs/api/java/util/jar/JarOutputStream.html#putNextEntry-java.util.zip.ZipEntry-) ，所以，当 transform 到第 2 个 `META-INF/maven/com.belerweb/pinyin4j/pom.xml` 时抛出：

  ```
  java.util.zip.ZipException: duplicate entry: META-INF/maven/com.belerweb/pinyin4j/pom.xml
  ```

----

[^1]: https://github.com/didi/booster/issues/119

