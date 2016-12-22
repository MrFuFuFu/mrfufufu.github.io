---
layout: post
title:  百分比布局支持库
subtitle: RelativeLayout 和 FrameLayout 的尺寸用 % 来表示
author: MrFu
date:   2015-08-31 17:52:00
categories: Android
header-img: "img/percentcover.jpg"
catalog:    true
tags:
    - Android
---


> 原文地址：[百分比布局支持库](http://mrfu.me/android/2015/08/31/percent_support_library/)

> 参考原文：[Percent Support Library: Bring dimension in % to RelativeLayout and FrameLayout](http://inthecheesefactory.com/blog/know-percent-support-library/en)


虽然有很多的布局可以在 Android 应用程序开发的世界供我们使用，但我们总是只用这三种布局：LinearLayout, RelativeLayout and FrameLayout。

不管怎么说在用 RelativeLayout 和 FrameLayout 的时候总有一些问题，因为你不能设置子视图的百分比程度。只有两种方法可能做到，1. 布局在 LinearLayout 里并用它的 layout_weight 布局参数；2. 在 Java 代码中重写 onMeasure 方法来实现。

举个例子，如果我想在 RelativeLayout 里放一个简单的红色矩形，它是在顶部，并且距离左边的 5% 的位置，宽度为屏幕的25%。我们的代码可以这样写：

```java
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:weightSum="20">

        <View
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            />

        <View
            android:layout_width="0dp"
            android:layout_height="100dp"
            android:layout_weight="5"
            android:background="#ff0000" />

    </LinearLayout>

</RelativeLayout>
```

这是结果：

![percentlayout_1](/img/percentlayout_1.png)

你会注意到这样的代码应该是非常复杂的。与此同时，这些控件也用视图和 LinearLayout 填充着，我们可以把它们看成是一种浪费。

这将不再是一个问题啦，因为在前几天 Android M 宣布了它的名字：棉花糖(Marshmallow)，Android 团队推出了许多支持库去帮助开发者与碎片化的战斗！其中之一就是 [百分比支持库(Percent Support Library)](http://developer.android.com/reference/android/support/percent/package-summary.html)，它具备的能力是用百分比去设置 RelativeLayout 和 FrameLayout 的尺寸！

## 你好，百分比支持库

这个库是非常容易使用的，因为它就如同 RelativeLayout 和 FrameLayout 一样我们都熟悉，只是有一些额外的功能。

首先，因为百分比支持库是随着 Android Support Library 23 一起的，所请确保你已经在 **SDK Manager** 中的 Android Support Library 更新了最新的版本。然后在 `build.gradle` 文件中添加下面这样的依赖：

```xml
compile 'com.android.support:percent:23.0.0'
```

现在，在使用老的 RelativeLayout 和 FrameLayout 做替换，只需要简单的将他们各自切换到 `android.support.percent.PercentRelativeLayout` 和 `android.support.percent.PercentFrameLayout`。这里有9个布局参数可以使用：

> `layout_widthPercent` : 用百分比来表示宽度，比如：`app:layout_widthPercent="25%"`

> `layout_heightPercent` : 用百分比来表示高度

> `layout_marginPercent` : 用百分比来表示 Margin

其余的是用百分比来表示每个 margin 面 `layout_marginLeftPercent`, `layout_marginRightPercent`, `layout_marginTopPercent`, `layout_marginBottomPercent`, `layout_marginStartPercent`, `layout_marginEndPercent`

用 `PercentRelativeLayout`，上面的代码例子就能这样来写了：

```xml
<android.support.percent.PercentRelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <View
        app:layout_widthPercent="25%"
        android:layout_height="100dp"
        app:layout_marginLeftPercent="5%"
        android:background="#ff0000" />
</android.support.percent.PercentRelativeLayout>
```

这是结果：

![percentlayout_2](/img/percentlayout_2.png)

你可以看到结果是完全是一致的，而且具有更短更清晰的代码，此外，该空间现在没有填充其他布局，这就让性能达到了更好的程度。

实际上这本应该就是 Android 整体的一部分，但不幸的是，事实并非如此。把它填加到原生Android 的RelativeLayout/FrameLayout 已经太迟了，因为用户用的设备都是老的操作系统版本，不可能支持使用这个功能。所以这就是为什么 Android 团队决定把它作为一个支持库来发布，我支持这个主意。

请去尝试一下，它是有助于让你的代码更加干净，更加好 =)

