---
layout: post
title:  "Glide - 占位符 和 渐现动画"
subtitle:   "Glide — Placeholders & Fade Animations"
author: MrFu
date:   2016-02-27 16:00:00
catalog:    true
tags:
    -  Glide
---


在你学习了如何从所有资源中加载图片之后，这周都是关于占位符，在图片加载出来之前的连接时间。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/)
4. 占位符 和 渐现动画
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

我们甚至没有必要去解释和讨论：空 `ImageView` 在任何 UI 上都是不好看的。如果你用 Glide，你很可能是通过网络连接加载图像。根据你用户的环境，这可能需要花费很多的时间。一个预期的行为是一个APP 去显示一个占位符直到这张图片加载处理完成。

Glide 的流式接口让这个变得非常容易的去做到！只需要调用 `.placeHolder()` 用一个 drawable(resource) 引用，Glide 将会显示它作为一个占位符，直到你的实际图片准备好。

```java
Glide
    .with(context)
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .placeholder(R.mipmap.ic_launcher) // can also be a drawable
    .into(imageViewPlaceholder);
```

做为一个显而易见的原因，你不能设置一个网络 url 作为占位符，因为这也会被去请求加载的。App 资源和 drawable 能保证可用和可访问的。然而，作为 `load()` 方法的参数，Glide 接受所有值。这可能不是可加载的（没有网络连接，服务器宕机...），删除了或者不能访问。在下一节中，我们将讨论一个错误的占位符。

## 错误占位符：.error()

假设我们的 App 尝试从一个网站去加载一张图片。Glide 给我们一个选项去获取一个错误的回调并采取合适的行动。我们会在后面来讨论，对现在来说，可能太复杂了。在大多数情况下使用占位符，来指明图片不能被加载已经足够了。

调用 Glide 的流式接口和之前显示预加载占位符的例子是相同的，不同的是调用了名为 `error()` 的函数。

```java
Glide
    .with(context)
    .load("http://futurestud.io/non_existing_image.png")
    .placeholder(R.mipmap.ic_launcher) // can also be a drawable
    .error(R.mipmap.future_studio_launcher) // will be displayed if the image cannot be loaded
    .into(imageViewError);

```

就这样。如果你定义的 `load()` 值的图片不能被加载出来，Glide 会显示 `R.mipmap.future_studio_launcher` 作为替换。再说一次，`error()`接受的参数只能是已经初始化的 drawable 对象或者指明它的资源(`R.drawable.<drawable-keyword>`)。

## 使用 crossFade()

无论你是在加载图片之前是否显示一个占位符，改变 `ImageView` 的图片在你的 UI 中有非常显著的变化。一个简单的选项是让它改变是更加平滑和养眼的，就是使用一个淡入淡出动画。Glide 使用标准的淡入淡出动画，这是(对于当前版本`3.6.1`)默认激活的。如果你想要如强制 Glide 显示一个淡入淡出动画，你必须调用另外一个建造者：

```java
Glide
    .with(context)
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .placeholder(R.mipmap.ic_launcher) // can also be a drawable
    .error(R.mipmap.future_studio_launcher) // will be displayed if the image cannot be loaded
    .crossFade()
    .into(imageViewFade);
```

`crossFade()` 方法还有另外重载方法 `.crossFade(int duration)`。如果你想要去减慢（或加快）动画，随时可以传一个毫秒的时间给这个方法。动画默认的持续时间是 300毫秒。

## 使用 dontAnimate()

如果你想直接显示图片而没有任何淡入淡出效果，在 Glide 的建造者中调用 `.dontAnimate()` 。

```java
Glide
    .with(context)
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .placeholder(R.mipmap.ic_launcher) // can also be a drawable
    .error(R.mipmap.future_studio_launcher) // will be displayed if the image cannot be loaded
    .dontAnimate()
    .into(imageViewFade);
```

这是直接显示你的图片，而不是淡入显示到 `ImageView`。请确保你有更好的理由来做这件事情。

需要知道的是所有这些参数都是独立的，而不需要彼此依赖的。比如，你可以设定 `.error()` 而不调用 `.placeholder()`。你可能设置 `crossFade()` 动画而没有占位符。任何参数的组合都是可能的。


## 展望

希望你在这篇博客中理解并学到很多。这对于一个良好的用户体验是非常重要的，即图片不会没有预期的突然蹦出来。同样的，当有什么事情出错时，使其有明显的提示。Glide 协助你容易的去这些方法，提供的这些事情去帮你做一个更好的 App。

但是我们的优化还没有做完。下周，我们将会看到图像大小和缩放。