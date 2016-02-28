---
layout: post
title:  "Glide - 缩略图"
subtitle:   "Glide — Thumbnails"
author: MrFu
date:   2016-02-27 19:25:00
tags:
    -  Glide
---


在过去几周，我们已经看了当加载和显示图像时如何优化用户体验的方式。对于流畅的用户体验来说，缓存和图像优先级已经迈出了一大步。然而，如果图像是非常大的，处理的过程需要一段时间才能显示。在这篇博客中，我们会探讨缩略图作为另一个优化选项。

## Glide 系列预览

//todo

## 缩略图优势

在你要用缩略图去做优化之前，确保你理解和掌握了所有[缓存](https://futurestud.io/blog/glide-caching-basics/)的选项和[请求优先级](https://futurestud.io/blog/glide-request-priorities/)。如果你已经实现了这些，再来查看缩略图是否能帮助更好的提高你的 Android 应用。

缩略图不同于[之前博客](https://futurestud.io/blog/glide-placeholders-fade-animations/)提到的占位符。占位符必须附带应用程序捆绑的资源才行。缩略图是动态占位符。它也可以从网络中加载。缩略图将会在实际请求加载完或者处理完之后才显示。如果缩略图对于任何原因，在原始图像到达之后，它不会取代原始图像。它只会被抹除。

**提示：另外一个流畅加载图片过程的真的很棒的方式是用色彩图像占位符的图像背景的主色彩作为图像。我们也为此写了一个[指南](https://futurestud.io/blog/how-to-get-dominant-color-code-for-picture-with-nodejs/)。**

## 简单的缩略图

Glide 为缩略图提供2个不同的方式。第一个是简单的选择，在原始图像被用过之后，这只需要一个较小的分辨率。这个方法在 `ListView`的组合和详细视图中是非常有用的。如果你已经在 `ListView` 中显示了图像。这么说吧，在250x250 像素的中，图像将在详细视图中需要一个更大的分辨率图像。然而，从用户的角度来看，他已经看到较小版本的图像，为什么在详情页中出现一个占位符显示了几秒，然后相同图像又再次一次显示（高分辨率的）？

在这种情况下，它有更好的意义去继续显示这张 250x250 像素版本的图像在详情视图上，并且后台去加载全分辨率的图像。Glide 的 `.thumbnail()` 方法让这一切成为可能。 在这样的情况下，这个参数是一个 `float` 作为其大小的倍数。

```java
Glide  
    .with( context )
    .load( UsageExampleGifAndVideos.gifUrl )
    .thumbnail( 0.1f )
    .into( imageView2 );
```

例如， 你传了一个 `0.1f` 作为参数，Glide 将会显示原始图像的10%的大小。如果原始图像有 1000x1000 像素，那么缩略图将会有 100x100 像素。因为这个图像将会明显比 `ImageView` 小很多，你需要确保它的 [ScaleType](http://developer.android.com/intl/zh-cn/reference/android/widget/ImageView.ScaleType.html) 的设置是正确的。

请注意，将应用于演示请求的所有请求设置也应用于缩略图。比如，如果你使用了一个变换去做了一个图像灰度。这同样将发生在缩略图中。

## 用完全不同的请求去进阶缩略图

然而用 float 参数来使用 `.thumbnail()` 是易于设置且非常有效，但它不总是有意义的。如果缩略图是要通过网络去加载相同的全分辨率的图像，则可能不会很快。所以，Glide 提供了另一个选项去加载和显示缩略图。

第二个选择是传一个完全新的 Glide 请求作为参数。让我们来看看实例：

```java
private void loadImageThumbnailRequest() {  
    // setup Glide request without the into() method
    DrawableRequestBuilder<String> thumbnailRequest = Glide
        .with( context )
        .load( eatFoodyImages[2] );

    // pass the request as a a parameter to the thumbnail request
    Glide
        .with( context )
        .load( UsageExampleGifAndVideos.gifUrl )
        .thumbnail( thumbnailRequest )
        .into( imageView3 );
}
```

所不同的是，第一个缩略图请求是完全独立于第二个原始请求的。该缩略图可以是不同的资源或图片 URL，你可以为其应用不同的转换，等等。

**提示，如果你想要更加疯狂，你可以递归并应用一个额外的缩略图请求去请求缩略图。**

## Outlook

这篇博客为你展示两种不同的方法用 Glide 去为图像加载缩略图。做应用优化的时候不要忘记这个选项！它可以在你的应用中明显的帮你减少空的 `ImageView` 时间。如果你有问题，在评论中让我们知道

下周，我们将看看用 Glide 做图片加载，但目标不是一个 `ImageView`。敬请关注！