---
layout: post
title:  保持 EditText 的简洁
subtitle: 在 Android 中对你所有的 EditText 实现文本监听
author: MrFu
date:   2015-11-15 17:40:00
categories: Android
header-img: "img/post-bg-edittext.png"
catalog:    true
tags:
    - Android
---


> 原文地址：[保持 EditText 的简洁](http://mrfu.me/android/2015/11/15/Keeping_it_clean/)

> 翻译原文：[Keeping it clean](https://medium.com/engineering-at-depop/keeping-it-clean-bba792c001bf)

> 项目地址(欢迎 Star)：[ClearEditText](https://github.com/MrFuFuFu/ClearEditText/tree/textWatchers)


![keeping-it-clean](/img/keeping-it-clean.jpeg)


在 Android design support 包中提供了一种在输入不合适字符时一直显示的提示方式来显示，现在已经开始在更多的应用上被使用了；这些 Android app 在显示他们的错误提示时采用的不同的方式常常让人感觉非常的不和谐。

即这个一直显示的错误消息是在 TextInputLayout 中的 EditText 周围的。这也是，作为一个奖励，提供了材料设计风格中，活泼的浮动标签在一个 APP 的用户体验中常常是最无聊的部分。

>每次一个新版本【指Android support library】发布的时候我就像一个小孩在过圣诞节：我冲下楼去看圣诞老人送来的新玩具是什么，但是发现他带来新玩具的时候，我的新玩具火车缺少一些零件，他还弄坏了一些我最喜欢的玩具，还把烟囱里的烟灰踩到了地摊上。

在这篇文章中，我将讨论如何在你的输入表单上去创建一个通用的、可重用的组件来实现所有的字段验证。因为你想要在用户改正了错误的输入时就去隐藏错误提示。我们可以通过使用 TextWatchers 来实现验证。

不幸的是，在最新的support library (23.1)中，一旦你隐藏了错误提示，让它们再显示的时候，会有一个 bug。所以这个例子是建立在这个 23.0.1 support library 上的。此时我对这个 support library 是又爱又恨的关系——每次一个新版本发布的时候我就像一个小孩在过圣诞节：我冲下楼去看圣诞老人送来的新玩具是什么，但是发现他带来新玩具的时候，我的新玩具火车缺少一些零件，他还弄坏了一些我最喜欢的玩具，还把烟囱里的烟灰踩到了地摊上。

## 创建我们通用的类

把我的小埋怨放到一边，让我们创建一个实现了 TextWatcher 的接口的抽象的 ErrorTextWatcher 类。对于这个简单的例子，我想说我们的 TextWatcher 总是带有 TextInputLayout，而且它可以显示一个简单的错误消息。你的用户体验设计团队可能想要显示不同的错误——如：“密码不能为空”，“密码必须包含至少一个数字”，“请输入至少 4 个字符”等。—— 但为了简单起见，每个 TextWatcher 我将只展示如何实现一个简单的消息。

```java
public abstract class ErrorTextWatcher implements TextWatcher {

    private TextInputLayout mTextInputLayout;
    private String errorMessage;

    protected ErrorTextWatcher(@NonNull final TextInputLayout textInputLayout, @NonNull final String errorMessage) {
        this.mTextInputLayout = textInputLayout;
        this.errorMessage = errorMessage;
    }
```

我还给这个抽象类增加了一些通用的方法:

```java
public final boolean hasError() {
    return mTextInputLayout.getError() != null;
}

protected String getEditTextValue() {
    return mTextInputLayout.getEditText().getText().toString();
}
```

我也想要我所有的  ErrorTextWatchers 都实现 validate() 方法，如果如果输入是正确的就返回 true，这样能简单的去显示或隐藏错误:

```java
public abstract boolean validate();

protected void showError(final boolean error) {
    if (!error) {
        mTextInputLayout.setError(null);
        mTextInputLayout.setErrorEnabled(false);
    } else {
        if (!errorMessage.equals(mTextInputLayout.getError())) {
            // Stop the flickering that happens when setting the same error message multiple times
            mTextInputLayout.setError(errorMessage);
        }
        mTextInputLayout.requestFocus();
    }
}
```

在我的代码上，这个库在这里有另外一个功能：在我看来通过设置错误提示的 enabled 为 false，你就应该能隐藏错误提示，但是这会让 EditText 的下划线仍然显示不正确的颜色，所以你既需要设置错误提示为空，也需要让下划线的颜色恢复。同样，如果你不断地设置相同的错误字符串，这个错误提示会随着动画不断的闪烁，所以只有当错误提示有新的值时才要去重写。

最后，当焦点在 TextWatcher 内的 EditText 上时，我有一点点调皮的要求 ——当你看到我是如何验证输入表单的，希望你能明白我为什么这么做，但是对于你的需求，你可能想要把这段逻辑移到其他地方。

作为一个额外的优化，我发现我可以在 onTextChanged 方法的 TextWatcher 接口内实现我所有的逻辑，所以我给 beforeTextChanged 和 afterTextChanged 的父类增加了两个空方法。

## 最小长度验证

现在，让我们这个类的一个具体的例子。一个常见的用例是输入字段需要至少为 x 个的字符。因此，让我们创建一个 MinimumLengthTextWatcher。它带有一个最小长度值，当然，在父类中，我还需要 TextInputLayout 和 message。此外，我不想在他们输入完成之前一直告诉用户他们需要输入 x 个字符——这会是一个坏的用户体验——所以我们应该在用户已经超出了最小限制字符的时候来开始显示错误。（译者注：可以理解为当用户输入的长度超过最小限制字符之后，用户再删除一部分字符，如果此时少于最小限制字符，就会显示错误了，这样就能理解了）

```java
public class MinimumLengthTextWatcher extends ErrorTextWatcher {

    private final int mMinLength;
    private boolean mReachedMinLength = false;

    public MinimumLengthTextWatcher(final TextInputLayout textInputLayout, final int minLength) {
        this(textInputLayout, minLength, R.string.error_too_few_characters);
    }

    public MinimumLengthTextWatcher(final TextInputLayout textInputLayout, final int minLength, @StringRes final int errorMessage) {
        super(textInputLayout, String.format(textInputLayout.getContext().getString(errorMessage), minLength));
        this.mMinLength = minLength;
    }
```

这里有两个构造方法：一个是具有默认的消息，还有一个是对于特殊的文本字段你可以创建一个更具体的值。因为我们想要支持当地化，我们采用 Android string 资源文件，而不是硬编码 String 的值。

我们文本的改变和验证方法现在已经像下面这样简单的实现了：

```java
@Override
public void onTextChanged(final CharSequence text…) {
    if (mReachedMinLength) {
        validate();
    }
    if (text.length() >= mMinLength) {
        mReachedMinLength = true;
    }
}

@Override
public boolean validate() {
    mReachedMinLength = true; // This may not be true but now we want to force the error to be shown
    showError(getEditTextValue().length() < mMinLength);
    return !hasError();
}
```

你会注意到，一旦验证方法在 TextWatcher 中被调起的话，它将会显示错误。我想这适用于大多数情况，但是你可能想要引入一个 setter 方法去重置某些情况下的这种行为。

你现在需要去给你的 TextInputLayout 增加 TextWatcher，接着在你的 Activity 或 Fragment 中去创建 views。就像这样：

```java
mPasswordView = (TextInputLayout) findViewById(R.id.password_text_input_layout);
mValidPasswordTextWatcher = new MinimumLengthTextWatcher(mPasswordView, getResources().getInteger(R.integer.min_length_password));
mPasswordView.getEditText().addTextChangedListener(mValidPasswordTextWatcher);
```

然后，在你代码的合适位置，你可以检查一个字段是否有效：

```java
boolean isValid = mValidPasswordTextWatcher.validate();
```

如果密码是无效的，这个 View 会自动的获得焦点并将屏幕滚动到这里。

## 验证电子邮件地址

另一种常见的验证用例是检查电子邮件地址是否是有效的。我可以很容易的写一整篇都关于用正则表达式来验证邮件地址的文章，但是因为这常常是有争议的，我已经从 TextWatcher 本身分开了邮件验证的逻辑。示例项目包含了可测试的 EmailAddressValidator，你可以用它，或者你也可以用你自己想要的逻辑来实现。

既然我已经把邮件验证逻辑分离出来了，ValidEmailTextWatcher 是和  MinimumLengthTextWatcher 非常相似的。

```java
public class ValidEmailTextWatcher extends ErrorTextWatcher {

    private final EmailAddressValidator mValidator = new EmailAddressValidator();
    private boolean mValidated = false;


    public ValidEmailTextWatcher(@NonNull final TextInputLayout textInputLayout) {
        this(textInputLayout, R.string.error_invalid_email);
    }

    public ValidEmailTextWatcher(@NonNull final TextInputLayout textInputLayout, @StringRes final int errorMessage) {
        super(textInputLayout, textInputLayout.getContext().getString(errorMessage));
    }

    @Override
    public void onTextChanged(…) {
        if (mValidated) {
            validate();
        }
    }

    @Override
    public boolean validate() {
        showError(!mValidator.isValid(getEditTextValue()));
        mValidated = true;
        return !hasError();
    }
```

这个 TextWatcher 在我们的 Activity 或 Fragment 内的实现方式是和之前的是非常像的：

```java
mEmailView = (TextInputLayout) findViewById(R.id.email_text_input_layout);
mValidEmailTextWatcher = new ValidEmailTextWatcher(mEmailView);
mEmailView.getEditText().addTextChangedListener(mValidEmailTextWatcher);
```

## 把它放在一起

对于表单注册或登录，在提交给你的 API 之前，你通常会验证所有的字段。因为我们要求关注在 TextWatcher 的任何 views 的失败验证。我一般在从下往上验证所有的 view。这样，应用程序显示所有需要纠正字段的错误，然后跳转到表单上第一个错误输入的文本。例如：

```java
private boolean allFieldsAreValid() {
    /**
     * Since the text watchers automatically focus on erroneous fields, do them in reverse order so that the first one in the form gets focus
     * &= may not be the easiest construct to decipher but it's a lot more concise. It just means that once it's false it doesn't get set to true
     */
    boolean isValid = mValidPasswordTextWatcher.validate();
    isValid &= mValidEmailTextWatcher.validate();
    return isValid;
}
```

你可以找到上述所有代码的例子在 [GitHub](https://github.com/MrFuFuFu/ClearEditText/tree/textWatchers)[^clearGithub] 上。这是一个在 ClearableEditText 上的分支，我是基于 [让你的 EditText 全部清除](http://mrfu.me/android/2015/07/30/allclear_edittext/)[^clearBlog] 这篇博客上的代码来进行阐述的，但是把它用在标准的 EditText 上也是一样的。它还包括了一些更多的技巧和 bug 处理，我没有时间在这里提了。

尽管我只显示了两个 TextWatcher 的例子，但我希望你能看到这是多么简单，你现在能添加其他的 TextWatcher 去给任何文本输入添加不同的验证方法，并在你的 APP 中去请求验证和重用。

[^clearGithub]: [ClearableEditText](https://github.com/depop/ClearableEditText/tree/textWatchers)

[^clearBlog]: [Giving your Edit Texts the All Clear]( https://medium.com/engineering-at-depop/giving-your-edit-texts-the-all-clear)
