---
layout: post
title:  "Glide - 加载进阶"
subtitle:   "Glide — Advanced Loading"
author: MrFu
date:   2016-02-27 13:00:00
tags:
    -  Glide
---


上周我们了解了用 Glide 的理由和简单的示例来加载一个来自网络的图片。但这不仅仅 Glide 的唯一加载来源。Glide 也能从 Android 资源，文件和 Uri 中加载。在这篇博客中，我们将涉及这三个选项。

## Glide 系列预览

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