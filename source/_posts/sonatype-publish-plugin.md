---
title: 一行搞定开源库发布到 Maven Central
date: 2021-10-07 10:00:00
categories: Gradle
tags:
  - Android
  - Java
  - Maven
---

发布过开源库的同学肯定深有感触，想要将一个开源库发布到 __Maven Central__ 对于开发者来说并不简单，尤其是通过 [Sonatype](https://oss.sonatype.org/) 来发布，需要满足一系列的[条件](https://central.sonatype.org/publish/requirements/)，而且对于 __Gradle__ 工程来说，尽管都是用 `maven-publish` 插件来进行发布，但不同的类型的工程，其发布所需的配置还有些不太一样，比如：__Gradle Plugin__，__Androdi Library__ 和 __Java Library__，尤其是多模块的 __Gradle__ 工程，要为每个模块写一堆看起来相似又不完全相同的 __DSL__ 很是麻烦，而且 __Gradle__ 的 __DSL__ 对于新手来说，简直是一脸懵逼。

## Sonatype

[Sonatype](https://oss.sonatype.org/) 提供了自动同步到 __Maven Central__ 的功能，但想要往 [Sonatype](https://oss.sonatype.org/) 上发布开源库，需要先要经过一系列的步骤：

1. [申请账号](https://issues.sonatype.org/secure/Signup!default.jspa)
1. 提交[新建项目](https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134)的 __JIRA__ 工单
1. 回复第 2 步提交的 JIRA 工单，证明 __groupId__ 对应的域名空间是有管理权限的
1. 生成 GPG 密钥
1. 然后配置 __Gradle__ 工程，保证上传的内容满足以下[条件](https://central.sonatype.org/publish/requirements/)
  - 源代码 __JAR__ 文件
  - __Javadoc JAR__ 文件
  - __POM__ 文件，包含以下内容
    - __Maven__ 坐标
      - __groupId__
      - __artifactId__
      - __version__
    - 项目信息
      - __name__
      - __description__
      - __url__
    - 开源许可信息
    - 开发者信息
    - __SCM__（源代码管理）信息
  - 上述每个文件对应的签名（__.asc__）文件

其中，前 4 步是一次性的工作，而最后一步是每个项目都要涉及到的。

## Java/Kotlin Library 工程

__Java/Kotlin Library__ 的 `publishing` 配置最简单，大致需要 3 步：

1. 为 __sources__ 和 __javadoc__ 创建相应的 __JAR Task__， 如果是 __Kotlin__ 工程，则需要通过 [Kotlin/dokka](https://github.com/Kotlin/dokka) 来生成 __Javadoc__
1. 在 `publications` 中注册一个名字为 __mavenJava__ 的 `MavenPublication`
1. 为 __mavenJava__ 签名

完整的示例如下所示：

```kotlin
project.run {
  val sourceSets = the<SourceSetContainer>()
  val javadocJar = tasks.register("packageJavadocFor${name.capitalize()}", Jar::class.java) {
    archiveClassifier.set("javadoc")
    from(tasks["dokkaHtml"])
  }
  val sourcesJar = tasks.register("packageSourcesFor${name.capitalize()}", Jar::class.java) {
    dependsOn(JavaPlugin.CLASSES_TASK_NAME)
    archiveClassifier.set("sources")
    from(sourceSets["main"].allSource)
  }

  publishing {
    repositories {
      maven {
        url = uri("https://oss.sonatype.org/service/local/staging/deploy/maven2/")
      }
    }
    publications {
      register("mavenJava", MavenPublication::class) {
        groupId = "${project.group}"
        artifactId = project.name
        version = "${project.version}"

        from(components["java"])

        artifact(sourcesJar.get())
        artifact(javadocJar.get())

        pom.withXml {
          asNode().apply {
            appendNode("name", project.name)
            appendNode("url", "https://github.com/johnsonlee/${project.name}")
            appendNode("description", project.description ?: project.name)
            appendNode("scm").apply {
              appendNode("connection", "scm:git:git://github.com/johnsonlee/${project.name}.git")
              appendNode("developerConnection", "scm:git:git@github.com:johnsonlee/${project.name}.git")
              appendNode("url", "https://github.com/johnsonlee/${project.name}")
            }
            appendNode("licenses").apply {
              appendNode("license").apply {
                appendNode("name", "Apache License")
                appendNode("url", "http://www.apache.org/licenses/LICENSE-2.0")
              }
            }
            appendNode("developers").apply {
              appendNode("developer").apply {
                appendNode("id", "johnsonlee")
                appendNode("name", "Johnson Lee")
                appendNode("email", "g.johnsonlee@gmail.com")
              }
            }
          }
        }
      }
    }
  }

  signing {
    sign(publishing.publications["mavenJava"])
  }
}
```

## Android Library 工程

与 __Java/Kotlin Library__ 不同，__Android Library__ 需要根据不同的 __variant__ 来生成 __sources__ 和 __javadoc__ 对应的 __JAR__，必要的情况下，还需要为每个 __variant__ 发布一个 __AAR__，一般是通过 `android.libraryVariants` 来遍历所有的 `variant`：

```kotlin
val android = extensions.getByName("android") as LibraryExtension

android.libraryVariants.forEach { variant ->
  // 为每个 variant 注册 MavenPublication
}
```

但由于 `libraryVariants` 的配置是 __lazy__ 模式，所以，需要在 `project.afterEvaluate` 回调中执行，完整的代码如下：

```kotlin
project.run {
  val android = extensions.getByName("android") as LibraryExtension

  afterEvaluate {
    publishing {
      publications {
        android.libraryVariants.forEach { variant ->
          val javadoc = tasks.register("javadocFor${variant.name.capitalize()}", Javadoc::class.java) {
            dependsOn("dokkaHtml")
            source(android.sourceSets["main"].java.srcDirs)
            classpath += files(android.bootClasspath + variant.javaCompileProvider.get().classpath)
            exclude("**/R.html", "**/R.*.html", "**/index.html")
          }

          val javadocJar = tasks.register("packageJavadocFor${variant.name.capitalize()}", Jar::class.java) {
            dependsOn(javadoc)
            archiveClassifier.set("javadoc")
            from(tasks["dokkaHtml"])
          }

          val sourcesJar = tasks.register("packageSourcesFor${variant.name.capitalize()}", Jar::class.java) {
            archiveClassifier.set("sources")
            from(android.sourceSets["main"].java.srcDirs)
          }

          create(variant.name, MavenPublication::class.java) {
            groupId = project.group
            artifactId = project.name
            version = project.version
            from(components[variant.name])
            artifact(javadocJar)
            artifact(sourcesJar)

            pom.withXml {
              asNode().apply {
                appendNode("name", project.name)
                appendNode("url", "https://github.com/johnsonlee/${project.name}")
                appendNode("description", project.description ?: project.name)
                appendNode("scm").apply {
                  appendNode("connection", "scm:git:git://github.com/johnsonlee/${project.name}.git")
                  appendNode("developerConnection", "scm:git:git@github.com:johnsonlee/${project.name}.git")
                  appendNode("url", "https://github.com/johnsonlee/${project.name}")
                }
                appendNode("licenses").apply {
                  appendNode("license").apply {
                    appendNode("name", "Apache License")
                    appendNode("url", "http://www.apache.org/licenses/LICENSE-2.0")
                  }
                }
                appendNode("developers").apply {
                  appendNode("developer").apply {
                    appendNode("id", "johnsonlee")
                    appendNode("name", "Johnson Lee")
                    appendNode("email", "g.johnsonlee@gmail.com")
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  signing {
    sign(publishing.publications)
  }
}
```

## Gradle Plugin 工程

__Gradle__ 官方提供了 `java-gradle-plugin` 用来生成 __Gradle Plugin__ 相关的 __POM__ 文件，但其中的内容只包含了 __Maven__ 坐标信息和基本的工程信息，根据不能满足 [Sonatype](https://oss.sonatype.org/) 的要求，要想发布到 [Sonatype](https://oss.sonatype.org/)，还需要开发者自己来手动配置，但如何对 `java-gradle-plugin` 生成的 __POM__ 进行修改，__Gradle__ 官方并没有提供相应的文档，其实并不难，只是跟前面的 __Java/Kotlin Library__ 和 __Android Library__ 都不一样，因为 `java-gradle-plugin` 已经自动创建了 `MavenPublication` 了，所以，并不需要再次创建或者注册 `MavenPublication` 只需要遍历一下，然后为 __POM__ 追加上必要的信息就行了，完整的代码如下：

```kotlin
project.run {
  publishing {
    publications {
      val sourceSets = the<SourceSetContainer>()
      val javadocJar = tasks.register("packageJavadocFor${name.capitalize()}", Jar::class.java) {
          dependsOn("dokkaHtml")
          archiveClassifier.set("javadoc")
          from(tasks["dokkaHtml"])
      }
      val sourcesJar = tasks.register("packageSourcesFor${name.capitalize()}", Jar::class.java) {
          archiveClassifier.set("sources")
          from(sourceSets["main"].allSource)
      }

      withType<MavenPublication>().configureEach {
        groupId = "${project.group}"
        version = "${project.version}"
        artifact(javadocJar)
        artifact(sourcesJar)
      }
    }
  }

  signing {
    sign(publishing.publications)
  }
}
```

## 一劳永逸

在看了上面针对不同类型的工程配置 `publishing` 后，发现，其实大部分代码都是类似的，如果是一个多模块的工程，配置起来就比较麻烦了，有的模块是需要发布的，有的模块是不需要发布的，通过 `allprojects` 或者 `subprojects` 来配置也不简单，既然大部分代码相似，能不能让整个配置更简单一些呢？答案是 —— 必须有！这就是 [sonatype-publish-plugin](https://github.com/johnsonlee/sonatype-publish-plugin) 的初衷，真的就一行代码搞定：

```kotlin
plugins {
  id("io.johnsonlee.sonatype-publish-plugin") version "1.2.0"
}
```

开发者只需要配置好相应的环境变量就可以通过命令直接上传了：

```bash
./gradlew clean publishToSonatype \
    -POSSRH_USERNAME=johnsonlee \
    -POSSRH_PASSWORD=********** \
    -POSSRH_PACKAGE_GROUP=io.johnsonlee
```

待上传到 [Sonatype](https://oss.sonatype.org/) 的 __staging__ 仓库后，然后通过如下命令来发布到正式仓库：

```bash
./gradlew closeAndReleaseRepository \
    -POSSRH_USERNAME=johnsonlee \
    -POSSRH_PASSWORD=********** \
    -POSSRH_PACKAGE_GROUP=io.johnsonlee
```

发布成功后，便可以在 [Maven Central](https://search.maven.org/search) 上搜索到了，关于详细介绍，请参阅[项目介绍](https://github.com/johnsonlee/sonatype-publish-plugin)。
