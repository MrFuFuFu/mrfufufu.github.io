---
layout: post
title:  "Glide - 加载进阶"
subtitle:   "Glide — Advanced Loading"
author: MrFu
date:   2016-02-27 13:00:00
catalog:    true
tags:
    -  Glide
---


上周我们了解了用 Glide 的理由和简单的示例来加载一个来自网络的图片。但这不仅仅 Glide 的唯一加载来源。Glide 也能从 Android 资源，文件和 Uri 中加载。在这篇博客中，我们将涉及这三个选项。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. 加载进阶
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
15. [集成网络栈](http://mrfu.me/2016/02/28/Glide_Integrating_Networking_Stacks/)
16. [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/)
17. [Module 实例：接受自签名证书的 HTTPS](http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/)
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 从资源中加载

首先从Android 资源中加载，使用一个资源 id (`int`)，来替换之前使用字符串去指明一个网络 URL 的情况。

```java
int resourceId = R.mipmap.ic_launcher;

Glide
    .with(context)
    .load(resourceId)
    .into(imageViewResource);
```

如果你对于 R.mipmap 有困惑，这是 Android 处理 icon 的[新方式](http://android-developers.blogspot.de/2014/10/getting-your-apps-ready-for-nexus-6-and.html)。

当然，你可以直接为 ImageView 类去设置资源。然而，如果你用的高级话题如动态转换来说，这可能是比较有趣的。

## 从文件中加载

其次是从文件中加载，当你让用户选择一张照片去显示图像（比如画廊）这可能会比较有用。该参数只是一个`文件`对象。我们看一个例子：

```java
//这个文件可能不存在于你的设备中。然而你可以用任何文件路径，去指定一个图片路径。
File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "Running.jpg");

Glide
    .with(context)
    .load(file)
    .into(imageViewFile);
```

## 从 Uri 中加载

最后，你也指定一个 `Uri` 来加载图片。该请求和之前的没有什么不同。

```java
//这可能是任何 Uri。为了演示的目的我们只是用一个 launcher icon 去创建了一个 Uri 
Uri uri = resourceIdToUri(context, R.mipmap.future_studio_launcher);

Glide
    .with(context)
    .load(uri)
    .into(imageViewUri);
```

一个小助手功能：简单的从资源 id 转换成 `Uri`。

```java
public static final String ANDROID_RESOURCE = "android.resource://";
public static final String FOREWARD_SLASH = "/";

private static Uri resourceIdToUri(Context context, int resourceId) {
    return Uri.parse(ANDROID_RESOURCE + context.getPackageName() + FOREWARD_SLASH + resourceId);
}
```

然而， `Uri` 不必从资源中去生成，它可以是任何 `Uri`。

## 展望

基本的加载原则已经完成，现在我们可以看看更多有趣的东西。下周我们 在 `ListView` 和 `GridView` 中去适配 adapter。