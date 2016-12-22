---
layout: post
title:  "Glide - 请求优先级"
subtitle:   "Glide — Request Priorities"
author: MrFu
date:   2016-02-27 19:10:00
catalog:    true
tags:
    -  Glide
---


上周，我们看了图片加载极其重要的一个部分：[缓存](https://futurestud.io/blog/glide-caching-basics/)！如果你错过了，值得你再去看看。这周，我们将整理 Glide 的另一重要功能：按优先级顺序请求图像。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/)
4. [占位符 和 渐现动画](http://mrfu.me/2016/02/27/Glide_Placeholders_&_Fade_Animations/)
5. [图片重设大小 和 缩放](http://mrfu.me/2016/02/27/Glide_Image_Resizing_&_Scaling/)
6. [显示 Gif 和 Video](http://mrfu.me/2016/02/27/Glide_Displaying_Gifs_&_Videos/)
7. [缓存基础](http://mrfu.me/2016/02/27/Glide_Caching_Basics/)
8. 请求优先级
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

## 图片请求的优先级

通常，你会遇到这样的使用场景：你的 App 将会需要在同一时间内加载多个图像。让我们假设你正在构建一个信息屏幕，这里有一张很大的英雄图片在顶部，还有两个小的，在底部还有一些不那么重要的图片。对于最好的用户体验来说，应用图片元素是显示要被加载和显示的，然后才是底部不紧急的 `ImageView`。Glide 可以用 `Priority` 枚举来支持你这样的行为，调用 `.priority()` 方法。

但在看这个方法调用的示例代码之前，让么我看看 priority 的枚举值，它首先作为 `.priority()` 方法的参数的。

## 了解 Priority (优先级)枚举

这个枚举给了四个不同的选项，下面是按照**递增**priority(优先级)的列表：

* `Priority.LOW`
* `Priority.NORMAL`
* `Priority.HIGH`
* `Priority.IMMEDIATE`

在我们开始例子前，你应该知道的是：优先级并不是完全严格遵守的。Glide 将会用他们作为一个准则，并尽可能的处理这些请求，但是它不能保证所有的图片都会按照所要求的顺序加载。

然而，如果你有的使用场景是确定一些图片是重要的，充分利用它！

## 使用实例：英雄元素和子图像

让我们开始回到开始时的例子吧。你正在实现一个信息详情页面，有一个英雄图片在顶部，和较小的图片在底部。对于最好的用户体验来说，英雄图片首先需要被加载。因此，我们用 `Priority.HIGH` 来处理它。理论上说，这应该够了，但是为了让这个实例增加点趣味，我们也将底层图像分配给低优先级，用 `.priority(Priority.LOW)` 调用：

```java
private void loadImageWithHighPriority() {  
    Glide
        .with( context )
        .load( UsageExampleListViewAdapter.eatFoodyImages[0] )
        .priority( Priority.HIGH )
        .into( imageViewHero );
}

private void loadImagesWithLowPriority() {  
    Glide
        .with( context )
        .load( UsageExampleListViewAdapter.eatFoodyImages[1] )
        .priority( Priority.LOW )
        .into( imageViewLowPrioLeft );

    Glide
        .with( context )
        .load( UsageExampleListViewAdapter.eatFoodyImages[2] )
        .priority( Priority.LOW )
        .into( imageViewLowPrioRight );
}
```

如果你运行这个实例，你会看到，在几乎所有的情况下，英雄图片将会首先显示出来。尽管是更大的图像（因为需要更多的处理时间）。

## Outlook

Glide 给了你非常方便的选项去定图像优先级。它是快速又简单的方式增加了些许的用户体验。整理你的 app 和代码看看是否你有需要去应用刚才学到的技术！

请求优先级是非常有用的，但是不总是完全解决问题。假设你必须下载一个非常大的图像，它可能需要一段时间来下载和处理它，不管你设置了怎样的优先级。下周，为了进一步提高用户体验，我们会去看看另外一个 Glide 工具箱：缩略图！