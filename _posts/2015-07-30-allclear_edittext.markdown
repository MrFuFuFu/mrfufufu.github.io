---
layout: post
title:  让你的 EditText 全部清除
author: MrFu
date:   2015-07-30 16:10:00
categories: Android
header-img: "img/post-bg-edittext.png"
catalog:    true
tags:
    - Android
---


> 原文地址：[让你的 EditText 全部清除](http://mrfufufu.github.io/android/2015/07/30/allclear_edittext/)

> 参考原文：[Giving your Edit Texts the All Clear](https://medium.com/engineering-at-depop/giving-your-edit-texts-the-all-clear-8ad2579a11ff)

> 项目地址(欢迎 Star)：[ClearEditText](https://github.com/MrFuFuFu/ClearEditText)



在输入文本的时候，通常当前输入的地方的末尾会有一个 'x' 来结束，它的作用是，如果我们想要清空这一整行输入的时候，点一下 'x' 就可以了。它的存在，还是很有必要的。

然后，Android UI 组件并没有提供这样的功能，如果 Android 用户在输入了一段很长的文本的时候，发现他完全输错了，这时候想要删除整行内容的话，他必须一直按删除键，或者长按选中整段文字，然后删除。所以说，其实，这样一个简单 'x' 的存在是非常又必要的。

对于这个 'x' 我们有什么要求呢：

* 'x' 应该只在我们编辑这一项文本的时候并且我们获得了焦点的情况下才显示
* 'x' 应该显示在这项文本内部，即它应该显示在 EditText 里
* 按下 'x' 应该是清除全部内容
* 'x' 的颜色应该是与编辑文本的主题色是一致的

这些要求意味着我们需要自定义 EditText。对于第一个要求，我们需要一个 TextWatcher，这样的话我们就可以看到内容字段发生的改变，还有我们需要实现 onFocusChangeListener。第二个要求，我们可以实现一个 'x' 作为一个 compound drawable，因为这里没有 onClick 事件去监听 compound drawable，我们需要使用 OnTouch 来监听，这样第三个要求也实现了。对于第四个要求，我认为 'x' 的颜色应该是和 hint text 的 color 是一样的。这样才会有“想要就要”的感觉，而不是“我要我要”的感觉。

## 构建我们的 EditText

创建新的 class，继承自 AppCompatEditText 而非 EditText，以确保我们在所有的设备上都有和 Android5.0 一样的效果。

```java
public class ClearEditText extends AppCompatEditText implements View.OnTouchListener, View.OnFocusChangeListener, TextWatcher {
```

创建构造函数和进行初始化：

```java
public ClearEditText(final Context context) {
    super(context);
    init(context);
}

public ClearEditText(final Context context, final AttributeSet attrs) {
    super(context, attrs);
    init(context);
}

public ClearEditText(final Context context, final AttributeSet attrs, final int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    init(context);
}
```

在 init 方法中，定义一个清除的图标，因为我们用了 support library，所以可以使用这个图标：abc_ic_clear_mtrl_alpha。但是因为它是白色的，所以我们使用着色(tint)的办法让它在 Android5.0 以前的设备上也能工作。用 DrawableCompat 类来完成我们的工作：

```java
private void init(final Context context) {
    final Drawable drawable = ContextCompat.getDrawable(context, R.drawable.abc_ic_clear_mtrl_alpha);
    final Drawable wrappedDrawable = DrawableCompat.wrap(drawable); //Wrap the drawable so that it can be tinted pre Lollipop
    DrawableCompat.setTint(wrappedDrawable, getCurrentHintTextColor());
    mClearTextIcon = wrappedDrawable;
    mClearTextIcon.setBounds(0, 0, mClearTextIcon.getIntrinsicHeight(), mClearTextIcon.getIntrinsicHeight());
    setClearIconVisible(false);
    super.setOnTouchListener(this);
    super.setOnFocusChangeListener(this);
    addTextChangedListener(this);
}
```

`setClearIconVisible` 来处理 EditText 的清除图标是否是显示。我们通过焦点的变化和文本的观察(text watchers)来决定显示与否。

```java
private void setClearIconVisible(final boolean visible) {
    mClearTextIcon.setVisible(visible, false);
    final Drawable[] compoundDrawables = getCompoundDrawables();
    setCompoundDrawables(
            compoundDrawables[0],
            compoundDrawables[1],
            visible ? mClearTextIcon : null,
            compoundDrawables[3]);
}
```

这当然意味着使用这样的控制你就不应该自己去设置 right 的 compound drawable，因为它总是会被重写为 'x' 或者 null，当文本改变或者焦点变化的时候。

你可以使用 TextInputLayout 来包裹 EditText。这是非常棒的。

## 监听其他的控制

细心的你肯定已经注意到了，在 init 方法中我调用了父类的 Touch，和 Focus 的监听事件。这么做是因为，我想重写标准的设置器，这样我们就能第一时间捕获这些监听。这样就能应用到我们的逻辑里，或者在逻辑里去设置监听。通过这种方式，如果我们用 TextInputLayout 包裹住了 EditText, 然后有 focus 监听。这样的话这些设置在 EditText 也仍然会被 fired。我们不需要 text watchers，因为你已经有了多个的 multiple text watchers 在编辑文本上。

```java
@Override
public void setOnFocusChangeListener(final OnFocusChangeListener onFocusChangeListener) {
    mOnFocusChangeListener = onFocusChangeListener;
}

@Override
public void setOnTouchListener(final OnTouchListener onTouchListener) {
    mOnTouchListener = onTouchListener;
}
```

为这个新类定义一些字段：

```java
private Drawable mClearTextIcon;
private OnFocusChangeListener mOnFocusChangeListener;
private OnTouchListener mOnTouchListener;
```

## 最终

实现3个监听，首先是 focus:

```java
@Override
public void onFocusChange(final View view, final boolean hasFocus) {
    if (hasFocus) {
        setClearIconVisible(getText().length() > 0);
    } else {
        setClearIconVisible(false);
    }
    if (mOnFocusChangeListener != null) {
        mOnFocusChangeListener.onFocusChange(view, hasFocus);
    }
}
```

这样当 focus 改变的时候，如果 editText 是获得焦点的，并且文本内容不为空，我们就显示 清除的 icon，否则，我们就设置为 null（即不显示 icon），在这两种情况下，我们要对其他所有的 focus 改变进行监听，来确保它的逻辑是正常进行的。


onTouch 事件：

```java
@Override
public boolean onTouch(final View view, final MotionEvent motionEvent) {
    final int x = (int) motionEvent.getX();
    if (mClearTextIcon.isVisible() && x > getWidth() - getPaddingRight() - mClearTextIcon.getIntrinsicWidth()) {
        if (motionEvent.getAction() == MotionEvent.ACTION_UP) {
            setText("");
        }
        return true;
    }
    return mOnTouchListener != null && mOnTouchListener.onTouch(view, motionEvent);
}
```

我们先检查清除的 icon 是否是显示的，然后当我们点击右侧区域，我们就应该始终消耗这个事件，我们不希望其他的 touch 监听获取到。最后，如果用户的手指是从 'x' 所在的区域抬起来的。我们就要去清除文本。如果 'x' 是不显示的或者 onTouch 事件不是在 right drawable 区域内的，我们就应该处理其他的对应的 touch 监听。

最后是简单的 TextWatcher：

```java
@Override
public final void onTextChanged(final CharSequence s, final int start, final int before, final int count) {
    if (isFocused()) {
        setClearIconVisible(s.length() > 0);
    }
}

@Override
public void beforeTextChanged(CharSequence s, int start, int count, int after) {
}

@Override
public void afterTextChanged(Editable s) {
}
```

这样，我们就拥有了带有 'x' 可清除的全功能的的 EditText。你可以在你的布局中替换常规的 EditText 了。如果你是使用 AutoCompleteTextView ，也是可以修改的，只要该类名为如下就行了：

```java
public class ClearableAutoCompleteTextView extends AppCompatAutoCompleteTextView implements View.OnTouchListener, View.OnFocusChangeListener, TextWatcher {
```





