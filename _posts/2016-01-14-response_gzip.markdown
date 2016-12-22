---
layout: post
title:  Response gzip 解压的问题
author: MrFu
date:   2016-01-14 13:25:00
catalog:    true
tags:
    -  Android
---


## 问题描述

在项目中使用了 [retrofit](http://square.github.io/retrofit/) 和 [OkHttp](http://square.github.io/okhttp/) 之后，服务端返回的数据都是被压缩的，导致 OkHttp 不能解析数据

## 问题排查

在此之前，通过调用 API 服务端下发的数据都是 gzip 压缩的，但是 response 的 header 里面并没有 `Content-Encoding:gzip` 的 header 头。以前在使用 `HttpURLConnection` 类的时候，都是直接写解压代码解压 response 数据流的（后面有代码）。

通过查 OkHttp 的说明，OkHttp 其实是会自动根据是否有这个 gzip 的头来判断是否需要解压 response 数据。

基于此，我让服务端在 response 的 header 里加上了 `response.addHeader("Content-Encoding", "gzip”);` 的头，至此，Android 这边问题解决已解决。然而 iOS 那边出现了数据无法解压的错误，具体错误描述是：当他们对返回的数据进行 gzip 解压时发现不能顺利解压。问题排查时发现，他们拿到的 response 数据已经被解压好的，当通过调用自己实现的解压方法后，数据就异常了。所以，初步断定，服务端在加了 gzip 头之后，下发的数据就没有被压缩了。

## debug 经过

依照这个思路，我们服务端去 check 为何加了头之后数据就没有被压缩。我在 Android 端联调时通过使用 FaceBook 的 [Stetho](http://facebook.github.io/stetho/)工具（Chrome）进行网络抓包的时候时发现，数据确实是没有被压缩的。

和服务端联调一个下午加一个晚上无果之后（绑 host，切 IP 等各种方法都尝试了），服务端同学提出数据确实是被压缩了，debug 打出来的 log 数据已经证明了，而且发现 Chrome 在网络调试时会对有 gzip 的头的数据进行自动解压的。

基于此，我在 Android 里使用 `HttpURLConnection` 类进行手动 debug，代码如下：

```java
int responseCode = httpURLConnection.getResponseCode();
if (responseCode == HttpURLConnection.HTTP_OK) {
    //un gzip
    in = httpURLConnection.getInputStream();
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    int len1;
    byte[] buffer1 = new byte[1024];
    while ((len1 = in.read(buffer1)) != -1) {
        byteArrayOutputStream.write(buffer1, 0, len1);
    }
    in.close();
    byteArrayOutputStream.close();
    final String str1 = new String(byteArrayOutputStream.toByteArray(), "utf-8");
    Debug.i_MrFu("未做解压的数据 = " + str1);

```

```java
    //do gzip
    in = new GZIPInputStream(httpURLConnection.getInputStream());
    ByteArrayOutputStream arrayOutputStream = new ByteArrayOutputStream();
    int len;
    byte[] buffer = new byte[1024];
    while ((len = in.read(buffer)) != -1) {
        arrayOutputStream.write(buffer, 0, len);
    }
    in.close();
    arrayOutputStream.close();
    final String str = new String(arrayOutputStream.toByteArray(), "utf-8");
    Debug.i_MrFu("做了解压的数据 = " + str);
}
```

最终发现，确实下发的数据是压缩过的。此时，iOS 也找到了问题的所在，iOS 的 `NSURLConnection` 类会针对有 gzip 头的 response 进行自动解压。所以他们 debug 时拿到的 `byte[]` 其实是已经解压好的，看此 issue: [NSURLConnection/NSURLRequest gzip support!](http://stackoverflow.com/questions/2682483/nsurlconnection-nsurlrequest-gzip-support)

## 结论

* Chrome 在 network 调试时会针对 gzip 的头进行自动判断是否解压
* iOS 的 `NSURLConnection` 类会针对 gzip 的头进行自动判断是否解压
* OkHttp 会针对 gzip 的头进行自动判断是否解压
* `HttpURLConnection` 所有的事情都要自己做，所以必须自行使用 `GZIPInputStream` 写解压代码的 do gzip 注释，如上方法
* 我应该早点用 `HttpURLConnection` 进行 debug 输出数据流的....工具([Stetho](http://facebook.github.io/stetho/))在此时就显得过于好用了(自动解压了)
* 即便是看到的，也不是事情的真相，只有不断的像深入挖掘事情的真相