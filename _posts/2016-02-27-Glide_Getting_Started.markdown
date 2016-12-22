---
layout: post
title:  "Glide - 开始！"
subtitle:   "Glide — Getting Started"
author: MrFu
date:   2016-02-27 12:00:00
catalog:    true
tags:
    -  Glide
---

> 译者注：原文[Glide — Getting Started](https://futurestud.io/blog/glide-getting-started)

在我们的 Picasso 系列收到很多成功的反馈后，我们要开始延伸另外一个令人惊讶的图片加载库系列：Glide。

Glide，就像 Picasso，可以从多个源去加载和显示图片，同时也兼顾缓存和在做图片处理的时候维持一个低内存消耗。它已经在 Google 官方 APP （如 Google 2015开发者大会的应用程序）中使用了，就和 Picasso 一样受欢迎。在这个系列中，我们要探讨 Glide 和 Picasso 的不同和优势。

## Glide 系列预览

1. 开始！
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/)
4. [占位符 和 渐现动画](http://mrfu.me/2016/02/27/Glide_Placeholders_&_Fade_Animations/)
5. [图片重设大小 和 缩放](http://mrfu.me/2016/02/27/Glide_Image_Resizing_&_Scaling/)
6. [显示 Gif 和 Video](http://mrfu.me/2016/02/27/Glide_Displaying_Gifs_&_Videos/)
7. [缓存基础](http://mrfu.me/2016/02/27/Glide_Caching_Basics/)
8. [请求优先级](http://mrfu.me/2016/02/27/Glide_Request_Priorities/)
9. [缩略图](http://mrfu.me/2016/02/27/Glide_Thumbnails/)
10. [回调：SimpleTarget 和 ViewTarget 用于自定义视图类](http://mrfu.me/2016/02/27/Glide_Callbacks_SimpleTarget_and_ViewTarget_for_Custom_View_Classes/)
11. [加载图片到通知栏和应用小部件中](http://mrfu.me/2016/02/27/Glide_Loading_Images_into_Notifications_and_AppWidgets/)
12. [异常：调试和错误处理](http://mrfu.me/2016/02/28/Glide_Exceptions-_Debugging_and_Error_Handling/)
13. [自定义转换](http://mrfu.me/2016/02/28/Glide_Custom_Transformations/)
14. [用 animate() 自定义动画](http://mrfu.me/2016/02/28/Glide_Custom_Animations_with_animate()/)
15. [集成网络栈](http://mrfu.me/2016/02/28/Glide_Integrating_Networking_Stacks/)
16. [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/)
17. [Module 实例：接受自签名证书的 HTTPS](http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/)
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 为何使用 Glide？

有经验的 Android 开发者可以跳过这节，但对于初学者来说，你可能会问自己为什么你想要去用 Glide，而不是自己去实现。

Android 在处理图片工作的时候显得有点娘，因为它会以[像素形式](http://developer.android.com/intl/zh-cn/training/displaying-bitmaps/index.html)加载图片到内存中去，一张照片平均普通的手机摄像头尺寸是 2592x1936 像素（5百万像素）将大约会分配 19MB 内存。对于复杂的网络情况，缓存和图片处理，如果你用了一个测试完善开发完成的库，如 Glide，你会省下大量的时间，还不会让你头疼！

在这个系列，我们将看到 Glide 的很多特性，去看下这篇博客的提纲，并考虑你是否真的要去开发所有这些功能。

## 添加 Glide

希望我们现在已经说服你去用一个库去处理你的图片加载请求了。如果你想要了解更多 Glide 的情况，这就是为你准备的指南！

首先，添加 Glide 到你的依赖中，写这篇博客的时候，最新的版本是 Glide 是 3.6.1(译者：现在是3.7.0了)

## Gradle

和大多数依赖一样，在一个 Gradle 项目中在你的 `build.gradle` 中添加下面这行代码：

``` xml
compile 'com.github.bumptech.glide:glide:3.6.1'
```

## Maven

Glide 也支持 Maven 项目：

```xml
<dependency>
<groupId>com.github.bumptech.glide</groupId>
<artifactId>glide</artifactId>
<version>3.6.1</version>
<type>aar</type>
</dependency>
```

## 第一次：从一个 URL 中加载图片

就像 Picasso， Glide 库是使用[流接口(fluent interface)](https://en.wikipedia.org/wiki/Fluent_interface)。对一个完整的功能请求，Glide 建造者要求最少有三个参数。

* `with(Context context)` - 对于很多 Android API 调用，[Context](http://developer.android.com/intl/zh-cn/reference/android/content/Context.html) 是必须的。Glide 在这里也一样
* `load(String imageUrl)` - 这里你可以指定哪个图片应该被加载，同上它会是一个字符串的形式表示一个网络图片的 URL
* `into(ImageView targetImageView)` 你的图片会显示到对应的 ImageView 中。

理论解释总是苍白的，所以，看一下实际的例子吧：

```java
ImageView targetImageView = (ImageView) findViewById(R.id.imageView);
String internetUrl = "http://i.imgur.com/DvpvklR.png";

Glide
    .with(context)
    .load(internetUrl)
    .into(targetImageView);
```

就这样！如果图片的 URL 存在并且你的 `ImageView` 是可见的，你会在几秒后看到图片。万一图片不存在，Glide 会返回一个错误的回调（我们会在后面讨论这个）。你可能已经相信这三行代码对你而言是有用的，但是这只是冰山一角啦。

## 展望

在下一篇文章中，除了从一个网络 URL 中加载，我们将开始其他选项来加载图片。具体来说，我们将从 Android 资源，本地文件，和一个 Uri 中加载图片。
