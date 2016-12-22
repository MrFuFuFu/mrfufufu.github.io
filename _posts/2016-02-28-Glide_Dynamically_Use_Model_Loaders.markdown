---
layout: post
title:  "Glide - 动态使用 Model Loader"
subtitle:   "Glide — Dynamically Use Model Loaders"
author: MrFu
date:   2016-02-28 14:40:00
catalog:    true
tags:
    -  Glide
---


在[上篇博客](https://futurestud.io/blog/glide-module-example-optimizing-by-loading-images-in-custom-sizes)中，你已经看到了如何声明和配置一个 Glide module，它在请求中增加了图像大小。这是非常有用的优化。然而，重要的是要知道，声明 Glide module 总是主动的。默认情况下，你不能动态的打开或者关闭它们。

在这篇博客中，你会学到如何去注册对当个请求去一个自定义的 model 加载器。

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
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. 动态使用 Model Loader
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 自定义图像大小

提示：如果你还没读过我们[之前的博客](https://futurestud.io/blog/glide-module-example-optimizing-by-loading-images-in-custom-sizes)，现在去读一下。否则，下面这部分看起来很困难。

作为一个简短的回顾：通常 Glide 的请求是和 `GlideUrl` 类来使用的。上周我们已经向你展示了如何创建一个新的接口，来考虑增加宽度和高度。

```java
public interface CustomImageSizeModel {  
    String requestCustomSizeUrl(int width, int height);
}
```

我们创建了一个实现，它及案例额传递了图像的 URL 加上尺寸提交给了工作服务器。

```java
public static class CustomImageSizeModelFutureStudio implements CustomImageSizeModel {

    String baseImageUrl;

    public CustomImageSizeModelFutureStudio(String baseImageUrl) {
        this.baseImageUrl = baseImageUrl;
    }

    @Override
    public String requestCustomSizeUrl(int width, int height) {
        return baseImageUrl + "?w=" + width + "&h=" + height;
    }
}
```

最后，这并不是最重要的，我们必须创建一个 `CustomImageSizeUrlLoader`，它传了宽度和高度给了我们的 model 实现：

```java
public static class CustomImageSizeUrlLoader extends BaseGlideUrlLoader<CustomImageSizeModel> {  
    public CustomImageSizeUrlLoader(Context context) {
        super( context );
    }

    @Override
    protected String getUrl(CustomImageSizeModel model, int width, int height) {
        return model.requestCustomSizeUrl( width, height );
    }
}
```

## Model Loader 和 .using() 的动态使用 

目前我们已经声明了 Glide module。Glide 会把它用在每一个请求。如果你不想这样，从 `AndroidManifest.xml` 中删除你的 Glide module。我们可以这么做是因为 Glide 提供了 `.using()` 方法去为单个的请求指定一个 model。

```java
String baseImageUrl = "https://futurestud.io/images/example.png";  
CustomImageSizeModel customImageRequest = new CustomImageSizeModelFutureStudio( baseImageUrl );

Glide  
        .with( context )
        .using( new CustomImageSizeUrlLoader( context ) )
        .load( customImageRequest )
        .into( imageView1 );
```

正如你看到的，我们正在创建一个 `CustomImageSizeModelFutureStudio` 对象来为我们的图像按照指定的大小加载。因为没有在 Glide module 中声明 `CustomImageSizeModel` 接口，我们必须指明这行代码 `.using(new  CustomImageSizeUrlLoader(context))`。Glide 现在会只为这个请求用这个 model。对于其他的请求，即使它们有 `CustomImageSizeModel` 接口，也不会受影响。

## Outlook

这篇博客中，你已经学到了如何 为指定的请求去指定 model。如果你不想要在 `AndroidManifest` 中使用 Glide module ，这是一个简单的选择。

有了这个博客文章，我们就完成了深入进入 Glide module 以及它们的用途。下周，我们会将这个系列包裹起来。