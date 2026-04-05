---
title: 坚决反对 DSL
categories:
  - Computer Science
  - Architecture Design
tags:
  - Gradle
  - java-gradle-plugin
date: 2020-10-28 23:30:00
i18n_key: against-dsl
---

最近在撸一个测试 *Gradle Plugin* 的 *Plugin* -- [bootstage/testkit-gradle-plugin](https://github.com/bootstage/testkit-gradle-plugin)，由于跑 *Gradle Plugin* 的 *Unit Test* 必须要使用 *Gradle* 的 `plugins` DSL 来启用插件，所以，万般无奈之下，只好用了 *Gradle* 官方推荐的最佳实践，结果掉进了坑里。

## Gradle Plugin Portal

*Gradle* 官方搞了一个 [Gradle Plugin Portal](https://plugins.gradle.org/) ，类似于 *App Store* ，开发者可以通过 `java-gradle-plugin` 直接发布 *Gradle* 插件到 [Gradle Plugin Portal](https://plugins.gradle.org/)，这样方便开发者通过关键字搜索，也利于插件的推广，想法是很不错的，但使用下来，我最终还是放弃了，原因是既不成熟，也不稳定，第一个版本 [testkit-gradle-plugin v0.1.0](https://plugins.gradle.org/plugin/io.bootstage.testkit) 在 [Gradle Plugin Portal](https://plugins.gradle.org/) 算是发布成功了，但是，在发布 `1.0.0` 是，因为网络超时，发布失败之后，尝试重新发布却报错：`1.0.0` 版本已经存在了。

之前一直对 *Sonatype* 的控制台加载太慢而耿耿于怀，一度有想换一个 *maven* 托管服务，尝试用了下 [bintray](https://bintray.com/)，捣鼓了好久也没成功发布成功，最终还是放弃了。经历过一次次的伤害后，终于发现 *Sonatype* 的好了，最终还是选择发布到 *Sonatype* 上，按照常规的 `publishing` 配置方式：

```kotlin
publishing {
    repositories {
        maven {
            url = uri("https://oss.sonatype.org/service/local/staging/deploy/maven2/")
        }
    }
    publications {
        create<MavenPublication>("mavenJava") {
            groupId = "${project.group}"
            artifactId = project.name
            version = "${project.version}"

            from(components["java"])

            artifact(sourcesJar.get())
            artifact(generateJavadoc.get())

            pom {
                ...
            }
        }
    }
}

signing {
    sign(publishing.publications["mavenJava"])
}
```

用 `publishToMavenLocal` 测试了一下本地发布没啥问题，就直接往 *Sonatype* 发布了，结果 *Sonatype* 在校验 *pom* 文件的签名时，报错: `BAD Signature`，把上传的 *pom* 和 *pom.asc* 文件都下载下来在本地用 *gpg* 校验了一下:

```bash
gpg --verify ~/Downloads/testkit-gradle-plugin-1.0.0.pom.asc
```

果然还是报：

```
gpg: BAD signature from "Johnson Lee <g.johnsonlee@gmail.com>" [ultimate]
```

打开 *pom* 文件一看，发现自定义的一些 *pom* 属性一个也没有，看来是被覆盖了，尝试注释掉 `java-gradle-plugin` 这个插件，*pom* 文件就正常了，但带来的问题是——发布的插件不支持 `plugins` DSL ，只好给 *Gradle* 官方提了个 issue: https://github.com/gradle/gradle/issues/14993, 结果第二天就回复了，原来是 `java-gradle-plugin` 会自动生成 `Publication` ，所以，用常规的配置方式就不好使了，得用 *java-gradle-plugin* 生成的 `Publication`，然后改成了这样：

```kotlin
publishing {
    repositories {
        maven {
            url = uri("https://oss.sonatype.org/service/local/staging/deploy/maven2/")
        }
    }
    publications {
        withType<MavenPublication>().configureEach {
            groupId = "${project.group}"
            artifactId = project.name
            version = "${project.version}"

            artifact(sourcesJar.get())
            artifact(javadocJar.get())

            pom {
                ...
            }

            signing {
                sign(this@configureEach)
            }
        }
    }
}
```

本地发布了一把，果然好使了，自定义的 *pom* 属性都有了，再次发布到 *Sonatype* ，结果又报错了：

```
Invalid POM: /io/bootstage/testkit/io.bootstage.testkit.gradle.plugin/1.2.0/io.bootstage.testkit.gradle.plugin-1.2.0.pom: Project name missing, Project description missing
```

结果打开本地的 *pom* 一看，`java-gradle-plugin` 生成的 `io.bootstage.testkit.gradle.plugin` 果然没有 `name` 和 `description`，突然想到 `java-gradle-plugin` 的 `gradlePlugin` DSL，看了一下 API，发现有个 `displayName` 和 `description`，于是抱着死马当活马医的心态试了一把，结果居然被我蒙对了 🤣

```kotlin
gradlePlugin {
    plugins {
        create("testkitPlugin") {
            id = "io.bootstage.testkit"
            displayName = "${id}.gradle.plugin"
            description = project.description
            implementationClass = "io.bootstage.testkit.gradle.TestKitPlugin"
        }
    }
}
```

终于可以发布一个完整的插件，心好累。。。最近被 *Gradle* 坑得太惨了。。。

## DSL

我们在写 *Gradle* 脚本的时候，每集成一个插件，都要或多或少的写一些 DSL 来配置工程，可是对于使用者来说，我怎么知道每个插件都提供了哪些 DSL？难道我用之前要先看一遍 API 文档，我只是想加几行配置而已！

而且一旦遇到复杂的情况，插件之间要相互协作的时候，DSL 怎么使用，就只能连蒙带猜了，就像前面的 `java-gradle-plugin` 跟 `maven-publish` 之间有冲突问题，要不是 *Gradle* 团队的人，或者之前有遇到过这种问题的人，怎么可能知道解决方案，只能去看源码了。

> 我只是想写个配置脚本而已！！！

为了加几行代码要翻一遍源码，我还不如放弃算了。这也是为什么，[Booster](https://github.com/didi/booster) 项目自始至终不支持 DSL 的原因，因为完全没有必要，能一行代码搞定的事情，绝对不用两行，如何让使用者以最低成本上手应该是每个开发者都要思考的问题。