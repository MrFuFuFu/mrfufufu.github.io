---
layout: post
title:  "Glide - 异常：调试和错误处理"
subtitle:   "Glide — Exceptions: Debugging and Error Handling"
author: MrFu
date:   2016-02-28 11:00:00
catalog:    true
tags:
    -  Glide
---

Glide 的所有基本概念已经都介绍过了，我要来看看开发者的议题。这篇博客中，我们会向你展示一些有用的方法来帮你调试可能会遇到在用 Glide 去加载图片的时候可能出现的问题。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
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
12. 异常：调试和错误处理
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

Glide 的 [GeneralRequest](http://bumptech.github.io/glide/javadocs/340/com/bumptech/glide/request/GenericRequest.html) 类提供了一个方法去设置 log 的级别。不幸的是，在生产过程中，使用这个类并不容易。然而，有一个非常简单的方法去获得 Glide 的调试日志。你所要做的就是通过 `adb` 的 shell 来激活。打开你的终端，使用以下命令：

```java
adb shell setprop log.tag.GenericRequest DEBUG  
```

最后一个 `DEBUG` 来自标准的 Android [日志常量](http://developer.android.com/intl/zh-cn/reference/android/util/Log.html)。因此，你你可以选择 debug 的优先级：

* `VERBOSE`
* `DEBUG`
* `INFO`
* `WARN`
* `ERROR`

输出，万一图像不存在，在会像这样：

```
io.futurestud.tutorials.glide D/GenericRequest: load failed  
io.futurestud.tutorials.glide D/GenericRequest: java.io.IOException: Request failed 404: Not Found  
...
```

可能你已猜到，这只当你的设备能接收实际的值并且你正在开发和测试你的 App。为了记录在生产中的 App，你将需要用一个不同的方式。答案是，依然用回调，我们在下一节来探讨。

## 常规异常日志记录

Glide 不能直接去访问 `GenericRequest` 类去设置日志，但万一一些请求出错了你是可以捕获异常的。比如，如果图片不可用，Glide 会（默默地）抛出一个异常，并且显示一个 drawable ，如果你已经指定了 `.error()` 的话。如果你明确想要知道这个异常，创建一个监听并传 `.listener()` 方法到 Glide 的建造者中。

首先，创建一个监听作为一个字段对象去避免垃圾回收（注：之前说过不要用匿名内部类的形式）：

```java
private RequestListener<String, GlideDrawable> requestListener = new RequestListener<String, GlideDrawable>() {  
    @Override
    public boolean onException(Exception e, String model, Target<GlideDrawable> target, boolean isFirstResource) {
        // todo log exception

        // important to return false so the error placeholder can be placed
        return false;
    }

    @Override
    public boolean onResourceReady(GlideDrawable resource, String model, Target<GlideDrawable> target, boolean isFromMemoryCache, boolean isFirstResource) {
        return false;
    }
};
```

在 `onException` 方法中， 你可以捕获错误，并且你可以决定要做什么，比如，打个 log。重要的是如果 Glide 要在后续处理的话，如显示一个错误的占位符等情况的话，你需要返回了 false 在 `onException` 方法中。

你可以设置一个监听在 Glide 建造者中：

```java
Glide  
    .with( context )
    .load(UsageExampleListViewAdapter.eatFoodyImages[0])
    .listener( requestListener )
    .error( R.drawable.cupcake )
    .into( imageViewPlaceholder );
```

要使日志工作正常的话，`.error()` 并不是必须的。然而，如果你在监听的 `onException` 中返回 `false` 的话，`R.drawable.cupcake` 只是显示出来而已。

## Outlook

这篇博客中，你已经学习了在 Glide 中通过一些方法去调试和打印异常。根据需要，选一种方式吧。如果你有问题，在评论中让我们知道！

在下篇博客中，我们会走向更加高级的话题。下周的话题的自定义转化！