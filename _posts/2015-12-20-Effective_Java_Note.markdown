---
layout: post
title:  Effective Java 笔记
author: MrFu
date:   2015-12-20 20:52:00
header-img: "img/post-bg-effective-java.jpg"
catalog:    true
tags:
    - Effective Java
---

> 这个是我在看原版《Effective Java》的读书笔记，略作笔记，方便记忆。英文版看起来还是有点吃力，慢慢看！坚持看完！也算是阅读的第一本原版技术书了。

## Item 1:考虑用静态工厂方法来替代构造方法

一个类可以提供一个公开的静态工厂方法，它只是返回一个该类的实例。如下是一个简单的例子，这个方法将一个 boolean 的基本类型转变成了一个 Boolean 对象的引用：

```java
public static Boolean valueOf(boolean b) {
    return b ? Boolean.TRUE : Boolean.FALSE;
}
```

注意：它不同于设计模式中的工厂方法模式。另外，静态工厂方式是一个普通方法，它必须有返回值，所以，这个返回值的声明类型应该是此静态工厂方法所在类的类型。
用静态工厂方法替代构造器形式有如下优势和劣势：

* 优势：

	1. 静态工厂方法有名字

	2. 当他们被调用的时候，不要求被创建一个新对象。 构造函数被调用的话，一定会创建新的实例，而静态工厂方法则不一定，它只需要返回一个对象的实例就够了。

	3. 静态工厂方法实际的返回类型可以是声明返回类型的任何子类型，构造函数只能返回当前类型。

	4. 他们减少了创建参数化类型实例的详细程度（能够使用类型推导）

对于4，举个例子吧，这么写，看起来很累赘：

```java
Map<String, List<String>> m = new HashMap<String, List<String>>();
```

如果这么改良一下：

```java
public static <K, V> HashMap<K, V> newInstance() {
    return new HashMap<K, V>();
}
```

然后这么调用就好了：

```java
Map<String, List<String>> m = HashMap.newInstance();
```

。。。不过事实上 Java1.7 已经支持了嘛。

* 劣势：

	1. 仅仅提供静态工厂方法的类而没有公开或者保护的构造器的话，是不能被继承的

	2. 静态工厂方法不能和其他的普通静态方法区分开来

## Item 2:考虑使用 Builder 当面临构造器有多个参数时

如果一个构造器有多个参数，并且有些参数是必须的，有些参数不是必须的，我们可能会写出这样的代码：

```java
// Telescoping constructor pattern - does not scale well!
public class NutritionFacts {
    private final int servingSize;  //(ml) required
    private final int servings;     //(per container) required
    private final int calories;     //  optional
    private final int fat;              //  optional
    private final int sodium;           //  optional
    privatefinalintcarbohydrate;        //  optional
    public NutritionFacts(int servingSize, int servings) {
        this(servingSize, servings, 0);
    }
    public NutritionFacts(int servingSize, int servings,
        int calories) {
        this(servingSize, servings, calories, 0);
    }
    public NutritionFacts(int servingSize, int servings,
        int calories, int fat) {
        this(servingSize, servings, calories, fat, 0);
    }
    public NutritionFacts(int servingSize, int servings,
        int calories, int fat, int sodium) {
        this(servingSize, servings, calories, fat, sodium, 0);
    }
    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium, int carbohydrate) {
        this.servingSize  = servingSize;
        this.servings = servings;
        this.calories = calories;
        this.fat = fat;
        this.sodium = sodium;
        this.carbohydrate = carbohydrate;
    }
}
```
调用时，会这样调用：

```java
NutritionFacts cocaCola = new NutritionFacts(240, 8, 100, 0, 35, 27);
```

当参数很多，并且可变参数也很多的情况下，这种方式书写和阅读都非常麻烦。

所以我们还有第二个选择，使用 *JavaBeans*  的形式，只提供一个无参构造器，对于所有的参数，使用 *setter* 方法来为每一个参数设置值。

```java
// JavaBeans Pattern - allows inconsistency, mandates mutability
public class NutritionFacts {
   // Parameters initialized to default values (if any)
   private int servingSize = -1; // Required; no default value
   private int servings=-1;//""""
   private int calories=0;
   private int fat=0;
   private int sodium=0;
   private int carbohydrate = 0;
   public NutritionFacts() { }
   // Setters
   public void setServingSize(int val)  { servingSize = val; }
   public void setServings(int val)    { servings = val; }
   public void setCalories(int val)    { calories = val; }
   public void setFat(int val)         { fat = val; }
	public void setSodium(int val)      { sodium = val; }

	public void setCarbohydrate(int val) { carbohydrate = val; }
}
```

这看起来是比较简单，但是有点冗长啊，阅读起来倒是容易了，调用的话，需要这么搞：

```java
NutritionFacts cocaCola = new NutritionFacts();
cocaCola.setServingSize(240);
cocaCola.setServings(8);
cocaCola.setCalories(100);
cocaCola.setSodium(35);
cocaCola.setCarbohydrate(27);
```

*JavaBeans* 的形式的话，我们仅仅只能检查参数的有效性，而不能强制的去设定。

那我们来看看 *Builder* 的形式的实现方式：

```java
// Builder Pattern
public class NutritionFacts {
    private final int servingSize;
    private final int servings;
    private final int calories;
    private final int fat;
    private final int sodium;
    private final int carbohydrate;
    public static class Builder {
    // Required parameters
    private final int servingSize;
    private final int servings;
    // Optional parameters - initialized to default values
    private int calories = 0;
    private int fat = 0;
    private int carbohydrate = 0;
    private int sodium = 0;
    public Builder(int servingSize, int servings) {
        this.servingSize = servingSize;
        this.servings = servings;
    }
    public Builder calories(int val)
        { calories = val; return this; }
    public Builder fat(int val)
        { fat = val; return this; }
    public Builder carbohydrate(int val)
        { carbohydrate = val; return this; }
    public Builder sodium(int val)
        { sodium = val; return this; }
    public NutritionFacts build() {
        return new NutritionFacts(this);
    }
}
    private NutritionFacts(Builder builder) {
        servingSize = builder.servingSize;
        servings = builder.servings;
        calories = builder.calories;
        fat = builder.fat;
        sodium = builder.sodium;
        carbohydrate = builder.carbohydrate;
    }
}
```

我们可以这样调用：

```java
NutritionFactscocaCola = new NutritionFacts.Builder(240, 8).calories(100).sodium(35).carbohydrate(27).build();
```

使用 *Builder* 的方式有点像命名参数方式*（The Builder pat- tern simulates named optional parameters）*

就像构造器那样，*builder* 可以强加给它的参数变量，*build* 方法实例化实体类，实例化前，可以对参数进行检查，如果不满足条件的，应该抛出 `IllegalStateException`，或者其他自定义异常。

另外一个小优点是 *builder* 可以有多个可变参数。构造器，像方法一样，可能只有一个可变参数。因为 builder 用不同的方法设置参数，只要你喜欢，他们可以有很多可变参数。

### 泛化建造者模式（Abstract Factory）

通过生命静态工厂方法的返回值为父类型来实现。用泛型让建造者模式和抽象工厂模式融合：

```java
// A builder for objects of type T
public interface Builder<T> {
    public T build();
}
```

这里我们的 `NutritionFacts.Builder` 类应该这样来声明实现：`Builder<NutritionFacts>`。

劣势：为了创建一个对象，必须先创建一个 *builder*，可能在某些情况下会有性能问题。并且它应该并用于有四个或者更多的参数时，否则应该用 *telescoping constructor* 的形式（即，构造器传参的形式）。但是你需要记住未来的扩展情况。

总之，当类的参数过多的时候，*Builder* 模式是一个不错的选择。用 *Builder* 的模式，对传统的 *telescoping constructor* 模式而言，客户端代码更容易阅读和书写；比 *JavaBeans* 模式更加的安全。

## Item 3: 用私有构造器或者枚举类型来强化单例的属性

在 Java1.5 之前有两种方式实现单例，他们都是基于构造函数私有和开放一个公开的静态成员去实现唯一的实例化，这个静态成员是一个 final 字段：

```java
// Singleton with public final field
public class Elvis {
    public static final Elvis INSTANCE = new Elvis();
    private Elvis() { ... }
    public void leaveTheBuilding() { ... }
}
```

但是它还是可以通过 `AccessibleObject.setAccessible` 来反射得到这个私有的构造器，如果要避免这种情况，修改这个构造器确保它在第二次被实例化的时候抛出一个异常。

第二个实现方式是通过静态工厂的方式，公开的成员是一个静态工厂方法：

```java
// Singleton with static factory
public class Elvis {
    private static final Elvis INSTANCE = new Elvis(); private Elvis() { ... }
    public static Elvis getInstance() { return INSTANCE; }
    public void leaveTheBuilding() { ... }

}
```

所有的调用 `Elvis.getInstance()` 去返回一个相同对象的引用，其他的 Elvis 实例将永远不会被创建。

对于可序列化的单例类，还要定义一个 `readResolve` 方法，用来自定义在反序列化时返回的对象，不然的话，每次在反序列化的时候都会生成一个新的示例。

```java
// readResolve method to preserve singleton property
private Object readResolve() {
    // Return the one true Elvis and let the garbage collector
    // take care of the Elvis impersonator.
    return INSTANCE;
}
```

使用枚举类型来实现单例的方式：

```java
// Enum singleton - the preferred approach
public enum Elvis {
    INSTANCE;
    public void leaveTheBuilding() { ... }
}
```

这是一种更加简单，更加安全的方式，原文是这么介绍的：*a single-element enum type is the best way to implement a singleton.*

然而，Android 并不推荐使用枚举，相对于使用静态常量而言，它会消耗两倍以上的内存 [Enums often require more than twice as much memory as static constants. You should strictly avoid using enums on Android.](http://developer.android.com/intl/zh-cn/training/articles/memory.html#Overhead)

## Item 4: 用私有构造函数强化不可实例化的性质

对于一个只有一组静态方法和静态字段的类来说，这样的类是不需要被实例化的。如工具类实例化是没有意义的。通过包含一个私有的构造器来让一个类不可被实例化 *（a class can be made noninstantiable by including a private constructor ）*

```java
// Noninstantiable utility class
public class UtilityClass {
    // Suppress default constructor for noninstantiability
    private UtilityClass() {
        throw new AssertionError();
    }
    ...  // Remainder omitted
}
```

因为明确了这个构造器是私有的，避免了它可以从外部被调用到。`AssertionError` 不是必须的，但是它可以防止这个构造器在该类的内部被不小心调用到。它可以确保该类在任何情况下永远不会被实例化。

这样做还有一个结果是，可以防止这个类被当做基类。


***

.........待续.......

***