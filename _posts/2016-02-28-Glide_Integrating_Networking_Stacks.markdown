---
layout: post
title:  "Glide - 集成网络栈"
subtitle:   "Glide — Integrating Networking Stacks"
author: MrFu
date:   2016-02-28 12:30:00
catalog:    true
tags:
    -  Glide
---


在学习了加载和显示图像的各种选项之后，来看看为 Glide 改变基本的网络栈吧。该指南假定你正在**使用 Gradle**。

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
12. [异常：调试和错误处理](http://mrfu.me/2016/02/28/Glide_Exceptions-_Debugging_and_Error_Handling/)
13. [自定义转换](http://mrfu.me/2016/02/28/Glide_Custom_Transformations/)
14. [用 animate() 自定义动画](http://mrfu.me/2016/02/28/Glide_Custom_Animations_with_animate()/)
15. 集成网络栈
16. [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/)
17. [Module 实例：接受自签名证书的 HTTPS](http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/)
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 集成网络栈

通过 HTTP/HTTPS 从网络上下载图像并显示是非常重要的一块。虽然标准的 Android 网络包也能做这些工作，但在 Android 中开发了很多提升网络的模块。每个库有它自己的优势和劣势。最后，这其实需要项目的配合和开发人员自己的品位来决定的。

Glide 的开发者不强制设置网络库给你，所以 Glide 可以说和 HTTP/S 无关。理论上，它可以与任何的网络库实现，只要覆盖了基本的网络能力就行。用 Glide 集成一个网络不是完全无缝的。它需要一个 Glide 的 [ModeLoader](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/model/ModelLoader.html) 的接口。为了让你更加易用，Glide 为2个网络库提供了实现：[OkHttp](https://github.com/square/okhttp) 和 [Volley](https://developer.android.com/intl/zh-cn/training/volley/index.html)。

## OkHttp

假定你要集成 OkHttp 作为你给 Glide 的网络库。集成可以通过声明一个 `GlideModule` 手动实现。如果你想要避免手动实现，只需要打开你的 `build.gradle` 然后在你的依赖中添加下面这两行代码：

```
dependencies {  
    // your other dependencies
    // ...

    // Glide
    compile 'com.github.bumptech.glide:glide:3.6.1'

    // Glide's OkHttp Integration 
    compile 'com.github.bumptech.glide:okhttp-integration:1.3.1@aar'
    compile 'com.squareup.okhttp:okhttp:2.5.0'
}
```

Gradle 会自动合并必要的 `GlideModule` 到你的 `Android.Manifest`。Glide 会认可在 manifest 中的存在，然后使用 OkHttp 做到所有的网络连接。

## Volley

另一方面，如果你偏爱使用 Volley，你必须改变你的 `build.gradle` 依赖：

```java
dependencies {  
    // your other dependencies
    // ...

    // Glide
    compile 'com.github.bumptech.glide:glide:3.6.1'

    // Glide's Volley Integration 
    compile 'com.github.bumptech.glide:volley-integration:1.3.1@aar'
    compile 'com.mcxiaoke.volley:library:1.0.8'
}
```

这将添加 Volley 并集成该库到你的项目中。集成库添加到 `GlideModule` 到你的 `Android.Manifest`。Glide 会自动认出它，然后使用 Volley 作为网络库。并不要求做其他的配置！

**警告：**：如果你把这两个库都在你的 `build.gradle` 中声明了，那这两个库都会被添加。因为 Glide 没有任何特殊的加载顺序，你将会有一个不稳定的状态，它并不明确使用哪个网络库，所以确保你只添加了一个集成库。

## 其他网络库

如果你是别的网络库的粉丝，你是不幸的。Glide 除了 Volley 和 OkHttp 外不会自动配置其他的库。然而你随时可以整合你喜欢的网络库，在 GitHub 上去开一个 pull request。为[Volley 和 OkHttp](https://github.com/bumptech/glide/tree/3.0/integration) 可能给你一个方向。

## Summary

你可以看到，集成网络是相当容易，如果你刚好使用 Gradle 作为你的构建系统，这就不需要做额外的进一步配置。如果你不使用 Gradle，请看看[这里](https://github.com/bumptech/glide/wiki/Integration-Libraries)。在不久的将来，我们会在 `GlideModule` 来进行进一步的定制。敬请期待！