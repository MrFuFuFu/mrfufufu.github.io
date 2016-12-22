---
layout: post
title:  "Glide - ListAdapter(ListView, GridView)"
subtitle:   "Glide — ListAdapter (ListView, GridView)"
author: MrFu
date:   2016-02-27 15:00:00
catalog:    true
tags:
    -  Glide
---


这个系列的前两篇博客已经展示了如何去加载一张图片到一个 `ImageView`中。这篇博客将会演示 `ListView` 和 `GridView` 的 adapter 中实现。每个单元格包含一个 `ImageView`。这有点类似于 很多图片画廊应用。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. ListAdapter(ListView, GridView)
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
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 画廊实现示例：ListView

首先我们需要一些测试图片。我们从我们的 [eatfoody.com](http://eatfoody.com/) 项目中去拿了一些[图片](http://imgur.com/a/uz4uZ)。

```java
public static String[] eatFoodyImages = {
        "http://i.imgur.com/rFLNqWI.jpg",
        "http://i.imgur.com/C9pBVt7.jpg",
        "http://i.imgur.com/rT5vXE1.jpg",
        "http://i.imgur.com/aIy5R2k.jpg",
        "http://i.imgur.com/MoJs9pT.jpg",
        "http://i.imgur.com/S963yEM.jpg",
        "http://i.imgur.com/rLR2cyc.jpg",
        "http://i.imgur.com/SEPdUIx.jpg",
        "http://i.imgur.com/aC9OjaM.jpg",
        "http://i.imgur.com/76Jfv9b.jpg",
        "http://i.imgur.com/fUX7EIB.jpg",
        "http://i.imgur.com/syELajx.jpg",
        "http://i.imgur.com/COzBnru.jpg",
        "http://i.imgur.com/Z3QjilA.jpg",
};
```

其次，我们需要一个 activity，它创建一个 adapter 并设置给一个 `ListView`。

```java
public class UsageExampleAdapter extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_usage_example_adapter);

        listView.setAdapter(new ImageListAdapter(UsageExampleAdapter.this, eatFoodyImages));
    }
}
```

再次，看下 adapter 的布局文件。这个 `ListView` 的 item 的布局文件是非常简单的。

```xml
<?xml version="1.0" encoding="utf-8"?>
<ImageView xmlns:android="http://schemas.android.com/apk/res/android"
       android:layout_width="match_parent"
       android:layout_height="200dp"/>
```

这回显示一个图片列表，每个的高度是 `200dp`，并且填充设备的宽度。显然，这不是最好的图片画廊，不过，不要在意这些细节。

在这之前，我们需要为 `ListView` 实现一个 [adapter](http://developer.android.com/intl/zh-cn/reference/android/widget/Adapter.html)。让它看起来是简单的，并绑定我们的 eatfoody 样本图片到 adapter。每个 item 会显示一个图片。

```java
public class ImageListAdapter extends ArrayAdapter {
    private Context context;
    private LayoutInflater inflater;

    private String[] imageUrls;

    public ImageListAdapter(Context context, String[] imageUrls) {
        super(context, R.layout.listview_item_image, imageUrls);

        this.context = context;
        this.imageUrls = imageUrls;

        inflater = LayoutInflater.from(context);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (null == convertView) {
            convertView = inflater.inflate(R.layout.listview_item_image, parent, false);
        }

        Glide
            .with(context)
            .load(imageUrls[position])
            .into((ImageView) convertView);

        return convertView;
    }
}
```

有趣的事情发生在 `ImageListAdapter` 类里的 `getView()` 方法中。你会看到 Glide 调用方式和之前的'常规'加载图片的方式是完全一样的。不管你在应用中想要如何去加载，Glide 的使用方式总是一样的。

作为一个进阶的 Android 开发者你需要知道我们需要去重用 `ListView` 的布局，去创建一个快速又顺滑滚动的体验。Glide 的魅力是自动处理请求的取消，清楚 `ImageView`，并加载正确的图片到对应的 `ImageView`。

![ListView with eatfoody Images](https://futurestud.io/blog/content/images/2015/09/glide-listview--1-.png)

## Glide 的一个优势：缓存

当你上下滚动很多次，你会看到图片显示的之前的快的多。在比较新的手机上，这甚至都不需要时间去等。你可以会猜测，这些图片可能是来自缓存，而不再是从网络中请求。Glide 的缓存实现是基于 Picasso，这对你来说会更加全面的而且做很多事情会更加容易。缓存实现的大小是依赖于设备的磁盘大小。

当加载图片时，Glide 使用3个来源：内存，磁盘和网络（从最快到最慢排序）。再说一次，这里你不需要做任何事情。Glide 帮你隐藏了所有复杂的情况，同时为你创建了一个智能的缓存大小。我们将在以后的博客中去了解这块缓存知识。

## 画廊实现示例：GridView

对于 `GridView` 来说这和 `ListView` 的实现并没有什么不同，你实际上可以用相同的 adapter，只需要在 activity 的布局文件改成 GridView:

```xml
<?xml version="1.0" encoding="utf-8"?>
<GridView
    android:id="@+id/usage_example_gridview"
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:numColumns="2"/>
```

这是结果：

![GridView with eatfoody Images](https://futurestud.io/blog/content/images/2015/09/glide-grid--1-.png)

## 其他应用：ImageView 作为元素

目前为止，我们仅仅看了整个 adapter 的 item 是一个 `ImageView`。该方法仍然应用于一个或者多个 ImageView 作为 adapter item 的一部分的情况。你的 `getView()` 代码会有一点不同，但是 Glide 项的加载方式是完全相同的。

## 展望

在此，你已经学会如何用 Glide 加载图片的 90%的 Android 使用场景了。在我们覆盖额外的案例之前，我们需要解释 Glide 的额外能力（除了图片加载和缓存）。即：下周将将会关注占位符和动画。