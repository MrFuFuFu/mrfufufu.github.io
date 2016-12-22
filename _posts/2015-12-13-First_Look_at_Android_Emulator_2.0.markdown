---
layout: post
title:  初窥 Android 模拟器 2.0，这些年来最大最棒的更新
subtitle: First Look at Android Emulator 2.0, the biggest and the best update yet in years
author: MrFu
date:   2015-12-13 15:50:00
categories: Android
header-img: "img/post-bg-androidemulator2.jpg"
catalog:    true
tags:
    - Android
---


> 原文地址：[初窥 Android 模拟器 2.0，这些年来最大最棒的更新](http://mrfu.me/android/2015/12/13/First_Look_at_Android_Emulator_2.0/)

> 翻译原文：[First Look at Android Emulator 2.0, the biggest and the best update yet in years](http://inthecheesefactory.com/blog/first-look-at-android-emulator-2.0/en)



我相信，所有的 Android 开发者都会同意 2015年 Android 开发者大会发布的最大的消息是 Android Studio 2.0 和 **Android 模拟器2.0**，该版本模拟器宣称它的运行和部署应用的速度相较第一个版本来说是难以置信的快。

![emulator_fastapk](/img/article/emulator_fastapk.jpg)

几个小时前，Android 开发者团队刚刚公开的推出了这个最新的模拟器。让我们给你展示一下这个 Android 模拟器史上最大的更新，你肯定不会想错过的。

## 安装

从安装开始，这样我们就可以一起开始了。

第一件事情是安装 **Android Studio 2.0 预览版 3b**，在 [Canary Channel](http://tools.android.com/download/studio/canary) 上有提供，要切换更新到通道到 Canary上，只需要在 **Help -> Check for Update…** 然后改变最顶部下拉菜单选择 **Canary Channel**（译者：事实上是在 Updatas 这里，然后选择 Automatically check updates for 为 Canary Channel，如图）。然后，再一次检查更新之后，Android Studio 2.0 就会安装到你的电脑上了。

![emulator_tran_canary](/img/article/emulator_tran_canary.png)

![emulator_canary](/img/article/emulator_canary.png)

Android 模拟器 2.0 要和 Android SDK Tools v25 一起更新到最新，所以，接下来的事情，你必须安装的是 **Android SDK Tools v25 rc1**，它可以通过 SDK Manager 来完成，或者如果当你读到这篇博客的时候有更新的版本提供的时候，你最好更新到最新的版本，这总是一个最好的方案。

![emulator_asdktools](/img/article/emulator_asdktools.png)

新的模拟器速度快的原因是 **Intel x86 模拟器加速度（HAXM installer）**。在 Extras 选项中下载提供的最新版本。

![emulator_haxminstaller](/img/article/emulator_haxminstaller.png)

正如上面提的这个名字，SDK Manager 下载的只是一个安装程序。它还不会为你安装 HAXM。你需要自己手动安装到 **Android SDK 文件夹下**，而且应该是 `extras/intel/Hardware_Accelerated_Execution_Manager`。你会看到一个安装程序躺在该目录下。只管去做吧，而且必须得做。

![emulator_haxminstaller2](/img/article/emulator_haxminstaller2.png)

最后一个要下载的是 **Android 5.0 - Google APIs Intel x86 Atom System Image rev 10**，用它作为一个模拟器的 ROM 镜像。

![emulator_gapisrev10](/img/article/emulator_gapisrev10.png)

都做完了！准备开始！

## 试一试

让我跳过 Android 虚拟设备创建的部分，因为我相信，每一个 Android 开发者都可以做到，你自己通过在 Android Studio 2.0 里提供的 AVD Manager 创建。

![emulator_avdmanager](/img/article/emulator_avdmanager.png)

请注意，在这部分里有一个新的试验性功能提供。你可以为模拟器指定 CPU 的内核数量，如果不设置的话，它会自动设置为默认值1。

![emulator_cpucores](/img/article/emulator_cpucores.png)

启动创建的 AVD 的时候到了。

![emulator_em2](/img/article/emulator_em2.jpg)

哇喔喔喔喔喔喔喔喔喔喔喔喔，Android 模拟器2.0！变化时显而易见的。你可以在模拟器屏幕的右侧看到新的工具栏。

把玩了一个小时之后，**我发现模拟器的启动和运行都比以前的版本快很多**。不管怎样，我必须说，我感觉它还是比 Genymotion 慢一点点。但不错的是，它是可以接受的，而且非常满意。

这里有相当多的新功能提供。最明显的是你现在可以简单的调整窗口的大小了。

![emulator_shrink](/img/article/emulator_shrink.jpg)

对于这些额外的功能，比如：GPS 仿真，指纹识别，电话呼叫，短信发送等，在以前的版本我们要通过命令行来做，而现在它在图形界面上提供了。我必须说这容易了100倍啊！

![emulator_settings](/img/article/emulator_settings.png)

在这个新版本中，对我来说这些扩展的控制是最令人印象深刻的功能，因为它是非常方便和非常的完善。还有更棒的...它是免费的。

现在让我们测试 apk 的部署速度。我发现它的传输速度是难以置信的快，达到了**50MB/s**。

```
$ adb -s emulator-5554 install app-release.apk
pkg: /data/local/tmp/app-release.apk
Success
51410 KB/s (6160590 bytes in 0.117s)
```

它比三星 Galaxy Note 3 LTE 手机的传输速度要快上10倍，这个手机可能在  5MB/s 的样子。在这样的速度下，它也可以显著的提高开发的速度。

总之，Android 模拟器 2.0 真的令人满意。**因其功能的完整性和免费的原因，我现在会考虑将我的主要模拟器从 Genymotion 切换到 Android 模拟器 2.0**。

然而，一些缺点仍然存在。**它消耗了相当多的内存**。

![emulator_memoryconsumption](/img/article/emulator_memoryconsumption.png)

但是它在 8GB+ 内存的机器上运行的还是可以的。

通常情况下，对着这样的大更新，我非常高兴。对于这个新的大事情，请尝试一下，随意感受一下，并分享一下你的意见。

周末愉快 =)




