---
layout: post
title:  "Glide - Module 实例：用自定义尺寸优化加载的图片"
subtitle:   "Glide Module Example: Optimizing By Loading Images In Custom Sizes"
author: MrFu
date:   2016-02-28 14:30:00
catalog:    true
tags:
    -  Glide
---


过去几周，我们已经看到了用 Glide module 来为 Glide 做各种各样的自定义。今天我们将会为你展示最后一个实例，但这可能是最有趣的一个了：从你的服务端在指定的尺寸下如何去请求图片。

## Glide 系列浏览

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
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. Module 实例：用自定义尺寸优化加载的图片
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 为何要在指定的尺寸下请求图片

在一个最近的项目中我们与一个多媒体服务端工作，它也是图片服务端，提供了非常高的图像质量（图像可能有 6000x4500 像素）。虽然我们可以直接用链接去拿源文件，但这对于设备的带宽，内存和电池来说，这么做是非常低效的。即使今天的设备有着非常高的分辨率显示屏，有这么高的一个分辨率没有任何好处。这就是为什么 Glide 总是测量 `ImageView` 的尺寸，并减少图像的内存分配大小。所以，这里仍然需要减少下载和计算处理的开销。因此，这个多媒体服务端给了一个新功能：它可以提供自定义图像的分辨率。这么想象一下吧：

```java
// previous way: we directly accessed the images
https://futurestud.io/images/logo.png

// new way, server could handle additional parameter and provide the image in a specific size
// in this case, the server would serve the image in 400x300 pixel size
https://futurestud.io/images/logo.png?w=400&h=300  
```

媒体服务端维护了之前的计算大小在磁盘上，如果没有请求传过去，缩放图像仍然在天上飞呢。现在初步实现了 Android 这边计算好了 `ImageView` 的大小，然后用 链接 URL（就像 `../logo.png?w=400&h=300`）做 Glide 请求。向我们之前给你展现的那样。这种方式奏效了，但是有点复杂，特别是如果你认为 Glide 在这里提供了帮助。

## 另一种自定义 GlideModule 

当然，我们必须声明一个新的 Glide module。在这种情况下，我们必须用 `glide.register()` 方法注册新的 model 到 Glide。

```java
public class CustomImageSizeGlideModule implements GlideModule {  
    @Override public void applyOptions(Context context, GlideBuilder builder) {
        // nothing to do here
    }

    @Override public void registerComponents(Context context, Glide glide) {
        glide.register(CustomImageSizeModel.class, InputStream.class, new CustomImageSizeModelFactory());
    }
}
```

该 `.register()` 调用了 Glide 的配置去给所有的请求，实现 `CustomImageSizeModel` 接口（替换常规的 `GlideUrl` 接口）。所以在这里你可以创建并传递一个 `CustomImageSizeModel` 的实例去实现给 Glide。
为了处理这个新的自定义 model。我们要去写一个 `CustomImageSizeModelFactory` 类，创建了我们的 model 处理的实例。

综上所述，在你添加了上述的 Glide module 后，你应该有两个未知的类。首先是 `CustomImageSizeModel`。

```java
public interface CustomImageSizeModel {  
    String requestCustomSizeUrl(int width, int height);
}
```

`CustomImageSizeModel` 只是一个接口，它将宽度和高度作为其参数，这是必须的，这样我们才能从媒体服务端请求精确的像素图像。第二个未知的类是 `CustomImageSizeModelFactory`：

```java
private class CustomImageSizeModelFactory implements ModelLoaderFactory<CustomImageSizeModel, InputStream> {  
    @Override
    public ModelLoader<CustomImageSizeModel, InputStream> build(Context context, GenericLoaderFactory factories) {
        return new CustomImageSizeUrlLoader( context );
    }

    @Override
    public void teardown() {

    }
}
```

这个类仅仅实现了 Glide 的 `ModelLoaderFactory` 接口。它为我们的 `CustomImageSizeUrlLoader`  类创建了一个新的实例，一旦 Glide 请求被创建，它将负责加载图像。

```java
public class CustomImageSizeUrlLoader extends BaseGlideUrlLoader<CustomImageSizeModel> {  
    public CustomImageSizeUrlLoader(Context context) {
        super( context );
    }

    @Override
    protected String getUrl(CustomImageSizeModel model, int width, int height) {
        return model.requestCustomSizeUrl( width, height );
    }
}
```

这样，我们为自定义大小的请求的新的 Glide module 已经做完了。我们已经在 Glide module 这边实现了所有的东西的，但是我们还没有实际创建 `CustomImageSizeModel` 接口的实现。为了用 `CustomImageSizeModel` 传递请求给 Glide。我们需要一个雷，它建立了自定义图片大小的 URL：

```java
public class CustomImageSizeModelFutureStudio implements CustomImageSizeModel {  
    String baseImageUrl;

    public CustomImageSizeModelFutureStudio(String baseImageUrl) {
        this.baseImageUrl = baseImageUrl;
    }

    @Override
    public String requestCustomSizeUrl(int width, int height) {
        // previous way: we directly accessed the images
        // https://futurestud.io/images/logo.png

        // new way, server could handle additional parameter and provide the image in a specific size
        // in this case, the server would serve the image in 400x300 pixel size
        // https://futurestud.io/images/logo.png?w=400&h=300
        return baseImageUrl + "?w=" + width + "&h=" + height;
    }
}
```

在上面的 `CustomImageSizeModelFutureStudio` 类中，我们已经实现了建立图片 URL 的逻辑：附加了高度和宽度的参数。最后，我们可以创建这个类的实例并做一个 Glide 请求：

```java
String baseImageUrl = "https://futurestud.io/images/example.png";  
CustomImageSizeModel customImageRequest = new CustomImageSizeModelFutureStudio( baseImageUrl );

Glide  
        .with( context )
        .load( customImageRequest )
        .into( imageView2 );
```

正如你看到的，我们不需要传一个精确的尺寸。Glide 会测量 `ImageView` 然后传给我们的请求。现在服务端会返回这个图片的完美的优化后的尺寸了！

当然你可以添加其他的 `CustomImageSizeModel` model 实现。如果你有多个服务端，它们使用了不同的逻辑去简历 URL。只需要创建一个新的 `CustomImageSizeModel` 实现然后传递它到你的 Glide 请求中。你可以使用很多的 model 去按照你需要的来实现！

## Outlook

在这篇博客中，你已经看到如何削减图像请求的开销的重要部分。每次你的用户将会看到他们的电池状态和存储数据，他们会爱上你的。不幸的是，你将需要服务端支付。尽管如此，Glide 在 Android 这边的做法是非常简单的。初始设置有点复杂，但是一旦你理解了这个概念，它将非常有用！

在这篇博客中我们向你展示的方法有一个问题：它将用在每一个单个请求。如果你在图像的 URL 中有混合使用的情况，它将重新计算大小，以及图片的 URL，它不能被调整？下周，我们要向你展示如何以相同的思想动态的在每个请求中应用。