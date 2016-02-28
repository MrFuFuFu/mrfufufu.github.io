---
layout: post
title:  Glide - 用 Module 自定义 Glide
author: MrFu
date:   2016-02-28 13:00:00
tags:
    -  Glide
---


上周，我们已经看了你如何为你的 Glide 加载图片而设置各种网络栈。在内部，为网络栈的 *集成库* 甚至都不需要做其他的声明，比如一个 `GlideModule`，它明显的定制了一个 Glide 的行为。这篇博客中，我们会给你一个 `GlideModule` 的概述。

## Glide 系列预览

## Glide Modules

Glide module 是一个抽象方法，全局改变 Glide 行为的一个方式。如果你需要访问 `GlideBuilder`，它要在你要做的地方创建 Glide 实例，这是要做的一种方法。为了定制 Glide，你需要去实现一个 [GlideModule](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/module/GlideModule.html) 接口的公共类。

```java
public class SimpleGlideModule implements GlideModule {  
    @Override public void applyOptions(Context context, GlideBuilder builder) {
        // todo
    }

    @Override public void registerComponents(Context context, Glide glide) {
        // todo
    }
}
```

该接口提供了两种发发来调整 Glide 不同的组件。在这篇博客中，我们主要看第一个方法 `applyOptions(Context context, GlideBuilder builder)`。

所以你知道要创建一个额外的类去定制 Glide。下一步是要全局的去声明这个类，让 Glide 知道它应该在哪里被加载和使用。Glide 会扫描 `AndroidManifest.xml` 为 Glide module 的 meta 声明。因此，你必须在 `AndroidManifest.xml` 的 `<application>` 标签内去声明这个刚刚创建的 Glide module。

```xml
<manifest

    ...

    <application>

        <meta-data
            android:name="io.futurestud.tutorials.glide.glidemodule.SimpleGlideModule"
            android:value="GlideModule" />

        ...

    </application>
</manifest>  
```

请确保你将 `android:name` 属性改成你的包名+类名的形式，这样的引用才是正确的。就这样，你不需要去添加其他任何代码。如果你想删掉 Glide Module，只需要把它从 `AndroidManifest.xml` 中移除就可以了。Java 类可以保存，说不定以后会用呢。如果它没有在 `AndroidManifest.xml` 中被引用，那它不会被加载或被使用。

你去定制 module 的话 Glide 会有这样一个优点：你可以同时声明多个 Glide module。Glide 将会（没有特定顺序）得到所有的声明 module。因为你当前不能定义顺序，请确保定制不会引起冲突！

## GlideBuilder

好了，你知道如何用 Glide module 定制 Glide 了。现在来看看接口的第一个方法：`applyOptions(Context context, GlideBuilder builder)`。该方法给你了一个 `GlideBuilder` 对象作为变量。这个方法是一个 `void` 的返回类型，所以你可以在这个方法里去调 `GlideBuilder` 中可用的方法。

* `.setMemoryCache(MemoryCache memoryCache)`
* `.setBitmapPool(BitmapPool bitmapPool)`
* `.setDiskCache(DiskCache.Factory diskCacheFactory)`
* `.setDiskCacheService(ExecutorService service)`
* `.setResizeService(ExecutorService service)`
* `.setDecodeFormat(DecodeFormat decodeFormat)`

你可以看到，这个 `GlideBuilder` 对象给你访问了 Glide 重要的核心组件。在这个博客中使用的方法，你可以改变磁盘缓存，内存缓存等等！

我们稍后会看到更多进阶的组件，但是现在我们先挑一个相对加单的改变：`.setDecodeFormat(DecodeFormat decodeFormat)`。

## 使用实例：增加 Glide 的图片质量

在 Android 中有两个主要的方法对图片进行解码：ARGB8888 和 RGB565。前者为每个像素使用了 4 个字节，后者仅为每个像素使用了 2 个字节。ARGB8888 的优势是图像质量更高以及能存储一个 alpha 通道。[Picasso](https://futurestud.io/blog/tag/picasso/) 使用 ARGB8888，Glide 默认使用低质量的 RGB565。对于 Glide 使用者来说：你使用 Glide module 方法去改变解码规则。

你只需要实现一个 `GlideModule`，像我们上面给你显示的那样，然后使用正确的枚举值调用 `builder.setDecodeFormat(DecodeFormat.PREFER_ARGB_8888)`。

```java
public class SimpleGlideModule implements GlideModule {  
    @Override public void applyOptions(Context context, GlideBuilder builder) {
        builder.setDecodeFormat(DecodeFormat.PREFER_ARGB_8888);
    }

    @Override public void registerComponents(Context context, Glide glide) {
        // nothing to do here
    }
}
```

如果你是正确的按照我们的步骤来的话，Glide 现在回用更高质量的图片解码。这种改变方式也遵循 Glide 的行为，适用于其他的模式。代码在 `registerComponents()` 会看起来有一点不同，我们很快会看到的。

## Summary

这篇博客中，你已经学会了 Glide module 的基础。你应该能感觉到他们是有用的，以及你知道怎么实现它们了。如果你仍然需要更多的信息，看看下面的资源链接。特别是如果你需要更多明确的在项目库中如何去使用 Glide module 以及使用 ProGuard，避免混淆的情况，请去看看这些内容。

因为这是一个相当复杂的话题，我们将在下周通过一个实际的例子去实践：如何用一个 `GlideModule` 的 `registerComponents()` 方法去从服务端使用 self-signed HTTPS 认证（这不是默认实现的）的方式去接收图片。

## 资源

[GlideModules on Glide's Github](https://github.com/bumptech/glide/wiki/Configuration)