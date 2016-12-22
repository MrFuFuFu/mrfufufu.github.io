---
layout: post
title:  "Glide - Module 实例：接受自签名证书的 HTTPS"
subtitle:   "Glide Module Example: Accepting Self-Signed HTTPS Certificates"
author: MrFu
date:   2016-02-28 13:30:00
catalog:    true
tags:
    -  Glide
---


在上篇博客中，你已经学会了 `GlideModules` 的基础。它们提供了一个易于访问的一些 Glide 的核心的基础功能。你通过实现和声明 `GlideModules` 可以快速修改 Glide 的行为。上周我们也将图像的质量改的更高了通过使用 `applyOptions()` 方法。这周，我们会用其他方法：`registerComponents()`，去修改 Glide 网络栈从 self-signed HTTPS 服务器的接收连接并得到图片。

## Glide 系列预览

1. [开始！](http://mrfu.me/2016/02/27/Glide_Getting_Started/)
2. [加载进阶](http://mrfu.me/2016/02/27/Glide_Advanced_Loading/)
3. [ListAdapter(ListView, GridView)](http://mrfu.me/2016/02/27/Glide_ListAdapter_(ListView,_GridView)/)
4. [占位符 和 渐现动画](http://mrfu.me/2016/02/27/Glide_Placeholders_&_Fade_Animations/)
5. [图片重设大小 和 缩放](http://mrfu.me/2016/02/27/Glide_Image_Resizing_&_Scaling/)
6. [显示 Gif 和 Video](http://mrfu.me/2016/02/27/Glide_Displaying_Gifs_&_Videos/)
7. [缓存基础](http://mrfu.me/2016/02/27/Glide_Caching_Basics/)
8. [请求优先级](http://mrfu.me/2016/02/27/Glide_Request_Priorities/)
9. [缩略图](http://mrfu.me/2016/02/27/Glide_Thumbnails/)
10. [回调：SimpleTarget 和 ViewTarget 用于自定义视图类](http://mrfu.me/2016/02/27/Glide_Callbacks_SimpleTarget_and_ViewTarget_for_Custom_View_Classes/)
11. [加载图片到通知栏和应用小部件中](http://mrfu.me/2016/02/27/Glide_Loading_Images_into_Notifications_and_AppWidgets/)
12. [异常：调试和错误处理](http://mrfu.me/2016/02/28/Glide_Exceptions-_Debugging_and_Error_Handling/)
13. [自定义转换](http://mrfu.me/2016/02/28/Glide_Custom_Transformations/)
14. [用 animate() 自定义动画](http://mrfu.me/2016/02/28/Glide_Custom_Animations_with_animate()/)
15. [集成网络栈](http://mrfu.me/2016/02/28/Glide_Integrating_Networking_Stacks/)
16. [用 Module 自定义 Glide](http://mrfu.me/2016/02/28/Glide_Customize_Glide_with_Modules/)
17. Module 实例：接受自签名证书的 HTTPS
18. [Module 实例：自定义缓存](http://mrfu.me/2016/02/28/Glide_Module_Example_Customize_Caching/)
19. [Module 实例：用自定义尺寸优化加载的图片](http://mrfu.me/2016/02/28/Glide_Module_Example_Optimizing/)
20. [动态使用 Model Loader](http://mrfu.me/2016/02/28/Glide_Dynamically_Use_Model_Loaders/)
21. [如何旋转图像](http://mrfu.me/2016/02/28/Glide_How_to_Rotate_Images/)
22. [系列综述](http://mrfu.me/2016/02/28/Glide_Series_Roundup/)

## 用 GlideModule 修改 Glide

在继续阅读前，请确保你已经阅读并理解了[之前的博客](https://futurestud.io/blog/glide-customize-glide-with-modules) 关于 `GlideModule` 的。我们不会在这个博客中继续说它的基础知识。相反，我们要跳过这个问题。所以确保你已经更新了你的 `GlideModule` 的基础知识。

你已经知道 `GlideModule` 提供给你两个方法去改变行为。上周，我们看了第一个方法 `applyOptions()`。这周我们会用另外一个方法 `registerComponents()`，去设置不同的网络库。默认情况下，Glide 内部使用了标准的 HTTPURLConnection 去下载图片。Glide 也提供了两个[集合库](https://futurestud.io/blog/glide-module-example-accepting-self-signed-https-certificates)。这三个都一个非常杨格的安全设置，这很好。唯一的缺点可能是当你的图片从服务端获取时，是使用 `HTTPS`，且是自签名的(self-signed)。这时 Glide 不会下载或显示图片了，因为自签名的证书被认为是一个安全的问题。

## 不安全的 OKHttpClient

因此，你需要去实现自己的网络栈，它接受自签名证书。幸运的是，我们[之前](https://futurestud.io/blog/picasso-customizing-picasso-with-picasso-builder/)已经实现了一个“不安全” 的 OKHttpClient。我们主要复制粘贴这个类。因为它给了我们一个常规的 `OkHttpClient`，我们这样子来集成：

```java
public class UnsafeOkHttpClient {  
    public static OkHttpClient getUnsafeOkHttpClient() {
        try {
            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return null;
                        }
                    }
            };

            // Install the all-trusting trust manager
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            OkHttpClient okHttpClient = new OkHttpClient();
            okHttpClient.setSslSocketFactory(sslSocketFactory);
            okHttpClient.setProtocols(Arrays.asList(Protocol.HTTP_1_1));
            okHttpClient.setHostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });

            return okHttpClient;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

创建 `OkHttpClient` 禁用掉所有的 SSL 证书检查。

## 整合到 Glide

我们的优势是，OkHttp 整合库为 Glide 做了几乎相同的事情，所以我们可以跟着他们走。首先，我们需要在 `GlideModule` 中声明我们的定制。正如你所期待的，我们要在 `registerComponents()` 方法中去做适配。我们可以调用 `.register()` 方法去改变 Glide 的基本部件。Glide 使用一个 [GlideLoader](http://bumptech.github.io/glide/javadocs/360/com/bumptech/glide/load/model/ModelLoader.html) 去链接数据模型到一个具体的数据类型。在我们的实例中，我们要去创建一个 `ModeLoader`，连接传入的 URL，通过 `GlideUrl` 类来代表一个 `InputStream`。Glide 要能创建一个我们的新的 `ModeLoader`，所以我们要在 `.register()` 方法中传递一个工厂。

```java
public class UnsafeOkHttpGlideModule implements GlideModule {  
        @Override
        public void applyOptions(Context context, GlideBuilder builder) {

        }

        @Override
        public void registerComponents(Context context, Glide glide) {
            glide.register(GlideUrl.class, InputStream.class, new OkHttpUrlLoader.Factory());
        }
    }
```

前两个参数是 model 类，和连接的资源类。最后一个参数是 `ModelLoaderFactory`。因此，我们不能直接设置一个 `UnsafeOkHttpClient` 实例，我们需要去创建一个 `ModelLoaderFactory`，它用 `UnsafeOkHttpClient` 来提供了一个 URL 和输入流之前的连接。

再说一次，在 [OkHttp 整合库](https://github.com/bumptech/glide/wiki/Integration-Libraries) 中给了我们一个很好的模板：

```java
public class OkHttpUrlLoader implements ModelLoader<GlideUrl, InputStream> {

    /**
     * The default factory for {@link OkHttpUrlLoader}s.
     */
    public static class Factory implements ModelLoaderFactory<GlideUrl, InputStream> {
        private static volatile OkHttpClient internalClient;
        private OkHttpClient client;

        private static OkHttpClient getInternalClient() {
            if (internalClient == null) {
                synchronized (Factory.class) {
                    if (internalClient == null) {
                        internalClient = UnsafeOkHttpClient.getUnsafeOkHttpClient();
                    }
                }
            }
            return internalClient;
        }

        /**
         * Constructor for a new Factory that runs requests using a static singleton client.
         */
        public Factory() {
            this(getInternalClient());
        }

        /**
         * Constructor for a new Factory that runs requests using given client.
         */
        public Factory(OkHttpClient client) {
            this.client = client;
        }

        @Override
        public ModelLoader<GlideUrl, InputStream> build(Context context, GenericLoaderFactory factories) {
            return new OkHttpUrlLoader(client);
        }

        @Override
        public void teardown() {
            // Do nothing, this instance doesn't own the client.
        }
    }

    private final OkHttpClient client;

    public OkHttpUrlLoader(OkHttpClient client) {
        this.client = client;
    }

    @Override
    public DataFetcher<InputStream> getResourceFetcher(GlideUrl model, int width, int height) {
        return new OkHttpStreamFetcher(client, model);
    }
}
```

在这个类中，你可以看到 `ModelLoaderFactory` 的内部构造是怎样的。对我们来说，重要的代码是创建 internalClient 对象：`internalClient = UnsafeOkHttpClient.getUnsafeOkHttpClient();`。

不幸的是，我们仍然需要用我们的不安全的 OKHttpClient 去连接 URL 激活输入流。因此，我们需要另外一个类去从一个 URL 中拉取返回的输入流：

```java
public class OkHttpStreamFetcher implements DataFetcher<InputStream> {  
    private final OkHttpClient client;
    private final GlideUrl url;
    private InputStream stream;
    private ResponseBody responseBody;

    public OkHttpStreamFetcher(OkHttpClient client, GlideUrl url) {
        this.client = client;
        this.url = url;
    }

    @Override
    public InputStream loadData(Priority priority) throws Exception {
        Request.Builder requestBuilder = new Request.Builder()
                .url(url.toStringUrl());

        for (Map.Entry<String, String> headerEntry : url.getHeaders().entrySet()) {
            String key = headerEntry.getKey();
            requestBuilder.addHeader(key, headerEntry.getValue());
        }

        Request request = requestBuilder.build();

        Response response = client.newCall(request).execute();
        responseBody = response.body();
        if (!response.isSuccessful()) {
            throw new IOException("Request failed with code: " + response.code());
        }

        long contentLength = responseBody.contentLength();
        stream = ContentLengthInputStream.obtain(responseBody.byteStream(), contentLength);
        return stream;
    }

    @Override
    public void cleanup() {
        if (stream != null) {
            try {
                stream.close();
            } catch (IOException e) {
                // Ignored
            }
        }
        if (responseBody != null) {
            try {
                responseBody.close();
            } catch (IOException e) {
                // Ignored.
            }
        }
    }

    @Override
    public String getId() {
        return url.getCacheKey();
    }

    @Override
    public void cancel() {
        // TODO: call cancel on the client when this method is called on a background thread. See #257
    }
}
```

不需要知道在这个类中所有的细节。然而，你应该对于这个系统有一个大概的理解，Glide 能去替换内部的工厂组件。

## Outlook

在这篇博客中，你看到了对于 Glide 工作方式的一个不同的使用场景。我们已经实现了一个 “不安全” 的网络栈，并用 `GlideModule` 中的 `registerComponents()` 方法将它集成到了 Glide 中。但这只是 Glide 配置的冰山一角而已。

下周，我们将看到 `GlideModule` 另外一个选项去改变 Glide 的缓存行为。