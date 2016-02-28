---
layout: post
title:  "Glide - 用 animate() 自定义动画"
subtitle:   "Glide — Custom Animations with animate()"
author: MrFu
date:   2016-02-28 12:00:00
tags:
    -  Glide
---

上周，我们看了图像在显示之前做了转换。这周我们用动画选项来显示图像。

## Glide 系列预览

## 动画基础

从图像到图像的平滑过渡是非常重要的。用户不喜欢在应用中出现突然的转变。这就是 Glide 要做的。Glide 中有一个标准动画去柔软的在你的 UI 中改变。我们在[之前的博客](https://futurestud.io/blog/glide-placeholders-fade-animations/) 看了 `.crossFade()`。

但是这篇博客，我们要去看看除了 `.crossFade()` 的其他选择。Glide 提供了两个选项去设置一个动画。两个版本都是在 `animate()` 中，但传的参数并不同。

在我们之前代码，我们指出，动画仅仅用于不从缓存中加载的情况。如果图片被缓存过了，它的显示是非常快的，因此动画是没有必要的，并且不显示的。

## 从资源中的动画

回到代码，第一个选项是传一个 Android 资源 id，即动画的资源。一个简单的例子是每个 Android 系统都提供的：slide-in-left(从左滑入)动画，`android.R.anim.slide_in_left`。下面这段代码是这个动画的 XML 描述：

```xml
<?xml version="1.0" encoding="utf-8"?>  
<set xmlns:android="http://schemas.android.com/apk/res/android">  
    <translate android:fromXDelta="-50%p" android:toXDelta="0"
            android:duration="@android:integer/config_mediumAnimTime"/>
    <alpha android:fromAlpha="0.0" android:toAlpha="1.0"
            android:duration="@android:integer/config_mediumAnimTime" />
</set> 
```

当然你可以创建你自己的 XML 动画。比如一个小的缩放动画，图片刚开始小的，然后逐渐增大到原尺寸。

```xml
<?xml version="1.0" encoding="utf-8"?>  
<set xmlns:android="http://schemas.android.com/apk/res/android"  
     android:fillAfter="true">

    <scale
        android:duration="@android:integer/config_longAnimTime"
        android:fromXScale="0.1"
        android:fromYScale="0.1"
        android:pivotX="50%"
        android:pivotY="50%"
        android:toXScale="1"
        android:toYScale="1"/>
</set>  
```

这两个动画都可以用到 Glide 建造者中：

```java
Glide  
    .with( context )
    .load( eatFoodyImages[0] )
    .animate( android.R.anim.slide_in_left ) // or R.anim.zoom_in
    .into( imageView1 );
```

在图片从网络加载完并准备好之后将从左边滑入。

## 通过自定义类实现动画

当你想加载到常规的 `ImageView` 中这是没问题的。但是如果 target 是一些自定义的呢，比如我们之前在[这篇博客](https://futurestud.io/blog/glide-callbacks-simpletarget-and-viewtarget-for-custom-view-classes) 里所谈论过的？所以另外一个选项就非常有用了。通过传递一个动画资源的引用，你实现的一个类有 `ViewPropertyAnimation.Animator` 接口。

这个很简单，你只需实现 `void animate(View view)` 方法。这个视图对象是整个 target 视图。如果它是一个自定义的视图，你要找到你的视图的子元素，并且做些必要的动画。

来看个简单的例子。假设你想要实现一个渐现动画，你得需要创建这样的动画对象：

```java
ViewPropertyAnimation.Animator animationObject = new ViewPropertyAnimation.Animator() {  
    @Override
    public void animate(View view) {
        // if it's a custom view class, cast it here
        // then find subviews and do the animations
        // here, we just use the entire view for the fade animation
        view.setAlpha( 0f );

        ObjectAnimator fadeAnim = ObjectAnimator.ofFloat( view, "alpha", 0f, 1f );
        fadeAnim.setDuration( 2500 );
        fadeAnim.start();
    }
};
```

接下来，你需要在 Glide 请求中去设置这个动画：

```java
Glide  
    .with( context )
    .load( eatFoodyImages[1] )
    .animate( animationObject )
    .into( imageView2 );
```

当然，在 `animate(View view)` 中你的动画对象方法中， 你可以做任何你想要对视图做的事情。自由的用你的动画创建吧。

如果你要在你的自定义视图中实现，你只需要创建这个视图对象，然后在你的自定义视图中创建你的自定义方法。

## Summary

这篇博客中，你已经学会了如何为你的 Glide 请求去创建和应用标准的和自定义的动画。这是我们围绕的话题中的一个，它是非常有益的。我们推荐你花费一些时间去对我们上面的代码进行测试，胡总去实现你自己的想法吧。你可以在评论中让我们知道！

下次，我们要开始解决最后一个 Glide 的大话题：自定义 Glide！具体而言，下周我们会介绍如何在 Glide 中整合各种网络栈。