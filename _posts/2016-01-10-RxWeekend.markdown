---
layout: post
title:  RxWeekend
subtitle: RxJava 的周末狂欢
author: MrFu
date:   2016-01-10 21:41:00
tags:
    -  RxJava
---

>周五的时候就打算这个周末就看 RxJava 了，于是周六把 *RxJava Essentials* 英文版再看了一遍，顺便看了一遍[翻译版](http://rxjava.yuxingxin.com/index.html)，然后就有了以下的笔记~ 

>[Part1](#part-1-rxjava-essentials----operators) 部分主要是 *RxJava Essentials* 的操作符

>[Part2](#part-2-tips) 部分主要是一些 tips


## Part 1: *RxJava Essentials* -- Operators

### Basic

* `just()` 方法可以传入1到9个参数，它们会按照传入的参数的顺序来发射它们。

* `Observable.empty()` 需要一个 Oservable 但是什么都不发射

* `Observable.never()` 传一个不发射数据并永远不会结束的 Observable

* `Observable.throw()` 创建一个不发射数据并且以错误结束的 Observable

`subject` 可以同时是一个 Observable 也可以是一个 Observer，一个 Subject 可以订阅一个 Observable，就像一个观察者，并发射新数据，或者传递它接受到的数据，就像一个 Observable。[see more](http://rxjava.yuxingxin.com/chapter2/subject_observable_observer.html)

对于空的 subscribe() 意为仅仅是为了开启 Observable，而不用管已发出的值。

在 `subscriber.onNext` 或 `subscriber.onCompleted()` 前检测观察者的订阅情况，使代码更高效，因为如果没有观察者等待时我们就不生成没必要的数据项。就像这样：

```java
if (!subscriber.isUnsubscribed()){
    subscriber.onCompleted();
}
```

* `repeat()`

* `defer()` 在观察者订阅时创建 Observable，而不是创建后立即执行，这篇文章有着更棒的解释：[小鄧子:使用RxJava实现延迟订阅](http://www.jianshu.com/p/c83996149f5b)

* `range()` 从一个指定的数字开始发射 N 个数字

* `interval(3, TimeUnit.SECONDES)` 轮询时用：参数：指定两次发射时间间隔，时间单位。

* `timer()` 一段时间后才发射 Observable


### Filtering

* `filter()`, `take()`, `takeLast()`

* `distinct()` 去掉序列中重复项，是作用于一个完整的序列的

* `distinctUntilChanged()` 在一个存在的序列上来创建一个新的不重复发射元素的序列

![distinctuntilchanged](/img/article/rxweekend_distinctuntilchanged.png)

* `first()`, `last()`, `firstOrDefault()`, `lastOrDefault()`

* `skip()`, `skipLast()` 跳过前几个或者最后几个元素

* `elementAt()` 发射指定元素。但如果元素不足可以使用：`elementAtOrDefault()`

* `sample(30,TimeUnit.SECONDS)` 指定的时间间隔里发射最近一次的数值

![sample](/img/article/rxweekend_sample.png)

* `throttleFirst()` 定时发射第一个元素

* `timeout()` 限时，在指定时间间隔 Observable 不发射值的话， 就会触发 `onError()` 函数

* `debounce()` 过滤发射速率过快的数据，即：在一个时间间隔过去之后，仍然没有发射的话，则发射最后的那个

### Transforming

* `map()` 接收到的对象应用到每个发射的值上

* `flatMap()` 将发射的序列转换成另外一种对象的 Observable 序列，注意：它允许交叉，即 `flatMap()` 不保证最终生成的 Observable 和源 Observable 发射序列相同。 [FlatMap](http://rxjava.yuxingxin.com/chapter5/the_*map_family.html)

* `concatMap()` 解决了 `flatMap()` 交叉的问题，提供了 能把发射值连续在一起的铺平函数，而非合并它们。

>关于`flatMap()` 和 `concatMap()` 必须看这篇文章: [小鄧子-RxJava变换操作符：.concatMap( )与.flatMap( )的比较](http://www.jianshu.com/p/6d16805537ef)

* `flatMapInterable()` 类似于 `flatMap()` 只是它将源数据两两结成对并生成 Iterable，而不是原始数据项和生成的 Observables

* `switchMap()` 和 `flatMap()` 区别在于每当源 Observable 发射一个新的数据项时，将取消订阅并停止监视之前那个数据项产生的 Observable，并开始监视当前发射的这个。

* `scan()` 累加器，对原始Observable 发射的每项数据都应用一个函数，计算出函数的结果值，并填充回可观测序列，等待下一次发射的数据一起使用。

* `scan(R, Func2)` 用初始值作为第一个发射的值

* `groupBy()`  引用小鄧子的一段话来说是这样的：去这里看更详细的解释，会恍然大悟的：[小鄧子-Architecting Android with RxJava](http://www.jianshu.com/p/943ceaccfdff)

>将原始Observable根据不同的key分组成多个`GroupedObservable`，由原始`Observable`发射（原始`Observable`的泛型将变成这样`Observable<GroupedObservable<K, T>>`），每一个`GroupedObservable`既是事件本身也是一个独立的`Observable`，每一个`GroupedObservable`发射一组原始`Observable`的事件子集。

* `buffer()` 将得到一个新的 Observable，这个 Observable 每次发射一组列表值而不是单个发射，你还可以指定它的 skip 值和 timespan 项数据

* `window()` 类似于 `buffer()`，但它发射的是 Observable 而不是列表

* `cast()` 将源 Observable 中每一项数据都转换成新的类型，转成了一个不同的 Class。

### Combining
* `merge()` 多个序列合并在一个最终发射的 Observable.   `mergeDelayError()` 当所有的 Observable 都完成时，再处理有 error 的情况，发射 `onError()`

* `zip()` 合并两个或多个 Observables 发射出的数据项，根据指定的函数 Func* 变换它们，并发射一个新值

* `join()` 基于时间窗口将两个 Observables 发射的数据结合在一起，组成一个新的 Observable。它可以控制每个 Observable 产生结果的生命周期，在每个结果的生命周期内，可以与另一个 Observable 产生的结果按照一定的规则进行合并！

![join](/img/article/rxweekend_join.png)

>join方法的用法如下： 
observableA.join(observableB, 
observableA产生结果生命周期控制函数， 
observableB产生结果生命周期控制函数， 
observableA产生的结果与observableB产生的结果的合并规则）

蓝线和粉色的线表示对应的Observable 上的元素的生命周期[](http://blog.csdn.net/Job_Hesc/article/details/46612015)

* `combineLatest()` 像 `zip()` 的特殊形式，`zip()`作用于最近未打包的两个 Observables，相反 `combineLatest()` 作用于最近发射的数据项

![combinelatest](/img/article/rxweekend_combinelatest.png)

* `and()`, `then()`, `when()`: 如下：

```java
Pattern2<O1, O2> pattern = JoinObservable.from(obserable1).and(obserable2);
Plan0<O1> plan = pattern.then(this::updateTitle);
JoinObservable.when(plan).toObservable().observeOn(…).subscribe(…);
```

解释：两个发射序列 obserable1 和 obserable2 通过 and 链接。使用 pattern 对象创建 Plan 对象，然后使用 when...（好吧，我想不到使用场景...）

![and_then_when](/img/article/rxweekend_and_then_when.png)

* `switch()` 将一个发射多个 Observables 的 Observable 转换成另一个单独的 Observable，后者发射那些 Observables 最近发射的数据项，注：当源 Observable 发射一个新的 Observable 时，`switch()` 会立即取消订阅前一个发射数据的 Observable，然后订阅一个新的 Observable，并开始发射它的数据。

* `startWith()` 与 `concat()` 对应，通过传一个参数来先发射一个数据序列


## Part 2: Tips


### Tips1

>[使用RxJava从多个数据源获取数据](http://www.jianshu.com/p/be084df924dc)

```java
// Our sources (left as an exercise for the reader)
Observable<Data> memory = ...;
Observable<Data> disk = ...;
Observable<Data> network = ...;

// Retrieve the first source with data
Observable<Data> source = Observable

  .concat(memory, disk, network)
  .first();//先取 memory 中的数据，如果有，就取出，然后停止检索队列。
```

```java
 //持久化数据/缓存数据
 Observable<Data> networkWithSave = network.doOnNext(new Action1<Data>() {
 @Override public void call(Data data) {
 saveToDisk(data);
 cacheInMemory(data);
 }
});

 Observable<Data> diskWithCache = disk.doOnNext(new Action1<Data>() {
 @Override public void call(Data data) {
  cacheInMemory(data);
 }

});
//现在，如果你使用 networkWithSave 和 diskWithCache，数据将会在加载后自动保存
```

```java
//处理陈旧数据
Observable<Data> source = Observable
    .concat(memory, diskWithCache, networkWithSave)
    .first(new Func1<Data, Boolean>() {

      @Override public Boolean call(Data data) {
        return data.isUpToDate();//需要 update 的话，则筛选掉该数据源，检索下一个数据源
      }
    });//注：first() 和 takeFirst() 区别在于，如果没有符合的数据源，first() 会抛 NoSuchElementException 异常
```

### Tips2

>[在正确的线程上观察](http://www.jianshu.com/p/72911b9ba2d7)

* `.subsribeOn()` 操作符可以改变Observable应该在哪个调度器上执行任务。

* `.observeOn()` 操作符可以改变Observable将在哪个调度器上发送通知。

* 另外，默认情况下，链上的操作符将会在调用 `.subsribeOn()`的那个线程上执行任务。如下：

```java
Observable.just(1,2,3)
  .subscribeOn(Schedulers.newThread())
  .flatMap(/** 与UI线程无关的逻辑**//)//会在 subscribeOn() 指定的线程上执行任务
  .observeOn(AndroidSchedulers.mainThread())
  .subscribe();
```

### Tips3

>[Architecting Android with RxJava](http://www.jianshu.com/p/943ceaccfdff)

Backpressure(背压): 事件产生的速度比消费快（在 producer-consumer(生产者-消费者) 模式中）。发生 overproucing 后，当链式结构不能承受数据压力时，就会抛出 `MissingBackpressureException` 异常。
最常见的 Backpressure 就是连续快速点击按钮....

### Tips4

>[避免打断链式结构：使用.compose()操作符](http://www.jianshu.com/p/e9e03194199e):

再重用操作符的方式上，使用 `compose()`，而不是 `flatMap()`:

![compose_flatmap](/img/article/rxweekend_compose_flatmap.png)

### Tips5

Schedulers:

将一个耗时的操作，通过 `Scehdulers.io()` 放到 I/O 线程中去处理

```java

public static void storeBitmap(Context context, Bitmap bitmap, String filename){
    Schedulers.io().createWorker().schedule(() -> {
        blockingStoreBitmap(context, bitmap, filename);
    })
}
```


