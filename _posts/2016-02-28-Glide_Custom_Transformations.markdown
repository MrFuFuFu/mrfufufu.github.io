---
layout: post
title:  "Glide - 自定义转换"
subtitle:   "Glide — Custom Transformations"
author: MrFu
date:   2016-02-28 11:30:00
catalog:    true
tags:
    -  Glide
---


# Glide — Custom Transformations

在前面12篇博客中，你已经学到了运用 Glide 标准功能所要求的基础知识。从这篇博客开始，我们将深入研究一系列进阶的话题。这周，我们将仔细看看所谓的转换。

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
13. 自定义转换
14. [用 animate() 自定义动画](http://mrfu.me/2016/02/28/Glide_Custom_Animations_with_animate()/)
15. [集成网络栈](http://mrfu.me/2016/02/28/Glide_Integrating_Networking_Stacks/)
16. [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/)
17. [Module 实例：接受自签名证书的 HTTPS](http://mrfu.me/2016/02/28/Glide_Module_Example_Accepting_Self-Signed_HTTPS_Certificates/)
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## Transformations

在图片被显示之前，transformations(转换) 可以被用于图像的操作处理。比如，如果你的应用需要显示一个灰色的图像，但是我们只能访问到原始色彩的版本，你可以用 transformation 去操作 bitmap，从而将一个明亮色彩版本的图片转换成灰暗的版本。不要理解错啦，transformation 不仅限于颜色转换。你可以图片的任意属性：尺寸，范围，颜色，像素位置等等！Glide 已经包含了2个 transformation，我们[之前](https://futurestud.io/blog/glide-image-resizing-scaling/)已经看了图像重设大小，即：`fitCenter` 和 `centerCrop`。这两个选项都非常有意义，他们在 Glide 中拥有自己的实现。当然，我们这篇博客不再介绍他们。

## 实现你自己的 Transformation

为了实践自定义转换，你将需要创建一个新类，它实现了 [Transformation 接口](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/Transformation.html)。要实现这个方法还是比较复杂的，你必须要有对 Glide 内部架构方面的洞察力才能做的比较棒。如果你只是想要对图片（不是 Gif 和 video）做常规的 bitmap 转换，我们推荐你使用抽象类 [BitmapTransformation](http://bumptech.github.io/glide/javadocs/latest/com/bumptech/glide/load/resource/bitmap/BitmapTransformation.html)。它简化了很多的实现，这应该能覆盖 95% 的应用场景啦。

所以，来看看 `BitmapTransformation` 实现实例。如果你定期阅读这个博客，你会知道我们喜欢的转换是 [用 Renderscript 模糊图像](https://futurestud.io/blog/how-to-blur-images-efficiently-with-androids-renderscript/)。我们可以将之前的所有代码重用到 Glide 的转换中。因为我们继承 `BitmapTransformation` 类，我们用这样的框架：

```java
public class BlurTransformation extends BitmapTransformation {

    public BlurTransformation(Context context) {
        super( context );
    }

    @Override
    protected Bitmap transform(BitmapPool pool, Bitmap toTransform, int outWidth, int outHeight) {
        return null; // todo
    }

    @Override
    public String getId() {
        return null; // todo
    }
}
```

现在我们将之前博客中用 Renderscript 来模糊图像的代码放到我们这里来：

```java
public class BlurTransformation extends BitmapTransformation {

    private RenderScript rs;

    public BlurTransformation(Context context) {
        super( context );

        rs = RenderScript.create( context );
    }

    @Override
    protected Bitmap transform(BitmapPool pool, Bitmap toTransform, int outWidth, int outHeight) {
        Bitmap blurredBitmap = toTransform.copy( Bitmap.Config.ARGB_8888, true );

        // Allocate memory for Renderscript to work with
        Allocation input = Allocation.createFromBitmap(
            rs, 
            blurredBitmap, 
            Allocation.MipmapControl.MIPMAP_FULL, 
            Allocation.USAGE_SHARED
        );
        Allocation output = Allocation.createTyped(rs, input.getType());

        // Load up an instance of the specific script that we want to use.
        ScriptIntrinsicBlur script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
        script.setInput(input);

        // Set the blur radius
        script.setRadius(10);

        // Start the ScriptIntrinisicBlur
        script.forEach(output);

        // Copy the output to the blurred bitmap
        output.copyTo(blurredBitmap);

        toTransform.recycle();

        return blurredBitmap;
    }

    @Override
    public String getId() {
        return "blur";
    }
}
```

再说一次，如果你对于代码块 `transform()` 里的实现是困惑的，去读[之前的博客](https://futurestud.io/blog/how-to-blur-images-efficiently-with-androids-renderscript/)，`getId()` 方法描述了这个转换的唯一标识符。Glide 使用该键作为缓存系统的一部分，为了避免意外的问题，你要确保它是唯一的。

下一节，我们要学习如何应用我们之前创建的转换。

## 单个转换的应用

Glide 有两种方式去使用转换。首先是传一个的你的类的实例作为参数给 `.transform()`。你这里你可以使用任何转换，无论它是否是用于图像还是 Gif。其他选择是使用 `.bitmapTransform()`，它只能用于 bitmap 的转换。因为我们上面的实现是为 bitmap 设计的，这两者我们都可以用：

```java
Glide  
    .with( context )
    .load( eatFoodyImages[0] )
    .transform( new BlurTransformation( context ) )
    //.bitmapTransform( new BlurTransformation( context ) ) // this would work too!
    .into( imageView1 );
```

## 运用多种转换

通常，Glide 的流式接口允许方法以链式的形式。然而对于转换却并不在这种场景下。确保你只调用了一次 `.transform()` 或 `.bitmapTransform()`，否则，之前的配置就会被覆盖掉的！然而，你还是可以运用多种转换的，通过传递多个转换对象作为参数传给 `.transform()` 或 `.bitmapTransform()`。

```java
Glide  
    .with( context )
    .load( eatFoodyImages[1] )
    .transform( new GreyscaleTransformation( context ), new BlurTransformation( context ) )
    .into( imageView2 );
```

这个代码片段中，我们把一个图像设置了灰度，然后做了模糊。Glide 为你自动执行了这两个转换。Awesome!

*提示：当你用了转换后你就不能使用 `.centerCrop()` 或 `.fitCenter()` 了。*


## Glide 转换集合

如果你已经有了做什么样转换的想法，你可以会想要用到你的 App 里，花点时间看下这个库：[glide-transformations](https://github.com/wasabeef/glide-transformations)。它为 Glide 转换提供了多种多样的实现。非常值得去看一下，说不定你的想法已经在它那里实现了。

这个库有两个不同的版本。扩展版本包含了更多的转换，它是通过设备的 GPU 来计算处理的。这个版本需要有额外的依赖，所以这两个版本的设置有一点不同。你应该看看所拥有的转换方法的列表，再去决定你需要使用哪个版本。

## Glide 转换设置

设置起来很简单，对于基础版本你只需要在你当前的 `build.gradle` 中添加一行代码就可以了。

```
dependencies {  
    compile 'jp.wasabeef:glide-transformations:1.2.1'
}
```

如果你想要使用 GPU 转换：

```
repositories {  
    jcenter()
    mavenCentral()
}

dependencies {  
    compile 'jp.wasabeef:glide-transformations:1.2.1'
    compile 'jp.co.cyberagent.android.gpuimage:gpuimage-library:1.3.0'
}
```

如果你想使用 `BlurTransformation`，你需要多一个步骤。如果你还没做的话，那就添加下面这些代码到你的 `build.gradle` 中。

```
android {  
    ...
    defaultConfig {
        ...
        renderscriptTargetApi 23
        renderscriptSupportModeEnabled true
    }
}
```

如果你想要知道更多关于这个步骤的东西，去看看我们的这篇博客： [blog post about Renderscript](https://futurestud.io/blog/how-to-use-the-renderscript-support-library-with-gradle-based-android-projects/)。

## 使用 Glide 的转换

当你将 `build.gradle` 文件在 Android Studio 同步了之后，你可以去使用这个转换集合了。使用模式和你自己定义转换的方式相同。假设我们想要做用这个集合的模糊转换去模糊一张图片：

```java
Glide  
    .with( context )
    .load( eatFoodyImages[2] )
    .bitmapTransform( new jp.wasabeef.glide.transformations.BlurTransformation( context, 25, 2 ) )
    .into( imageView3 );
```

就像我们上面所以用的，你也可以使用一连串的转换。`.bitmapTransform()` 方法都接受一个或多个转换。

## Outlook

这篇博客中，你学到了 Glide 非常有用的工具：转换！你已经学会如何去实现并应用预定义的以及自定义的转换。我们喜欢这能在你的 App 中实现所有你需要的方式！如果你有问题，在评论中让我们知道吧。

这篇博客简述了一个高度可定制的功能，我们会继续在下一篇博客中这么做。下周，我们会去看看自定义动画。