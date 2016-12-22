---
layout: post
title:  基于Material Design 风格的海狐全球购 尝试篇
author: MrFu
date:   2015-07-27 13:43:00
categories: Android
header-img: "img/post-bg-mdhaitao.jpg"
catalog:    true
tags:
    - Android
---


>本文最初发表在公司内的 wiki 上，为方便以后查阅，在这里也做一份备份

## 前言

在你的 Android 手机里，是否存在着各种风格迥异的 APP，有阿里系“淘宝”“支付宝”类似的长相 iOS 风格的Android 应用，也有获得Google “[Best-In-Class Android Design](https://play.google.com/store/apps/collection/promotion_3001769_io_awards)”推荐的完全 Android 风的 "印象笔记(Evernote)"，当然还有像“蘑菇街”这样iOS 风和 Android 风，混搭的逆向生长怪物。Google 一直在不遗余力的推广着它家的那套“Android Design”，甚至还在去年推出了“Material Design”来重新统一它的设计语言。

你能说微信的设计糟糕吗，恐怕没有人会这么觉得; 图片分享最大的社区 Instagram 也做成了与 iOS 一模一样的设计样式，但是好像也没有多少人吐槽它做的差。当然还是有牛人做出了这样令人惊叹的 [Material Design 风格的 Instagram](http://v.youku.com/v_show/id_XODg2NDQ1NDQ4.html)。那么到底该做成什么样的呢？

**大家在看效果预览的视频时，如果有广告，可以使用下面的优酷会员账号，当做是小福利咯！！！剩余360多天！！随便用！！！！！！**

**账号：15900034241 密码123456**

## iOS Design 和 Android Design 区别

移动端的 APP 界面，不论 iOS 和 Android，通常由四个元素组成：状态栏(status bar)、导航栏(navigation)、主菜单栏(submenu)、内容区域(content)。不同的是，Android4.0开始将主菜单移到了顶部，这样就能就避免出现误操作，以及由于双底栏而带来的美观性等问题：例如：你本来想点击 淘粉吧中的”逛逛“，但结果你不小心点到了 home 键；你本来是想点击”真实拍“，结果不小心点到了”多任务键“或者”返回键“。



Android 从4.0开始，有了一套自己的设计规范，叫做”Android Design“，通过哔哩哔哩Android 3.3版本和4.0版本的对比，你可以大致感受一下 Android Design 和 iOS Design 的设计区别：

左：Android 风格；右： iOS 风格


![bilibili](https://raw.githubusercontent.com/MrFuFuFu/mrfufufu.github.io/master/img/post_bilibili.png)

## 什么是 Material Design ？

2014 年 Google I/O 大会上发布了Android L 并推出了 Material Design，重新统一了 Google 的设计语言，那什么是 Material Design 呢，你可以理解成“材料设计”或者“本质设计”它考虑的是事物的本质，将电子屏幕里的UI元素看成是一种不存在于现实世界的新的材质，并赋予它物理特性。主要有

1. “纸的形态模拟”
2. 转场动画
3. icon 动画
4. 大面积色块Action bar
5. FAB 按钮（Fixed Action Button）
6. 无边框按钮


等等

关注上述几点可以参考这篇文章的介绍：[超全面总结！深聊MATERIAL DESIGN引领的设计趋势](http://www.uisdc.com/material-design-trends)

关于 Material Design 的短视频介绍，可以参考这个视频： [谷歌安卓Material主题 Google Material design](http://v.youku.com/v_show/id_XNzMxNzUyNzQ0.html)

## 购物类应用 fancy 的使用体验

在 Android 上体验了大量的购物类的 APP 中，目前看来只有 fancy 的 设计使用体验是感受最深的，采用大量的滑动操作，诸多的卡片设计，以及令人舒适的转场动画等。当然了，里面的高逼格商品也是一种“就算买不起，我看着都开心”的感受，有兴趣的可以看下面我录的一小段视频（由于 wiki 的限制，所以我给出了优酷的链接）

[链接在此](http://v.youku.com/v_show/id_XMTI5NDQ4NTgzNg==.html)


## 在海淘应用中实现 Material Design



基于 Material Design (以下简称 MD)，试着想让我们的新 APP `海狐全球购` 变得“令人惊叹”，“与众不同”，我尝试着在现有的逻辑业务基础上制作了一套 MD 风格的效果。

[链接在此2](http://v.youku.com/v_show/id_XMTI5NDQ4NDUwOA==.html)

目前主要是实现了，首页，我的订单，地址管理和登录页面，使用最新的 Google 推荐的 NavigationView, ToolBar，实现左侧抽屉效果，采用 卡片设计的风格对各个 item 进行重新定制，增加部分页面的转场动画效果。当然这只是一个非常浅显的尝试，很多细节兼顾并不完全。


现在市场上大量的购物类，海淘类 APP 在设计上大多采用与 iOS 相同的一套设计方案，如果在我们的 APP 设计上能按照谷歌推荐的 Material Design 设计规范来设计这么一套 APP 的话，相信一定能在体验上加分不少。

面对繁杂的国内市场，对面海量的购物类 APP，以及竞争越来越激烈的海淘市场，如何让我们的新 APP 脱颖而出，这也许需要多方面的努力，在价格，在物流，在质量，也许更在体验上。也只有全方位的优秀了，才会更加牛逼。


`海狐` 向前冲吧！

欢迎大家对该话题进行讨论~~~


写完我才发现，可能大家目前还不知道我们目前的版本长什么样呢，录了一个简单的视频，可以对比起来看看：

[链接在此3](http://v.youku.com/v_show/id_XMTI5NDUwNjE0MA==.html)




>推荐阅读：
>
>[Material Design in Action — 哔哩哔哩动画 Android 客户端](http://www.jianshu.com/p/d1458e550b8e)（强烈推荐）
>
>[material design specification](http://www.google.com/design/spec/material-design/introduction.html) (需翻墙)
>
>[谷歌设计师的Material Design实践心得](http://www.ui.cn/detail/22532.html)
>
>[FEEDLY创始人聊聊改版实战经验](http://www.uisdc.com/material-design-feedly-redesign)
>
>[开发者眼中的Android UI Design](http://blog.csdn.net/eclipsexys/article/details/46238889)（东东看完会打我么）




