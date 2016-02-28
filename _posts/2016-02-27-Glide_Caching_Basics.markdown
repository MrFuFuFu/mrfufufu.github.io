---
layout: post
title:  Glide - 缓存基础
author: MrFu
date:   2016-02-27 19:00:00
tags:
    -  Glide
---


当我们看了加载，显示和处理图像后，我们将会继续进行优化的进程。图像成功和高效加载的一个很基础的功能是缓存！在这篇博客中，我们将整理在 Glide 中的缓存基础。

## Glide 系列预览


## 缓存基础

在 Android App 中必须去做的是一个很好的实现图片加载组件，尝试去减少网络请求。Glide 在这里并没有什么不同。Glide 通过使用默认的内存和磁环缓存去避免不必要的网络请求。我们将在后面的博客中去详细的查看实现细节。如果你等不到那个时候，通过浏览[官方文档](https://github.com/bumptech/glide/wiki/Caching-and-Cache-Invalidation)这个话题。

目前最重要的是带着所有的图片请求放到内存和磁盘中。虽然缓存通常是很有用的，但在某些情况下，它可能不是像期待的行为那样。在下一节中，我们会看看如何为单个请求改变 Glide 的缓存行为。

## 使用缓存策略

如果你以前用过 Glide。你会发现不需要去做任何额外的事情来激活缓存。它直接就从盒子里取出来用了！然而，如果你知道一张图片变化很快，你可能想要避免某些缓存。

Glide 提供了方法去适配内存和磁盘缓存行为。让我们先看看内存缓存。

## 内存缓存

让我们想象一个非常简单的请求，从网络中加载图片到 `ImageView`。

```java
Glide  
    .with( context )
    .load( eatFoodyImages[0] )
    .skipMemoryCache( true )
    .into( imageViewInternet );

```

你已经注意到，我们调用了 `.skipMemoryCache(true)` 去明确告诉 Glide 跳过内存缓存。这意味着 Glide 将不会把这张图片放到内存缓存中去。这里需要明白的是，这只是会影响内存缓存！Glide 将会仍然利用磁盘缓存来避免重复的网络请求。

这也容易知道 Glide 将会默认将所有的图片资源放到内存缓存中去。因为，指明调用 `.skipMemoryCache(false)` 是没有必要的。

**提示：注意个事实，如果你的一个初始请求一个但是 URL 是相同的，但没有调用 `.skipMemoryCache(true)` ，然后你后来又调用了这个方法，这是这个资源将会在内存中获取缓存。当你想要去调整缓存行为时，确保你是要调用所有相同资源的时候。**

## 跳过磁盘缓存

正如你上面这部分所了解到的，即使你关闭内存缓存，请求图片将会仍然被存储在设备的磁盘缓存中。如果你有一张图片具有相同的 URL，但是变化很快，你可能想要连磁盘缓存也一起禁用。

你可以用 `.diskCacheStrategy()` 方法为 Glide 改变磁盘缓存的行为。不同的于 `.skipMemoryCache()` 方法，它需要一个枚举而不是一个简答的布尔值。如果你想要为一个请求禁用磁盘缓存。使用枚举 `DiskCacheStrategy.NONE` 作为参数。

```java
Glide  
    .with( context )
    .load( eatFoodyImages[0] )
    .diskCacheStrategy( DiskCacheStrategy.NONE )
    .into( imageViewInternet );
```

图片在这段代码片段中将不会被保存在磁盘缓存中。然而，默认的它将仍然使用内存缓存！为了把这里两者都禁用掉，两个方法一起调用：

```java
Glide  
    .with( context )
    .load( eatFoodyImages[0] )
    .diskCacheStrategy( DiskCacheStrategy.NONE )
    .skipMemoryCache( true )
    .into( imageViewInternet );
```

## 自定义磁盘缓存行为

正如我们之前提到的，Glide 有多个选项去配置磁盘缓存行为。在我们向你展示这些选项之前，你必须了解到 Glide 的磁盘缓存是相当复杂的。比如，[Picasso](https://futurestud.io/blog/tag/picasso/) 仅仅缓存了全尺寸的图像。然而 Glide 缓存了原始图像，全分辨率图像和另外小版本的图像。比如，如果你请求的一个图像是 1000x1000 像素的，但你的 `ImageView` 是 500x500 像素的，Glide 将会把这两个尺寸都进行缓存。

现在你将会理解对于 `.diskCacheStrategy()` 方法来说不同的枚举参数的意义：

* `DiskCacheStrategy.NONE` 什么都不缓存，就像刚讨论的那样
* `DiskCacheStrategy.SOURCE` 仅仅只缓存原来的全分辨率的图像。在我们上面的例子中，将会只有一个 1000x1000 像素的图片
* `DiskCacheStrategy.RESULT` 仅仅缓存最终的图像，即，降低分辨率后的（或者是转换后的）
* `DiskCacheStrategy.ALL` 缓存所有版本的图像（**默认行为**）

作为最后一个例子，如果你有一张图片，你知道你将会经常操作处理，并做了一堆不同的版本，对其有意义的仅仅是缓存原始分辨率图片。因此，我们用 `DiskCacheStrategy.SOURCE` 去告诉 Glide 仅仅保存原始图片：

```java
Glide  
    .with( context )
    .load( eatFoodyImages[2] )
    .diskCacheStrategy( DiskCacheStrategy.SOURCE )
    .into( imageViewFile );
```

## Outlook

在这篇博客中，你已经了解了 Glide 图像缓存工作的基础知识以及你如何根据你的需求去调整它的行为。在后面的博客中，我们会回头来做更高级的优化。然而，这个博客开了个头，给了你一个非常有效的方法去获得最出色的 Glide 缓存行为。

下周，我们将看另一个对于用户体验来说极其重要的部分：对图像的要求！