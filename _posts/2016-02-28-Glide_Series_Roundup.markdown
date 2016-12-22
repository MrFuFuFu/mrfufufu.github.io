---
layout: post
title:  "Glide - 系列综述"
subtitle:   "Glide — Series Roundup"
author: MrFu
date:   2016-02-28 14:49:00
catalog:    true
tags:
    -  Glide
---


从开始我们的 Glide 图片加载库系列以来已经过去相当长的时间了。随着时间的推移，这个短系列变得越来越长。我们很感谢你的持续关注和反馈。我们希望你能像我们一样学到很多。让我们回顾一下我们所涵盖的主题。我们强烈推荐你花上一分钟时间通过这个列表来确认你都从这个 Glide 系列中学到了些什么。

## 图像基础，用 Glide 加载 Gif 和 Video

我们从简单介绍和演示了 Glide 加载图片，Gif 和本地视频的方式。这部分适用于每个刚开始用 Glide 的人。

* [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/) 原文：[Getting Started & Simple Loading](https://futurestud.io/blog/glide-getting-started)
* [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/) 原文：[Advanced Loading](https://futurestud.io/blog/glide-advanced-loading)
* [显示 Gif 和 Video](http://mrfu.me/2016/02/27/Glide_Displaying_Gifs_&_Videos/) 原文：[Displaying Gifs & Videos](https://futurestud.io/blog/glide-displaying-gifs-and-videos)

## 图像显示和占位符

接下来，我们看了如何让 Glide 用在 `ListView` 或 `GrideView` 的适配器中。我们也向你展现了 Glide 的占位符实现和渐现动画。

* [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/) 原文：[ListAdapter (ListView, GridView)](https://futurestud.io/blog/glide-listadapter-listview-gridview)
* [占位符 和 渐现动画](http://mrfu.me/2016/02/27/Glide_Placeholders_&_Fade_Animations/) 原文：[Placeholders & Fade Animations](https://futurestud.io/blog/glide-placeholders-fade-animations)

## 图片大小重设和缩略图

后来学了如何加载和显示图片，我们转义到了基本的图片处理。首先我们已经介绍了你对 Glide 的可能的选项来改变图像的大小和缩放。我也展示了你可以请求和利用缩略图。

* [图片重设大小 和 缩放](http://mrfu.me/2016/02/27/Glide_Image_Resizing_&_Scaling/) 原文：[Image Resizing & Scaling](https://futurestud.io/blog/glide-image-resizing-scaling)
* [缩略图](http://mrfu.me/2016/02/27/Glide_Thumbnails/) 原文：[Thumbnails](https://futurestud.io/blog/glide-thumbnails)

## 缓存和请求优先级

Glide 就像任何 Android 中的图片加载库，它的缓存组件部分决定了这个库是活的还是死的。在缓存基础的文章中，我们已经呈现了 Glide 方法的构建预览。此外，我们展示了如何处理单个单个请求的缓存行为。在下面的博客中，我们呈现了你该如何去对请求做优先级排序，以及确保重要图片首先被加载和显示。

* [缓存基础](http://mrfu.me/2016/02/27/Glide_Caching_Basics/) 原文：[Caching Basics](https://futurestud.io/blog/glide-caching-basics)
* [请求优先级](http://mrfu.me/2016/02/27/Glide_Request_Priorities/) 原文：[Request Priorities](https://futurestud.io/blog/glide-request-priorities)

## Glide Target 的回调

在接下来的两篇博客中，我们一直假定你是加载图片到标准的 `ImageView` 中。在这两篇中，我们可以选择如何使用 Glide 去异步加载图片到不同的 target 中。如果你需要去加载图片到自定义的视图中，通知或应用小部件，就这些啦：

* [回调：SimpleTarget 和 ViewTarget 用于自定义视图类](http://mrfu.me/2016/02/27/Glide_Callbacks_SimpleTarget_and_ViewTarget_for_Custom_View_Classes/) 原文：[Callbacks: SimpleTarget and ViewTarget for Custom View Classes](https://futurestud.io/blog/glide-callbacks-simpletarget-and-viewtarget-for-custom-view-classes)
* [加载图片到通知栏和应用小部件中](http://mrfu.me/2016/02/27/Glide_Loading_Images_into_Notifications_and_AppWidgets/) 原文：[Loading Images into Notifications and RemoteViews](https://futurestud.io/blog/glide-loading-images-into-notifications-and-appwidgets)

## 异常 和 调试

当创建了一个新应用，在开发过程中不是所有的事情都是正常工作的。重要的是当你不知道一些东西为什么不工作的时候有什么样的方法可以处理。这就是为什么我们介绍了一篇特别的文章就是为了调试和错误处理。这可能听起来不是很有吸引力，但重要的是让你知道在未来碰到此类问题的时候，你可以如何处理：

* [异常：调试和错误处理](http://mrfu.me/2016/02/28/Glide_Exceptions-_Debugging_and_Error_Handling/) 原文：[Exceptions: Debugging and Error Handling](https://futurestud.io/blog/glide-exceptions-debugging-and-error-handling)

## Glide 转换

在向你展示了所有 Glide 基础之后，我们开始了更多的自定义功能。如果你需要在显示图片之前做处理，自定义转换的博客写给你看了：

* [自定义转换](http://mrfu.me/2016/02/28/Glide_Custom_Transformations/) 原文：[Custom Transformation](https://futurestud.io/blog/glide-custom-transformation)
* [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/) 原文：[How to Rotate Images](https://futurestud.io/blog/glide-how-to-rotate-images)

# Glide 动画

Glide 不仅可以转换动画，它还能控制图片的显示。如果你想要给你的图片增加一个 eye-popping 动画，可以读读这篇博客：

* [用 animate() 自定义动画](http://mrfu.me/2016/02/28/Glide_Custom_Animations_with_animate()/) 原文：[Custom Animations with animate()](https://futurestud.io/blog/glide-custom-animations-with-animate)

## Glide Module

我们最后一个主题是 Glide module。Glide module 给了一个抽象的方式来自定义每个组件和 Glide 的行为。如果你正式在生产应用中使用 Glide 的话，确保你都看过这些了。这可能和一块宝石一样重要：

* [集成网络栈](http://mrfu.me/2016/02/28/Glide_Integrating_Networking_Stacks/) 原文：[Integrating Network Stacks](https://futurestud.io/blog/glide-integrating-networking-stacks)
* [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/) 原文：[Customize Glide with Modules](https://futurestud.io/blog/glide-customize-glide-with-modules)
* [Module 实例：接受自签名证书的 HTTPS](http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/) 原文：[Glide Module Example: Self-Signed HTTPS Network Stack](https://futurestud.io/blog/glide-module-example-accepting-self-signed-https-certificates)
* [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/) 原文：[Glide Module Example: Customize Caching](https://futurestud.io/blog/glide-module-example-customize-caching)
* [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/) 原文：[Glide Module Example: Optimizing By Loading Images In Custom Sizes](https://futurestud.io/blog/glide-module-example-optimizing-by-loading-images-in-custom-sizes)
* [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/) 原文：[Dynamically Use Model Loaders](https://futurestud.io/blog/glide-dynamically-use-model-loaders)

## 最后：Glide 这本书！

如果你过去看了一个或多个这个系列的文章的话，你肯定已经看到了我们这本书的提示了。我们已经[出版了 Glide 的书](https://leanpub.com/glide-image-loading-on-android)去给对这个感兴趣的用户早些进入一个连贯的介绍 Glide 在一个 DPF （或 `mobi`/`.epub`）文件中看。此外，我们还增加了额外的内容来感谢你。不要担心，如果你读了这个系列的博客的话，你并不会错过太多。但对于所有支持我们的以及购买了这个系列的书的人说：**谢谢你们！**

为着你们的兴趣和鼓励，再次感谢大家，我们非常感激。

最后：这个系列还错过了什么了吗？我们能做的更好吗？让我们在评论中知道吧。

我们期待在接下来的 Future Studio 其他系列中看到你。