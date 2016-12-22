---
layout: post
title:  "Glide - 显示 Gif 和 Video"
subtitle:   "Glide — Displaying Gifs & Videos"
author: MrFu
date:   2016-02-27 18:00:00
catalog:    true
tags:
    -  Glide
---


在以前发表的博客文章中我们已经看到可以从各种来源来显示图片。我们学到了如何去处理图像的显示，改变大小和用标准选项缩放图像。这篇博客将会告诉你一个独特的功能：显示 Gif 和本地视频。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/)
4. [占位符 和 渐现动画](http://mrfu.me/2016/02/27/Glide_Placeholders_&_Fade_Animations/)
5. [图片重设大小 和 缩放](http://mrfu.me/2016/02/27/Glide_Image_Resizing_&_Scaling/)
6. 显示 Gif 和 Video
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

## 显示 Gif

有很多图片加载库来去加载和显示图片。能支持 Gif 有一些特别也是非常有帮助的，如果在你的 App 需要的话。Glide 实现 Gif 是如此的特别和令人惊讶，因为它是如此的简单。如果你想显示一个 Gif，你可以只使用和过去相同的调用方式就可以了：

```java
String gifUrl = "http://i.kinja-img.com/gawker-media/image/upload/s--B7tUiM5l--/gf2r69yorbdesguga10i.gif";
Glide  
    .with( context )
    .load( gifUrl )
    .into( imageViewGif );
```

就这样！这将在 `ImageView` 中显示 Gif 并自动开始播放它。另外一个关于 Glide 的伟大的事情是你仍然可以使用你的标准去调用处理这个 Gif:

```java
Glide  
    .with( context )
    .load( gifUrl )
    .placeholder( R.drawable.cupcake )
    .error( R.drawable.full_cake )
    .into( imageViewGif );
```

## Gif 检查

上面的代码有一个潜在的问题是，如果提供的来源不是一个 Gif，可能只是一个常规图片，这就没有办法显示这个问题。Glide 接受 Gif 或者图片作为 `load()` 参数。如果你期望这个 URL 是一个 Gif，Glide 不会自动检查是否是 Gif。因此他们引入了一个额外的防区强制 Glide变成一个 Gif `asGif()`:

```java
Glide  
    .with( context )
    .load( gifUrl )
    .asGif()
    .error( R.drawable.full_cake )
    .into( imageViewGif );
```

如果 gifUrl 是一个 git，这没什么变化。然而，不像之前那样，如果这个 gifUrl 不是一个 Gif，Glide 将会把这个 load 当成失败处理。这样做的的好处是，`.error()` 回调被调用并且错误占位符被显示，即使 gifUrl 是一个完美的图片（但不是一个 Gif）。

## Gif 转为 Bitmap

如果你的 App 显示一个位置的网络 URL 列表，它可能遇到常规的图片或者 Gif。在某些情况下，你可能对不想系那是整个 Gif。如果你仅仅想要显示 Gif 的第一帧，你可以调用 `asBitmap()` 去保证其作为一个常规的图片显示，即使这个 URL 是一个 Gif。

```java
Glide  
    .with( context )
    .load( gifUrl )
    .asBitmap()
    .into( imageViewGifAsBitmap );
```

这让你用 Glide 显示所有已知的 url 显示为图片的形式。这很简单，试一试！

## 显示本地视频

现在来谈谈视频。Glide 还能显示视频！只要他们是存储在手机上的。让我们假设你通过让用户选择一个视频后得到了一个文件路径：

```java
String filePath = "/storage/emulated/0/Pictures/example_video.mp4";
Glide  
    .with( context )
    .load( Uri.fromFile( new File( filePath ) ) )
    .into( imageViewGifAsBitmap );
```

这里需要注意的是，这仅仅对于**本地**视频起作用。如果没有存储在该设备上的视频（如一个网络 URL 的视频），它是不工作的！如果你想显示视频从网络 URL，去看看 [VideoView](http://developer.android.com/intl/zh-cn/reference/android/widget/VideoView.html)。

## Outlook

读完这篇博客，你应该能像使用图片一样使用 Gif 和本地视频了。Glide 与 Gif 的协作是非常顺滑和方便的。下周，我们会为你介绍 Glide 的缓存系统。