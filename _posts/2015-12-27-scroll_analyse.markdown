---
layout: post
title:  Android Scroll 分析
subtitle: 《Android 群英传》读书笔记
author: MrFu
date:   2015-12-27 16:40:00
header-img: "img/post-bg-android-heros.jpg"
catalog:    true
tags:
    - 《Android 群英传》
---

> 链接 [Android 控件架构与自定义控件详解](http://mrfu.me/2015/12/27/custom_view/)

> 这是我重读《Android 群英传》的时候做的读书笔记，这里主要讲了 Android 坐标系和视图坐标系，以及实现滑动的多种实现方法。
 

## Android 坐标系和视图坐标系

### 区别

* Android 坐标系：左上角作为原点，由 `getLocationScreen(int location[])` 获取点的位置，或在触控事件中使用 `getRawX()`、`getRawY()`获得Android 坐标系中的坐标。

* 视图坐标系：子视图在父视图中的位置关系，同样，父视图的左上角为坐标原点，通过 `getX()`、`getY()` 获得视图坐标系的坐标。

### 获取坐标值

#### View 提供的获取坐标方法

`getTop()`、`getLeft()`、`getRight()` 和 `getBottiom()` 获取到的是 View 自身的顶边、左边、右边、底边到其父布局顶边、左边、右边、底边的距离。

#### MotionEvent 提供的方法

* `getX()`, `getY()` 获取到点击事件距离控件左边、顶边的距离，即视图坐标
* `getRawX()`, `getRawY()` 获取点击事件距离整个屏幕左边、顶边的距离，即绝对坐标

## 实现滑动的方法

滑动的思想：触摸 View 时，系统记下当前触摸点坐标；当手指移动时，系统记下移动后的触摸点坐标，从而获取到相对于前一次坐标点的偏移量，并通过偏移量修改 View 的坐标。如此重复，从而实现滑动的过程。

### 1. layout 方法

```java
@Override
public boolean onTouchEvent(MotionEvent event){
    //绝对坐标，当然也可以通过 getX() 视图坐标获取偏移量, 两种方式得到的偏移量都是相同的
    //但是注意，使用绝对坐标系，一定要在每次执行完 ACTION_MOVE 的逻辑后，重设初始坐标，才能准确地获取偏移量
    int rawX = (int)event.getRawX();
    int rawY = (int)event.getRawY();
    switch(event.getAction()){
        case MotionEvent.ACTION_DOWN:
            //记录触摸点坐标
            lastX = rawX;
            lastY = rawY;
            break;
        case MotionEvent.ACTION_MOVE:
            //计算偏移量
            int offsetX = rawX - lastX;
            int offsetY = rawY - lastY;
            //在当前 left, top, right, bottom 的基础上加上偏移量
            layout(getLeft() + offsetX,
                getTop() + offsetY,
                getRight() + offsetX,
                getBottom() + offsetY);
            //重设初始坐标
            lastX = rawX;
            lastY = rawY;
            break;
    }
    return true;
}
```

### 2. `offsetLeftAndRight()` 和 `offsetTopAndBottom()` 方法

与 layout 方法 效果相同，只是多了一层封装而已

```java
//同时对 left 和 right 进行偏移
offsetLeftAndRight(offsetX);
//同时对 top 和 bottom 进行偏移
offsetTopAndBottom(offsetY);
```

### 3. LayoutParams

LayoutParams 保存了一个 View 的布局参数，所以通过改变 LayoutParams 来动态修改一个布局的位置参数，从而达到改变 View 位置的效果。

```java
LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams)getLayoutParams();
layoutParams.leftMargin = getLeft() + offsetX;
layoutParams.topMargin = getTop() + offsetY;
setLayoutParams(layoutParams);
```

所以，其实我们改变的是这个 View 的 Margin 属性

### 4. scrollTo 和 scrollBy

* `scrollTo(x, y)` 移动到一个具体的坐标点

* `scrollBy(dx, dy)` 移动的增量为 dx, dy

**scrollTo 和 scrollBy 移动的是 View 的内容。即：对 TextView 使用的话，则是移动它的文本；对 ViewGroup 使用的话，则移动的是所有的子 View。所以，一般不对 View 使用这两个方法，而是对 ViewGroup 使用。**

```java
int offsetX = x - lastX;
int offsetY = y - lastY;
//注：随手指移动的话，偏移量要为负
((View)getParent()).scrollBy(-offsetX, -offsetY);
```

### 5. Scroller

Scroller 类可以实现平滑移动的效果，而不再是瞬间完成的移动。

Scroller 原理：和 scrollTo, scrollBy 类似，只是，在 ACTION_MOVE 中不断获取手指移动的微小偏移量，将一段距离划分为 N 个非常小的偏移量。在每个偏移量里面通过 scrollBy 方法进行瞬间移动，实现平滑移动。

#### 例：让子 View 跟随手指滑动，但在手指离开屏幕时，让子 View 平滑移动到初始位置，即屏幕左上角。

使用 Scroller 类需要如下三个步骤:

##### a. 初始化 Scroller

```java
mScroller = new Scroller(context);
```

##### b. 重写 `computeScroll()` 方法，实现模拟滚动

```java
//模板代码
//系统在绘制 View 的时候会在 draw() 方法中调用该方法
//该方法实际上就是使用 scrollTo 方法, 不断的瞬间移动一个小距离实现整体的平滑移动效果
@Override
public void computeScroll(){
    super.computeScroll();
    //判断 Scroller 是否执行完毕
    if(mScroller.computeScrollOffset()){
        ((View)getParent()).scrollTo(
            mScroller.getCurrX(),//获得当前的滑动坐标
            mScroller.getCurrY());
        //通过重绘不断调用 computeScroll
        invalidate();
    }
}
```

需要注意：因为只能在 `computeScroll()` 方法中获取模拟过程的 scrollX 和 scrollY 坐标，但 `computeScroll()` 不会自动调用，只能通过 `invalidate()` -> `draw()` -> `computeScroll()` 来间接调用 `computeScroll()`，所以需要在上述代码中调用`invalidate()`，实现循环获取 scrollX 和 scrollY 的目的。模拟过程结束后，`scroller.computeScrollOfset()` 方法会返回 false, 从而中断循环，完成整个平滑移动的过程。

##### c. startScroll 开启模拟过程

```java
case MotionEvent.ACTION_UP:
    //手指离开时，执行滑动过程，让子 View 平滑移动到初始位置，即屏幕左上角
    View viewGroup = ((View)getParent());
    mScroller.startScroll(
        viewGroup.getScrollX(),//起始坐标
        viewGroup.getScrollY(),
        -viewGroup.getScrollX(),//偏移量
        -viewGroup.getScrollY());
    //通知重绘！
    invalidate();
    break;
```

### 6. 属性动画

>略(我也等笔记做到第7章的动画机制的时候再写吧，哈哈)

### 7. ViewDragHelper

例：实现 QQ 滑动侧边栏的布局

```java
public class DragViewGroup extends FrameLayout {

    private ViewDragHelper mViewDragHelper;
    private View mMenuView, mMainView;
    private int mWidth;

    public DragViewGroup(Context context) {
        super(context);
        initView();
    }

    public DragViewGroup(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public DragViewGroup(Context context,
                         AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView();
    }

    //加载布局文件完成后调用
    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        //按顺序将子 View 分别定义成 MenuView 和 MainView
        mMenuView = getChildAt(0);
        mMainView = getChildAt(1);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        // 获取 View 的宽度
        // 如果需要根据 View 的宽度来处理滑动后的效果，可以使用这个值来判断
        mWidth = mMenuView.getMeasuredWidth();
    }

    //步骤二：拦截
    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        //将事件传递给 ViewDragHelper 处理
        return mViewDragHelper.shouldInterceptTouchEvent(ev);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        //将触摸事件传递给ViewDragHelper,此操作必不可少
        mViewDragHelper.processTouchEvent(event);
        return true;
    }

    //步骤一：初始化
    private void initView() {
        //使用静态工厂方法初始化
        //参数1 通常是一个 ViewGroup,即parentView
        //参数2 是一个 Callback 回调，是整个 ViewDragHelper 的逻辑核心
        mViewDragHelper = ViewDragHelper.create(this, callback);
    }

    //步骤四：处理回调 Callback
    private ViewDragHelper.Callback callback =
            new ViewDragHelper.Callback() {

                // 何时开始检测触摸事件
                // 通过该方法，指定在创建 ViewDragHelper 时，参数 parentView 中的哪一个子 View 可以被移动
                @Override
                public boolean tryCaptureView(View child, int pointerId) {
                    //如果当前触摸的child是mMainView时开始检测
                    //即 只有 MainView 可以被拖动
                    return mMainView == child;
                }

                // 触摸到View后回调
                @Override
                public void onViewCaptured(View capturedChild,
                                           int activePointerId) {
                    super.onViewCaptured(capturedChild, activePointerId);
                }

                // 当拖拽状态改变，比如idle，dragging
                @Override
                public void onViewDragStateChanged(int state) {
                    super.onViewDragStateChanged(state);
                }

                // 当位置改变的时候调用,常用与滑动时更改scale等
                @Override
                public void onViewPositionChanged(View changedView,
                                                  int left, int top, int dx, int dy) {
                    super.onViewPositionChanged(changedView, left, top, dx, dy);
                }

                // 处理垂直滑动
                // top: 垂直方向上 child 移动的距离
                // dy: 相较前一次的增量
                @Override
                public int clampViewPositionVertical(View child, int top, int dy) {
                    return 0;//垂直方向上不发生滑动
                }

                // 处理水平滑动
                @Override
                public int clampViewPositionHorizontal(View child, int left, int dx) {
                    return left;
                }

                // 拖动结束后调用
                // 即手指离开屏幕后实现的操作
                // 该方法内部是通过 Scroller 类来实现的
                @Override
                public void onViewReleased(View releasedChild, float xvel, float yvel) {
                    super.onViewReleased(releasedChild, xvel, yvel);
                    //手指抬起后缓慢移动到指定位置
                    //让 MainView 移动后左边距小于500像素时，就使用 smoothSlideViewTo() 将 MainView 还原到初始状态，即(0,0)的点
                    if (mMainView.getLeft() < 500) {
                        //关闭菜单
                        //相当于Scroller的startScroll方法
                        mViewDragHelper.smoothSlideViewTo(mMainView, 0, 0);
                        ViewCompat.postInvalidateOnAnimation(DragViewGroup.this);
                    } else {
                        //打开菜单
                        //大于500时，移动到(300, 0)坐标,即显示 MenuView
                        mViewDragHelper.smoothSlideViewTo(mMainView, 300, 0);
                        ViewCompat.postInvalidateOnAnimation(DragViewGroup.this);
                    }
                }
            };

    //步骤三：处理 computeScroll()
    //因为 ViewDragHelper 内部同样是通过 Scroller 来实现平滑移动的，所以重写该方法
    //可作为模板代码
    @Override
    public void computeScroll() {
        if (mViewDragHelper.continueSettling(true)) {
            ViewCompat.postInvalidateOnAnimation(this);
        }
    }
}
```

ViewDragHelper.Callback 中其他的一些强大的事件

* `onViewCaptured()` 触摸到 View 后回调
* `onViewDragStateChanged()` 拖拽状态改变时回调
* `onViewPositionChanged()` 位置改变时回调，如滑动时更改 scale 进行缩放等效果

