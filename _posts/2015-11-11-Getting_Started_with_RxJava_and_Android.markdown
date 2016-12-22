---
layout: post
title:  RxJava 入门
subtitle: Getting Started with RxJava and Android
author: MrFu
date:   2015-11-11 16:25:00
categories: Android
header-img: "img/reactivex_bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - RxJava
---


> 原文地址：[RxJava 入门](http://mrfu.me/android/2015/11/11/Getting_Started_with_RxJava_and_Android/)

> 翻译原文：[Getting Started with RxJava and Android](http://www.captechconsulting.com/blogs/getting-started-with-rxjava-and-android)

## 什么是 ReactiveX？

[ReactiveX](http://reactivex.io/) 是一个专注于异步编程与控制可观察数据（或者事件）流的API。它组合了观察者模式，迭代器模式和函数式编程的优秀思想。

实时数据处理是一件普通的现象，有一个高效、干净和可扩展的方式来处理这些情景是重要的。使用 Observables 和 Operators 来熟练操作它们。ReactiveX 提供一个可组合又灵活的 API 来创建和处理数据流，同时简化了异步编程带来的一些担忧，如：线程创建和并发问题。

## RxJava 简介

[RxJava](https://github.com/ReactiveX/RxJava) 是 ReactiveX 在 Java 上的开源的实现。Observable（被观察者） 和 Subscriber（订阅者）是两个主要的类。在 RxJava 上，一个 Observable 是一个发出数据流或者事件的类，Subscriber 是一个对这些发出的 items （数据流或者事件）进行处理（采取行动）的类。一个 Observable 的标准流发出一个或多个 item，然后成功完成或者出错。一个 Observable 可以有多个 Subscribers，并且通过 Observable 发出的每一个 item，该 item 将会被发送到 Subscriber.onNext() 方法来进行处理。一旦 Observable 不再发出 items，它将会调用 Subscriber.onCompleted() 方法，或如果有一个出错的话 Observable 会调用 Subscriber.onError() 方法。

现在，我们知道了很多关于 Observable 和 Subscriber 类，我们可以继续去介绍有关 Observables 的创建和订阅。

```java
Observable integerObservable = Observable.create(new Observable.OnSubscribe() {
   @Override
   public void call(Subscriber subscriber) {
       subscriber.onNext(1);
       subscriber.onNext(2);
       subscriber.onNext(3);
       subscriber.onCompleted();
   }
});
```

这个 Observable 发出了整数 1，2，3 然后结束了。现在我们需要创建一个 Subscriber，那样我们就能让这些发出的流起作用。

```java
Subscriber integerSubscriber = new Subscriber() {
   @Override
   public void onCompleted() {
       System.out.println("Complete!");
   }
   @Override
   public void onError(Throwable e) {
   }
   @Override
   public void onNext(Integer value) {
       System.out.println("onNext: " + value);
   }
};
```

我们的 Subscriber 只是简单的把任何发出的 items 打印出来，完成之后通知我们。一旦你有一个 Observable 和一个 Subscriber，可以通过 Observable.subscribe() 方法将他们联系起来。

```java
integerObservable.subscribe(integerSubscriber);
// Outputs:
// onNext: 1
// onNext: 2
// onNext: 3
// Complete!
```

上面所有这些代码可以简单的通过使用 Observable.just() 方法来创建一个 Observable 去发出这些定义的值，并且我们的 Subscriber 可以改变成匿名的内部类，如下：

```java
Observable.just(1, 2 ,3).subscribe(new Subscriber() {
   @Override
   public void onCompleted() {
       System.out.println("Complete!");
   }
   @Override
   public void onError(Throwable e) {}
   @Override
   public void onNext(Integer value) {
       System.out.println("onNext: " + value);
   }
});
```

## 操作符

创建和订阅一个 Observable 是足够简单的，可能这并不是非常有用的，但这只是用 RxJava 的一个开始。通过调用操作符，任何的 Observable 都能进行输出转变，多个 Operators 能链接到 Observable 上。例如，在我们刚才的 Observable 中，我们只想要收到奇数的数字。要做到这一点，我可以使用 filter() 操作符。

```java
Observable.just(1, 2, 3, 4, 5, 6) // add more numbers
       .filter(new Func1() {
           @Override
           public Boolean call(Integer value) {
               return value % 2 == 1;
           }
       })
       .subscribe(new Subscriber() {
           @Override
           public void onCompleted() {
               System.out.println("Complete!");
           }
           @Override
           public void onError(Throwable e) {
           }
           @Override
           public void onNext(Integer value) {
               System.out.println("onNext: " + value);
           }
       });
// Outputs:
// onNext: 1
// onNext: 3
// onNext: 5
// Complete!
```

我们的 filter() 操作符定义了一个方法，将取出我们发出的整数，并对所有的奇数返回为 true，所有的偶数返回为 false。从我们的 filter() 返回为 false 的值是不会发出到 Subscriber 的，我们也不会在输出中看到他们。注意：filter() 操作符返回的是一个 Observable，这样我们的订阅方式就可以像之前的做法那样了。

现在，我想找到发出的这些奇数的平方根，一种方法是在调用我们的 Subscriber 的每一个 onNext() 去计算平方根。然而，如果我们在我们的 Subscriber 中做计算平方根的操作的话，这样得到期望可能就不能进一步实现的数据的流式转换了。要做到这一点，我们可以在 filter() 操作符上链上 map() 操作符。

```java
Observable.just(1, 2, 3, 4, 5, 6) // add more numbers
       .filter(new Func1() {
           @Override
           public Boolean call(Integer value) {
               return value % 2 == 1;
           }
       })
       .map(new Func1() {
           @Override
           public Double call(Integer value) {
               return Math.sqrt(value);
           }
       })
       .subscribe(new Subscriber() { // notice Subscriber type changed to 
           @Override
           public void onCompleted() {
               System.out.println("Complete!");
           }

           @Override
           public void onError(Throwable e) {
           }

           @Override
           public void onNext(Double value) {
               System.out.println("onNext: " + value);
           }
       });
// Outputs:
// onNext: 1.0
// onNext: 1.7320508075688772
// onNext: 2.23606797749979
// Complete!
```

操作符的链式使用是构成 RxJava 必不可少的一部分，让你可以灵活的实现任何你想要的需求。随着对于 Observables 和 Operators 相互作用的理解，我们可以进入下一个话题：RxJava 和 Android 的整合。

## 让 Android 中的线程操作变得简单

在 Android 开发中有一个常见的场景是需要在后台线程去分担一定量的工作，一旦该任务完成，会将结果回调到主线程去显示结果。

在 Android 中，我们有多种方法来做这样的事：用 AsyncTasks，Loaders，Services 等。然而，这些解决方式通常不是最好的。Asynctasks 很容易导致内存泄露，CursorLoaders 与 ContentProvider 需要大量的配置和设置样板代码，还有 Services 的目的是为了长时间在后台运营的，而不是处理快速完成的操作，如：做一个网络请求或者从数据库加载内容。

让我们看看 RxJava 是怎么帮我们解决这些问题的。下面这样的布局有一个按钮去开始一个长时间运行的操作，并且始终显示进度条，这样我们可以确保我们的操作是运行在后台线程的而不是在主线程。

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:app="http://schemas.android.com/apk/res-auto"
   android:id="@+id/root_view"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:fitsSystemWindows="true"
   android:orientation="vertical">

   <android.support.v7.widget.Toolbar
       android:id="@+id/toolbar"
       android:layout_width="match_parent"
       android:layout_height="?attr/actionBarSize"
       android:background="?attr/colorPrimary"
       app:popupTheme="@style/AppTheme.PopupOverlay"
       app:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar" />

   <Button
       android:id="@+id/start_btn"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_gravity="center_horizontal"
       android:text="@string/start_operation_text" />

   <ProgressBar
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_gravity="center_horizontal"
       android:indeterminate="true" />

</LinearLayout>
```

一旦按钮被点击，它会禁用按钮并开启长时间运行的操作，并且一旦这个操作完成便会显示一个 Snackbar，然后按钮会重新变得可点击。这里是一个用 AsyncTask 实现我们这个“长期运行的操作”的例子。这个按钮只是 new 了一个 SampleAsyncTask 并 executes 了它。

```java
public String longRunningOperation() {
   try {
       Thread.sleep(2000);
   } catch (InterruptedException e) {
       // error
   }
   return "Complete!";
}

private class SampleAsyncTask extends AsyncTask {

   @Override
   protected String doInBackground(Void... params) {
       return longRunningOperation();
   }

   @Override
   protected void onPostExecute(String result) {
       Snackbar.make(rootView, result, Snackbar.LENGTH_LONG).show();
       startAsyncTaskButton.setEnabled(true);
   }
}
```

现在，我们如何将这个 AsyncTask 用 RxJava 来实现呢？首先，我们需要添加以下内容到我们 app 的 gradle build 文件下: `compile 'io.reactivex:rxjava:1.0.14'` 。然后我们需要创建一个 Observable 来调用我们这个长时间运行的操作。这可以使用 Observable.create() 方法来做到。

```java
final Observable operationObservable = Observable.create(new Observable.OnSubscribe() {
   @Override
   public void call(Subscriber subscriber) {
       subscriber.onNext(longRunningOperation());
       subscriber.onCompleted();
   }
});
```

我们创建了 Observable 将会调用 longRunningOperation() 方法，将返回的结果作为参数给 onNext() 方法，然后调用 onCompleted() 来完成 Observable （注：在我们的 Observable 去订阅之前，我们的操作是不会被调用的）。接下来，当 button 被点击时，我们需要给我们的 Observable 做订阅。我添加了一个新的 button 用 RxJava 版本来处理我们的任务。

```java
startRxOperationButton.setOnClickListener(new View.OnClickListener() {
   @Override
   public void onClick(final View v) {
       v.setEnabled(false);
       operationObservable.subscribe(new Subscriber() {
           @Override
           public void onCompleted() {
               v.setEnabled(true);
           }

           @Override
           public void onError(Throwable e) {}

           @Override
           public void onNext(String value) {
               Snackbar.make(rootView, value, Snackbar.LENGTH_LONG).show();
           }
       });
   }
});
```

现在当我们建立应用程序时，然后点击新 button 时，会发生什么？我们的进度显示会冻结，然后我们 UI 变得反应迟钝。这是因为我们还没有定义我们的 Observable 应该在什么线程上，以及我们应该在什么线程去订阅它。这是 RxJava 的 Schedulers（调度器） 功能。

对于任何 Observable 你可以定义在两个不同的线程，Observable 会操作在它上面。使用 Observable.observeOn() 可以定义在一个线程上，可以用来监听和检查从 Observable 最新发出的 items （Subscriber 的 onNext，onCompleted 和 onError 方法会执行在 observeOn 所指定的线程上），并使用 Observable.subscribeOn() 来定义一个线程，将其运行我们 Observable 的代码（长时间运行的操作）。

RxJava 默认情况下是单线程的，你会需要利用 observeOn() 和 subscribeOn() 方法为你的应用带来多线程操作。RxJava 附带了几个现成的 Schedulers 给 Observables 使用，如：Schedulers.io() （用于 I/O 操作），Schedulers.computation()（计算工作），和 Schedulers.newThread()（为任务创建的新线程）。然而，从 Android 的角度来看，你可能想知道如何把订阅代码执行到主线程。我们可以用 RxAndroid 库来实现这一目标。

[RxAndroid](https://github.com/ReactiveX/RxAndroid) 是一个对 RxJava 的轻量级扩展为了 Android 的主线程提供 Scheduler，也能去创建一个 Scheduler 用于运行在任何给定的 Android Handler 类上。用新的 Schedulers，Observable 创建之前能让我们将其修改为在后台线程执行我们的任务，并将我们的结果推到主线程上。

要在 APP 中用 RxAndroid，只要在 gradle build 文件中添加这行代码就行了：`compile 'io.reactivex:rxandroid:1.0.1'`。

```java
final Observable operationObservable = Observable.create(new Observable.OnSubscribe() {
   @Override
   public void call(Subscriber subscriber) {
       subscriber.onNext(longRunningOperation());
       subscriber.onCompleted();
   }
})
       .subscribeOn(Schedulers.io()) // subscribeOn the I/O thread
       .observeOn(AndroidSchedulers.mainThread()); // observeOn the UI Thread
```

我们修改 Observable 将用 Schedulers.io() 去订阅，并用 AndroidSchedulers.mainThread() 方法将观察的结果返回到 UI 线程上 。现在，当我们建立我们的 APP 并点击我们的 Rx 操作的按钮，我们可以看到当操作运行时它将不再阻塞 UI 线程。

所有上述的例子利用了 Observable 类来发出我们的结果，当一个操作仅仅只需要发出一个结果然后就完成的情况我们可以有另外一个选择。RxJava 发布的 1.0.13 版本介绍了 Single 类。Single 类可以用于创建像下面这样的方法：

```java
Subscription subscription = Single.create(new Single.OnSubscribe() {
           @Override
           public void call(SingleSubscriber singleSubscriber) {
               String value = longRunningOperation();
               singleSubscriber.onSuccess(value);
           }
       })
       .subscribeOn(Schedulers.io())
       .observeOn(AndroidSchedulers.mainThread())
       .subscribe(new Action1() {
           @Override
           public void call(String value) {
               // onSuccess
               Snackbar.make(rootView, value, Snackbar.LENGTH_LONG).show();
           }
       }, new Action1() {
           @Override
           public void call(Throwable throwable) {
               // handle onError
           }
       });
```

当给一个 Single 类做订阅时，只有一个 onSuccess 的 Action 和 onError 的 action。Single 类有不同于 Observable 的操作符，有几个操作符具有将 Single 转换到 Observable 的机制。例如：用 Single.mergeWith() 操作符，两个或更多同类型的 Singles 可以合并到一起去创建一个 Observable，发出每个 Single 的结果给一个 Observable。

## 防止内存泄露

对于 AsyncTasks 所提到的缺点是，如果对于涉及了 Activity 或 Fragment 的处理不仔细的话，AsyncTasks 可能会造成内存泄露。不幸的是，使用 RxJava 不会魔术般的缓解内存泄露危机，但是防止内存泄露是很简单的。

如果你一直在关注代码，你可能会注意到你调用的 Observable.subscribe() 的返回值是一个  Subscription 对象。Subscription 类只有两个方法，unsubscribe() 和 isUnsubscribed()。为了防止可能的内存泄露，在你的 Activity 或 Fragment 的 onDestroy 里，用 Subscription.isUnsubscribed() 检查你的 Subscription 是否是 unsubscribed。如果调用了 Subscription.unsubscribe() ，Unsubscribing将会对 items 停止通知给你的 Subscriber，并允许垃圾回收机制释放对象，防止任何 RxJava 造成内存泄露。如果你正在处理多个 Observables 和 Subscribers，所有的 Subscription 对象可以添加到 CompositeSubscription，然后可以使用 CompositeSubscription.unsubscribe() 方法在同一时间进行退订(unsubscribed)。

## 写在最后

RxJava 在 Android 生态系统中提供非常棒的多线程选项。让我们能轻松的去后台线程做操作，然后将结果推到 UI 线程上。这对于任何 Android 应用来说都是非常需要的功能，能够运用 RxJava 的众多操作符来处理任何操作的结果仅仅是为了创造更多的附加值。然而 RxJava 要求我们对这个库有更好的了解，充分利用其功能，所花费在这个库上的时间就能让你带来更大的回报。

这篇博客并未涉及 RxJava 的更进一步的主题：热观察 vs 冷观察、处理 backpressure、 Rx 的 Subject 类。用 RxJava 替代 AsyncTask 所涉及的示例代码可以在 [Github](https://github.com/alex-townsend/GettingStartedRxAndroid) 上找到。

## 番外：Retrolambda

Java 8 引入了 Lambda 表达式，遗憾的是 Android 并不支持 Java 8，所以我们不能在 RxJava 中利用这一特性。幸运的是，有一个名为 [Retrolambda](https://github.com/orfjackal/retrolambda) 的库反向移植了 Lambda 表达式到 Java 的早期版本。还有提供有一个 Retrolambda 的 [gradle 插件](https://github.com/evant/gradle-retrolambda)，能让我们在 Android 应用中去使用 Lambda。

对于 Lambda，可以简化 Observable 和 Subscriber 的代码，如：

```java
final Observable operationObservable = Observable.create(
       (Subscriber subscriber) -> {
           subscriber.onNext(longRunningOperation());
           subscriber.onCompleted();
       })
       .subscribeOn(Schedulers.io())
       .observeOn(AndroidSchedulers.mainThread());

startRxOperationButton = (Button) findViewById(R.id.start_rxjava_operation_btn);
startRxOperationButton.setOnClickListener(v -> {
   v.setEnabled(false);
   operationObservable.subscribe(
           value -> Snackbar.make(rootView, value, Snackbar.LENGTH_LONG).show(),
           error -> Log.e("TAG", "Error: " + error.getMessage()),
           () -> v.setEnabled(true));
});
```

Lambda 表达式为 RxJava 减少了很多代码，我会强烈建议你用上 Retrolambda 的。它甚至比 RxJava 还要好用（setOnClickListener方法同样可以使用 Retrolambda）。

