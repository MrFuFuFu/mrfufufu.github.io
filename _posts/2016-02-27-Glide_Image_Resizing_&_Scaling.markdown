---
layout: post
title:  Glide - 图片重设大小 和 缩放
author: MrFu
date:   2016-02-27 17:00:00
tags:
    -  Glide
---

在前几篇博客中，你已经知道如何从不同的资源中加载图片，以及哪些不同的方式的占位符。这周的博客是重要的，如果你不能支配图片的大小去加载：调整大小和缩放。

## Glide 系列预览

## 用 resize(x,y) 调整图片大小

通常情况下，如果你的服务器或者 API 提供的图像是你需要的精确驰却，这时是完美的情况下，在内存小号和图像质量之间的权衡。

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

`CenterCrop()`是一个裁剪技术，即缩放图像让它填充到 `ImageView` 界限内并且侧键额外的部分。`ImageView` 可能会完全填充，但图像可能不会完整显示。

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