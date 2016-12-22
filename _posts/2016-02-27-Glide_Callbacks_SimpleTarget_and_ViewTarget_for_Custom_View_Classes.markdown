---
layout: post
title:  "Glide - 回调：SimpleTarget 和 ViewTarget 用于自定义视图类"
subtitle:   "Glide — Callbacks: SimpleTarget and ViewTarget for Custom View Classes"
author: MrFu
date:   2016-02-27 19:30:00
catalog:    true
tags:
    -  Glide
---


在前三篇博客围绕着 Glide 做了优化并提高了用户体验，在接下来的几篇博客中将会用到 Glide 的回调技术。目前为止，我们总是假设我们要加载图片或者 Gif 到 `ImageView` 中。但这并非总是如此。这篇博客中，我们将看看没有指定一个 `ImageView` 而来获取图片资源的 Bitmap 的方法。

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
10. 回调：SimpleTarget 和 ViewTarget 用于自定义视图类
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

## Glide 中的回调：Targets

目前为止，我们很方便的使用 Glide 建造者去加载图片到 `ImageView` 中了。Glide 隐藏了一大堆复杂的在后台的场景。Glide 做了所有的网络请求和处理在后台线程中，一旦结果准备好了之后，切回到 UI 线程然后更新 `ImageView`。

在这篇博客中，我们假定 `ImageView` 不再是图像的最后一步。我们只要 Bitmap 本身。Glide 提供了一个用 `Targets` 的简单的方式去接受图片资源的 Bitmap。Targets 是没有任何别的回调，它在 Glide 做完所有的加载和处理之后返回结果。

Glide 提供了各种的 targets 并且每个都有其明确的目的。我们将在接下来的几节中通过使用它们。让我们从 `SimpleTarget` 开始。

## SimpleTarget

看如下代码实例：

```java
private SimpleTarget target = new SimpleTarget<Bitmap>() {  
    @Override
    public void onResourceReady(Bitmap bitmap, GlideAnimation glideAnimation) {
        // do something with the bitmap
        // for demonstration purposes, let's just set it to an ImageView
        imageView1.setImageBitmap( bitmap );
    }
};

private void loadImageSimpleTarget() {  
    Glide
        .with( context ) // could be an issue!
        .load( eatFoodyImages[0] )
        .asBitmap()
        .into( target );
}
```

这段代码的第一部分创建了一个字段对象，声明了一个方法，即一旦 Glide 已加载并处理完图像，它将被调用。这个回调方法传了 Bitmap 作为一个参数。你之后便可以使用这个 Bitmap 对象，无论你要怎样用它。

这段代码的第二部分是我们如何通过 Glide 用 targets：和 `ImageView` 用法完全相同的！你既可以传一个 Target 也可以传一个 `ImageView` 参数给 `.into()` 方法。Glide 自己将会处理并返回结果给任何一个。这里有一些不同的是，我们添加了 `.asBitmap()`，它强制 Glide 去返回一个 `Bitmap` 对象。记住，Glide 也可以加载 Gif 或 video 的。为了防止 target 的冲突（我们需要 Bitmap） 和未知资源在网络背后的 URL(可能是一个 Gif)，我们可以调用 `.asBitmap()` 告诉 Glide 我们需要一个图像。

## 关注 Targets

除了知道如何实现一个简单版本的 Glide 的 Target 回调系统，你要学会额外两件事。

首先是 `SimpleTarget` 对象的字段声明。从技术上来说，Java/Android 会允许你在 `.into()` 方法中去声明 target 的匿名内部类。然而，这大大增加了这样一个可能性：即在 Glide 做完图片请求之前， Android 垃圾回收移除了这个匿名内部类对象。最终这可能会导致一个情况，当图像加载完成了，但是回调再也不会被调用。所请确保你所声明的回调对象是作为一个字段对象的，这样你就可以保护它避免被邪恶的 Android 垃圾回收机制回收 ;-)

第二个关键部分是 Glide 建造者中这行：`.with(context)`。 这里的问题实际是 Glide 的功能：当你传了一个 context，例如是当前应用的 activity，Glide 将会自动停止请求当请求的 activity 已经停止的时候。这整合到了应用的生命周期中通常是非常有帮助的，但是有时工作起来是困难的，如果你的 target 是独立于应用的 activity 生命周期。这里的解决方案是用 application 的 context: `.with(context.getApplicationContext))`。当应用资深完全停止时，Glide 才会杀死这个图片请求。请求记住，再说一次，如果你的请求需要在 activity 生命周期之外去做时，才用下面这样的代码：

```java
private void loadImageSimpleTargetApplicationContext() {  
    Glide
        .with( context.getApplicationContext() ) // safer!
        .load( eatFoodyImages[1] 
        .asBitmap()
        .into( target2 );
}
```

## Target 指定尺寸

另一个潜在的问题是，target 没有指明大小。如果你你传一个 `ImageView` 作为参数给 `.into()`，Glide 将会用 `ImageView` 的大小去限制图像的大小。比如说，如果加载的图片是 1000x1000 像素的，但是 `ImageView` 只有 250x250 像素，Glide 将会减少图片的尺寸去节省时间和内存。很显然，在和 target 协作的时候并没有这么做，因为我们并没有已知的大小。然而，如果你有一个指定的大小，你可以提高回调。如果你知道这种图片应该要多大，你应该在你的回调声明中指定它以节省一些内存。

```java
private SimpleTarget target2 = new SimpleTarget<Bitmap>( 250, 250 ) {  
    @Override
    public void onResourceReady(Bitmap bitmap, GlideAnimation glideAnimation) {
        imageView2.setImageBitmap( bitmap );
    }
};

private void loadImageSimpleTargetApplicationContext() {  
    Glide
        .with( context.getApplicationContext() ) // safer!
        .load( eatFoodyImages[1] )
        .asBitmap()
        .into( target2 );
}
```

## ViewTarget

我们不能直接使用 `ImageView` 的原因可能是多种多样的。我们已经向你展示如果去接收一个 Bitmap。现在我们要更进一步。假设你有一个 [Custom View](https://developer.android.com/intl/zh-cn/training/custom-views/index.html)。Glide 并不支持加载图片到自定义 view 中，因为并没有方法知道图片应该在哪里被设置。然而，Glide 可以用 `ViewTarget` 更容易实现。

让我们看一个简单的自定义 View，它继承自 `FrameLayout` 并内部使用了一个 `ImageView` 以及覆盖了一个 `TextView`。

```java
public class FutureStudioView extends FrameLayout {  
    ImageView iv;
    TextView tv;

    public void initialize(Context context) {
        inflate( context, R.layout.custom_view_futurestudio, this );

        iv = (ImageView) findViewById( R.id.custom_view_image );
        tv = (TextView) findViewById( R.id.custom_view_text );
    }

    public FutureStudioView(Context context, AttributeSet attrs) {
        super( context, attrs );
        initialize( context );
    }

    public FutureStudioView(Context context, AttributeSet attrs, int defStyleAttr) {
        super( context, attrs, defStyleAttr );
        initialize( context );
    }

    public void setImage(Drawable drawable) {
        iv = (ImageView) findViewById( R.id.custom_view_image );

        iv.setImageDrawable( drawable );
    }
}
```

你不能使用常规的 Glide 的方法 `.into()`，因为我们的自定义 view 并不继承自 `ImageView`。因此，我们必须创建一个 `ViewTarget`，并用 `.into()` 方法：

```java
private void loadImageViewTarget() {  
    FutureStudioView customView = (FutureStudioView) findViewById( R.id.custom_view );

    viewTarget = new ViewTarget<FutureStudioView, GlideDrawable>( customView ) {
        @Override
        public void onResourceReady(GlideDrawable resource, GlideAnimation<? super GlideDrawable> glideAnimation) {
            this.view.setImage( resource.getCurrent() );
        }
    };

    Glide
        .with( context.getApplicationContext() ) // safer!
        .load( eatFoodyImages[2] )
        .into( viewTarget );
}
```

在 target 回调方法中，我们使用我们创建的方法 `setImage(Drawable drawable)` 在自定义 view 类中去设置图片。另外确保你注意到我们必须在 `ViewTarget` 的构造函数中传递我们自定义 view 作为参数：`new ViewTarget<FutureStudioView, GlideDrawable>(customView)`。

这应该涵盖了所有你需要的自定义 view。你也可以在回调中添加额外的工作。如，我们可以分析传入的 Bitmap 的主要的颜色并设置十六进制值给 `TextView`。但我们相信你应该已经有一些想法了。

## Outlook

在这篇相当长的博客中，你已经了解了在 Glide 中 target 的基本原理。你已经学会了如何访问图片的 Bitmap 以及如何将图片加载到你自定义的 view 中。我们错过什么了吗？让在评论中让我们知晓！

下周，我们将继续 target 的实例，当我们看如何加载图像到通知中以及应用程序窗口小部件里。