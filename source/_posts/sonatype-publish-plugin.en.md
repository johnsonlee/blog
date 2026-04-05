---
title: Publish to Maven Central in One Line
categories:
  - Computer Science
  - Gradle
tags:
  - Android
  - Java
  - Maven
date: 2021-10-07 10:00:00
lang: en
i18n_key: sonatype-publish-plugin
---

Anyone who has published an open source library knows the pain: getting a library published to __Maven Central__ through [Sonatype](https://oss.sonatype.org/) is far from simple. You need to meet a long list of [requirements](https://central.sonatype.org/publish/requirements/), and for __Gradle__ projects, even though everything uses the `maven-publish` plugin, the configuration differs across project types -- __Gradle Plugin__, __Android Library__, and __Java Library__ all have their quirks. In a multi-module __Gradle__ project, writing nearly identical but subtly different __DSL__ blocks for each module is tedious, and __Gradle__'s __DSL__ can be bewildering for newcomers.

## Sonatype

[Sonatype](https://oss.sonatype.org/) provides automatic syncing to __Maven Central__, but publishing to it requires several steps:

1. [Register an account](https://issues.sonatype.org/secure/Signup!default.jspa)
1. Submit a [new project](https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134) __JIRA__ ticket
1. Reply to the JIRA ticket from step 2 to prove you have admin access to the domain namespace corresponding to your __groupId__
1. Generate a GPG key
1. Configure your __Gradle__ project so that uploaded artifacts satisfy the following [requirements](https://central.sonatype.org/publish/requirements/):
  - Sources __JAR__ file
  - __Javadoc JAR__ file
  - __POM__ file containing:
    - __Maven__ coordinates
      - __groupId__
      - __artifactId__
      - __version__
    - Project information
      - __name__
      - __description__
      - __url__
    - License information
    - Developer information
    - __SCM__ (Source Code Management) information
  - A signature (__.asc__) file for each of the above

Steps 1-4 are one-time tasks. The last step is required for every project.

## Java/Kotlin Library Projects

The `publishing` configuration for __Java/Kotlin Library__ projects is the simplest, requiring roughly 3 steps:

1. Create __JAR Tasks__ for __sources__ and __javadoc__. For __Kotlin__ projects, use [Kotlin/dokka](https://github.com/Kotlin/dokka) to generate __Javadoc__
1. Register a `MavenPublication` named __mavenJava__ in `publications`
1. Sign __mavenJava__

Here is a complete example:

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

## Android Library Projects

Unlike __Java/Kotlin Library__ projects, __Android Library__ projects need to generate __sources__ and __javadoc__ JARs for each __variant__. When necessary, you also need to publish an __AAR__ for each __variant__. This is typically done by iterating over all variants via `android.libraryVariants`:

```kotlin
val android = extensions.getByName("android") as LibraryExtension

android.libraryVariants.forEach { variant ->
  // Register a MavenPublication for each variant
}
```

Since `libraryVariants` is configured lazily, this must be executed inside a `project.afterEvaluate` callback. The complete code looks like this:

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

## Gradle Plugin Projects

Gradle officially provides `java-gradle-plugin` for generating __Gradle Plugin__-related __POM__ files, but its output only includes __Maven__ coordinates and basic project info -- nowhere near enough for [Sonatype](https://oss.sonatype.org/)'s requirements. Developers need to configure the rest manually, but Gradle's official documentation doesn't explain how to modify the __POM__ generated by `java-gradle-plugin`. It's actually not hard -- just different from __Java/Kotlin Library__ and __Android Library__ projects. Since `java-gradle-plugin` already creates `MavenPublication` instances automatically, you don't need to create or register new ones. Just iterate over the existing ones and append the required POM information. The complete code:

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

## Once and for All

After looking at the `publishing` configurations for different project types above, you'll notice that most of the code is nearly identical. In a multi-module project, this becomes a real hassle -- some modules need to be published and others don't, and using `allprojects` or `subprojects` doesn't simplify things much. Since the code is so similar, can we make the whole thing simpler? The answer is yes -- and that's exactly what [sonatype-publish-plugin](https://github.com/johnsonlee/sonatype-publish-plugin) was built for. It truly takes just one line:

```kotlin
plugins {
  id("io.johnsonlee.sonatype-publish-plugin") version "1.3.0"
}

group = "io.johnsonlee"
version = "1.0.0"
```

Just configure the appropriate environment variables and you can upload directly via command line:

```bash
./gradlew clean publishToSonatype \
    -POSSRH_USERNAME=johnsonlee \
    -POSSRH_PASSWORD=********** \
    -POSSRH_PACKAGE_GROUP=io.johnsonlee \
    -Psinging.keyId=xxxxxxxx \
    -Psinging.password=******** \
    -Psinging.secretKeyRingFile=/Users/johnsonlee/.gnupg/secring.gpg
```

After uploading to [Sonatype](https://oss.sonatype.org/)'s __staging__ repository, publish to the release repository with:

```bash
./gradlew closeAndReleaseRepository \
    -POSSRH_USERNAME=johnsonlee \
    -POSSRH_PASSWORD=********** \
    -POSSRH_PACKAGE_GROUP=io.johnsonlee
```

Once published, you can find it on [Maven Central](https://search.maven.org/search). For more details, see the [project page](https://github.com/johnsonlee/sonatype-publish-plugin).

The plugin also supports publishing to private Nexus repositories, such as a company's internal Nexus server. Just configure these properties or environment variables:

* `NEXUS_URL`
* `NEXUS_USERNAME`
* `NEXUS_PASSWORD`

Then publish to your private Nexus repository with:

```bash
./gradlew clean publish \
    -PNEXUS_URL=http://nexus.johnsonlee.io/ \
    -PNEXUS_USERNAME=johnsonlee \
    -PNEXUS_PASSWORD=**********
```
