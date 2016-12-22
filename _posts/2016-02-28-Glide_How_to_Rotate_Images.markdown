---
layout: post
title:  "Glide - 如何旋转图像"
subtitle:   "Glide — How to Rotate Images"
author: MrFu
date:   2016-02-28 14:45:00
catalog:    true
tags:
    -  Glide
---



不久前，我们有一个问题是如何用 Glide 旋转图像，因为 Picasso 提供了这个方法 [out-of-the-box](https://futurestud.io/blog/picasso-image-rotation-and-transformation)。不幸的是，Glide 并不提供这样的小方法的调用，但是在这个博客中我们将会告诉你怎么做的跟它一样简单。

如果你需要关于 Glide 的更多内容，浏览我们这些博客列表：

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
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. 如何旋转图像
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 如何用 Glide 旋转图片

事实上，[android.graphics.Matrix](http://developer.android.com/intl/zh-cn/reference/android/graphics/Matrix.html) 类提供了我们所需要的准确办法（甚至更多办法）。这个代码片段就是用来旋转图像的：

```java
Bitmap toTransform = ... // your bitmap source

Matrix matrix = new Matrix();  
matrix.postRotate(rotateRotationAngle);

Bitmap.createBitmap(toTransform, 0, 0, toTransform.getWidth(), toTransform.getHeight(), matrix, true);  
```

为了使它对我们有用，尤其是用在 Glide 中，我们会包裹它作为一个 `BitmapTransformation`：

```java
public class RotateTransformation extends BitmapTransformation {

    private float rotateRotationAngle = 0f;

    public RotateTransformation(Context context, float rotateRotationAngle) {
        super( context );

        this.rotateRotationAngle = rotateRotationAngle;
    }

    @Override
    protected Bitmap transform(BitmapPool pool, Bitmap toTransform, int outWidth, int outHeight) {
        Matrix matrix = new Matrix();

        matrix.postRotate(rotateRotationAngle);

        return Bitmap.createBitmap(toTransform, 0, 0, toTransform.getWidth(), toTransform.getHeight(), matrix, true);
    }

    @Override
    public String getId() {
        return "rotate" + rotateRotationAngle;
    }
}
```

如果你不知道上面这个类发生了，去看看我们介绍的 [Custom Transformations](https://futurestud.io/blog/glide-custom-transformation)，它将告诉你所有你要知道的。

最后，让我们看看新的转换的实例：

```java
private void loadImageOriginal() {  
    Glide
        .with( context )
        .load( eatFoodyImages[0] )
        .into( imageView1 );
}

private void loadImageRotated() {  
    Glide
        .with( context )
        .load( eatFoodyImages[0] )
        .transform( new RotateTransformation( context, 90f ))
        .into( imageView3 );
}
```

![Glide Rotate Transformation](https://futurestud.io/blog/content/images/2016/02/glide-rotate.png)

当然，你可以改变第二个参数来设置你需要的旋转的角度。你甚至可以动态设置它！

这应该提供了所有的代码和知识你需要在 Glide 中旋转的图片，即使它没有直接在库中提供。如果这对你来说有用的，在评论中让我们知道呗！