---
layout: post
title:  Glide - 怎样旋转图像
author: MrFu
date:   2016-02-28 17:00:00
tags:
    -  Glide
---


不久前，我们有一个问题是如何用 Glide 旋转图像，因为 Picasso 提供了这个方法 [out-of-the-box](https://futurestud.io/blog/picasso-image-rotation-and-transformation)。不幸的是，Glide 并不提供这样的小方法的调用，但是在这个博客中我们将会告诉你怎么做的跟它一样简单。

如果你需要关于 Glide 的更多内容，浏览我们这些博客列表：

## Glide 系列浏览

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