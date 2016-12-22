---
layout: post
title:  Android 控件架构与自定义控件详解
subtitle: 《Android 群英传》读书笔记
author: MrFu
date:   2015-12-27 14:22:00
header-img: "img/post-bg-android-heros.jpg"
catalog:    true
tags:
    - 《Android 群英传》
---

> 链接 [Android Scroll 分析](http://mrfu.me/2015/12/27/scroll_analyse/)

> 这是我重读《Android 群英传》的时候做的读书笔记，在 View 这块，医生讲解真的非常深入浅出，非常值得一读，并且多次重读。
 
## 架构：

* PhoneWindow 将一个 DecorView 设置为整个应用窗口的根 View，这里面所有 View 的监听事件，都通过 WindowManagerService 来接收。DecorView 分为 TitleView 和 ContentView，ContentView 是一个 ID 为 content 的 FrameLayout
* 在 `onCreate()` 方法中调用 `setContentView()` 方法后，ActivityManagerService 会回调 `onResume()` 方法，此时系统才会把整个 DecorView 添加到 PhoneWindow 中，并让其显示出来，从而完成最终的界面绘制。

## View 的测量：
测量 View 的类：MeasureSpec 类，它是一个32位的 int 值，高两位为测量模式，低30位为测量大小，使用位运算提高并优化效率。

重写 `onMeasure()` 后，最终要做的是把测量后的宽高值作为参数设置给 `setMeasureDimension()` 方法。

```java
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec){
    setMeasureDimension(measureWidth(widthMeasureSpec), measureHeight(heightMeasureSpec));
}

//可作为模板代码！
private int measureWidth(int measureSpec){
    int result = 0;
    int specMode = MeasureSpec.getMode(measureSpec);
    int specSize = MeasureSpec.getSize(measureSpec);
    if(specMode == MeasureSpec.EXACTLY){//精确值模式，指定具体数值
        result = specSize;
    }else{
        result = 200;//先设置一个默认大小
        //最大值模式，layout_width 或 layout_height 为 wrap_content 时，控件大小随控件的内容变化而变化，此时控件尺寸只要不超过父控件允许的最大尺寸即可。
        if(specMode == MeasureSpec.AT_MOST){
            result = Math.min(result, specSize);//取出我们指定的大小和 specSize 中最小的一个来作为最后的测量值
        }
        //MeasureSpec.UNSPECIFIED 不指定其大小，View 想多大就多大
    }
    return result;
}
```

即，如果不重写 `onMeasure()` 方法，系统则会不知道该默认多大尺寸，就会默认填充整个父布局，所以，**重写 `onMeasure()` 方法的目的，就是为了能够给 View 一个 wrap_content 属性下的默认大小**。

## View 的绘制

`onDraw()` 中的参数，就是 Canvas 对象，使用该对象进行绘图，而在其他地方，则需要 new 出该对象:

```java
Canvas canvas = new Canvas(bitmap);
```

传进去的 bitmap 是与这个 bitmap 创建的 Canvas 画布紧密联系的，这个过程称为装载画布。该 bitmap 用来存储所有绘制在 Canvas 上的像素信息。所有的 Canvas.drawXXX 方法都发生在这个 bitmap 上。

```java
@Override
protected void onDraw(Canvas canvas){
    //...
    //在 onDraw 方法中绘制两个 bitmap
    canvas.drawBitmap(bitmap1, 0, 0, null);
    canvas.drawBitmap(bitmap2, 0, 0, null);
    //...
}
private void otherMethod(){
    //将 bitmap2 装载到另一个 Canvas 对象中
    Canvas mCanvas = new Canvas(bitmap2);
    //其他地方使用 Canvas 对象的绘图方法在装载 bitmap2 的 Canvas 对象上进行绘图
    mCanvas.drawXXX
}
```

**通过 mCanvas 将绘制效果作用在了 bitmap2 上，再刷新 View 的时候，就会发现通过 `onDraw()` 方法画出来的 bitmap2 已经改变，因为 bitmap2 承载了在 mCanvas 上所进行的绘图操作。我们没有将图形直接绘制在 `onDraw()` 方法制定的那块画布上，而是通过改变 bitmap，让 View 重绘，从而显示改变之后的 bitmap。**

## ViewGroup 的测量

当 ViewGroup 的大小为 wrap_content 时，ViewGroup 需要对子 View 进行遍历，以便获得所有子 View 大小从而决定自己的大小，即调用子 View 的 Measure 方法来获得每一个子 View 的测量结果。

子 View 测量完毕后，ViewGroup 执行 Layout 过程时，同样是遍历调用子 View 的 Layout 方法，并指定其具体显示的位置，从而来决定其布局位置。

## 自定义 View

```java
@Override
protected void onDraw(Canvas canvas){
    //在回调父类方法前，对 TextView 来说是在绘制文本内容之前，实现逻辑
    super.onDraw(canvas);
    //之后，绘制文本之后
}
```

在 attrs.xml 中通过使用`<declar-styleable>`标签声明使用了自定义属性，使用如下代码获得在布局文件中自定义的那些属性

```java
TypedArray ta = context.obtainStyledAttributes(attrs, R.styleable.TopBar);
mLeftColor = ta.getColor(R.styleable.TopBar_leftTextColor, 0);
//完成资源回收，避免重新创建的时候的错误
ta.recycle();
```

## 自定义 ViewGroup

重写 `onMeasure()` 来对子 View 进行测量，重写 `onLayout()` 确定子 View 位置，重写 `onTouchEvent()` 增加响应事件。

### 实例需求：自定义 ViewGroup 实现类似 ScrollView 上下滑动，同时增加粘性效果。即，当一个子 View 向上滑动大于一定距离后，松开将自动上滑，显示下一个子 View，否则回到原始位置。

#### 步骤一：先实现类似 ScrollView 功能：

```java
@override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec){
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    int count = getChildCount();
    //遍历通知子 View 对其自身进行测量
    for(int i = 0;i < count; ++i){
        View childView = getChildAt(i);
        measureChild(childView, widthMeasureSpec, heightMeasureSpec);
    }
}
```

#### 步骤二：再对子 View 进行放置位置设定，让每个子 View 都显示完整的一屏。所以，本例中ViewGroup 的高度就是子 View 的个数乘以屏幕高度，然后遍历设定每个子 View 放置的位置

```java
@Override
protected void onLayout(boolean changed, int l, int t, int r, int b){
    int childCount = getChildCount();
    //设置 ViewGroup 高度
    MarginLayoutParams mlp = (MarginLayoutParams)getLayoutParams();
    mlp.height = mScreenHeight.childCount;
    setLayoutParams(mlp);
    //修改子 View 的 top 和 bottom 属性，使它们依次排列
    for(int i=0; i<childCount; i++){
        View child = getChildAt(t);
        if(child.getVisibility() != View.GONE){
            child.layout(l, i*mScreenHeight, r, (i+1)*mScreenHeight);
        }
    }
}
```

#### 步骤三：


```java
@Override
public boolean onTouchEvent(MotionEvent event){
    int y = (int)event.getY();
    switch(event.getAction()){
        case MotionEvent.ACTION_DOWN:
            mLastY = y;
            mStart = getScrollY();//记录按下位置
            break;
        case MotionEvent.ACTION_MOVE:
            if(!mScroller.isFinished()){
                mScroller.abortAnimation();
            }
            int dy = mLastY - y;
            if(getScrollY() < 0){
                dy = 0;
            }
            if(getScrollY() >getHeight - mScreenHeight){
                dy = 0;
            }
            scrollBy(0, dy);//随手指滚动 dy
            mLastY = y;
            break;
        case MotionEvent.ACTION_UP:
            mEnd = getScrollY();
            int dScrollY = mEnd - mStart;
            if(dScrollY > 0){//上滑
                if(dScrollY < mScreenHeight / 3){//小于一定距离, 滚回去
                    mScroller.startScroll(0,getScrollY(), 0, -dScrollY);
                }else{//大于，则滚动完剩余的距离
                    mScroller.startScroll(0,getScrollY(), 0, mScreenHeight-dScrollY);
                }
            }else{//同理
                if(-dScrollY < mScreenHeight /3){
                    mScroller.startScroll(0, getScrollY(), 0, -dScrollY);
                }else{
                    mScroller.startScroll(0, getScrollY(), 0, -mScreenHeight - dScrollY);
                }
            }
            break;
    }
    postInvalidata();
    return true;
}

/**
*Called by a parent to request that a child update its values for mScrollX and mScrollY if necessary. This will typically be done if the child is animating a scroll using a Scroller object.
**/
@Override
public void computeScroll(){
    super.computeScroll();
    if(mScroller.computeScrollOffset()){
        scrollTo(0, mScroller.getCurrY());
        postInvalidate();
    }
}
```

## 事件拦截机制

![custom_view_viewgroup](/img/article/custom_view_viewgroup.jpeg)

点击 View 的 log:

```java
ViewGroupA dispatchTouchEvent
ViewGroupA onInterceptTouchEvent
ViewGroupB dispatchTouchEvent
ViewGroupB onInterceptTouchEvent
View dispatchTouchEvent
View onTouchEvent //last event, will back to parent
ViewGroupB onTouchEvent
ViewGroupA onTouchEvent
```

所以事件传递顺序是：先执行 `dispatchTouchEvent()` 然后是 `onInterceptTouchEvent()`。**返回值：True，拦截，不继续；False，不拦截，继续流程。初始返回是 false。**

事件处理顺序是：`onTouchEvent()`。**返回值：True，处理了，不审核；False，给上级处理。初始返回是 false。**

即：

* **分发、拦截**：如果某个 ViewGroup 直接使用 `dispatchTouchEvent()` 返回了 true ，则分发拦截结束，不再向其子 View 传递，则，直接执行该 ViewGroup 的 `onTouchEvent()`，然后继续向上*处理*对应 ViewGroup 的 `onTouchEvent()`。

* **处理**：如果某个 View 直接在 `onTouchEvent()` 中返回了 true。则上级不再执行 `onTouchEvent()`。所有的*处理*在此结束。




