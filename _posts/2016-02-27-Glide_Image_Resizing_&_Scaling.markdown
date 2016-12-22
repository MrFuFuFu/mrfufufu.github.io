---
layout: post
title:  "Glide - 图片重设大小 和 缩放"
subtitle:   "Glide — Image Resizing & Scaling"
author: MrFu
date:   2016-02-27 17:00:00
catalog:    true
tags:
    -  Glide
---

在前几篇博客中，你已经知道如何从不同的资源中加载图片，以及哪些不同的方式的占位符。这周的博客是重要的，如果你不能支配图片的大小去加载：调整大小和缩放。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/)
4. [占位符 和 渐现动画](http://mrfu.me/2016/02/27/Glide_Placeholders_&_Fade_Animations/)
5. 图片重设大小 和 缩放
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

## 用 resize(x,y) 调整图片大小

通常情况下，如果你的服务器或者 API 提供的图像是你需要的精确尺寸，这时是完美的情况下，在内存小号和图像质量之间的权衡。

在和 Picasso 比较后，Glide 有[更加高效](http://inthecheesefactory.com/blog/get-to-know-glide-recommended-by-google/en)的内存管理。Glide 自动限制了图片的尺寸在缓存和内存中，并给到 `ImageView` 需要的尺寸。Picasso 也有这样的能力，但需要调用 `fit()` 方法。对于 Glide，如果图片不会自动适配到 `ImageView`，调用 `override(horizontalSize, verticalSize)
`。这将在图片显示到 `ImageView`之前重新改变图片大小。

```java
Glide
    .with(context)
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .override(600, 200) // resizes the image to these dimensions (in pixel). does not respect aspect ratio
    .into(imageViewResize);
```

当你还没有目标 view 去知道尺寸的时候，这个选项也可能是有用的。比如，如果 App 想要在闪屏界面预热缓存，它还不能测量 `ImageView` 的尺寸。然而，如果你知道这个图片多少大，用 override 去提供明确的尺寸。

## 缩放图像

现在，对于任何图像操作，调整大小真的能让长宽比失真并且丑化图像显示。在你大多数的使用场景中，你想要避免发生这种情况。Glide 提供了一般变化去处理图像显示。提供了两个标准选项：`centerCrop` 和 `fitCenter`。

## CenterCrop

`CenterCrop()`是一个裁剪技术，即缩放图像让它填充到 `ImageView` 界限内并且裁剪额外的部分。`ImageView` 可能会完全填充，但图像可能不会完整显示。

```java
Glide
    .with(context)
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .override(600, 200) // resizes the image to these dimensions (in pixel)
    .centerCrop() // this cropping technique scales the image so that it fills the requested bounds and then crops the extra.
    .into(imageViewResizeCenterCrop);
```

## FitCenter

`fitCenter()` 是裁剪技术，即缩放图像让图像都测量出来等于或小于 `ImageView` 的边界范围。该图像将会完全显示，但可能不会填满整个 `ImageView`。

```java
Glide
    .with(context)
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .override(600, 200)
    .fitCenter() 
    .into(imageViewResizeFitCenter);
```

我们会在以后的博客去做自定义的转换，以及 `centerCrop()` 和 `fitCenter()` 。

## Outlook

在这篇博客中，你学会如何去对图像的大小和显示进行调整。这对创建一个很棒的应用非常具有帮助。在我们进入 Glide 进阶课程之前，我们来看一个 Glide 很独特的功能：显示 Gif 和 video。