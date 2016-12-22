---
layout: post
title:  【翻-双语】一览新的 Android Gradle 构建工具：新的 DSL 结构 和 Gradle 2.5
author: MrFu
date:   2015-07-17 21:26:00
categories: English
header-img: "img/gradle-tools.jpg"
catalog:    true
tags:
    - English
---

> 译者地址：[【翻】一览新的 Android Gradle 构建工具：新的 DSL 结构 和 Gradle 2.5](http://mrfufufu.github.io/android/2015/07/17/New_Android_Gradle_Build_Tools.html)

> 原文：[First Look at New Android Gradle Build Tools: The new DSL structure and Gradle 2.5](http://inthecheesefactory.com/blog/new-gradle-build-tools-with-gradle-2.5/en)

> 双语对照地址: [【翻-双语】一览新的 Android Gradle 构建工具：新的 DSL 结构 和 Gradle 2.5](http://mrfufufu.github.io/english/2015/07/17/Translate_New_Android_Gradle_Build_Tools.html)

>* 翻译: [MrFu](http://mrfufufu.github.io/)
>* 校验: [MrFu](http://mrfufufu.github.io/)

Android Studio 1.3's stage is closed to the stable release. New features are keep coming including full NDK support. And it seems like some major change is also being waited for its good time to hatch such as a new Gradle Build Tools with the newly designed DSL (gradle script code structure).

Android Studio 1.3 的平台已经接近于稳定的发布版，新的功能不断推出，包括对NDK 的完美支持。它看起来有一些重大的改变也正在等待合适的孵化时机，如：新的 Gradle 构建工具以及新设计的 DSL (gradle 脚本代码结构)

I found it is very interesting after an hour of playing. So I decide to write this blog to introduce you guys the upcoming changes of the build tools to let you prepare.

在我把玩了一个小时之后，我发现它是非常有趣的，所以，我决定去写下这篇博客来向你们这些家伙介绍这个构建工具即将带来的改变，好让你们做好准备。

##What is Android Gradle Build Tools?

##Android Gradle 构建工具(Android Gradle Build Tools)是什么？

In case you don't know yet. Android Gradle Build Tools is a runtime used for processing module's `build.gradle` file before passing it forward to Gradle for the furthur step.

万一你还不知道它呢！Android Gradle 构建工具是一个运行时用于处理 module 下的 `build.gradle` 文件的，在这个文件传递到 Gradle 去做进一步操作之前进行的。

Gradle Build Tools' version is declared in project's `build.gradle` like below:

Gradle Build Tools 在项目中的 `build.gradle` 声明就像下面这样：

```xml
dependencies {
    classpath 'com.android.tools.build:gradle:1.2.3'
}
```

Each version of Gradle Build Tools can work with the supported Gradle version listed below.

每个版本的 Gradle Build Tools 可以与下面列出的受支持的 Gradle 版本协同工作。


| Android Gradle Plugin  |      Gradle     |
|:----------------------:|:---------------:|
|    1.0.0 - 1.1.3       |    2.2.1 - 2.3  |
|         1.2+           |       2.2.1+    |


And the syntax we use these days to write Gradle Script in `build.gradle` file is defined in Android Gradle Build Tools. We call it `DSL` (Domain-Specific Language).

在 Android Gradle Build Tools 中定义了语法规则，和我们使用的语法规则在 `build.gradle` 文件中来写 Gradle 脚本(And the syntax we use these days to write Gradle Script in build.gradle file is defined in Android Gradle Build Tools.). 我们称它为 `DSL`(Domain-Specific Language).

##The new Android Gradle Build Tools
##新的 Android Gradle 构建工具

After DSL hasn't been touched since the launch of Gradle Build Tools 1.0, Android Studio team has decided to do the major change with the new Gradle Build Tools which is still in the experimental stage by change its base to Gradle's new component model mechanism allows significant reduction in configuration time. However development teams are working hard trying to remove these current changes to minimize the migration process from the traditional plugin in the future.

从 Gradle Build Tools 1.0 问世以来， DSL 还没有被动过， Android Studio 团队决定对新的 Gradle Build Tools 做出重大的改变。它仍然在试验阶段，通过改变其基础的 Gradle 的新组件模型机制使其显著的减少在配置上花费的时间。然而开发团队正在努力尝试去移除这些通用的变化，以尽量减少从传统的插件在未来的迁移过程。(However development teams are working hard trying to remove these current changes to minimize the migration process from the traditional plugin in the future.)

Anyway IMHO the new DSL looks pretty good. I must say that I am convinced to change since the new DSL structure and naming is more meaningful than it currently is.

不管怎么样，坦白的说，新的 DSL 看起来相当不错。我必须说我对这些改变非常信服，因为这个新的 DSL 结构以及命名比现在的这个更加有意义。

To try the new Gradle Build Tools, just simply change the build tools' version in project's `build.gradle` to

尝试新的 Gradle Build Tools 只需要简单的在项目的 `build.gradle` 文件中更改 build tools 的版本：

```xml
dependencies {
    classpath 'com.android.tools.build:gradle-experimental:0.1.0'
}
```

Please note that this new version of build tools works with just-released Gradle 2.5 only so you need to install it first by modify `distributionUrl` line in `gradle/gradle-wrapper.properties` file placed in your project.

请注意， 新版本的 build tools 要与刚刚发布的 Gradle 2.5 一起使用才行，所以你需要首先安装 Gradle2.5，在你的项目的 `gradle/gradle-wrapper.properties` 文件下修改 `distributionUrl` 这一行：

```xml
distributionUrl=https\://services.gradle.org/distributions/gradle-2.5-bin.zip
```

Enter settings page (**File -> Settings** on *Windows* or **Android Studio -> Preferences** on *Mac OS X*) and make sure that you check **Use default gradle wrapper**.


进入设置页面( *Windows* 系统在 **File -> Settings** 或 *Mac OS X* 在 **Android Studio -> Preferences** 下)，并且，确保你选择使用的是**默认配置的 gradle wrapper**.

![defaultwrapper](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/Gradle/defaultwrapper.png)


And then modify module's `build.gradle` file from:

然后修改 module 的 `build.gradle` 文件从这样：

```xml
apply plugin: 'com.android.application'
android {
    compileSdkVersion 22
    buildToolsVersion "23.0.0 rc3"

    defaultConfig {
        applicationId "com.inthecheesefactory.hellojni25"
        minSdkVersion 15
        targetSdkVersion 22
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:22.2.0'
}
```
to

改成这样：

```xml
apply plugin: 'com.android.model.application'

model {
    android {
        compileSdkVersion = 22
        buildToolsVersion = "23.0.0 rc3"

        defaultConfig.with {
            applicationId = "com.inthecheesefactory.hellojni25"
            minSdkVersion.apiLevel = 15
            targetSdkVersion.apiLevel = 22
            versionCode = 1
            versionName = "1.0"
        }
    }
    android.buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles += file('proguard-rules.pro')
        }
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:22.2.0'
}
```

You can notice that structure are quite different. `com.android.application` is now changed to `com.android.model.application`. `=` operator is required for the most properties as well as `+=` operator which is used to add element(s) to the collection. Some property's name that are not so clear in the term of meaning are also adjusted, for example, `minSdkVersion` is now changed to `minSdkVersion.apiLevel`

你可以注意到结构有很大的不同。`com.android.application` 现在改为 `com.android.model.application`. 大多数属性要求有 `=` 操作符，以及 `+=` 操作符被用于添加元素（也许是多个）到集合中。以前一些属性的名字定义的不是非常的清晰的，现在也有所调整，举个例子：`minSdkVersion` 现在变成了 `minSdkVersion.apiLevel` 

Well, let's sync project with gradle files to apply the change.

好了，让我们用 gradle 文件同步项目去应用这些改变。

![syncgradle](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/Gradle/syncgradle.png)




And then simply run it. Everything works fine as expected with the more meaningful syntax, built with new-fresh Gradle 2.5.

然后只需要运行它。在使用更有意义的语法规则后，一切按预期的那样工作。使用新鲜出炉的 Gradle 2.5 构建！

![run](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/Gradle/run.png)


##Give NDK support a try

##试试 NDK 的支持

Android Studio 1.3 was proudly announced with full NDK Support. So let's give a try with some very simple native codes. First of all, you need to define a NDK's directiory to project's `local.properties` file. Please note that you can use both NDK r10e available in [Android NDK Downloads Page](https://developer.android.com/ndk/downloads/index.html) and NDK Bundle available in SDK Manager.

Android Studio 1.3 嘚瑟的宣布了完全支持 NDK。所以，让我们用一个非常简单的 native 代码例子来做尝试。首先，你需要在项目的 `local.properties` 文件里定义一个 NDK 的目录。请注意你可以在 [Android NDK Downloads Page](https://developer.android.com/ndk/downloads/index.html) 中显示的 NDK r10e 和在 SDK Manager 中显示的 NDK Bundle 都是可以使用的。

```xml
ndk.dir=PATH_TO_NDK_ROOT
```

Create `HelloJni.java` somewhere in your java package.

创建 `HelloJni.java` 放在你的 Java 包下。

```java
public class HelloJni {
    public native String stringFromJNI();
}
```

Make a **jni** folder inside **src/main** and create `hello-jni.c` file with the content shown below.

在 **src/main** 目录里面创建一个 **jni** 文件夹，并且创建一个 `hello-jni.c` 文件里面写如下的内容：

**hello-jni.c**

```c
#include <string.h>
#include <jni.h>

jstring
Java_com_inthecheesefactory_hellojni25_HelloJni_stringFromJNI( JNIEnv* env,
                                                  jobject thiz )
{
#if defined(__arm__)
  #if defined(__ARM_ARCH_7A__)
    #if defined(__ARM_NEON__)
      #if defined(__ARM_PCS_VFP)
        #define ABI "armeabi-v7a/NEON (hard-float)"
      #else
        #define ABI "armeabi-v7a/NEON"
      #endif
    #else
      #if defined(__ARM_PCS_VFP)
        #define ABI "armeabi-v7a (hard-float)"
      #else
        #define ABI "armeabi-v7a"
      #endif
    #endif
  #else
   #define ABI "armeabi"
  #endif
#elif defined(__i386__)
   #define ABI "x86"
#elif defined(__x86_64__)
   #define ABI "x86_64"
#elif defined(__mips64)  /* mips64el-* toolchain defines __mips__ too */
   #define ABI "mips64"
#elif defined(__mips__)
   #define ABI "mips"
#elif defined(__aarch64__)
   #define ABI "arm64-v8a"
#else
   #define ABI "unknown"
#endif

    return (*env)->NewStringUTF(env, "Hello from JNI !!  Compiled with ABI " ABI ".");
}
```

Please don't forget to change `com_inthecheesefactory_hellojni25` to match HelloJni.java's package name or it will just simply not working.

请不要忘记将 `com_inthecheesefactory_hellojni25` 改变成对应的 HelloJni.java 的包名，否则它是不工作的。

For those who are familiar with NDK, you might notice that Makefiles aren't needed anymore.

对于那些熟悉 NDK 的人，你可能注意到了 Makefiles 已经不再需要了。

And here is the final file structure.

这是最终的文件目录：

![files](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/Gradle/files.png)

Now let's test the JNI code in `MainActivity.java` by placing code below at the very last line of **MainActivity** class.

现在，让我们在 `MainActivity.java` 中测试这段 JNI 代码，把下面这段代码放到 **MainActivity** 类的最后一行：

```java
public class MainActivity extends AppCompatActivity {
    ...
    static {
        System.loadLibrary("hello-jni");
    }
}
```
```java
Modify `onCreate` like this.

修改 `onCreate` 就像这样：

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Toast.makeText(MainActivity.this,
                    new HelloJni().stringFromJNI(),
                    Toast.LENGTH_LONG)
            .show();
}
```

Done! You can now use the native code through Java code. Run to try it.

duang~完成！现在，你可以通过 Java 代码来使用 native 代码了，运行试试吧

![screenshot18](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/Gradle/screenshot18.png)


And with the awesome full support of NDK on Android Studio, Java code and Native code can now work seemlessly. If you inspect code in Java, it will jump you to the right place in native code.

随着在 Android Studio 上令人惊叹的完全支持 NDK，Java 代码现和 Native 代码现在可以配合更加天衣无缝。如果你在 Java 中调试代码，它将会跳转到 native 代码的正确位置。（译者：这点还真是令人惊叹喔！）

![linkjni](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/Gradle/linkjni.png)


Anyway it is still in the experimental stage. Some features are still under development. Better wait for the final release for serious use.

不管怎么说，它仍然处于实验阶段，某些功能仍在开发中。对于严肃的用户来说，最好等到它最终发布吧。

##Conclusion
##结论

I must say that the new Gradle Build Tools is very interesting. Major change to DSL looks really promising and far more meaningful than the current one. The great code should be able to tell what it does, agree?

我必须说新的 Gradle Build Tools 是非常有趣的。主要改变的 DSL 看起来非常有前途，并且对于现在的来说具有更深远的意义。优秀的代码应该能告诉我们它能做什么（译者：能从字面意思理解这段代码的意思），对吧？

However it is still in the experimental stage. The DSL is not final yet. We better just study and know its existence rather than switching to the new one right now. Anyway I believe that it would not be so long until the stable release available for real use. Be prepared !

然后它仍然还处于实验阶段。这个 DSL 还不是最终的版本，我们最好只是学习和了解他的存在，而不是现在立刻就切换到这个新的版本。不管怎么说，我相信距离它发布可供实际使用的稳定版本不会很久了。做好准备吧！

More information available here >> Experimental Plugin User Guide

可以在这里了解更多的信息 >>[Experimental Plugin User Guide](http://tools.android.com/tech-docs/new-build-system/gradle-experimental)

=)



![p11](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/11.png)
Author: nuuneoi (Android GDE, CTO & CEO at The Cheese Factory)
A full-stack developer with more than 6 years experience on Android Application Development and more than 12 years in Mobile Application Development industry. Also has skill in Infrastucture, Service Side, Design, UI&UX, Hardware, Optimization, Cooking, Photographing, Blogging, Training, Public Speaking and do love to share things to people in the world!

