---
layout: post
title:  Glide - Module 实例：自定义缓存
subtitle:   "Glide Module Example: Customize Caching"
author: MrFu
date:   2016-02-28 14:00:00
catalog:    true
tags:
    -  Glide
---


在上篇博客，我们用一个自定义的 HTTP 客户端设置了自己的 Glide module，它接受一个自签名的 HTTPS 证书。这周，我们仍然停留在低水平上去定制一个 Glide 组件的缓存。

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
15. [集成网络栈](http://mrfu.me/2016/02/28/Glide_Integrating_Networking_Stacks/)
16. [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/)
17. [Module 实例：接受自签名证书的 HTTPS](http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/)
18. Module 实例：自定义缓存
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 自定义内存缓存

希望你已经读了 [caching basics](https://futurestud.io/blog/glide-caching-basics/) 和 [Glide modules](https://futurestud.io/blog/glide-customize-glide-with-modules/) 博客。否则，看下面的代码对你来说可能像魔术一般了。如果你读过了，那就继续读下去。

好吧，既然是定制 Glide，我们就需要创建一个新的 Glide module。就如你在以前博客中看到的那样，`applyOptions` 方法使我们获取了 `GlideBuilder` 对象。该 `GlideBuilder` 为我们提供了几个方法去定制 Glide 的缓存。首先，来看看内存缓存。

内存缓存是在设备的 RAM 中去维护图片的。这里没有 IO 行为，所以这个操作是很快的。另一方面是 RAM(内存) 的大小是非常有限的。寻找一个大内存缓存的平衡点（大量图像空间）与一个小内存缓存（最大限度减少我们 App 的资源消耗）并不容易。Glide 内部使用了 [MemorySizeCalculator](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/engine/cache/MemorySizeCalculator.html) 类去决定内存缓存大小以及 bitmap 的缓存池。bitmap 池维护了你 App 的堆中的图像分配。正确的 bitmpa 池是非常必要的，因为它避免很多的图像重复回收，这样可以确保垃圾回收器的管理更加合理。

幸运的是，你已经得到了 Glide 的 `MemorySizeCalculator` 类以及默认的计算：

```java
MemorySizeCalculator calculator = new MemorySizeCalculator(context);  
int defaultMemoryCacheSize = calculator.getMemoryCacheSize();  
int defaultBitmapPoolSize = calculator.getBitmapPoolSize();  
```

上面这段代码相当有用，如果我们想要用默认值作为基准，然后调整它。比如，如果你认为你的 app 需要 20% 大的缓存作为 Glide 的默认值，用我们上面的变量去计算他们：

```java
int customMemoryCacheSize = (int) (1.2 * defaultMemoryCacheSize);  
int customBitmapPoolSize = (int) (1.2 * defaultBitmapPoolSize);  
```

因为我们已经计算出了我们的内存缓存和 bitmap 池的大小，我们可以在我们的 Glide module 代码里去得到。在 `applyOptions()` 方法中，我们可以在 `GlideBuilder` 对象中调用相应的方法。

```java
public class CustomCachingGlideModule implements GlideModule {  
    @Override public void applyOptions(Context context, GlideBuilder builder) {
        MemorySizeCalculator calculator = new MemorySizeCalculator(context);
        int defaultMemoryCacheSize = calculator.getMemoryCacheSize();
        int defaultBitmapPoolSize = calculator.getBitmapPoolSize();

        int customMemoryCacheSize = (int) (1.2 * defaultMemoryCacheSize);
        int customBitmapPoolSize = (int) (1.2 * defaultBitmapPoolSize);

        builder.setMemoryCache( new LruResourceCache( customMemoryCacheSize );
        builder.setBitmapPool( new LruBitmapPool( customBitmapPoolSize );
    }

    @Override public void registerComponents(Context context, Glide glide) {
        // nothing to do here
    }
}
```

正如你看到的，在 `applyOptions()` 方法的最后两行，我们不能直接设置大小。我们需要创建一个 `LruResourceCache` 和 `LruBitmapPool` 的实例。这两个都是 Glide 的默认实现。因此，如果你仅仅想要调整大小，就可以继续使用它们通过传两个不同的大小的值给构造函数。

## 自定义磁盘缓存

调整磁盘缓存和和刚才的很像，但是我们有一个更大的决定去做，磁盘缓存可以位于应用的私有目录（换句话说，除了它自己，没有别的应用可以访问）。否则，磁盘缓存也可以位于外部存储，公有目录（更多信息，请看 [Storage Options](http://developer.android.com/intl/zh-cn/guide/topics/data/data-storage.html)）。不能一起设置这两个为之。Glide 为这两个选项都提供了它的实现：`InternalCacheDiskCacheFactory` 和 `ExternalCacheDiskCacheFactory`。就像内存缓存的构造函数一样，在它们的构造函数内都传一个磁盘缓存的工厂类：

```java
public class CustomCachingGlideModule implements GlideModule {  
    @Override
    public void applyOptions(Context context, GlideBuilder builder) {
        // set size & external vs. internal
        int cacheSize100MegaBytes = 104857600;

        builder.setDiskCache(
            new InternalCacheDiskCacheFactory(context, cacheSize100MegaBytes)
        );

        //builder.setDiskCache(
        //new ExternalCacheDiskCacheFactory(context, cacheSize100MegaBytes));
    }

    @Override
    public void registerComponents(Context context, Glide glide) {
        // nothing to do here
    }
}
```

上面的代码将设置磁盘缓存到应用的内部目录，并且设置了最大的大小为 100M。下面注释的那行代码会设置磁盘缓存到外部存储（也设置了最大大小为 100M）。

这两个选项都不让你选一个特点的目录。如果你要让磁盘缓存到指定的目录，你要使用 `DiskLruCacheFactory`：

```java
// or any other path
String downloadDirectoryPath = Environment.getDownloadCacheDirectory().getPath(); 

builder.setDiskCache(  
        new DiskLruCacheFactory( downloadDirectoryPath, cacheSize100MegaBytes )
);

// In case you want to specify a cache sub folder (i.e. "glidecache"):
//builder.setDiskCache(
//    new DiskLruCacheFactory( downloadDirectoryPath, "glidecache", cacheSize100MegaBytes ) 
//);
```

## 自定义缓存实现

目前为止，我们已经向你展示了如何去移动和设置缓存为确定的大小。然而，所有的调用都引用了缓存的原始实现。如果你有你自己的缓存实现呢？

嗯，你看到我们总是创建一个 Glide 的默认缓存的实现的新实例。你可以完成你自己的实现，创建和实例化它，并用上上面所有你看到的方法。你必须确保你的缓存代码实现了如下接口方法：

* Memory cache needs to implement: [MemoryCache](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/engine/cache/MemoryCache.html)
* Bitmap pool needs to implement [BitmapPool](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/engine/bitmap_recycle/BitmapPool.html)
* Disk cache needs to implement: [DiskCache](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/engine/cache/DiskCache.html)

## Outlook

在这篇博客中，你已经看到了如何改变和定制 Glide 的缓存，Glide 的默认实现已经是全面的了，所以确保你有足够的理由而去改变这些事情。如果你做了一些改变，确保设备的覆盖测试。

下周，我们会看到另一个 Glide module 话题。我们会看到如何去实现一个组件，它要求图片在目标 `ImageView` 有精确的大小。我们保证，这很棒！