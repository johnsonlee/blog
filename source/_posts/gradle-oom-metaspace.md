---
title: Gradle OOM 问题
categories:
  - Computer Science
  - Gradle
tags:
  - AGP
date: 2020-10-27 00:00:00
---

最近在准备 [Booster](https://github.com/didi/booster) 的 `v3.0.0` 发布前的测试，为了保证 [Booster](https://github.com/didi/booster) 的质量，对 *Android Gradle Plugin* 从 `3.0.0` 到 `4.1.0` 挨个版本进行了适配，并写了大量的集成测试，在跑测试用例的过程中，刚开始跑 *debug* 的构建测试用例一切挺顺利的，后来脑子一抽，把 *release* 构建也加上吧，没想到，整个测试用例就卡在 *Android Gradle Plugin* `3.5.0` 的用例上不动了，试了很多次，也一直这样，后来一看，原来已经是 *OOM* 了，还 dump 了一堆 *hprof* 文件，看了一下 *JUnit* 的测试报告才发现，原来是 *Metaspace* 爆了。

```
org.gradle.testkit.runner.UnexpectedBuildFailure: Unexpected build execution failure in /var/folders/dy/bxzw01fx3bv9xmsmyy77qgx80000gp/T/junit1018081279555935171 with arguments [assemble, -S, -Pbooster_version=2.4.0, -Pandroid_gradle_version=3.5.0, -Pcompile_sdk_version=28, -Pbuild_tools_version=26.0.3, -Pmin_sdk_version=18, -Ptarget_sdk_version=26]

Output:
> Task :buildSrc:compileJava NO-SOURCE
> Task :buildSrc:compileGroovy NO-SOURCE
> Task :buildSrc:processResources
> Task :buildSrc:classes
> Task :buildSrc:jar
> Task :buildSrc:assemble
> Task :buildSrc:compileTestJava NO-SOURCE
> Task :buildSrc:compileTestGroovy NO-SOURCE
> Task :buildSrc:processTestResources NO-SOURCE
> Task :buildSrc:testClasses UP-TO-DATE
> Task :buildSrc:test NO-SOURCE
> Task :buildSrc:check UP-TO-DATE
> Task :buildSrc:build

> Configure project :
file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-v3_5/build/classes/java/main/
file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-v3_5/build/classes/kotlin/main/
file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-v3_5/build/tmp/kapt3/classes/main/
file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-v3_5/build/resources/main
file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-compat/build/libs/booster-android-gradle-compat-3.0.0-SNAPSHOT.jar
file:/Users/johnsonlee/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-reflect/1.3.61/2e07c9a84c9e118efb70eede7e579fd663932122/kotlin-reflect-1.3.61.jar
file:/Users/johnsonlee/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib/1.3.61/4702105e97f7396ae41b113fdbdc180ec1eb1e36/kotlin-stdlib-1.3.61.jar
file:/Users/johnsonlee/.gradle/caches/modules-2/files-2.1/org.jetbrains.kotlin/kotlin-stdlib-common/1.3.61/65abb71d5afb850b68be03987b08e2c864ca3110/kotlin-stdlib-common-1.3.61.jar
file:/Users/johnsonlee/.gradle/caches/modules-2/files-2.1/org.jetbrains/annotations/13.0/919f0dfe192fb4e063e7dacadee7f8bb9a2672a9/annotations-13.0.jar
file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-v3_5/build/classes/kotlin/integrationTest/
WARNING: The specified Android SDK Build Tools version (26.0.3) is ignored, as it is below the minimum supported version (28.0.3) for Android Gradle Plugin 3.5.0.
Android SDK Build Tools 28.0.3 will be used.
To suppress this warning, remove "buildToolsVersion '26.0.3'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools.

> Task :preBuild UP-TO-DATE
> Task :preCnDebugBuild UP-TO-DATE
> Task :compileCnDebugAidl NO-SOURCE
> Task :compileCnDebugRenderscript NO-SOURCE
> Task :checkCnDebugManifest
> Task :generateCnDebugBuildConfig
> Task :mainApkListPersistenceCnDebug
> Task :generateCnDebugResValues
> Task :generateCnDebugResources
> Task :createCnDebugCompatibleScreenManifests
> Task :processCnDebugManifest
> Task :mergeCnDebugShaders
> Task :compileCnDebugShaders
> Task :generateCnDebugAssets
> Task :mergeCnDebugAssets
> Task :processCnDebugJavaRes NO-SOURCE
> Task :checkCnDebugDuplicateClasses
> Task :validateSigningCnDebug
> Task :signingConfigWriterCnDebug
> Task :mergeCnDebugJniLibFolders
> Task :preCnReleaseBuild UP-TO-DATE
> Task :compileCnReleaseAidl NO-SOURCE
> Task :compileCnReleaseRenderscript NO-SOURCE
> Task :checkCnReleaseManifest
> Task :generateCnReleaseBuildConfig
> Task :mainApkListPersistenceCnRelease
> Task :generateCnReleaseResValues
> Task :generateCnReleaseResources
> Task :javaPreCompileCnRelease
> Task :createCnReleaseCompatibleScreenManifests
> Task :processCnReleaseManifest
> Task :prepareLintJar
> Task :mergeCnReleaseShaders
> Task :compileCnReleaseShaders
> Task :generateCnReleaseAssets
> Task :mergeCnReleaseAssets
> Task :processCnReleaseJavaRes NO-SOURCE
> Task :checkCnReleaseDuplicateClasses
> Task :signingConfigWriterCnRelease
> Task :mergeCnReleaseJniLibFolders
> Task :preEnDebugBuild UP-TO-DATE
> Task :compileEnDebugAidl NO-SOURCE
> Task :compileEnDebugRenderscript NO-SOURCE
> Task :checkEnDebugManifest
> Task :generateEnDebugBuildConfig
> Task :mergeCnDebugResources
> Task :processCnDebugResources
> Task :mainApkListPersistenceEnDebug
> Task :generateEnDebugResValues
> Task :generateEnDebugResources
> Task :mergeCnDebugNativeLibs
> Task :stripCnDebugDebugSymbols
> Task :createEnDebugCompatibleScreenManifests
> Task :processEnDebugManifest
> Task :checkEnDebugDuplicateClasses
> Task :mergeEnDebugShaders
> Task :compileEnDebugShaders
> Task :generateEnDebugAssets
> Task :mergeEnDebugAssets
> Task :processEnDebugJavaRes NO-SOURCE
> Task :validateSigningEnDebug
> Task :signingConfigWriterEnDebug
> Task :mergeEnDebugJniLibFolders
> Task :javaPreCompileCnDebug
> Task :compileCnDebugJavaWithJavac
> Task :compileCnDebugSources
> Task :transformClassesWithDexBuilderForCnDebug FAILED
> Task :mergeCnReleaseNativeLibs
> Task :mergeCnDebugJavaResource
> Task :mergeEnDebugNativeLibs
> Task :mergeCnReleaseResources
> Task :javaPreCompileEnDebug
> Task :mergeEnDebugResources
Daemon will be stopped at the end of the build after running out of JVM memory

FAILURE: Build failed with an exception.

* What went wrong:
Metaspace

* Try:
Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Exception is:
java.lang.OutOfMemoryError: Metaspace


* Get more help at https://help.gradle.org

BUILD FAILED in 24s

    at org.gradle.testkit.runner.internal.DefaultGradleRunner$2.execute(DefaultGradleRunner.java:255)
    at org.gradle.testkit.runner.internal.DefaultGradleRunner$2.execute(DefaultGradleRunner.java:251)
    at org.gradle.testkit.runner.internal.DefaultGradleRunner.run(DefaultGradleRunner.java:324)
    at org.gradle.testkit.runner.internal.DefaultGradleRunner.build(DefaultGradleRunner.java:251)
    at io.bootstage.testkit.gradle.rules.GradleExecutor.finished(GradleExecutor.kt:50)
    at org.junit.rules.TestWatcher.finishedQuietly(TestWatcher.java:117)
    at org.junit.rules.TestWatcher.access$400(TestWatcher.java:46)
    at org.junit.rules.TestWatcher$1.evaluate(TestWatcher.java:64)
    at org.junit.rules.TestWatcher$1.evaluate(TestWatcher.java:55)
    at org.junit.rules.TestWatcher$1.evaluate(TestWatcher.java:55)
    at org.junit.rules.ExternalResource$1.evaluate(ExternalResource.java:48)
    at org.junit.rules.RunRules.evaluate(RunRules.java:20)
    at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
    at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)
    at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)
    at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
    at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
    at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
    at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
    at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
    at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
    at org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.runTestClass(JUnitTestClassExecutor.java:110)
    at org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:58)
    at org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:38)
    at org.gradle.api.internal.tasks.testing.junit.AbstractJUnitTestClassProcessor.processTestClass(AbstractJUnitTestClassProcessor.java:62)
    at org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.processTestClass(SuiteTestClassProcessor.java:51)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)
    at org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)
    at org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)
    at org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)
    at com.sun.proxy.$Proxy2.processTestClass(Unknown Source)
    at org.gradle.api.internal.tasks.testing.worker.TestWorker.processTestClass(TestWorker.java:118)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
    at java.lang.reflect.Method.invoke(Method.java:498)
    at org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)
    at org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)
    at org.gradle.internal.remote.internal.hub.MessageHubBackedObjectConnection$DispatchWrapper.dispatch(MessageHubBackedObjectConnection.java:182)
    at org.gradle.internal.remote.internal.hub.MessageHubBackedObjectConnection$DispatchWrapper.dispatch(MessageHubBackedObjectConnection.java:164)
    at org.gradle.internal.remote.internal.hub.MessageHub$Handler.run(MessageHub.java:412)
    at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
    at org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:48)
    at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
    at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
    at org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:56)
    at java.lang.Thread.run(Thread.java:748)
```

## Gradle 测试

跑 *Gradle* 插件测试需要引到 [Gradle TestKit](https://docs.gradle.org/current/userguide/test_kit.html)，每个 `@Test` 方法前都会动态创建一个 *Android Gradle* 工程，然后在 `@Test` 方法后会调用 *Gradle Runner* 去执行 *assemble* 这个任务，`@Test` 方法体中可以操作这个动态生成的 *Android Gradle* 工程，例如：

```kotlin
private const val MIN_SDK_VERSION = 18
private const val TARGET_SDK_VERSION = 30
private val AGP = V30

private val ARGS = arrayOf(
        "assemble", "-S",
        "-Pbooster_version=${Build.VERSION}",
        "-Pandroid_gradle_version=3.0.0",
        "-Pcompile_sdk_version=28",
        "-Pbuild_tools_version=26.0.3",
        "-Pmin_sdk_version=${MIN_SDK_VERSION}",
        "-Ptarget_sdk_version=${TARGET_SDK_VERSION}"
)

@Suppress("RemoveCurlyBracesFromTemplate", "FunctionName")
abstract class V30IntegrationTest(val isLib: Boolean) {

    private val projectDir = TemporaryFolder()

    @get:Rule
    val ruleChain: TestRule = rule(projectDir) {
        rule(LocalProperties(projectDir::getRoot)) {
            rule(TestCaseConfigure(projectDir::getRoot)) {
                GradleExecutor(projectDir::getRoot, "4.1", *ARGS)
            }
        }
    }

    @Before
    fun setup() {
        projectDir.copyFromResource("${if (isLib) "lib" else "app"}.gradle", "build.gradle")
        projectDir.copyFromResource("buildSrc")
        projectDir.copyFromResource("src")
    }

    @Test
    @Case(ScopeFullWithFeaturesTest::class)
    fun `test AGPInterface#scopeFullWithFeatures`() {
    }

}

class V30AppIntegrationTest : V30IntegrationTest(false)

class V30LibIntegrationTest : V30IntegrationTest(true)

```

## Gradle Runner

*Gradle Runner* 在执行测试构建任务的时候，会新启一个 `GradleDaemon` 进程，默认 *Gradle Runner* 会在 `$TMPDIR` 目录下创建一个类似于 `~/.gradle` 的目录，用来存放缓存文件，刚开始出现 *OOM* 的时候，以为与 *Gradle Runner* 有关，后来，重新设置了 *Gradle Runner* 的目录，*OOM* 依然存在。

## Profiling

*OOM* 发生在 *Metaspace* ，大概率跟 *class* 的加载有关，于是用 *VisualVM* 对 *Gradle Runner* 的 *GradleDaemon* 进程进行分析，发现 *Metaspace* 的内存涨幅很不可思议，执行到第三个测试用例就 *OOM* 了：

![Metaspace OOM](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABBcAAAJqCAMAAABHDlgmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURf///8/x/Lvr+q/n+fLy8vX19cbv/Pb29vPz8/T09PX29d72/uD3/tz2/sjv/Ob5/8Tu+8Ht+8vw/Nn1/eX4/+T4/+L3/uD2/tHy/NDy/Mzw/Nj1/df0/b7s+9Pz/NXz/cfv/K3n+OH3/t/2/t32/uP4/9Ly/Nb0/c7x/L3s+6jl+Mnv/LLo+bjq+qrm+Lbp+sPu+7nq+rTp+cDt+7Po+dv2/c3x/Kvm+Mrv/Lfq+qnm+PfUprDn+cLu+83w/K7n+dj0/dr1/bzs+rrr+uf5/9Tz/b/t+6zn+Kfl+LHo+fbUpcXu+1BbX1FbX/bTpLrq+vj4+LXp+eP4/tTz/NLz/M/y/E5bX8rw/MXv/MLt+7/s+9r2/dX0/WVlZbzr+u7u7rfp+rXp+rTo+bHn+ffVqIuLi/bTpcfHxyS03vOkL9fY2FJbYKbl+AAAAPW9bfTMmMfa4LzX37LT3vndt6bP3LfU38HY36HO26zR3frfumnN65zM25bFxNm9l9bW1vvlxvjZrvjWqv7+/vrhvvz9/bu8vPfYrKampvr6+oKCgvnbs/vnyqmrq9ra2pqbm+fo5+3t7X18fNPU1EpKSmlpaezs7OTl5Q8PD3d6e7CwsK/S3WZtb21tbbbU3qGhoWpzdvOmNODh4dHR0arQ3fvjw57N20lQUrvW3x4eHoiIhyi231ZhZCkpKTw8PMrb4MbZ4Onp6sXFxZaXlzi64fbGgVdXV+vr656enpGRkcTY4PbQm/SqP19pbLnV37e4uL/Y33Z2dnzT7/Hx8fSwTJjM23uDhYqSlENDQ/rpz97e38rMzTMzM/bCeXJyclnG54rZ8WBgYEnB5Zjf9b2+vkO73XXQ7S+44M3b4PS0V1i+2fXv58DBwt7PsIOLjc7Pzn/I167Hv/Lcu/HiyPbr3MfOt5uho5vY6/W4YvbJjJbM0WvD2JrP1XfBz6Pi9vXy7trYwefTr9vEpMbMype5wKnPzLvUzOLi0vHYsvPVqtSWOzGhwtirbdi3i7ekiUiqyHSJjU7nOHoAACAASURBVHja7J1fa+JKGMbnYkt299P1C0iuRBDer9CLYokF/9W0mQ2IoBclhQgqpPUqlN4EDQXBy4Kf5cwkmfyx6dn20IPp7vPbg7bvzOyF8/j0ndn6HMYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgC9L4KPX/gQYA4PjkfEH7IHX906lrAICjA18AAHy6L9An/oEvAIB+4QCCLwDwJ/gC4RwBAHwB/QIAfyI3jc5y2dnc/Isv2NGX4+a7+4VOz5JPdg/9AgBfkYm9fBgb454/edsXZr/kI3Xe3S/M6EE8WpQdK5pD9AsAfBUGds+IGPuDT/CFxAhm3BSPY575wu0z+gUAvgr7nsH2hrFnxnj6Dl+wPO7uNG0ZcFMM15aP3LXL+oVrauq6ORK+sBYrfP2OxER9JZa96PrO5E5X17erZ+52dFVd1xwK1Xz0CwAcEXts7M/34j/DuHjbF8wHgfQF8/q+F4pV+6ftVtMCZzW95j9K+oWxU9eb3BbfmrXJ0tUtc7Tu651Gf+uJ0dVg2Nf1wKk3avxeVU3H7m/UfPQLAByRsSGbBdkyGJ23fSEcCYQvdMkebii6ieg5wheuNK1Pi5J+YXwV6vVrn/QpdTYL6qbniKUjDMGMLhuCX6I7oF1SndJKfqXmo18AoAq+0LF/f47Y0SwIgoVmz8JQ+sKdKPNlWb+woY27E77g00xwEftCRy7T9aFJj7JfuBQlvkqqPi3kSjUf/QIAx8M31DnCfvm9LzQpOmzIp3HiCxbZZf2CHpquHvULdlTxhC/sydcfHPndhbCDyBfW1EmqU1rG/YKNf48A4MhMjU5872j7zd/7gmaaXW1wIxr9SY0LXzDnP+r8pqxf0Ot0J31BN4Ohbln6c6DrOxp2t1y4wnwwk75gTu7vuKWqgbvQ9zdqPvoFAI6H/mJ35D9T2v5ef4cvTG7J5S+aR84D32qB5zp8p5X2C+uHdeQLXZMcfqE3XMfXxbIe93SXO7fyHHErVvu6qjYD4k5fzUe/AMARsRq+3bH93XSuvekLeW4s+dg/0QYDcY74Ofmpaa/7hQJWfIvYvBHHhpuoF4j7geBy0BzIL5Kqvp7k56NfAOCIHUN3v1hM10/a+3whT3TvqJX0C+8iunfE7zsCUH0+5Avj3aEvfOTzlA8+ft8RgD/PFw6of3IsC/oFAP4MX0D+AgDwBfgCAH+VL3w81P1/8AUAQAXA/zcDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8v3XWbsRe79db4wL8ydPnFaeex/iKeNf/K19LhuSGWd3uP44n4pi8zqIfFsbSm1gt8wzg7x0tfYS62F68UULaTrL+6HObUoZQQ0d6svrOCYiJFQAHVp+cS0YKF9OOtGTVvXKM+Y98Dr3P3LArh83j2rEZbJj2Jv+XRuJbPC/I8zy6OqVq6XjALPe78wKt/VBy55xtaleuClq8UULaTlnPZcxZZTSkhsgM+o3uWV0ysCCig8uxpNr/Z9Zm1frNfkANhnbFVEPt7wxXLuBqtq50+d4x4LCMeUzW1PlLFJevTA17+r+ELSgGLkp18HjFmhIVapIToi9Nu5AuZYuqZL0AB1fYFty+fPffnqSsJRGe45c5li+3cTBnmI2Nusotd0V4sa8nAxuknO21RN1NOfkzV3JwKhCqe6AIvf0V8oVtzuJluPJuYPLgWvnCogLKd5L44Z1AzX4uUoLRyn1dMphYooOIExHtCCuIc0bq4uDDJY22X+1dkMJuu1KQhNVibekIuTfHdkrZecr/w5C7a0U77j4EQiOw0725YcSypZeulKmrG7VUbr35FfMGjXWOcbnwrpKuxI3zhQAFlO6nTXjySn9USJeR9QSkmVQsUUHnav0gcJZL7hQ7NTtiOvPmZ8IeMidNhbE7hmX4t2ol2beu403hke8finTa27tU3xn5MH0zeL44ltXR9fLoMeAfXTlXxhRnVdZZu/Ibc4jkiUUDZTk5IegHvZLVECXlfUIpJ1QIFfIWjhEvPsS8syJkzNibiXLaVirUjbxJPaSz3ecLqHjupUXTP/ELb7ZY8+SODnfD4oPqN37HDMVlL1yddpMWROXlsXxBv2oZ8/09D4vWW2vgO1Q58IVZA2U5qso9o0SJfU0pIfSFRTF4RUED1aYifD9IXmpzLg+GOgsLwPPpZIWR0J0+SZ2y2lCYR9YqWbdsPNLai8VpiJcE1ezUma2p9ogr2GOKlPyqmPN8vSb7lW7ZDL2rjhzQT7+WcLygFlO2kK/zgjOaFWs0s+kKimIIioIBqNwurzWREW+kLukP1RmPDNJfuhguD7dzY9rfhfD4X3d/K7bOl22beTBNWcsbG8XB0kzRvsT6/im6um+KEWhhTNbU+VkWr6z7i5T8qSwoaLyFZ7Hy5f9qSrTb+3KHLOo/uHYsKONxJucu9WZuNtllNKSFWQOwLSjFKEVBA5fGJyBnp0hf2FCG6RlM8eemtE5fVrTwlkuuIU6LlObNQqOM2zN77Wz5zRuIk8iCG6ufFMVVT6yNVELmPfbz8R+W8HhIFomc4d4UILltq48VBgoJ67t5RKeBwJ+Uut0ZOGDxlNaUEOaZxTtzJFFPwBSig0tpoT7qvq5pV+tsMg25cPolaweY2N3TfjIba6/j+ID+matl6UBUsPdmjfmHj24PS2Yc7Ge/yjVXY3UQJBXUkigF/RRva+G9jAAoAAAAAAAAAAAAAAAAAAAAAAAAAPo6K45Ko2K4kmisNecvNS6O81NyYQuBbfh0ivQCoGCHxdvR0/eaUNI6LZbFdKppLRXzl56kor3RuRDHwLb8OkV4AVM4X5KfqpvQvvqDiuCQqtktFc6mIr4N5UZSXmhtTDHzLr0OkFwBV84WQtvITr9IXLmc86Ile3w1O2C+vlcV4Zb6gYrvyYW4y4utgXhTlpeZGHAS+5dch0guAqvmCZ9K3Nl9FvtCZmjJa44qed+J9n8V4pe93FduVD3OLIr4K8+Ior2wuex34ll+HSC8AKucLBhk+H8bniO+X8vP1mkv8OT8p9QUV25ULc5vkQjuSeXGUVzpXchj4ll+HSC8AKucLOpneY1P4gvw8Ppe+IDoFskp9QcV2ZWFuWcRXfp6M8krnsrLAt9w6RHoBUDlfYB7RVPqCT6PTsfSF9ozTqNQX0tguFeaWj/jKz5NRXmouKwl8y69DpBcA1fMFm1wmfcGm0SKguxa75GuXdmmMl3q/52O7VDSXivjKx3apKC81tyzwTa2LfQGRXgBUzRe0zj7yhVOTeI/T2YZstifnm7p3VHFc+dguFc2lIr7ysV0qykvNLQt8U+siX0CkFwAVRm+x0/mbo8XYrp/W67GEJMpLzS0fAwD8CfzX2C5EegEAAAAAAAAAAAD8w87dvbSR7nEAf6A5NPkzeitLbwu14GXdXoT+A7IXa7rziI2XBV9KInlpJPhSXDEQZFboRXPVGjElA6LGiwoxwWwMMcj6CuaIdoXtQbvdczjPM5OkaqNGzcuTzPc7tlOF0i8lv0/nlxmLIAiCIAiCIAiCIAiCIAiCIAiCIEjN0maoZl4aBM1zYZuhWMMUq1gzuAAXUAwuwIVqheBVjmJwAS7ABRSDC3ABewSKwQW4ABdQDC7ABewRKAYX4AJcQDG4ABewR6AYXIALcCGXP8xdYuafLhQTpBlc0N0ecfKFChoUE6YZXNCXCws7e/RL2ipmvlpRTJBmcEFXe8SCWabKV7Og6UMxUZrBBR25sLCTpjQdxvjBBbiAPaLAQhe7WJjG+MEFuAAXCtmOULoXxvjBhXK68HTh9Gf9v/bDhbraI37KsouF7DOevmeCBsWEaVYqC1OWDxYTIT7/8rKTkCHPoOed+vVRC/tpuM1JRufmQq/ggqgubCtUtpoxfnChvC4YCQkxEHzv1c8GO8jrCc0F/zAhs37mwszdkfdwQcw9IhOlNJJ9Yn6ipu+JoEExYZpd430Dry/vQv94P3GMaC6EZgnxhLgLxDMJF4R0YUu9WMD4wYUKuDAzPkSIc3yCDf8YN2FuRnXhpYcsDbqZC26Lsx8uCLhH7FjZxUIXxg8uVMKFYc8SPzl+80/mXBhWXXAsj7lfcxd+8b0dYyiwvDRU8XhZ1T/tGsdzMZptf5W/yF/Z6+fb8d8znwl09AnaS9y/sYo1K5WFBY0FFrf3zB5BvN4Rh1vdI3yDuF4QbI/YZtcK8l4X/lnG9UJlrhc+OPO/skyq7ztO5t53JEttXqK5MBXSXDBWMx1GQUNq32wrzVUIN59LX7OgQTFhmpV6O6LNv7zsJsQ7+HbCceY+JSG/z6gujI9MDcGFb3le42aGkwhTwRrG+MGFirlQeLrpnUM9Oy57rgku1N6FT2GFUiVqxvjBhSq4UNJz0HCh1ntEpoupEGEqPMP4wQW4ABf4ApGZlpkK0xg/uAAXsEfkN4gupkI6i/GDC3ABLuRzolyhAsYPLsAFne0R22n+jRDN7e23ey2drK/v7u5ubm72VjV/3eQ3bV6Q3QuyXjwncAEuNKYL6hPPynT7Vek789kRN0Al4ODgYG1tLZkMSDXK35J4SfL8L/ld1orn4IIIRWkJgQsNs0dksjL/9qgrWWj39XID9jkBqeLDEAgGkysrsVh3dbN/k98UuyArxZMMFk+g3sCqbDO40CAuGMwKf7bxShSOepNnX0upYJATwAxYnZ+Px+OJxGFnbXK4eJPf1VTZUgmejcT5xC/IfPGsCkVpCYELjbFHbEUoTXddicLmGv83hhkwzw1gr+9OkbLYKWgWq61Rzf/K4EIDuGD4uKe+sdB8KQonm/vsYjkQm19sFTQodt10VqoZXKj/PSITlakSvQKF3YMUQ2Fl/hDj10DFWuECXLjgYiGsXPl2o4qCtLJ6iPGDC3BBD3sE/9/f0+HLVoij3iRDIdidaO3sxPjBBbjQ+C7sRClVspcuEBsBjkIc4wcX4II+9oirV4iTXrZAxOJNZ7LYJGhQTJhmcKF+XcitEJfdgQhK0koc4wcX4IJe9ojMlSvEZlKSkvGm+w8xfnABLujCBW2FeHbZPQimQnAe4wcX4IJu9ojcCmG/UIX1NUlKrXZi/OACXNCJC4ZvK4S96NG+vs9U6D7E+MEFuKCbPSITYStEs4ZC0QcWDgJS4EIVMH5wAS40nguGHYVG8nchilwrHG0wFWIJjB9cgAs62iM+MhbM9ouSU+Hhg4cXZ/GhoEExYZrBhTpzYVumafNVKmD84AJc0NMescVYaL+VChg/uAAXGsyFY5nutd9OBYwfXIALjbVHmGVqva0KGD+4ABcayoUwpdFbq4DxgwtwoZH2iGkqRy9R4X6p6bkvaFBMmGZwoV5cMDAWpl1F0pu6lgoYP7gAFxpmjzBYqZx1ueznDhf/9qhrqYDxgwtwoVFcyKgs2M9fKxztS1IwjvGDC3BBj3tEJk2VLg7BmWsF/r8xBbo7MX5wAS7o0AXDDmMhrFlwKjdYITB+cAEuNMYekTlJU6qYNRS+XS3caIXA+MEFuNAALhi2rDKl8p652F2I7tYHN0nPA0GDYsI0K3nany6cPsGFquwRO1mFUpqebj+vgrZCYPzgQo1dmLJ8sJgKJ59/edmpfn3Uwn4abnOS0bm50Cu4UEYX1P2BKtawq/hdCIwfitXcBSMhIWfh5Huf//qof5iQWT9zYebuyHu4UK49Ir8/ZF0um+vc+43ryRuvEBg/uFDePYIQr69wOuVCaJYQT4i7QDyTcKE8LmTO7A/nnlrYTUkrCYwfionhwsz4UOHkHJ+YzLnw0kOWBt3MBbfF2Q8XyrNH7J3fH07RsBmQYocYPxQTw4Vhz9Kpk+M3vwbDqGN5zP2au/CL7+0YQ4Glw1jFo6Oqf9o1DnLzZuEvyj+uvuJH79/S2v2ex7c5/nrcI+bRI2gvcf/GKtasVBYWNA9yJxa3V3OBeL0jDre6R/gGcb1Qjj3io0yzruI5OZACq4/vPb5Veh4LGhQTplmpLnxwnj6xWHLXC2SpzUs0F6ZCcKEMLmQi1MoNsH13uI7XpEAc44diorhgbPMvL7vzJ+IdfDvhyLlAfp9RXRgfmRqCC2V4fyFKI+3qXYjvPo6SUiqB8UMxca4Xzj3k9M6B55oq5MIWlcNFVbDtBqVgAuOHYsK6cPnzjqZqpsMkaJ7frNmOQqM2lu/XCH5/svVeGfLmnqBBMWGawQXBXNijaZutyJsL9s8BKfYA44dicKGuXSA3ahamSnPhasFuYx85GDYkqRvjh2JwQYcuqLco1csFlQT+ocpgP96XAvMYPxSDC3rcIz5FqFV7c4F/8B929bS+JqXiGD8Ugwt6dME4TSP23LsLdvXgQOxuBCUpmMD4oRhc0OUewW9RapcL/DKB/+J49yAlMRVihxg/FIMLunRBu0WpXi2o7zUebe4HOArdcYwfisEFve4R6i1K7W0Fm229d42jsNKdaGl51FLWvGkRNCgmTDO4IIwLuVuU6vrQm2QmBFbmD1se3cH4oRhc0O0eod2i1LLGUIjNN2H8UAwu6NoFY/4WJb9c+Cyl4vcxfigGF3S/R2i3KNWsp6Q4xg/F4AJcyN+i1LaI2J1K5s0dQYNiwjSDC0LsEfnvouTplYKtGD8UgwtwwZq7RWmzuf4MSHGMH4rBBewR21R+kr9cSErdGD8Ugwtw4V/pwr0I27+lYBPGD8XgAvaILark70XsBgJxjB+KwQW4YIzQ6RwLx5XfIjB+cAEu1MMeYaZKfovYkIIPMH4oBhfgQkbJPwA9wLaIBMYPxeAC9ghTtnCPsipbBMYPLsAF8V3YkWmYXSqwg20RyRaMH4rBBewRpijd4yyw/EeqxhaB8YMLcEF0F4wfqWzmLAzYjoPSKsYPxeAC9gj+nzTxR5r49cK+tNKC8UMxuAAX+PdR2gtbxOGjquTNI0GDYsI0gws13SOMEfX7KAdsA0cpaR7jh2JwAS6YTCdUsQ2oYVsExg/F4AL2CJPpk0KzA+o9yk0pdYjxQzG4ABdMxi4aGRio8haB8YMLcEHoPSIj0y6VBbZFxH6uWl78LGhQTJhmcKGGLkRpWmNhVwoc4lWOYnABewR/Alo2a2tEUlr9sXp58aOgQTFhmsGF2rmwR63am46fpeA9vMpRrB5deLqgnvp/7T91ggu32CO2qWxXb1EeB6U4XuUoVo8uTFk+WEyEDHkGPe8KJ5ZRC/tpuM1JRufmQq/gwjVcSNPogLpGbEgreJWjWF26YCQk5CRksIO8niicuAv+YUJm/cyFmbsj7+FC6XuE+kgTf6jpz4CU+KGaefGDoEExYZpd430Dr4/0j/cTx0j+pLoQmiXEE+IuEM8kXCjZhU8ROq1uEbZ9KYZXOYrVqwsz40NkjGPwf/bO7qfJLI/jJ7hEmbv5A7yYS02MQU0mZrzSxEz2Ap3bSTDqhvEcsi3JlgRLJsahxUrTRcqwRGYb9hG9oVdKeTE0MbDdC0l4EQaawkxCCrPhZUR8wYy6mXHPOU/BFltsoQ+ePs/3e7CPEAOfnP74eN7aZ6A3cZFeuNJAhho93Aueivo6eCHrecTGkaZfaPCvqHKAFagXmhqGSMILTYmL9IJ7pNXTLLxwqa2zlUuBp7JkF1vlrv60HJptS7KO8OuqZ17R/qCP+bO7m+3FLv+8rFuNolzq9phhZNlq4d9CC+nmEcTn87s9ch7R1ojxQrbziG4W018vtUZDe/C/H8AKdLxwv15eGitJR/vGRXphqNxHdC909cELmbww801VSjStf2OPElUOsAL1wr7ywMiIJ90+JSE/9kov3PR33YAXMqwvzIXZpixIK3hn6TiqHGCFvB8h49YPNLlxrikHL+xb1FhsODX62y6IPcpju52aY4oGYMqQ4Ry08fOI+RjThvXNh/W2nmU6iioHGLxgQS/Ewyzc700Xxy80+CWqHGDwguXmEU+6GYtdS6sF72+TdApVDjCLeKF4N1NZrGhsgkzOIbq9GSL2KFHlAIMXLOQFIsheaSyizyEcqR/ij9ijRJUDDF6wmBee2BlbuCo1sHllQTws0fGLHyM1FxUNwJQhgxeMm0c8jDBtMWWw8G64wB/FHiWqHGDwgoW80Or5vpOxSFmGlQWHvkd55KOk5oiiAZgyZPCCMenq6el5bdcV4Hh/dcEr3us1ehBVDjB4wUpeeNTzqKdFl8J7WpDNMUmnUOUAgxcs5IWZ4RE+Xvg91QTvJCHaGg2dQJUDDF6wjhfmwuy1v6fh6WYlJDWxR4kqBxi8YBkviBOOkTIvebaFFsTrKFHlAIMXrOKFvXMR+SqpVC84nq59++1S0keQTnz1sVLzlaIBmDJk8EJ+U1IlTjg6eGzPHO/yPEQ3ZRRVDjB4wRpekC+HsHsdCS+8mzUE6fhUSgb3oMoBBi9Ywwv9Ggv3J4YIZGO8sDpNg1PHLhw5ltQufMTUXFA0AFOGDF7IX+YXGLNfFasJYpCw7gXvyygNTShUSodVrXKAqUMGL+Qtr/hgYfHdkkJifSE+S+noZ4dVSvVhRQMwZcjghTydZJqTr510ODYWFaQXvKuTNDiIKgcYvGA1L8zMldkjjDFtUd+STF5fWBNzCFQ5wOAFK3lhXQlcCjH7d4n1hETjXogv8znEHlQ5wOAFy3hhJkkJi2WO92J7xucQ0TFUOcDgBet44UkssxL4oOHn379/S+n4CqocYPCCdbxQYmeR9ErQU9HT0/Om9sJ5FVN9XtEATBkyeGF7Wuhm4S2s4Ig/4l74J6ocYPCClbxQxbT+LbSwFvpXz6Oe/x5XM9XHAWYSMMPI4IVtHWESm5IZ83ya0j/e9rz9G6ocYPCCdbwwp7HujFZYXaY0NMZ7FlUOMHjBOl4oeaix4YwLC7NBGp06dhxeABi8YCkvzIfZQsaFhSgN1n4ue9aGKgcYvGAZL8xEWCyDFV5OiiMLh/TYqg8pGoCZBswwMngh11nEAot40y8sTIuFhXc9iyoHGLxgFS/YWfhaunWF1cdBGh08fAheABi8YDkvLDLt/fNMq2vLUUqDtXuSexbzCIDBC9bwQknZ5vNMzqcvH8v3dA3VrqT2LLwAMCt44fpZeCGusUXuAqf84JOH57OT0gmjY1++37OocoCZ3gu37gea+aWznKeZtAVGRurl11sq+ENTeT1pGRjou25yL8xpbNjplE5wOuJL00HuhOjo4Epp6aHS90KqSxUNwEwDZhhZtl7YV1zRrP/tT/5i0nZv/estgSZCHgS4F3r3+u+Z2wvzYWbnUpBWcMb5SCE4PjVxsfTQ+bQ9a0OVA8z0XiBk3Qt9/Lc/yQt9Dwhp6BNeIA0dpvbCTIQtOBJTCGd8mobGTqQbJ8ALALOgF/7eWUdI/c32joQXrjSQoUYP94Knor7OzF6Ih1nEq0uBTyK4Fj7/QM+iygFmGS+4/UPyciugi6HFPdLqaRZeuNTW2cqlwFNZvIutcnd+TvPwa/a/q8+cibb8JvQf/pxs1Uh1dama7YWiXNXoMWXIcvXCT/cTn3p8uheIz+d3e+Q8oq3RtOOFuTDTusVIQc9jGl35kHExjwCYZcYLdQPrKwsVifECGSr3Ed0LXX0m9YK4c33sC6e+FcEzS6MTZz4UW/UZRQMw04AZRpatFSo7A/4uQm61FIvPfI2d7e6EF8iPvdILN/1dN8zpBXnnese6FBzOJRqcyKJnUeUAM70XUnP2rtsy55rknevLElaI88uvNDh2Bl4AGLxg4XPQ8s71+sJCXD6uUTp2KovYqk8pGoCZBswwMnhh68g71ycOPstNypdBOngKXgAYvGBdL8g713udSXkepFNZ9iyqHGDwghm9cI0PFqrWjSBnEc+jtPYUvAAweCF3L3yym6k07DvPyDvXJw8WnKtcC0VZxlZdpGgAZhoww8jghUx5EmPhRWeqFkJ0tBReABi8YF0vDLNw6mDBGc9FC0UEVQ4weMFsXqhi2hebRguTdPxiEbwAMHjBsl6IM60qdbCwFM1JC5hHAAxeMJkXih9qrDtFC2shSkc/K4IXAAYvWNYLM/KdmZJOLUxTOj6RY8/eVrWWAGYaMMPI4IX0WxGx5IUFeSfanHsWVQ4weMFMXkjZitDvRHs+5561ocoBBi+YyAvJWxFxeSfaPdvoWXgBYPCCibyQ2IpwiQ/9TrRFZ7bTs6hygMELZvFCYivCJcwg70Q7sd2eRZUDDF4wixf0rQgXb3JhYfDMdnsW8wiAwQtm8YK+FSHmEPFpGqy9eG7bsd0+p2gAZhoww8jghTRbEWK04FymoYM76llUOcDgBXN4QW5FiLUF5xKNrpzcScjtk4oGYKYBM4wMXti0FdEvRwuulzQ4sbOetaHKAQYvmMALcivCJbMapYMn4QWAwQsW9MLMq6qUhJmdDxV44iFau+OeRZUDDF4oQC+ULLBNiUkriK2I8aIDOwy5fUDRAMw0YIaRWdkLiyw8nJJurz6LWKahEzvuWRuqHGDwQsF5Ya9YZHRtjlhzFFsRB+AFgMELFvTCfFgsMjo3NR6xFZGPnkWVAwxeKDQvlMTYgitdxFbEAXgBYPCCFb3QzcKOdFoQWxF56VnMIwAGLxSYF/b+xrQ/p9XCNB0/tz8fsd3er2gAZhoww8gs6oV5jS2mnUUs09Bf8tSzqHKAwQsF5YUnkQyLC2IrYj+8ADB4wYpeGGaRtIsLYisiXz2LeQTA4IWC8sIrpn2XaStiP7wAMHjBil54uL64EF9bSkmI1uaxZ1HlAIMXCscLTyLMro8Ppumm5GkrAl4AmGW8cP1s0id1/6grWC/YWUR/edQsDU2lZPDi1/mL7fLXigZgpgEzjCxbK9y6H2jml7bAyEg9ITcaGhvuyq+3VPCHpvJ60jIw0He9ELxQxsJXNxYZDXzG4AWAmd8L+4orpBfuyc8aK0lzu+6FQBMhDwLcC717/fcKwAtzGuvfWGQ8bWDI5dOKBmCmATOMLPt5RJIX6m7WEbdf90LfB2waDQAAIABJREFUA0Ia+oQXSEOH+l4QbwO/vrgwehpeABi8kAcv1N9s57/8rcIJA73SC1cayFCjh3vBU1Ffp74X7CzGnXDHdWeWhs4b+ozZUOUAs4oXiPtWoCPhhSbpBfdIq6dZeOFSW2crlwJP5Se72Cpz+tdVr8PPXD/z9oK+Wbl82shmu2zs999+e6Eo12X0mDJkuXqBEI8vZR5BfD6/2yPnEW2Nqo8X5jRtY3Fh7KixIZePKpofVAVDjylDlrsXKjrkumNHYt2RDJX7iO6Frj7FvTATZsNiDuGam6SjRy3rBYCZBswwsmytUNkZ8HcR4mvsbHen7FMS8mOv9MJNf9cNxb2wIBcX5MmF8TNGP2M2VDnATO+FRM7edcuruxDPNX3Dwl655rhGowePwgsAgxfy5IVCPgc9r7EqbgWXazVo+OIC5hEAgxcKwgslC/I9F+TiQu2nxof88KmiAZhpwAwjs44X+lnY6bpzR7wl0/i5XXjGbKhygMELinuhZF6cfxZ7Eb/S6P/ZO5vfpq40Dh+kIaYsosAKWFR0U6FmAxsGCcEfMEjUi1ZtkFKhMpmeg3QTNS0LsuDSfDS4DiGOMohEDrpEHqF4VeIoRliNQs3CSPmQ02AlEWoGZ5EUhoxaPiTaajTnfjixTWISknvvuff+3tvaDVToUd5zHn7vsZ373i54AWDwAryg/lj4Wk0LP0fppCUdwxwBMHhBdC/U8SlCe+dCzJLDBXgBYPCC+F5IKeykqoXIDE2fsqZjmCMABi/ke8FnZV1ez//0TpKNRtT6hWbO7IIXAAYvwAs+3yJLNqla+C0anbSqY5gjAAYvCO2FrKIc5VZQDxceVFlVpKdK0AKYa8BMI/OCF5ZyU8QMHT9lWcckrHKAwQsCe2HQmCKe08znxywrqeeYoAUw14CZRuYBLzQx5RtVC//N0EkLO0awygEGLwjrhaUEG4w06VPEMXgB2w9egBd4jbJpbYp4QmOHrOwY5giAwQvCeuERUy5qU0SUTh60sqSeg4IWwFwDZhqZ270wm2CL2msRadpgbccIVjnA4AVBvVDLpo03OsY+gxew/eAFeIHXRZb4zpYpAnMEwOAFQb2wMzdFZKfog4PwArYfvAAv+HyzSbagTRFzdOpUhcVFeioELYC5Bsw0Mjd7YT7Bkue5FeSfo9GnFfACth+8AC/4UgnjnQvqFGF9xySscoDBC8J5IauwhSZjikhXwQvYfvACvOBrUoyzhcgLGv3Aho5hjgAYvCCaFx4prFbXQjZG71bAC9h+8AK88DfF+JELdk0RmCMABi+I5oWTjA3qVpBf0Mx7FfACth+84HkvLDJlMSLnpoiJE7YU6TkhaAHMNWCmkbnQCzsHmXKHJ4WILMuRxzR9Al7A9oMXvO6FnbU5LRg/us2mjklY5QCDF0TxwhLXwlFZLZ4Xshk68alNJfV8KmgBzDVgppG5zQtLCyzxjeoEboVIX4yO29YxglUOMHjBHi/M/uPPOwU1zRIXZSMuPI/S9IdldhWpLxO0AOYaMNPInO2FRwn2ihVW8ivZ8MIcpQ0V9nVMwioHGLxggxdmaxlb+GOwsM4bVsjO0OiEnR2DFwDmBS9c8quP/h+F8QIPC4k6+aF2lpC7ZNn4j84YjT21tWOYIwDmfi/cuB3u5E8DNbdr3iGkOzw21qL9elcNf+iobiFdIyPxSxZ6QQsLX8mRh3JBRfQn9WjhdBm8gO0HL5jqhR3ba1Qv7CAkzoXQfSv3613hDkKGw9wLQ77QLeu8oIcFXqvlBbuPFjBHAMwzc4TmBV5t3QVeiA8TEoirXiCBPqu8YIQFLoHX80JEtv1oAV4AmNe8MHTtCiEt1673GV64ECD321u5F1prWhot8sJyWNDyglyYF+Q+248WMEcAzGNe6AjcV5+ab4R1MXQ1j11t7VS98EV3/1UuBV6XfaZes3+wVwu/ciFo18OHcuH1LPp7+mv+/bL7IvX1ZWJezwTlqsd3TBiyDXrhR10LvFrbdC+QtrZQc6s2R3S3W5EX8sOCkRfySz1aOCGCycWdI3rx17JbvmOmkW3QC7dblr808gK5X91GdC8MxM33wvLJgl7Z589+KSghjhZwvgAwj8wRZ/vDoQGyozo8NtZKSFt7//VmwwvkpyHNC9dCA1dM98JssiAsvIjR32lhiXC0gPMFgHnmfCG//N832/K+Jq6FZF5YeEzp+H/uFtahMngB2w9esMULNr3fUdXC+fywkJnYX79f0JKEJQOYa8BMI3OSFwq0oIWF0/vhBWw/eMHTXshpIaj+o4cFkVtGsMoBBi+Y7oX8tJALC/ACth+84Gkv5GthOSzsxxyB7QcveNgLeVrICwvwArYfvOBhL+RpQQsL5ctVXy5oEWHJAOYaMNPInOGFFS3oYaEcXsD2A5jXvbCihZdTBWFB5JZJWOUAgxfyveDf2svQQlAO9sVo+nQ5vIDtBzAn5oWtUkJeWgiqRwtROr7LKS3DHAEweKEoL2xN5aUFHhbkf1HaUFYOL2D7AczzeWElLcxRetdBLcMcATB44bW8sMnhwcgLvvncm5+zj2l0shxewPYDmKPzwqaGB/1PmK9LMq6FIK/sDM08rVyleisFLSIsGcBcA2Yambh5QZMCS9SqWlBfn4ydqYQXsP0A5lwvGNt7/RLI/3olKXApHJXVsBDsjNH0hw5rmYRVDjB4YbW8sN6hoaiKpBAMqq9PVlXCC9h+APNOXvi28E71i0VSCAafqK9POq5lmCMABi+skRfeKAW/b5QV17IUtHctBNXXJ4+sWb1HBC0iLBnAXANmGpnZeeFNQ4RvnilFd6rXpaAaQXshQn190oktk7DKAQYvvF1e8PsW2GiwRF1QX588Ai9g+wHMXXmhlBT8vixLRNaWwr0pSmNnnNkyzBEAgxdK5IUSQ4TPN80GS0mBxho++6Rk9X4iaBFhyQDmGjDTyOzMC/zhEUvIpaTwdL9jWyZhlQMMXthoXtB/K8kWS0ihfPebq3e3oCUJSwYw14CZRmZrXvBdZEk5+/xJQW1ECiK3jGCVAwxeeJu8sD3B7gQf0+JavxTgBWw/eMF1eeEkSwY7abTozrMbkALmCGw/eMFVeYH/zlKCHQ3O0LvubBm8ADB44W3yQh2bDr6gsQp3tgxzBMDghbc4X5hV2MXgFJ3YDS9glQMMecHIC4NsIfg1narct6nq3SdoScKSAcw1YKaR2Xe+MK8o57MxOrkPXsAqB5gXvLCuvDDKaoP36LhrW0awygEGL2w0L8wzpelllP4VXsAqB5iDvXDJrz42/rMx7+nt84L2+eo52uDelmGOAJj7vXDjdriTP10JtAe+X37i1VXDHzqqW0jXyEj80rrzgl/9fPVZGj0EL2CVA8y5XtixvUb1QvtZ0nl9+Un1QriDkOEw98KQL3Rr/XlB/Xz1DH1wfNN17rigRYQlA5hrwEwjW/8coXqh8VojaQ7lnjQvxIcJCcRVL5BAX9597kvmBb/6+eoXNFMBL2CVA8zxXriqymBkyHjSvHAhQO63t3IvtNa0NObd5964j9wagSHJ6lJTdMLNLZOwygHmKS90GE+aF5rHrrZ2ql74orv/KpcCr8u+N12/slfBZ/R/R84d3/R1bgv+DFMuSViyfwvKdQ7fMWHINj1HkLa2UHOrNkd0ty/PEaV/2qv6+epUjE4e3oI6d1jQIsKSAcw1YKaRbcwL6oFj3/XlJ80L96vbiO6FgfjKuWPJHw9/kiVT92j6MLyAVQ4wR3vhbH84NLDa65SE/DSkeeFaaOBK3vlCibywlGB/f5mhH7i7ZRJWOcA8kBf0atbf0NRc+n1NpeNCHZtOzdHxw/ACVjnA3OGFdb4PutQ1q7DvXkajpw9sSf1wQNAiwpIBzDVgppGZ87mpkjXIFlKP6YMD8AJWOcC85IWi84TCG1bXKcr5TpqpcnvLJKxygMELa+eF125YXZtK07sH4AWscoB5Ny/MK0U3rF4M9tJYpetbhjkCYPDCmnnBP8pGU0U1RSe3bVX9sE3QIsKSAcw1YKaRmZ4XeFxoKtLCE5r2QMskrHKAwQtr5IVV4kI2Q5/CC1jlAPNwXuBxIVLkhTk67oWWYY4AGLywRl7Q4kJP4Y1po9HP4QWscoB5OC+ocWGu+L60DZ5oGeYIgMEL+V7wr9QgG30ZLbox7UQ5vIBVDjAPe0GPCw+27d2zbY/6r/bokZZhjgAYvLC6F/S4sMuTLYMXAAYvrOqFXFzwZMswRwAMXljVCxbEBXgB2w9ecJYXjLjwsal182NBiwhLBjDXgJlGZqYXjLgAL2CVAwxeqC6MC3vNrZt7BS1JWDKAuQbMNDITvaDHhSp4AascYPBCzgvWxAVxW0awygEGL7zmBWviAryA7QcvOMgLFsUFzBHYfvCCg7xgUVyAF7D94AXneMGIC3tMr5t7BC0iLBnAXANmGplZXjDiAryAVQ4weCHnBcvigrgtk7DKAQYvFHrBsrgAL2D7wQtO8YJ1cQFzBLYfvOAUL1gXF+AFbD94wSFeMOLC+1bUzfcFLUlYMoC5Bsw0MlO8oMeFCngBqxxg8ELOC1bGBXFbRrDKAQYv5HnByrgAL2D7wQvO8IKiyJbFBcwR2H7wgjO8oMeFj6ypLz8StCRhyQDmGjDTyMzwwrcpHhc83zKCVQ4wr3ihv5pXJ+kOj421aL/QVcMfOqpbSNfISPyS7oUUjwsn3rWovnxX0CLCkgHMNWCmkW08DvwltJ1038p91RXuIGQ4zL0w5AvdMrzA4wJaJmGVA8xDXojz3Z/nhfgwIYG46gUS6NO9YGVcgBew/eAFAbxwub+RkP+zd/6ujSNtHFexwXsHV23zwh3vlQdvf/1dcd0MGA7c3C2uFoMHF2lSuggydkC2E7MR8qtlhVL42HcarwvveyC8i0ECC7ZKGRSu8T/g8q3e+SXFSrLZ+DbWTrLPY/CMHo/sB02ej2ZG8yUt5+WJ4kLzwFj02owL7WetfcmFIocLMI+A9AMufH4umEcLUfgvJBiem+/t9oBzoTZ8ZTMoMPvff/7N4i3otbv7Tz1fhraR/aVpXLtwxbSJbFMunP1XVdqW5IJhWUdmW8wjhj05XihyuADziM3tD7gtP5QrtrXINsTC/rt0ZeGZGi8Yi6eWIbkweSO58K9//Fqc7f6qqTW0jQwCezCBbS2yDbngP9/hhdV79dJUXDBOp4ILztGkL7kAXSauLPyVQ2BfCheUlcfmDfuafinSdn/R1AxtI4PAHkxgW4tsG/sdocu4NeCvHAIDLgAXgAsQGHDhBi58X6Ttfq+pGdpGBoE9mMC2FhlwAbgAgQEXgAtFWQP+yiEw4AJw4UYuVDSy0a1bQvoBF4AL25xHABeAC8AF6DLgAnABuJDnwu9F2u7vmlojF9n95ELBl0zbvtQ2sK1FBlwALgAXgAtFcOGHIu3tD5qakYvsfnKh4EumbV9qG9jWIgMuABeAC8AF4EJR1riWC5Tyd+Shj2Qk9QhwAbgAXPgiuODUSxEv7Nj3hGNW3tmxeCU0PZWLopYcD6qOODSnX/tOxeyyqrdvAReAC8CFBzePCII650KcVKKa5MJSfWBXvfVa3an0YskFj56tKp0ycw7LwAXgAnDhIa4vcC6gKarQcaVyHmZciCcLTzhkLSijSvAISS5U2n6lU2NIsFfABeDC/eXCd0Xa2+80tUYuMqSsHiHkjFml6iGPIuu4xhxoeYYWHuIOVbNDFBoOP8F0oqmFOomNwvjMQndho1u3LPiSaduX2ga2tciAC4VzoZJygRCESFiKkNd3PDuhzJHWIj+O9z3BBbuVENShj53T6G64UAEuABeAC5/LjA+OF8iUIDpOPWenKGo2m50ux0BWI25YpoILgg4ddNrqUxgvABeACw+WCyhOUFRDiIrEX0Tig7GXOsaCBGjWQutcCM0WgvECcAG48ADnEYlfHg8QcuzYZum+SFArXtRIxgXmULXVeTOmOS6gtodgvABcAC48yPUFccOuEE/CAFGPXpuQxAuuvdXDeAG4AFx4gPOIy/lPUPEGXAAufA4u/FSkvf1JUzNykSF9bIPxQsGXTNu+1DawrUUGXNiWNXTlAgIuABeAC8AFGC8AF4ALX/A8grpq0VKuWtBsTdOla37qposaNHXkTgMuABe2woVvi7S332pqRi4ymWdml715+9njxo1XHUvuDR+edOvdAEm1JqqE9ZLcGYGCemwvUz9KDk+qYod1JTkc8FruNBFltbqSSCn4kmnbl9oGtrXIgAvbssY1XOiUWeYNyykXDr1NuRDcRJIAoZqV7Zri2k3ptyzk9TN/3Rn1YrnHykG8lj9NbJkIxkvgAnDhPnNhT1su7F3DBZ6AdmyhyO5O0NC0Z+j1wu4h1F70E/ZJz/ZZLktX4k/7VDbkplq4nu/7/eGFP7900Jqt7bJOubDsBr3T1B+UySh4xPHCakjW8qfxrVR+9Dm4oG1fahvY1iIDLmxtHnEdF5QskkxdWqVozsYLDgn7iJYDPqcozWj0mEgXOl4SglRDlLXg84hw7mX+vHnHTqbWvOACqc/rJPPb4UhJNTPRZv40ZJ52LQJcAC4AF4rigpJFho9arWoiuEBDq4NQ0w/V6sE8lK6wxNNeNUTrLbx5subPYYG1qVzlwnIVzWdZ4kf+Skk1U9HmpdOQuZwtHOACcAG4UNQ8Qskio2kYhgHnglddJowLZDlfKi540hU+5rds1RCttQj6y3X/mrk2R8fVeUTVRW7HzfwkUFJNJdq8fBqfR8zOgQvABeBCYVyQski3HIqBfIJ6TeYilLKbOsv6hN/VpYtUJ4gQ1VA8cxQtXNrkOsvMv25NuZ6ZLSAKLkQeYT8TVIML/4hLNSMvFW1ePo1z4WQFXAAu3DEXnhRpe080NSMXGRbWwbjt4TMLR/OFn+Dl1Ar69sqfeYf1RYhx6ay5M8HShaOv7bGrGmKctnAjw/f9YeZfs8Ao7eycYSzUmhgL7SbGXy1xZJ8vlpl/dT6IqfAL0ebl05iZh9NzR9QKvmTa9qW2gW0tMuBCkVxghmRBAsLeKEvQAMt3xLOeV1MXCbKG0slPJen3ZP7LJjYoXRxaIacKdyi/+pT5iRd88DQEXAAubG77x/vAhZutcT0XckYIT8jssOSmOYrvzHr0imv0Af9Vg/QDLtzKhi/ev28ZRv+gdzAWjufP2Nvh05bx/N27Nx3gwmZcuEQJl+AibHTrlpB+wIXbceG1KHp1Y/BScuHFoWHMXjAuTEtHr4ELH51H3AgGDFwALtxfLuw7+4Z5JLnwZmYYB284F4yDE+DCJ3EBAxeAC/eSCy3nJUt+mzPh3VRwoXlgLHptxoX2s9Y+cOFvzSNc644yXi5bUrmA6GarilSuW6iFRXqxsuDKD1y6XgAXgAsbrzua/osTxYVDwQXzvd0ecC7Uhq9sBgVme08KfO0V+msbvBq5yEbsLj2iRjDCSSzq6y9nLEqzy969fevK57d8vauXIlaK/205wvFg4CPhP+82u5T9ih/7Hj8a8CP2ot24GeNRMIj9JTuqr+yejKNaXVVEreBrpm1f/vXkS4ts80cRbSs3jzAs68hsi3nEsCfHCz8XaXs/a2pGLjJ53zbYLTyKr9zmnanc3VD2MB6W08HDobfhaIErKFlRd3AvFosVg556wolr7EvjBEc1fjSqyZ+Il/JJpoW9flbw/QtcTylqBV8ybftS28C2FtnmXHh2ItYdT9S6o7F4ahmSC5M3wIWPcoFwLnBxJCOE3Z2w96l9prjA89WOLfkBV1tiLq1Mmwu1JVYuobZU33BhnAtBmeDgEZ8x0KmT7kZozTCZEkzHYn2BHXFcmJTPNIiQW2KsCsEFzH8IuABcuK1ZvVcvzdxzSsM4nQouOEeTPnDhwhofHi/QMuMDlppIXA2ppbiQ2PhCbYnnbLzApZWqOZZqS+nCXG2ZfkOeC9gOcWg4ODivRqnfO3aww5lQ5WMQ91jwwim9bvL8F3LLrOBc4HpK4AJw4fZWHptymeGmfU3QZTdwQYwXmn6IsdRE8nRN5xE5taXgApdWquZi19M8lK6wxHGgGl7igpRJYuosx6HCAjsfZVzwfOkODQYQhhght8wKzgWupwQuABfueB/0b0Xa3m+ampGLTD4QMFlGLs/42H2+xFITGfkXXMDrakvOBSGtVM0lF6TaEoeP+Q1dNbzEBSxkkrwyq8nnDDYHQTqPcG01u3BNigkbilRd7Ha8tJDziNm5aFLwJdO2L7UNbGuRARcK5AJeDDGO2/xJ4XKF3TJP16DjkVnKhdBsYaG25Id2gnt1LNSWvDkuJXwuIF2kOsFCbZlfeZRcwGTWEuuOscXY4eG6WmaU6451S+xfYH5/gp06Jux3gmqgCsWFkxVwAbhwx1z4sUj780dNrZGLTOZtOPD91zQVR0pNpDXvD6efqLaUphSUUiaJ/ZPFIOC6ybxgMj36aomd6uBQLH8KuaUqcnrKgi+Ztn2pbWBbiwy4UCQX2PCAit3OShwpNJFr+4z+vtpyfTe1lEmqwgqvCCZHqZ6SePKnlf+qnhLSD7gAXLjjK3stFzaxT1VbioY36ik/JsiA9AMuABd048KlLPdI4foISD/gAnChiHnE/dJNQfoBF+6OC98UaX9+o6k1cpERjWx065YFXzJt+1LbwLYWGXBhW/b/9s6mNZFsDcDvpknS0zCb+djPxz+ZHyCzl6wk9wYO5Bf0QkqMYPyIxlIQIVkEBdMdhUTvJoRsgh2EQBazaAj3p9z61DIx6U5iVZ2rz9MQ7VMn8aGsevSYmh6hC3SBLtAFukAX6AJdYB1BF+gCXXhTFzjKEaMLPGUP1xEc5YjRBZ4yuoAYXaALrCMQowvPd+GPKPnPH5qitDVDbGnEQjOjC2EhHOWI0QW6QBcQowt0gXUEYnSBLtAFxOjCG7rwQ5R8/kFTRFszxJZGLDQzukAXEKMLdCEqFEc5YnSBLtAFxOgCXWAdgRhdoAt0ATG6QBdYRyBGF+gCXUCMLoTYhd+j5PPvmiLamiG2NGKhmdEFuoAYXaALUaE4yhGjC3SBLiBGF+gC6wjE6MILuvBrlHz+VVNEWzPElkYsNDO6EBaKoxwxukAX6AJiK9uFxBVdYB2BGF2YoZ8apjZEGs3xOOMMVFPWl1IyI9XLy8EuXaALiK1gF9ZFBlYQGj1/oNosiVw0rS6cr5V7dIF1BGKr+flCvjHThcGFSG5gd0FyR24XPkTJzgdNUdqaIbY0YqGZvTgL5/WiSKbeOvK68DEno0LW6kI2lUnThcCe5ShHbGW6UMqN7BvjsOmGoWqMa9l9uwtbjU7NioLFzocI/+xE+mgv+CPamv1XU68d9pg2Zi/MwpWbBYts3u2C5PNlI+usIxoF3i+wjkBsBd8vDDP+vZT3fkFGyby4XegP6AJdQGz1urCebI7HWZF8odMyvC7I3bnThXq5X6QLfL6A2Ep+7uhe3XRqPHNdE08ZXUBsFbvw/PWOPGWsIxCjCw+78FuU7PymKUpbM8SWRiw0M7oQFsJRjhhdoAt0ATG6QBdYRyBGF+gCXUCMLryhC79Eyc4vmiLamiG2NGKhmdEFuoAYXaALUaE4yhGjC3SBLiBGF+gC6wjE6AJdoAuI0YU3dOHvKPn0t6Yobc0QWxqx0MzoAl1AjC5E0YU/o+TTn5oi2pohtjRioZnRBbqAGF2gC1GhOMoRowt0gS4gRhfoAusIxOjCC7rwc5R8+llTRFszxJZGLDQzuhAWiqMcMbpAF+gCYnSBLrCOQIwu0AW6gBhdoAusIxCjCwvswk9R8uknTVHamiG2NGKhmdGFsBCOcsToAl2gC4jRBbrAOgIxukAX6AJidIEusI5AjC4ssAs/Rsk/P2qKaGuG2NKIhWZGF8JCcZQjRhfoAl1AjC7QBdYRiNEFukAXEKMLz5M+SNMF1hGI0YUgxVwhd+rcq6asL6VkRqqXl4NdukAXEFvdLhS2Zb/ldqFZErloWl04Xyv33C78FSX//KUpoq0ZYksjFprZ61YR9bQYZbcLgwuR3MDuguSO6AJdQGxlu1Czm3B57nThY05GhazVhWwqk6YLUxRHOWKr2IWS0wVjXMvu213YanRqVhQA4P+eN68jJJ8vG1lnHdEoSPQkRVeSiCG2WmaFbTnyPneUUTIvbhf6A54yjnLEVtcs8HtKkbtzpwv1cr/IU8ZRjtgKmxnPXNcEAAAAEDW7Cftr+pvvUNKRv4fR1uybYt4m/cS+e59GLZa40vUgu1qPySxWDofNfQl+otFojscZ+84oeeDNce4FPvOoN3O16RXa8Zl5A1GbPSU28fM36Sf2aIYuYv3UMLWh0UEWMBsOO4kYzGJm/V3K3jHTK68b7tXWspa7PAjeC1ybfW60BtMrtOMz8waiNntKzPebbNJP7NEMbcREBhmNDrKpmfUuob8Vg1ns2DvGv2KiP5rskcJ958AZcO8Fr6k4l7vO9Art+MzcgRjM5ot5N/2Rt0k/sQcztBKTfEOjgyxoZtRrsZhp0AX/yutiQjL1lv3fYfSyYp991oB7L3htdm2/npleoR2fmTsQg9l8Me+mmPA26Sf2YIZWYuf1okYH2dRsvXAZzy7Tpwsl5+/GYfNIiuXiQW7PsHeNey94bXYuv5eeXqEdm5k3EIPZXLHJjb9JP7HHM7QRK+VGsYh908yo9cqjWMw0Wke4ZPNyNBwOqyn7gxbv3uwbKQlcoR2bmTcQg9lcsenN3HWEDmJz1xFaiF3ZWRBtDrKZXSaNVixmGnTBv/I64bwOp9xSlg/8gfLBzLXZ3o7xrtCO1cweiN7sSTH7xhrwNuknNjtDI7Fhxv/AVpuDzDNLW1szsZjFynanWe5Pfg3T2ZZ8odMyJmefNeDdC/yixtsx3hXa8Zl5A1GbPSXm3VgDj39PqYnY7Ax9xNaTzfE4q9FBNt1luX5n+C4GM02YXHmdODW+MUMbM38gJrOHYgGauNmRAAAC80lEQVQ/b5N+YvE+l9qKPWNmlNZiNQMAAAAAAAAAAAAAAAAAAAAAAAAAeDnpXfYBQMRUJjh/vchu2Dd32UX87Mz+9z5s46P1pdaYl4ULUxZvBgDPduHfHu4JeqLs827NVJMJxdqrf3by6f9lW+VfHu7Ddof2Kd+eN9PvwkLNAOAlXTDt20bg7Dsrh/KwL+9CRGYA8KgLY1UUOR5bZ1/p1uz2ZKjMbkYG12blXuTLsdk+EKkWyu3uhfijm822eeLPd/DnDcTo2qSCG5/tgved3vTNM/Ok7HdhIWYA8Iou5Nt9KZp31tlXaa63buTd8biUkIuPieStyHUhXdu1trQL203T8Ecr3bvdPX++gz8vZZ2TpVJL9YIbn+2C/53u9LPjWvHM78JCzADgFV1odG6kP+4pOVQXe/vqdPJuvdW1Jh87S/pKznopVvfe6KFyPkbw5zsTvHn2//VBjlR+ZuOzXXC/05teU3eBdcRCzADgNV3YU3s399bZ11PXFl/csy9zcnJinbW1Y5VLeOe7WfBGe8r5tYM/3yIdnFdrd2Y2zu+CPTPT9R/Bm75lnczpaRcWYAYAr+qCnJx1xXlV/uqM2GffyLqfdz4V3DIH7tm3qS680UPVcl+VvwZ+7GTe+s1t+uHGx12onFlfstf+d3rTT+1X/mkXFmMGAK/oQkEN7bNPKpWavN+QsrXhizo8TVrn55aRPrHPvsqVMTQ3/NHKzZGMDH++c45681JiHF8nnIeZbpzXhaE6klN7ETB5BGf6SfXq6GbahQWYAcD3dGH2AiPr7NvMl5yz7/RMddtbst1tf5Uz1c6at9I1u2dr9qt7t232xB8tVpTZTvjznWWBNy8l90qZplkNbpz3sGu3qqsqV5Pv9KbfmepmMO3CAswA4I28c/4tZika1ptzQ96/F9lwXnUrqXTR+WdZvVHZvArOF3/evB/2FJv7pzPf6U43zhdtBgAhvcdIYQYAs2R7mAEAAAAAAAAAAAAAAAAAAAC8mf8BpUME6WO5DTkAAAAASUVORK5CYII=)

## Test 日志

为了看到更详细的 *build* 过程，于是，打开了 *Test* 任务的日志：

```gradle
task integrationTest(type: Test) {
    description = 'Runs the integration tests.'
    group = 'verification'
    testClassesDirs = sourceSets.integrationTest.output.classesDirs
    classpath = sourceSets.integrationTest.runtimeClasspath
    mustRunAfter test
    testLogging {
        events "passed", "skipped", "failed", "standardOut", "standardError" // 开启日志输出
    }
}

task functionalTest(type: Test) {
    description = 'Runs the functional tests.'
    group = 'verification'
    testClassesDirs = sourceSets.functionalTest.output.classesDirs
    classpath = sourceSets.functionalTest.runtimeClasspath
    mustRunAfter test, integrationTest
    testLogging {
        events "passed", "skipped", "failed", "standardOut", "standardError" // 开启日志输出
    }
}
```

这样，就可以看到测试工程的 *build* 的详细过程了：

```
com.didiglobal.booster.android.gradle.v3_5.V35AppIntegrationTest > test AGPInterface#mergedManifests STANDARD_OUT
    > Task :buildSrc:compileJava NO-SOURCE
    > Task :buildSrc:compileGroovy NO-SOURCE
    > Task :buildSrc:processResources
    > Task :buildSrc:classes
    > Task :buildSrc:jar
    > Task :buildSrc:assemble
    > Task :buildSrc:compileTestJava NO-SOURCE
    > Task :buildSrc:compileTestGroovy NO-SOURCE
    > Task :buildSrc:processTestResources NO-SOURCE
    > Task :buildSrc:testClasses UP-TO-DATE
    > Task :buildSrc:test NO-SOURCE
    > Task :buildSrc:check UP-TO-DATE
    > Task :buildSrc:build
    > Configure project :
    file:/Users/johnsonlee/Workspace/github/didi/booster/booster-android-gradle-v3_5/build/classes/kotlin/integrationTest/
    WARNING: The specified Android SDK Build Tools version (26.0.3) is ignored, as it is below the minimum supported version (28.0.3) for Android Gradle Plugin 3.5.0.
    Android SDK Build Tools 28.0.3 will be used.
    To suppress this warning, remove "buildToolsVersion '26.0.3'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools.

    > Task :preBuild UP-TO-DATE
    > Task :preCnDebugBuild UP-TO-DATE
    > Task :compileCnDebugAidl NO-SOURCE
    > Task :compileCnDebugRenderscript NO-SOURCE
    > Task :checkCnDebugManifest
    > Task :generateCnDebugBuildConfig FROM-CACHE
    > Task :javaPreCompileCnDebug FROM-CACHE
    > Task :mainApkListPersistenceCnDebug
    > Task :generateCnDebugResValues FROM-CACHE
    > Task :generateCnDebugResources UP-TO-DATE
    > Task :mergeCnDebugResources FROM-CACHE
    > Task :createCnDebugCompatibleScreenManifests
    > Task :processCnDebugManifest
    > Task :processCnDebugResources
    > Task :compileCnDebugJavaWithJavac FROM-CACHE
    > Task :compileCnDebugSources UP-TO-DATE
    > Task :mergeCnDebugShaders FROM-CACHE
    > Task :compileCnDebugShaders FROM-CACHE
    > Task :generateCnDebugAssets UP-TO-DATE
    > Task :mergeCnDebugAssets FROM-CACHE
    > Task :processCnDebugJavaRes NO-SOURCE
    > Task :mergeCnDebugJavaResource FROM-CACHE
    > Task :checkCnDebugDuplicateClasses FROM-CACHE
    > Task :transformClassesWithDexBuilderForCnDebug
    > Task :mergeExtDexCnDebug FROM-CACHE
    > Task :mergeDexCnDebug FROM-CACHE
    > Task :validateSigningCnDebug FROM-CACHE
    > Task :signingConfigWriterCnDebug FROM-CACHE
    > Task :mergeCnDebugJniLibFolders FROM-CACHE
    > Task :mergeCnDebugNativeLibs FROM-CACHE
    > Task :stripCnDebugDebugSymbols FROM-CACHE
    > Task :packageCnDebug
    > Task :transformClassesWithBoosterForCnDebug
    > Task :assembleCnDebug
    > Task :preCnReleaseBuild UP-TO-DATE
    > Task :compileCnReleaseAidl NO-SOURCE
    > Task :compileCnReleaseRenderscript NO-SOURCE
    > Task :checkCnReleaseManifest
    > Task :generateCnReleaseBuildConfig FROM-CACHE
    > Task :javaPreCompileCnRelease FROM-CACHE
    > Task :mainApkListPersistenceCnRelease
    > Task :generateCnReleaseResValues FROM-CACHE
    > Task :generateCnReleaseResources UP-TO-DATE
    > Task :mergeCnReleaseResources FROM-CACHE
    > Task :createCnReleaseCompatibleScreenManifests
    > Task :processCnReleaseManifest
    > Task :processCnReleaseResources
    > Task :compileCnReleaseJavaWithJavac FROM-CACHE
    > Task :compileCnReleaseSources UP-TO-DATE
    > Task :prepareLintJar
    > Task :lintVitalCnRelease FAILED

    FAILURE: Build completed with 2 failures.

    1:
    Task failed with an exception.
    -----------
    * What went wrong:
    Execution failed for task ':lintVitalCnRelease'.
    >
    Lint infrastructure error
      Caused by: java.lang.reflect.InvocationTargetException
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at com.android.tools.lint.gradle.api.ReflectiveLintRunner.runLint(ReflectiveLintRunner.kt:38)
        at com.android.build.gradle.tasks.LintBaseTask.runLint(LintBaseTask.java:100)
        at com.android.build.gradle.tasks.LintPerVariantTask.lint(LintPerVariantTask.java:60)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.gradle.internal.reflect.JavaMethod.invoke(JavaMethod.java:103)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.doExecute(StandardTaskAction.java:48)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:41)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:28)
        at org.gradle.api.internal.AbstractTask$TaskActionWrapper.execute(AbstractTask.java:702)
        at org.gradle.api.internal.AbstractTask$TaskActionWrapper.execute(AbstractTask.java:669)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter$5.run(ExecuteActionsTaskExecuter.java:404)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:402)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor$RunnableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:394)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor$1.execute(DefaultBuildOperationExecutor.java:165)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:250)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:158)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.run(DefaultBuildOperationExecutor.java:92)
        at org.gradle.internal.operations.DelegatingBuildOperationExecutor.run(DelegatingBuildOperationExecutor.java:31)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeAction(ExecuteActionsTaskExecuter.java:393)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeActions(ExecuteActionsTaskExecuter.java:376)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.access$200(ExecuteActionsTaskExecuter.java:80)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter$TaskExecution.execute(ExecuteActionsTaskExecuter.java:213)
        at org.gradle.internal.execution.steps.ExecuteStep.lambda$execute$1(ExecuteStep.java:33)
        at java.util.Optional.orElseGet(Optional.java:267)
        at org.gradle.internal.execution.steps.ExecuteStep.execute(ExecuteStep.java:33)
        at org.gradle.internal.execution.steps.ExecuteStep.execute(ExecuteStep.java:26)
        at org.gradle.internal.execution.steps.CleanupOutputsStep.execute(CleanupOutputsStep.java:58)
        at org.gradle.internal.execution.steps.CleanupOutputsStep.execute(CleanupOutputsStep.java:35)
        at org.gradle.internal.execution.steps.ResolveInputChangesStep.execute(ResolveInputChangesStep.java:48)
        at org.gradle.internal.execution.steps.ResolveInputChangesStep.execute(ResolveInputChangesStep.java:33)
        at org.gradle.internal.execution.steps.CancelExecutionStep.execute(CancelExecutionStep.java:39)
        at org.gradle.internal.execution.steps.TimeoutStep.executeWithoutTimeout(TimeoutStep.java:73)
        at org.gradle.internal.execution.steps.TimeoutStep.execute(TimeoutStep.java:54)
        at org.gradle.internal.execution.steps.CatchExceptionStep.execute(CatchExceptionStep.java:35)
        at org.gradle.internal.execution.steps.CreateOutputsStep.execute(CreateOutputsStep.java:51)
        at org.gradle.internal.execution.steps.SnapshotOutputsStep.execute(SnapshotOutputsStep.java:45)
        at org.gradle.internal.execution.steps.SnapshotOutputsStep.execute(SnapshotOutputsStep.java:31)
        at org.gradle.internal.execution.steps.CacheStep.executeWithoutCache(CacheStep.java:201)
        at org.gradle.internal.execution.steps.CacheStep.execute(CacheStep.java:70)
        at org.gradle.internal.execution.steps.CacheStep.execute(CacheStep.java:45)
        at org.gradle.internal.execution.steps.BroadcastChangingOutputsStep.execute(BroadcastChangingOutputsStep.java:49)
        at org.gradle.internal.execution.steps.StoreSnapshotsStep.execute(StoreSnapshotsStep.java:43)
        at org.gradle.internal.execution.steps.StoreSnapshotsStep.execute(StoreSnapshotsStep.java:32)
        at org.gradle.internal.execution.steps.RecordOutputsStep.execute(RecordOutputsStep.java:38)
        at org.gradle.internal.execution.steps.RecordOutputsStep.execute(RecordOutputsStep.java:24)
        at org.gradle.internal.execution.steps.SkipUpToDateStep.executeBecause(SkipUpToDateStep.java:96)
        at org.gradle.internal.execution.steps.SkipUpToDateStep.lambda$execute$0(SkipUpToDateStep.java:89)
        at java.util.Optional.map(Optional.java:215)
        at org.gradle.internal.execution.steps.SkipUpToDateStep.execute(SkipUpToDateStep.java:54)
        at org.gradle.internal.execution.steps.SkipUpToDateStep.execute(SkipUpToDateStep.java:38)
        at org.gradle.internal.execution.steps.ResolveChangesStep.execute(ResolveChangesStep.java:77)
        at org.gradle.internal.execution.steps.ResolveChangesStep.execute(ResolveChangesStep.java:37)
        at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsFinishedStep.execute(MarkSnapshottingInputsFinishedStep.java:36)
        at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsFinishedStep.execute(MarkSnapshottingInputsFinishedStep.java:26)
        at org.gradle.internal.execution.steps.ResolveCachingStateStep.execute(ResolveCachingStateStep.java:90)
        at org.gradle.internal.execution.steps.ResolveCachingStateStep.execute(ResolveCachingStateStep.java:48)
        at org.gradle.internal.execution.impl.DefaultWorkExecutor.execute(DefaultWorkExecutor.java:33)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:120)
        at org.gradle.api.internal.tasks.execution.ResolveBeforeExecutionStateTaskExecuter.execute(ResolveBeforeExecutionStateTaskExecuter.java:75)
        at org.gradle.api.internal.tasks.execution.ValidatingTaskExecuter.execute(ValidatingTaskExecuter.java:62)
        at org.gradle.api.internal.tasks.execution.SkipEmptySourceFilesTaskExecuter.execute(SkipEmptySourceFilesTaskExecuter.java:108)
        at org.gradle.api.internal.tasks.execution.ResolveBeforeExecutionOutputsTaskExecuter.execute(ResolveBeforeExecutionOutputsTaskExecuter.java:67)
        at org.gradle.api.internal.tasks.execution.StartSnapshotTaskInputsBuildOperationTaskExecuter.execute(StartSnapshotTaskInputsBuildOperationTaskExecuter.java:62)
        at org.gradle.api.internal.tasks.execution.ResolveAfterPreviousExecutionStateTaskExecuter.execute(ResolveAfterPreviousExecutionStateTaskExecuter.java:46)
        at org.gradle.api.internal.tasks.execution.CleanupStaleOutputsExecuter.execute(CleanupStaleOutputsExecuter.java:94)
        at org.gradle.api.internal.tasks.execution.FinalizePropertiesTaskExecuter.execute(FinalizePropertiesTaskExecuter.java:46)
        at org.gradle.api.internal.tasks.execution.ResolveTaskExecutionModeExecuter.execute(ResolveTaskExecutionModeExecuter.java:95)
        at org.gradle.api.internal.tasks.execution.SkipTaskWithNoActionsExecuter.execute(SkipTaskWithNoActionsExecuter.java:57)
        at org.gradle.api.internal.tasks.execution.SkipOnlyIfTaskExecuter.execute(SkipOnlyIfTaskExecuter.java:56)
        at org.gradle.api.internal.tasks.execution.CatchExceptionTaskExecuter.execute(CatchExceptionTaskExecuter.java:36)
        at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.executeTask(EventFiringTaskExecuter.java:73)
        at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.call(EventFiringTaskExecuter.java:52)
        at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.call(EventFiringTaskExecuter.java:49)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor$CallableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:416)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor$CallableBuildOperationWorker.execute(DefaultBuildOperationExecutor.java:406)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor$1.execute(DefaultBuildOperationExecutor.java:165)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:250)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.execute(DefaultBuildOperationExecutor.java:158)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:102)
        at org.gradle.internal.operations.DelegatingBuildOperationExecutor.call(DelegatingBuildOperationExecutor.java:36)
        at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter.execute(EventFiringTaskExecuter.java:49)
        at org.gradle.execution.plan.LocalTaskNodeExecutor.execute(LocalTaskNodeExecutor.java:43)
        at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$InvokeNodeExecutorsAction.execute(DefaultTaskExecutionGraph.java:355)
        at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$InvokeNodeExecutorsAction.execute(DefaultTaskExecutionGraph.java:343)
        at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.execute(DefaultTaskExecutionGraph.java:336)
        at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.execute(DefaultTaskExecutionGraph.java:322)
        at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker$1.execute(DefaultPlanExecutor.java:134)
        at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker$1.execute(DefaultPlanExecutor.java:129)
        at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.execute(DefaultPlanExecutor.java:202)
        at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.executeNextNode(DefaultPlanExecutor.java:193)
        at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.run(DefaultPlanExecutor.java:129)
        at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:63)
        at org.gradle.internal.concurrent.ManagedExecutorImpl$1.run(ManagedExecutorImpl.java:46)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
        at org.gradle.internal.concurrent.ThreadFactoryImpl$ManagedThreadRunnable.run(ThreadFactoryImpl.java:55)
        at java.lang.Thread.run(Thread.java:748)
      Caused by: java.lang.OutOfMemoryError: Metaspace
        at java.lang.ClassLoader.defineClass1(Native Method)
        at java.lang.ClassLoader.defineClass(ClassLoader.java:756)
        at java.security.SecureClassLoader.defineClass(SecureClassLoader.java:142)
        at java.net.URLClassLoader.defineClass(URLClassLoader.java:468)
        at java.net.URLClassLoader.access$100(URLClassLoader.java:74)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:369)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:363)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(URLClassLoader.java:362)
        at com.android.tools.lint.gradle.api.DelegatingClassLoader.findClass(DelegatingClassLoader.kt:30)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
        at com.android.tools.lint.checks.BuiltinIssueRegistry.<clinit>(BuiltinIssueRegistry.java:363)
        at com.android.tools.lint.gradle.LintGradleExecution.createIssueRegistry(LintGradleExecution.java:375)
        at com.android.tools.lint.gradle.LintGradleExecution.runLint(LintGradleExecution.java:216)
        at com.android.tools.lint.gradle.LintGradleExecution.lintSingleVariant(LintGradleExecution.java:385)
        at com.android.tools.lint.gradle.LintGradleExecution.analyze(LintGradleExecution.java:91)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at com.android.tools.lint.gradle.api.ReflectiveLintRunner.runLint(ReflectiveLintRunner.kt:38)
        at com.android.build.gradle.tasks.LintBaseTask.runLint(LintBaseTask.java:100)
        at com.android.build.gradle.tasks.LintPerVariantTask.lint(LintPerVariantTask.java:60)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.gradle.internal.reflect.JavaMethod.invoke(JavaMethod.java:103)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.doExecute(StandardTaskAction.java:48)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:41)
        at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:28)


    * Try:

    Run with
    --info
     or
    --debug
     option to get more log output. Run with
    --scan
     to get full insights.
```

从上面的堆栈来看，是 *lintVitalCnRelease* 这个 *Task* 的锅，于是，尝试关掉 `lintVitalCnRelease`：

```gradle
android {

    ...

    lintOptions {
        checkReleaseBuilds false
    }
}
```

再次 *run* 一下测试用例，通过 *VisualVM* 分析，发现 *Metaspace* 的增长曲线变成这样了：

![Normal Metaspace](data:image/png;base64,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)

当然，除了禁用 *lintVital* 的方式外，还可以通过 *gradle.properties* 来调大 *Metaspace* 的大小：

```properties
org.gradle.jvmargs=-XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Xms512m -Xmx2048m
```
