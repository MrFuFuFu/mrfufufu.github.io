---
layout: post
title:  【翻-双语】Android Design Support Library 的 代码实验——几行代码，让你的 APP 变得花俏
author: MrFu
date:   2015-07-01 20:45:00
categories: English
header-img: "img/codelab-android-lib.jpg"
catalog:    true
tags:
    - English
---

> 译者地址：[【翻】Android Design Support Library 的 代码实验——几行代码，让你的 APP 变得花俏](http://mrfufufu.github.io/android/2015/07/01/Codelab_Android_Design_Support_Library/)

> 原文：[Codelab for Android Design Support Library used in I/O Rewind Bangkok session----Make your app fancy with few lines of code](http://inthecheesefactory.com/blog/android-design-support-library-codelab/en)

> 原文项目 demo: [Lab-Android-DesignLibrary](https://github.com/nuuneoi/Lab-Android-DesignLibrary)

> 双语对照地址: [【翻-双语】Android Design Support Library 的 代码实验——几行代码，让你的 APP 变得花俏](http://mrfufufu.github.io/english/2015/07/01/Translate_Codelab_Android_Design_Support_Library/)

>* 翻译: [MrFu](http://mrfufufu.github.io/)
>* 校验: [MrFu](http://mrfufufu.github.io/)
>* 能去这里小小的点一下 star 吗？非常感谢：[Codelab](https://github.com/MrFuFuFu/Codelab)

At the moment I believe that there is no any Android Developer who doesn`t know about **Material Design** anymore since it officially becomes a design philosophy by shaking the world of design in passed year.

目前，我相信，没有任何 Android 开发者不知道**材料设计**的，因为它的设计在过去的一年震惊了世界，正式的变成了一个设计理念。

Surprisingly that it was not easy to implement Material Design in android application because those Material Design`s UI Component like Floating Action Button (FAB) wasn`t available in Android pre-Lollipop. Only choice we had was to use 3rd party library published by indie android developer out there.

令人惊讶的是，在 Android 应用中材料设计是不容易实现的，因为材料设计的 UI 组件  如: Floating Action Button (FAB) 在低于 Android L 系统上是不可用的。我们只能选择使用由独立开发者公布出来的第三方库。

Here comes a good news. Last week during Google I/O 2015 event, Google announced the most excited support library within year named **Android Design Support Library** providing a bunch of useful Material Design UI Components in a single library. Let me use this chance to describe to you one by one how to use each of them through this article.

来了一个好消息，上周(2015.5.29)在谷歌2015 I/O 大会时，谷歌宣布了一个今年最让人兴奋的支持库，名叫 **Android Design Support Library**，在这个单独的 library 里提供了一堆有用的材料设计 UI 组件。通过这篇文章，让我用这个机会向你一个一个描述如何来使用他们。

Please check the video below as the final of result of this tutorial.

请查看下面这个视频作为本教程最终的结果。

![0](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/0.gif)

And this is the starting point. A blank Activity with DrawerLayout equipped.

从这里开始，空白 Activity 里面有一个 DrawerLayout 。

![1](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/1.gif)

Activity is also already adjusted the theme in Material Design`s way.

Activity 已经调整为材料设计风格的主题。

```xml
<item name="colorPrimary">#2196F3</item>
<item name="colorPrimaryDark">#1565C0</item>
<item name="colorAccent">#E91E63</item>
```

OK, let`s start !

好了，让我们开始吧！


## Step 1: Clone Source Code from Github 步骤一：从 Github 上拷贝源码

I have prepared source code for this codelab. You could simply clone it from [GitHub](https://github.com/nuuneoi/Lab-Android-DesignLibrary). MainActivity is the final result shown above. Please do your codelab in `CodeLabActivity` prepared in the same project.

我已经为这个 codelab 准备了源码，你可以从 [GitHub](https://github.com/nuuneoi/Lab-Android-DesignLibrary) 轻松的 clone 它。MainActivity 是上面所示的最终结果。请在这个 project 的 `CodeLabActivity` 中做我们的代码实验。

First task that you have to do it yourself is ... to successfully run it which it supposes to be done by simply clicking on Run button.

你一定要自己做的一个任务是... 成功的运行它，它应该是通过简单的点击“运行”按钮来完成。


## Step 2: Add Android Design Support Library Dependency 步骤二：添加 Android Design Support Library 依赖

First thing to do to include Android Design Support Library in our project is to add a line of dependency code in app`s `build.gradle` file.

第一件要做的事是在我们的项目中添加 Android Design Support Library，在 app 的 `build.gradle` 文件下添加一行依赖代码。

```xml
compile 'com.android.support:design:22.2.0'
```

**Please note that Design Support Library depends on Support v4 and AppCompat v7. Once you include this library in your project, you will also gain an access to those libraries` components.**

**请注意 Design Support Library 依赖于 Support v4 和 AppCompat v7。一旦你在你的项目中添加这个 library，你也将获得一个这些 libraries 的组件的入口。（译者注：就是说 Design Support Library 中就已经包含了 Support v4 和 AppCompat v7）**

By the way, source code cloned from Github has already been added above line of code. But if you create your own project, you need to add it by yourself.

顺便说一下，从 Github 克隆的源码已经添加了上面这行代码。但是如果你创建了你自己的项目，你需要自己添加它。


## Step 3: Add FAB 步骤三：添加 FAB

Floating Action Button (FAB) is simply a circle button with some drop shadow that unbelieveably could change the world of design. No surprise why it becomes a signature of Material Design. So let`s start with this thing. Add FAB in layout file with `FloatingActionButton` and wrap it with `FrameLayout` since it needs some parent to make it aligned at bottom right position of the screen. Place those things as DrawerLayout`s content by replacing an existed `TextView` in `activity_code_lab.xml` file like below.

Floating Action Button (FAB) 是一个有一些阴影的圆形按钮，这个令人难以置信的，可以改变世界的设计。毫不奇怪它为什么会变成材料设计的标志。因此我们从这开始。添加一个 FAB 在布局文件，因为它需要一些父类来使它在屏幕的右下方位置对齐，所以用 `FrameLayout` 来包裹 `FloatingActionButton`。请做这样的事情作为 DrawerLayout 的内容：更换 `activity_code_lab.xml` 中已经存在的 `TextView` ，像下面的代码这样。

```xml
<android.support.v4.widget.DrawerLayout ...
    xmlns:app="http://schemas.android.com/apk/res-auto"
    ....>
    <FrameLayout
        android:id="@+id/rootLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <android.support.design.widget.FloatingActionButton
            android:id="@+id/fabBtn"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="bottom|right"
            android:src="@drawable/ic_plus"
            app:fabSize="normal" />
    </FrameLayout>
    ...
</android.support.v4.widget.DrawerLayout>
```

`android:src` is used to define a Resource ID of icon you want (40dp transparent png file is recommended) while `app:fabSize="normal"` is used to define FAB`s size. `normal` means the standard 56dp button used in most of the case but in case you want to use the smaller one, `mini` is an another choice that will change its width to 40dp.

`android:src` 是用来定义你想要的资源文件 ID（推荐 40dp 的清晰的 png 文件），而 `app:fabSize="normal"` 是用来定义 FAB 的大小的，`normal` 的意思是在大多数情况下标准尺寸为 56dp 的按钮，但是万一你想使用较小的一个， `mini` 是另一个选择，它的大小将变成 40dp。

That`s all. FAB is now ready to use! Here is the result when we run the code on Android 4.4.

就这样，FAB 现在准备使用！下面是当我在 Android 4.4 上运行这段代码的结果。

![p0](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/0.jpg)

But when we run on Android 5.0, the result turn into this ...

但是当我们运行在 Android 5.0 上时，结果变成了这样...

![p1](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/1.jpg)

There is nothing fancy but just a bug. Fortunate that design library`s developer team has already known the issue and will release a fixed version in the near future. But if you want to use it now, we could do some workaround by setting FAB`s margin right and margin bottom to 16dp for API Level 21+ and to 0dp for Android pre-Lollipop. Thanks Configuration Qualifier that allows us to do it extremely easy.

这不是特效，只是一个 bug。幸运的是 design library 的开发者团队已经知道这个问题并在不久的将来会发布一个修复的版本。但是如果你现在想要使用它，我们可以做一些事情：通过设置 FAB 的 margin right 和 margin bottom 为 16dp 在 API Level 21+ 上面并在 低于 Android L 的版本上 设置为 0dp。感谢配置资源可以让我们非常容易的做到这一点。

**res/values/dimens.xml**

```xml
<dimen name="codelab_fab_margin_right">0dp</dimen>
<dimen name="codelab_fab_margin_bottom">0dp</dimen>
```

**res/values-v21/dimens.xml**

```xml
<dimen name="codelab_fab_margin_right">16dp</dimen>
<dimen name="codelab_fab_margin_bottom">16dp</dimen>
```

**res/layout/activity_code_lab.xml**

```xml
<android.support.design.widget.FloatingActionButton
    ...
    android:layout_marginBottom="@dimen/codelab_fab_margin_bottom"
    android:layout_marginRight="@dimen/codelab_fab_margin_right"
    .../>
```

Hola !

好了！

![p2](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/2.jpg)

Another bug is here. Where are you, shadow? This bug is related to the prior one. You could do a quick fix by defining `app:borderWidth="0"` as FAB`s attribute.

这里有另一个 bug。阴影，你在哪里？这个 bug 和先前的那个是有关联的。你可以通过定义 `app:borderWidth="0"` 作为  FAB 的属性 作为一个快速的解决方案。

![p3](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/3.jpg)

Welcome back, shadow! Its depth is automatically set to the best practices one, 6dp at idle state and 12dp at pressed state. Anyway you are able to override these values by defining `app:elevation` for idle state`s shadow depth `andapp:pressedTranslationZ` for press state`s.

欢迎回来，阴影！其深度是自动设置的最佳实践之一：6dp 在空闲状态，12dp 是按下状态。反正你可以通过定义重写这些值，`app:elevation` 为空闲状态下的阴影深度，`andapp:pressedTranslationZ` 为按下状态的。

Regard to button`s color, basically FAB uses the accent color but you could override with `app:backgroundTint` attribute.

关于按钮的颜色，FAB 基本上使用强调色，但是你可以重写 `app:backgroundTint` 属性来修改。

Just like a traditional Button, you could handle click with `setOnClickListener()`. Add the following line of codes in `initInstances` in `CodeLabActivity.java` file.

就像传统的按钮，你可以通过 `setOnClickListener()` 处理点击，在 `CodeLabActivity.java` 文件的 `initInstances` 方法中添加下面的代码。

```java
FloatingActionButton fabBtn;
...
private void initInstances() {
    ...
    fabBtn = (FloatingActionButton) findViewById(R.id.fabBtn);
    fabBtn.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
        }
    });
}
```

Done !

完成！

## Step 4: Play with Snackbar 步骤四：使用 Snackbar

Snackbar, a tiny black bar showing a brief message at the bottom of the screen, is also available in this library. Snackbar shares the same concept as Toast but unlike Toast, it shows as a part of UI instead of overlaying on screen.

Snackbar，在屏幕的地步一个微小的黑色条显示着一条简短的消息，在这个 library 中也是可用的。Snackbar 和 Toast 有着相同的概念，但是不同于 Toast，它的表现是作为 UI 的一部分而不是覆盖在屏幕上。

![p4](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/4.jpg)

Not just a concept but also coding style that it is inspired from Toast. You could summon Snackbar by the code below.

不只是概念相同，编码风格也是由 Toast 所启发，你可以通过下面的代码唤起 Snackbar。

```java
Snackbar.make(someView, "Hello. I am Snackbar!", Snackbar.LENGTH_SHORT)
        .setAction("Undo", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            }
        })
        .show();
```

The first parameter of `make()` is a View or Layout that you want to show a Snackbar at it`s bottom position. In this example, a FrameLayout that wrapped a FAB is the one. `setAction()` method is used to set the action displayed on the right of Snackbar with a listener corresponded. This method is not required and could be removed.

`make()` 的第一个参数是一个 View 或者 Layout，你想在它的底部位置显示一个 Snackbar。在这个例子中，一个 FrameLayout 包裹着一个 FAB 就是其中一个例子。`setAction()` 方法是用在设置动作显示在 Snackbar 的右侧并有对应的监听。这个方法不是必需的，可以移除。

Now let`s give a try by adding the following code.

现在，让我们通过添加下面的代码去试试。

```java
FrameLayout rootLayout;
...
private void initInstances() {
    ...
    rootLayout = (FrameLayout) findViewById(R.id.rootLayout);
    fabBtn = (FloatingActionButton) findViewById(R.id.fabBtn);
    fabBtn.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Snackbar.make(rootLayout, "Hello. I am Snackbar!", Snackbar.LENGTH_SHORT)
                    .setAction("Undo", new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                        }
                    })
                    .show();
        }
    });
}
```

Click at FAB and see the result.

点击 FAB 以及看到的结果。

![p5](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/5.jpg)

It works ! but ... not perfectly yet. It is appeared that Snackbar is placed on top of FAB which is totally bad in term of UX. Anyway the behavior is already correct since there is no any relation between Snackbar and FAB defined.

有用！但是... 还不是很完美。它是出现在放置 Snackbar 顶部的位置，长期的用户体验是很差的。不管怎么样，这个行为已经是正确的，因为这里没有为 Snackbar 和 FAB 定义任何关联。

A special Layout is invented for this purpose especially, make child Views work coordinated. No surprise why its name is `CoordinatorLayout`

为了这个目的专门发明了一个特殊的布局，使子 Views 协调工作。这就不用奇怪为什么它的名字是 `CoordinatorLayout` 了。

## Step 5: Make them collaborated with CoordinatorLayout 步骤五：使他们和 CoordinatorLayout 协作

CoordinatorLayout is a Layout let child Views work coordinated. Anyway there is no magic. Each View inside must be designed and implemented to work with CoordinatorLayout as well. FAB and Snackbar are two of those.

CoordinatorLayout 是一个让子 Views 协调工作的布局。这里没有任何魔法。每个 View 中肯定是设计和实现了和  CoordinatorLayout 协同工作的。FAB 和 Snackbar 就是这两个view。

So ... let`s change FrameLayout wrapped a FAB to `CoordinatorLayout` now.

所以... 现在让我们将 FrameLayout 改成 `CoordinatorLayout` 包裹一个FAB。

**res/layout/activity_code_lab.xml**

```xml
<android.support.design.widget.CoordinatorLayout
    android:id="@+id/rootLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <android.support.design.widget.FloatingActionButton
        ... />
</android.support.design.widget.CoordinatorLayout>
```

And don`t forget to change rootLayout`s variable type in `CodeLabActivity.java` to CoordinatorLayout as well or it will crash.

而且，不要忘了在 `CodeLabActivity.java` 改变 rootLayout 的变量类型为 CoordinatorLayout，否则就会崩溃。

```xml
//FrameLayout rootLayout;
CoordinatorLayout rootLayout;
//rootLayout = (FrameLayout) findViewById(R.id.rootLayout);
rootLayout = (CoordinatorLayout) findViewById(R.id.rootLayout);
```

**Result**: FAB now moves along with Snackbar`s appearance and disappearance. Some feature is also added. Snackbar is now able to Swipe-to-dismiss ! Please give a try.

**结果**：现在 FAB 随着 Snackbar 的出现和消失而移动。还增加了一些功能。Snackbar 现在能够滑动消失了！请试一试。

![2](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/2.gif)

But bug is all around ... It appears that on Android pre-Lollipop, FAB just forgets to move down when Snackbar is swiped-to-dismiss...

但是 bug 到处都是… bug 出现在低于 Android L 的系统上，当 Snackbar 滑动消失的时候，FAB 忘记了移动下来。

![3](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/3.gif)

It is obviously a bug but I don`t know the exact reason. Thanks god, there is some workaround. From my own experiment, I found that when we set FAB`s margin bottom and margin right to some non-zero positive value, thing will magically back to work. So ... just change those margin values to 0.1dp for Android pre-Lollipop.

这显然是一个 bug，但是我不知道确切的原因。感谢天主，这里有一些解决方法。从我的实验中，我发现当我们设置 FAB 的 margin bottom 和 margin right 为一些非零的正数值时，它将会奇迹般的正常工作，所以..就只需要为低于 Android L 的系统改变 margin 的值为 0.1dp就行。

**res/values/dimens.xml**

```xml
<dimen name="codelab_fab_margin_right">0.1dp</dimen>
<dimen name="codelab_fab_margin_bottom">0.1dp</dimen>
```

Done. Here is the result.

完成。下面是结果。

![4](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/4.gif)

From now on, if you plan to use Android Design Support Library. Please think about CoordinatorLayout first since it is something like a core of this library.

从现在起，如果你计划使用 Android Design Support Library。请首先考虑 CoordinatorLayout，因为它就像是这个 library 的核心。


## Step 6: Goodbye ActionBar, Hail Toolbar 步骤六：再见 ActionBar，你好，Toolbar

Toolbar is not part of Android Design Support Library but is needed to be used together with the rest of components in this library.

Toolbar 不是 Android Design Support Library 的一部分，而是在这个库中需要与其他组件一起使用。

Toolbar is a replacement of traditional Action Bar with far more flexible behavior. I encourage you guys to hiding an Action Bar and switch to Toolbar from now on since new libraries with wonderful features are all designed to work together with Toolbar not Action Bar including components in this Design Support Library.

Toolbar 是一个替代传统的 Action Bar 具有更灵活的行为。我鼓励你们从现在开始隐藏 Action Bar 并且切换到 Toolbar。因为这些有奇妙功能的新库，包括 Design Support Library 的组件中，都被设计为和 Toolbar 协同工作而不是 Action Bar。

It is easy to switch to Toolbar. Just start with hiding an Action Bar from an Activity by defining these attributes in AppTheme`s style.

很容易切换到 Toolbar。只需要从 Activity 定义的 AppTheme 的 style 属性隐藏掉 Action Bar 开始。

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <item name="windowActionBar">false</item>
    <item name="windowNoTitle">true</item>
</style>
```

Then place a Toolbar component inside CoordinatorLayout right before where FAB is.

然后在 CoordinatorLayout 里面的 FAB 之前正确的放一个 Toolbar 组件。

```xml
<android.support.design.widget.CoordinatorLayout
    ...>
    <android.support.v7.widget.Toolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:background="?attr/colorPrimary"
        app:popupTheme="@style/ThemeOverlay.AppCompat.Light"
        app:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar" />
    <android.support.design.widget.FloatingActionButton
        ...>
    </android.support.design.widget.FloatingActionButton>
</android.support.design.widget.CoordinatorLayout>
```

Now write a code to tell system that we will use Toolbar as an Action Bar replacement with Java Code below.

现在写代码来告诉系统，我们将使用 Toolbar 作为一个 Action Bar，更换下面的 Java 代码。

```java
Toolbar toolbar;
private void initInstances() {
    toolbar = (Toolbar) findViewById(R.id.toolbar);
    setSupportActionBar(toolbar);
    ...
}
```

Although it could run fine by now but from I said previously. Things placed inside CoordinatorLayout must be designed and implemented to work with it or it will not coordinate with any other sibling views. But well ... Toolbar is not designed for that. Don`t worry, there is no any new special Toolbar here, just an component that is prepared to make Toolbar works perfectly with CoordinatorLayout. An easy task, just simply wrap Toolbar with `AppBarLayout`. That`s all !

虽然它现在可以运行成功，但是根据我之前说的，放在 CoordinatorLayout 的东西必须被设计和实现成与它一起合作的，否则将不与任何其他兄弟 views(sibling views) 协作。但是... Toolbar是不合适的。别担心，这里没有任何新的特殊 Toolbar。只是一个组件是为了准备让 Toolbar 与 CoordinatorLayout 一起工作的更加完美。这是简单的任务，只是简单的用 `AppBarLayout` 包裹 Toolbar，就这样！

```xml
<android.support.design.widget.CoordinatorLayout
    ...>
    <android.support.design.widget.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">
       <android.support.v7.widget.Toolbar
           .../>
    </android.support.design.widget.AppBarLayout>
    <android.support.design.widget.FloatingActionButton
        ...>
    </android.support.design.widget.FloatingActionButton>
</android.support.design.widget.CoordinatorLayout>
```

Now run and test. If you do it all right, you will see that Drawer Menu will overlay on top of the App Bar area. The outgrowth of applying AppBarLayout is the drop shadow below App Bar area is now returned ! Yah !

现在运行和测试，如果你做的都是对的，你将会看到 Drawer Menu  会覆盖在 App Bar区域的顶部。使用了 AppBarLayout 的输出结果是：低于应用栏区域的阴影现在回来了，耶！(译者注：不晓得怎么翻了：The outgrowth of applying AppBarLayout is the drop shadow below App Bar area is now returned ! Yah !)

![5](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/5.gif)

This step is now done. From now on I suggest you to always wrap ToolBar element with AppBarLayout. Just its ability to bring back drop shadow is convinced enough.

这个步骤现在完成了。从现在开始，我建议你总是用 AppBarLayout 包裹 ToolBar 元素。光凭它能带回来阴影的能力就足够有说服力。


## Step 7: Place something in content area 步骤7：在内容区域放东西

We got FAB, we got Toolbar. Now it`s time to place something in content area of an Activity.

我们已经得到了 FAB 和 Toolbar，现在是时候在 Activity 的内容区域放上东西了。

Umm. How about two simple buttons? Well, let`s place them between AppBarLayout and FAB.

额。如果是两个简单的按钮呢？好吧，让我们把它们放在在 AppBarLayout 和 FAB 之间。

```xml
    ...
</android.support.design.widget.AppBarLayout>
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Yo Yo"/>
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Yo Yo"/>
</LinearLayout>
<android.support.design.widget.FloatingActionButton
    ...>
```

Here is the result ...

下面是结果...

![p6](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/6.jpg)

It is appeared that those buttons are unexpectedly placed under Toolbar. Guess why...

这些按钮似乎都出人意料的放在了 Toolbar 下面。猜猜为什么？

Yah, same old reason, *LinearLayout is not designed to work with CoordinatorLayout*. In this case, there is no any layout to wrap it like Toolbar`s case. It is for more easy, you just need to add an attribute to the LinearLayout telling its scroll behavior like below.

是的，一些古老的原因，*LinearLayout 没有被设计成与 CoordinatorLayout 协同工作*。在这样的情况下，没有任何布局用来包裹 LinearLayout，使它像 Toolbar 的做法那样。但它是更加容易的，你只需要在 LinearLayout 添加一个属性告诉它的滚动行为，就像下面写的这样：

```xml
<LinearLayout
    ...
    app:layout_behavior="@string/appbar_scrolling_view_behavior"
    ...>
```

And now they are at the right place. Yah !

现在，他们被放在了正确的位置了，耶！

![p7](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/7.jpg)

Done =)

完成！=)

## Step 8: Play with TabLayout 步骤8：玩转 TabLayout

Tab is a part of UX best practices in Android Application. Previously if we want to use new Material Design Tab, we need to download source code of SlidingTabLayout and SlidingTabStrip to our project ourselves. Right now we could just use `TabLayout` provided in this library, also with some more tweak options.

Tab 是在 Android 应用程序中用户体验(UX)最佳实践的一部分。在以前，如果我们想要使用新的材料设计风格的 Tab，我们需要自己去为项目中下载 SlidingTabLayout 和 SlidingTabStrip 的源码。现在，我们只需要使用这个库提供的 `TabLayout`，它也有很多可以调整的选项。

Where should we place this TabLayout? According to Android Application UX Guideline, Tab should be placed on top of the screen not the bottom. And well, it should be above the drop shadow part. So we will place it inside AppBarLayout along with Toolbar. It could be done like this because **AppBarLayout is inherited from a vertical LinearLayout**.

我们应该把 TabLayout 放在哪里？根据 Android 应用程序用户体验指导原则，Tab 应该放在屏幕的顶部而不是在底部。还有，它应该在阴影部分的上面。所以，我们将其放在 AppBarLayout 里面，沿着 Toolbar。这是可以做到的，**因为 AppBarLayout 是继承自一个垂直的 LinearLayout**。

```xml
<android.support.design.widget.AppBarLayout ...>
    <android.support.v7.widget.Toolbar ... />
    <android.support.design.widget.TabLayout
        android:id="@+id/tabLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
</android.support.design.widget.AppBarLayout>
```

Add some tabs with Java Code.

在 Java 代码中添加一些 tabs。

```java
TabLayout tabLayout;
private void initInstances() {
    tabLayout = (TabLayout) findViewById(R.id.tabLayout);
    tabLayout.addTab(tabLayout.newTab().setText("Tab 1"));
    tabLayout.addTab(tabLayout.newTab().setText("Tab 2"));
    tabLayout.addTab(tabLayout.newTab().setText("Tab 3"));
    ...
}
```

Here is the result.

下面是结果：

![p8](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/8.jpg)

Background color is automatically set to primary color while the indicator line`s color is the accent one. But you will notice that Tab`s font is still black but we expect it to be white. This happens because we didn`t provide it any theme yet. Simply define TabLayout a theme like this.

背景色会自动设置成 primary color(主题色)，而导航线的颜色是强调色。但是你将会注意到 Tab 的字体仍然是黑色的，但是我们希望字体是白色的。这是因为我们还没有为 TabLayout 提供任何主题呢。TabLayout 定义主题是简单的，就像这样：

```xml
<android.support.design.widget.TabLayout
    ...
    app:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar" />
```

They are white now.

现在，他们是白色的了。

![p9](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/9.jpg)

You have a choice to manually control TabLayout like above or let it work with ViewPager automatically by calling `setupWithViewPager(...)`. I believe that it will be used quite frequent for this case.

你可以像上面这样选择手动控制 TabLayout，或者让它和 ViewPager 一起工作，自动调用 `setupWithViewPager(...)`。我相信这种情况会很频繁的使用。

There are two attributes we could adjust the display in TabLayout.

还有，我们可以调整两个属性来显示 TabLayout。

`app:tabMode` - set it as `fixed` if you want to display every single tab on the screen. Good for a small number of tabs but totally a bad choice if there are so many tabs. In the case you are not sure that all of them could be displayed nicely at a time, you could set this attribute as `scrollable` to let user scroll through tabs instead just like Google Play Store`s.

`app:tabMode` - 如果你想在屏幕上显示出每个单独的 tab，就设置 tab 为 `fixed` 的， 。它适合只有少数 tab 的时候，但是如果有很多的 tab 的时候这是一个完全错误的选择。在这种情况下你是不确定所有的 tab 是否能很好的在同一时间显示出来的。所以，你可以设置这个属性为 `scrollable` 让用户去滚动 tab，就像 Google Play Store 那样。

`app:tabGravity` - set it as `fill` if you want distribute all available space to each tab or set it as center if you want to place all of the tabs at the `center` of the screen. Please note that this attribute will be ignored if tabMode is set to scrollable.

`app:tabGravity` - 如果你想要分配所有的可用空间给每个 tab，就设置这个属性为 `fill`。如果你想要所有的 tab 在屏幕的中间，就设置这个属性为 `center`。请注意，如果 tabMode 是设置成 scrollable 的，则这个属性将会被忽略。

Here is what it looks like in each mode.

每个模式的样子就像下面这样：

![p10](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/10.jpg)

Done with TabLayout =)

TabLayout 完成了！


## Step 9: Make AppBarLayout exit the screen along with content when scroll 步骤9：当随着内容滚动时，让 AppBarLayout 退出屏幕

One nice Android UX Guideline announced is the App Bar could be scrolled out of the screen along with content to get some more additional space to display content and it is already proved that this UX is good. Previously there were some application that was already implemented this behavior but developer had to do it by themselves. Right now it could be done easily with just a line of code.

一个优美的 Android 用户体验是引导 App Bar 可以随着内容滚动出屏幕的，以获得额外的空间来显示内容，并且，这已经是被证明这样的用户体验是很棒的。以前有一些应用程序已经实现了这种行为，但是开发者必须自己来实现。现在它只需要用一行代码就能轻松的完成。

First of all, we need to make the content scrollable first by adding some amount of Buttons to LinearLayout. How about 20?

首先，我们需要让内容能够滚动，先往 LinearLayout 加入一些 Button。大约20个？

```xml
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Yo Yo"/>
...
<!-- Add 20 more buttons here -->
...
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Yo Yo"/>
```

And then wrap the LinearLayout with ScrollView and **don`t forget to move layout_behavior from LinearLayout to ScrollView** since ScrollView is now a direct child of CoordinatorLayout.

然后用 ScrollView 包裹这个 LinearLayout，还有，**不要忘了将 LinearLayout 里的 layout_behavior 移动到 ScrollView**，因为现在 ScrollView 是 CoordinatorLayout的最直接的子 view。

```xml
<ScrollView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fillViewport="true"
    app:layout_behavior="@string/appbar_scrolling_view_behavior">
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">
        ...
    </LinearLayout>
</ScrollView>
```

Then add a Scroll Flags to Toolbar like this.

然后给 Toolbar 添加一个滚动标志，就像这样：

```xml
<android.support.v7.widget.Toolbar
    ...
    app:layout_scrollFlags="scroll|enterAlways" />
```

Test it.

试试吧

![6](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/6.gif)

Hmm ... Toolbar supposes to scroll out of the screen along with the content but why it appears that nothing happened?

额... 原先假定的 Toolbar 会随着内容的滚动滚出屏幕的，但是为什么它看起来什么都没有实现呢？

The same old reason ... **ScrollView was not designed to work with CoordinatorLayout (again)**. You need to use the another one, `NestedScrollView`, provided in Android Support Library v4, which is designed to work with CoordinatorLayout since born.

同样的老原因啦... **ScrollView 没有被设计成与 CoordinatorLayout 协同工作(又来)**。你需要另一个 view：`NestedScrollView`，Android Support Library v4 中有提供。这个 NestedScrollView 设计出来的目的就是为了与 CoordinatorLayout 协同工作的。

```xml
<android.support.v4.widget.NestedScrollView ...>
    <LinearLayout ...>
        ...
    </LinearLayout>
</android.support.v4.widget.NestedScrollView>
```

And with the same reason, please note that the classic ListView doesn`t work with CoordinatorLayout as well. Only `RecyclerView` works. Time to change, may be?

同样的原因，请注意了： ListView 类也是和 CoordinatorLayout 不能协同工作的。只有 `RecyclerView` 可以。也许需要时间来改变咯~

Here is the result after changing ScrollView to NestedScrollView.

这里将 ScrollView 改变成 NestedScrollView 后的结果。

![7](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/7.gif)

Works like a charm! You will notice that Toolbar scroll out of the screen but TabLayout still stay. This is because we didn`t set any scroll flags to TabLayout. If you want TabLayout to disappear from the screen as well, just simply define the same attribute to TabLayout.

运行起来真赞！你会注意到 Toolbar 滚出了屏幕，但是 TabLayout 仍然还在。这是因为我们没有给 TabLayout 设置任何滚动标志。如果你想要 TabLayout 同样从屏幕上消失，只需要给 TabLayout 定义相同的属性就可以了。

```xml
<android.support.design.widget.TabLayout
    ...
    app:layout_scrollFlags="scroll|enterAlways" />
```

Result

结果：

![8](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/8.gif)

There is some gesture bug here. I found that it is quite hard to pull things back to the screen. It seems like we have to wait for the next release.

这里会有一些手势上的 bug。我发现拉它回到屏幕是非常困难的。看来我们得等下一个版本了。

Now let`s look at it in details. Curious what are the meaning of those flags actually: `scroll` and `enterAlways`? Actually there are 4 attribute values that we could set as.

现在，让我们来看看它的一些细节。很好奇这些标志的真实意思是什么：`scroll` 和 `enterAlways`？事实上我们可以在这里设置4个属性值。

`scroll` - If you want the view to scroll along the content. You need to apply this flag. 

`scroll` - 你想你想要设置这个 view 随着内容滚动，你需要应用这个标志。

`enterAlwaysCollapsed` - This flag defines how View enter back into the screen. When your view has declared a minHeight and you use this flag, your View will only enter at its minimum height (i.e., ‘collapsed’), only re-expanding to its full height when the scrolling view has reached it’s top. Use it with scroll flag like this: `scroll|enterAlwaysCollapsed`

`enterAlwaysCollapsed` - 这个标志定义了 View 是如何回到屏幕的。当你的 view 已经声明了一个最小高度(minHeight) 并且你使用了这个标志，你的 View 只有在回到这个最小的高度的时候才会展开，只有当 view 已经到达顶部之后它才会重新展开全部高度。滚动标志像这样来使用它：`scroll|enterAlwaysCollapsed`。

![9](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/9.gif)

Anyway it seems like it doesn`t work as described in minHeight part. Another issue is there is a problem with TabLayout. Pretty hard to pull those Views back to the screen.

它好像在这个 minHeight 部分死活不工作。这里和 TabLayout 有另一个问题。很难把这些 View 拉回到屏幕来。

`enterAlways` - this flag ensures that any downward scroll will cause this view to become visible, enabling the ‘quick return’ pattern. Use it with scroll flag as well: `scroll|enterAlways`

`enterAlways` - 这个标志确保了任何向下滚动的操作都会让这个 view 变得可见，达到“快速返回”(‘quick return’ )的效果，滚动标志像这样来使用它： `scroll|enterAlways`

![10](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/10.gif)

`exitUntilCollapsed` - View will scroll off until it is collapsed (its minHeight) and stay like that, for example,  

`exitUntilCollapsed` - View 将关闭滚动直到它被折叠起来(有 minHeight) 并且一直保持这样，举个例子：

```xml
<android.support.v7.widget.Toolbar
    ...
    android:layout_height="192dp"
    android:gravity="bottom"
    android:paddingBottom="12dp"
    android:minHeight="?attr/actionBarSize"
    app:layout_scrollFlags="scroll|exitUntilCollapsed"/>
```

Here is the result of code above.

下面是上述代码的结果：

![11](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/11.gif)

This mode is frequently used in the component I will talk about in next part.

这种模式在组件中经常使用，我将在下一个部分讨论。

## Step 10: Remove TabLayout 移除 TabLayout

From the experiment, there is some obvious bug when we use TabLayout along with scrolling thing described above. I believe that it is just a bug that will be fixed in the near future. For now, let`s remove TabLayout from the code first to make the next steps run smoothly.

从实验来看，在上述情况下当我们用 TabLayout 来滚动的时候，有一些明显的 bug。我相信这只是一个 bug，而且以后会被修复的。现在，让我们首先从代码中移除 TabLayout，确保下一步运行是流畅的。

```xml
<!--android.support.design.widget.TabLayout -->
```

Also remove from Java Code.

从 Java 代码中也删除

```xml
//tabLayout = (TabLayout) findViewById(R.id.tabLayout);
//tabLayout.addTab(tabLayout.newTab().setText("Tab 1"));
//tabLayout.addTab(tabLayout.newTab().setText("Tab 2"));
//tabLayout.addTab(tabLayout.newTab().setText("Tab 3"));
```

OK. Let`s go to the next step !

好了，让我们去做下一步！

## Step 11: Make Toolbar collapsable 步骤11：使工具栏可折叠

Like an example shown in exitUntilCollapsed part, Toolbar could be expanded and collapsed but you will see that it isn`t perfect yet. Toolbar still leave the screen in spite of the best practice that those icons (Hamburger, etc.) should stay on the screen.

就像在 exitUntilCollapsed 部分所示的例子中，Toolbar 可以展开和折叠，但是你会看到它还不是很完美。Toolbar 仍然离开了屏幕，最好的体验是让这些 icon (汉堡等-即菜单栏) 应该留在屏幕内。

Design Support Library has already been prepared for this as well. You could make Toolbar collapsable like a magic with `CollapsingToolbarLayout` which is very easy to use just like other components. Here are the steps:

Design Support Library 已经为这个准备好了。用 `CollapsingToolbarLayout` 你可以像魔术一样让 Toolbar 折叠起来，就像其他组件一样，它是非常容易使用的，具体操作步骤如下：

- Wrap `Toolbar` with `CollapsingToolbarLayout` but still be under `AppBarLayout`
- 用 `CollapsingToolbarLayout` 包裹 `Toolbar`，但仍然在 `AppBarLayout` 中

- Remove `layout_scrollFlags` from Toolbar
- 从 `Toolbar` 中删除 `layout_scrollFlags`

- Declare `layout_scrollFlags` for `CollapsingToolbarLayout` and change it to `scroll|exitUntilCollapsed`
- 为 `CollapsingToolbarLayout` 声明 `layout_scrollFlags`，并且将 `layout_scrollFlags` 设置成 `scroll|exitUntilCollapsed`

- Change AppBarLayout`s layout height to the size of expanded state. In this example, I use 256dp
- 改变 AppBarLayout 扩张状态时的布局高度大小。在这个例子中，我用 256dp

Here is the final code.

这是最终代码。

```xml
<android.support.design.widget.AppBarLayout
    android:layout_width="match_parent"
    android:layout_height="256dp">
    <android.support.design.widget.CollapsingToolbarLayout
        android:id="@+id/collapsingToolbarLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_scrollFlags="scroll|exitUntilCollapsed">
        <android.support.v7.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="?attr/colorPrimary"
            android:minHeight="?attr/actionBarSize"
            app:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar"
            app:popupTheme="@style/ThemeOverlay.AppCompat.Light" />
    </android.support.design.widget.CollapsingToolbarLayout>
</android.support.design.widget.AppBarLayout>
```

And the result is

这个结果是：

![12](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/12.gif)

Looks good but those Toolbar icons still scroll off the screen. We could pin it to let it be always on top of the screen by declare this attribute to Toolbar.

看起来不错，但是这些 Toolbar icons 仍然滚出了屏幕。我们可以声明这个属性给 Toolbar 来固定住它，让它总是在屏幕的顶部。

```xml
<android.support.v7.widget.Toolbar
    ...
    app:layout_collapseMode="pin"/>
```

Toolbar is now pinned !

Toolbar现在被定住了！

![13](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/13.gif)

But wait ... where is the title text?! Unfornate that it`s gone in the wind after wrapping Toolbar with CollapsingToolbarLayout. We have to set it manually through `setTitle(String)` in Java code.

但是，等一下…标题的文字在哪里？！不幸的是，在用 CollapsingToolbarLayout 包裹住 Toolbar 后，它随风而逝了。我们必须通过在 Java 代码中手动设置 `setTitle(String)` 来实现。

```java
CollapsingToolbarLayout collapsingToolbarLayout;
private void initInstances() {
    ...
    collapsingToolbarLayout = (CollapsingToolbarLayout) findViewById(R.id.collapsingToolbarLayout);
    collapsingToolbarLayout.setTitle("Design Library");
}
```

Result:

结果：

![14](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/14.gif)

Title`s font color is still black. This is because we didn`t set any theme to the App Bar yet. To do so, just simply declare `android:theme` for `AppBarLayout` like this.

这里的字体颜色仍然是黑的的。这是因为我们还没有为 App Ba 设置任何主题。要做到这一点，只需要简单的为 `AppBarLayout` 声明 `android:theme` 属性就可以了，就像这样：

```xml
<android.support.design.widget.AppBarLayout
    ...
    android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar">
```

Title now turns into white !

现在，标题变成了白色的了！

![15](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/15.gif)

With CollapsingToolbarLayout`s feature, transition is automatically applied to the title text between collapsed and expanded state. In case you want to change the position of title text in expanded state, you could do so by apply margin through 4 attributes such as `app:expandedTitleMargin`, `app:expandedTitleMarginBottom`, `app:expandedTitleMarginEnd` and `app:expandedTitleMarginStart`

由于CollapsingToolbarLayout 的 特点，应用的标题文字在收缩和展开状态是会自动过渡的。如果你想要在展开状态改变标题文字的位置，你可以这样做：通过应用的 margin 的4个属性，就是：`app:expandedTitleMargin`, `app:expandedTitleMarginBottom`, `app:expandedTitleMarginEnd` 以及 `app:expandedTitleMarginStart`

Or if you want to change text`s appearance in collapsed and expanded state. You could simply do that by applying TextAppearance through `app:collapsedTitleTextAppearance` and `app:expandedTitleTextAppearance` respectively.

或者如果你想要在折叠和展开状态时改变文本的显示。你可以这样来简单的实现：设置 TextAppearance，分别通过 `app:collapsedTitleTextAppearance` 和 `app:expandedTitleTextAppearance` 来设置。

Let`s try changing margin start to 64dp.

让我们从试着改变 margin 为64dp 开始。

```xml
<android.support.design.widget.CollapsingToolbarLayout
    ...
    app:expandedTitleMarginStart="64dp">
```

Result

结果：

![16](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/16.gif)

Awesome !

真棒！

## Step 12: Add background image to App Bar 步骤12：为 App Bar 添加背景图片

In many cases, we want to have a beautiful image as an App Bar`s background not just a plain color like currently is. Fortunate that CollapsingToolbarLayout is inherited from FrameLayout so we could simply add an ImageView as a background layer behind Toolbar like this.

在这种情况下，我们想要用一张美丽的图片作为 App Bar 的背景，而不只是像现在这样的一个普通的颜色。幸运的是 CollapsingToolbarLayout 是继承自 FrameLayout 所以我们可以轻松的添加一个 ImageView 作为 Toolbar 的背景图层，就像这样：

```xml
<ImageView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:scaleType="centerCrop"
    android:src="@drawable/header" />
<android.support.v7.widget.Toolbar
    ...
```

Result

结果：

![17](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/17.gif)

Image appears already but there is an unexpected blue bar appears as well. It is nothing fancy but just a Toolbar`s background. Simply remove this line from Toolbar.

图片已经显示出来了，但是这里有一点还没有达到预期，蓝色的导航条仍旧显示着。有一个 Toolbar 的背景看起来不是酷炫的。从 Toolbar 移除它，只需要下面这行代码就行了。

```xml
android:background="?attr/colorPrimary"
```

Result

结果：

![18](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/18.gif)

Image now just moves along with content scrolling which is a little bit too wooden. We could make it more elegant with parallax mode by declaring collapse mode like this.

现在图片是随着内容的滚动了，但是看起来太呆了。我们可以使用视差模式让它变得更优雅一些，只需要声明 collapse 就行了，像下面这样：

```xml
<ImageView
   ...
   app:layout_collapseMode="parallax" />
```

Result

结果：

![19](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/19.gif)

You also could apply a parallax multiplier between 0.0-1.0.

你也可以设置视差的系数，介于 0.0-1.0之间。

```xml
app:layout_collapseParallaxMultiplier="0.7"
```

Please give a try yourself =)

请你自己去尝试一下=)

Lastly you will notice that App Bar`s background is always shown as image. You could let it automatically changed into plain color in collapsed mode by declaring attribute `app:contentScrim` like below:

最后你可能会注意到 App Bar 的背景总显示一张图片。你可以让它在收缩的时候自动的变化到普通的颜色，通过声明属性 app:contentScrim 像下面这样来实现：

```xml
<android.support.design.widget.CollapsingToolbarLayout
    ...
    app:contentScrim="?attr/colorPrimary">
```

Result

结果：

![20](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/20.gif)

App Bar is now beautiful with just some line of codes =)

只用了几行代码，就让 App Bar 变得这么漂亮了 =)


## Step 13: Play with Navigation Drawer 步骤13：玩转 Navigation Drawer

Right now Drawer Menu pulled from the left side is still just a blank white panel. Previously it is quite a hard task to implement this menu since we have to do it manually with LinearLayout or ListView.

现在从左侧拉出 Drawer Menu 仍然只是一个空白的面板。在以前，实现这个菜单是非常麻烦的，因为我们不得不手动的用 LinearLayout 或者 ListView 去实现。

With NavigationView provided in Android Design Support Library, things would be 15.84321 times easier !

在 Android Design Support Library 中提供了 NavigationView，实现它变得更容易了，它为我们节省了15.84321倍的时间！

First of all, create a header view layout file for Drawer Menu. (It is already there in Github project.)

首先，为 Drawer Menu 创建一个标题视频布局文件。（它已经在 Github的项目中了）

**res/layout/nav_header.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="192dp"
    android:theme="@style/ThemeOverlay.AppCompat.Dark">
    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:src="@drawable/nav_header_bg"
        android:scaleType="centerCrop" />
    <ImageView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/nuuneoi"
        android:layout_gravity="bottom"
        android:layout_marginBottom="36dp" />
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:layout_margin="16dp"
        android:text="nuuneoi"
        android:textAppearance="@style/TextAppearance.AppCompat.Body1"/>
</FrameLayout>
```

Now create a menu resource file.

现在创建一个菜单资源文件

**res/menu/navigation_drawer_items.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <group android:checkableBehavior="all">
        <item
            android:id="@+id/navItem1"
            android:icon="@drawable/ic_action_location_found_dark"
            android:title="Home"/>
        <item
            android:id="@+id/navItem2"
            android:icon="@drawable/ic_action_location_found_dark"
            android:title="Blog"/>
        <item
            android:id="@+id/navItem3"
            android:icon="@drawable/ic_action_location_found_dark"
            android:title="About"/>
        <item
            android:id="@+id/navItem4"
            android:icon="@drawable/ic_action_location_found_dark"
            android:title="Contact"/>
    </group>
</menu>
```

Place `NavigationView` binding both resources above as Drawer Menu`s menu area by replace an existed white LinearLayout with the following code.

`NavigationView` 与两个资源文件绑定起来，作为 Drawer Menu 的菜单区域，用下面的代码来替换一个已经存在的 白色的 LinearLayout ：

```xml
        ...
    </android.support.design.widget.CoordinatorLayout>
    <android.support.design.widget.NavigationView
        android:id="@+id/navigation"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/nav_header"
        app:itemIconTint="#333"
        app:itemTextColor="#333"
        app:menu="@menu/navigation_drawer_items" />
</android.support.v4.widget.DrawerLayout>
```

Drawer Menu is now summoned ! Woo hooo

现在：召唤 Drawer Menu！哇喔，哇喔

![21](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/21.gif)

NavigationView is designed for Drawer Menu especially. So everything would be created and measured automatically including width of the menu which we have to define ourselves case by case with Configuration Qualifier previously.

NavigationView 就是为了 Drawer Menu 而特别设计的。所以，所有的东西都会被创建并且自动测量包括菜单的宽度等，我们自己定义案例来配置以前的设计。

To handle those menu items click event, you could simply declare a listener with `setNavigationItemSelectedListener` like below:

为了处理这些菜单项的点击事件，你可以声明 `setNavigationItemSelectedListener` 来监听，就像下面这样：

```java
NavigationView navigation;
private void initInstances() {
    ...
    navigation = (NavigationView) findViewById(R.id.navigation);
    navigation.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
        @Override
        public boolean onNavigationItemSelected(MenuItem menuItem) {
            int id = menuItem.getItemId();
            switch (id) {
                case R.id.navItem1:
                    break;
                case R.id.navItem2:
                    break;
                case R.id.navItem3:
                    break;
            }
            return false;
        }
    });
}
```

In the real use, please feel free to declare your own header view and modify menu items as you wanted.

在实际使用中，请随意的区声明你想要定义的 header view 和修改菜单项。


## Step 14: Modernize EditText with TextInputLayout 步骤14：用上 TextInputLayout 让 EditText 变的更风骚

The last part of this Codelab is here. You could change an old style EditText to a modern one that always show Hint and Error Message.

这是 Codelab 的最后一部分了。你可以改变一个旧的 EditText 的风格，让它变得更时髦，即：总是会显示一个提示或者一个错误信息。

To do so, just simply wrap an EditText with TextInputLayout. That`s all !

要做到这一点，只需要简单的用 TextInputLayout 包裹住一个 EditText ，就这么简单！

```xml
<android.support.design.widget.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Username" />
</android.support.design.widget.TextInputLayout>
```

Put two of them inside NestedScrollView and see the result.

把这两个控件放到 NestedScrollView 里看下结果。

![22](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/gif/22.gif)

Incredibly easy, huh? =)

难以置信的容易吧？=)

## Conclusion 结论

Android Design Support Library is very promising support library. It is totally recommended for your production. Anyway it still contains a lot of bugs, I suggest you to wait for a little bit until every single bug is fixed.

Android Design Support Library 是非常有前途的支持库，它非常值得在你的产品上使用。虽然它仍然包含了很多错误，我建议你再等等，直到每个错误都被修复。

Such a long tutorial. Hope you find it useful =)

这么长的教程，希望希望你觉得它有用 =)



![p11](https://raw.githubusercontent.com/MrFuFuFu/Codelab/master/pic/11.png)
Author: nuuneoi (Android GDE, CTO & CEO at The Cheese Factory)
A full-stack developer with more than 6 years experience on Android Application Development and more than 12 years in Mobile Application Development industry. Also has skill in Infrastucture, Service Side, Design, UI&UX, Hardware, Optimization, Cooking, Photographing, Blogging, Training, Public Speaking and do love to share things to people in the world!




















