---
layout: post
title:  一个方便的图片加载框架——ImageViewEx
author: MrFu
date:   2015-06-08 20:12:00
categories: Android
header-img: "img/post-bg-js-module.jpg"
catalog:    true
tags:
    - Android
---

## 一、前言

最近在整理项目中的一些代码，以备即将开展的新项目中使用，刚刚整理到一个图片加载的 lib，用起来非常的简单，和 picasso 或者谷歌的 Volley 等都一样，只需要一行代码就能完成图片加载的逻辑。

项目地址：[ImageViewEx](https://github.com/MrFuFuFu/ImageViewEx)

项目效果：![screen](https://raw.githubusercontent.com/MrFuFuFu/ImageViewEx/master/Image/screen.png)

## 二、使用

先给出使用方法：首先在布局文件中加入如下代码：

```java
<mrfu.imageviewex.lib.ImageViewEx
    android:id="@+id/imageview"
    android:layout_width="match_parent"
    android:layout_height="200dp"
    android:layout_below="@+id/toolbar"
    android:scaleType="centerCrop" />
```

如果是要使用圆形或者圆角的图片，只需要将 `ImageViewEx` 改成 `RoundImageView` 就可以了。

在 Java 代码中，这样写就可以了

```java
ImageViewEx imageviewex = (ImageViewEx)findViewById(R.id.imageview);
RoundImageView roundimageview1 = (RoundImageView)findViewById(R.id.roundimageview1);
RoundImageView roundimageview2 = (RoundImageView)findViewById(R.id.roundimageview2);
imageviewex.loadImage("http://f.hiphotos.baidu.com/image/pic/item/ae51f3deb48f8c5471a15c2e38292df5e0fe7f45.jpg");
roundimageview1.loadImage("http://f.hiphotos.baidu.com/image/pic/item/ae51f3deb48f8c5471a15c2e38292df5e0fe7f45.jpg");
roundimageview2.setConer(10, 10);//设置圆角图片
roundimageview2.loadImage("http://f.hiphotos.baidu.com/image/pic/item/ae51f3deb48f8c5471a15c2e38292df5e0fe7f45.jpg");
```

## 三、 原理

先给出类关系图


![ImageViewEx](https://raw.githubusercontent.com/MrFuFuFu/ImageViewEx/master/Image/ImageViewEx.png)


使用方式非常简单，现在大概来分析一下这个框架的原理：

框架的加载方式主要还是通过 http 请求的 get 方式拿到图片，然后将其保存在 SD 卡中，将 SD 卡中的图片转化为 Bitmap 对象，通过 `LruMemoryCache` 缓存方式存到内存中。并将其加载到对应 View 上去。

主要类就是 `ImageViewEx` 和 `ImageLoader` 了

### 1、 ImageViewEx.java

这个类的主要功能就是设置加载时的默认图片，调用ImageLoader 类的loadImageAsync进行加载图片，对加载完成后的回调进行处理。都在loadImage(url)中体现了：
    
```java
public void loadImage(String url) {
    mUrl = url;
    setImageBitmap(null);

    //设置加载时的默认图片
    if (defaultDrawable != null) {
        setImageDrawable(defaultDrawable);
    } else if (defaultImg != null) {
        setImageBitmap(defaultImg);
    } else {
        setImageDrawable(defaultImage);
    }
    //调用ImageLoader，进行图片加载
    ImageLoader.ImageRequest request = new ImageLoader.ImageRequest(url, this);
    ImageLoader.get().loadImageAsync(request, mHttpCallback);
}

protected void toMeasure(Bitmap bitmap){};

AbsHttpCallback mHttpCallback = new AbsHttpCallback() {
    @Override
    public void onSuccess(final ImageRequest request, final Bitmap bitmap) {
        if(!request.url.equals(mUrl)) {
            return ;
        }
        toMeasure(bitmap);

        final ImageView iv = (ImageView)request.cookie;
        if(request.inMemory) {
            iv.setImageBitmap(bitmap);
            return ;
        }
        //设置动画
        handler.post(new Runnable() {
            @Override
            public void run() {
                if(request.url.equals(mUrl)) {
                    setImageWithAnimation(iv, bitmap);
                }
            }
        });
    }
```

### 2、 ImageLoader.java

使用最大运行内存的十六分之一作为 LruMemoryCache 的缓存大小，如果超过了这个大小，系统会自动将其释放掉。

在加载的过程中，线程池可以开启的最多任务数为 `MAX_BLOCK_QUEUE_SIZE` 个，balanceTasks()这个方法，保证了队列的最大任务数：

```java
/**
 * balance tasks
 */
private void balanceTasks() {
	BlockingQueue<Runnable> queue = mExecutorPool.getQueue();
	if (queue == null) { 
		return ;
	}
	int poolSize = queue.size();
	if (poolSize > MAX_BLOCK_QUEUE_SIZE) { //保留队尾MAX_BLOCK_QUEUE_SIZE个队列其他清理掉
		int keep = poolSize - MAX_BLOCK_QUEUE_SIZE;
		List<Runnable> list = new ArrayList<Runnable>();
		int i = 0;
		while (queue.size() > 0) {
			i++;
			Runnable r = queue.remove();
			if (i >= keep) {
				list.add(r);
			} else {
				LocalTask task = (LocalTask) r;
				mTaskQueue.remove(task.httpRequest.url);
			}
		}
		queue.clear();
		queue.addAll(list);
	}
}
```

在内部类 LocalTask 中进行加载的逻辑，主要看 run() 方法，先根据 url 拿到 SD 卡中的存储路径pathName，将 pathName 解析成 Bitmap 对象，如果不为 null 表示 SD 卡中有该图片，直接取 SD 卡中的图片，否则删除这个文件，并通过 HttpRequestGet 去下载该图片，下载完成后会回调 requestFinished 方法，并调用 notifySuccess 方法，注意，不管成功还是失败，都需要将其从任务队列 mTaskQueue 中删除。

```java
/**
 * local task
 *
 */
private class LocalTask implements Runnable, HttpGetProgressCallback {
	private ImageRequest httpRequest;
	private AbsHttpCallback callback;
	public LocalTask(ImageRequest request, AbsHttpCallback callback) {
		this.httpRequest = request;
		this.callback = callback;
	}
	@Override
	public void run() {
		String pathName = FileStore.cachePathForKey(httpRequest.url);
		if (!TextUtils.isEmpty(pathName)) {
			Bitmap  bitmap = decodeBitmap(pathName);
			if(bitmap != null) {
				notifySuccess(httpRequest, callback, bitmap);
				return ;
			} else {
				new File(pathName).delete();
			}
		}
		callback.onStart(httpRequest);
		HttpRequestGet httpGet = new HttpRequestGet(httpRequest.url, this);
		httpGet.run();
	}
	@Override
	public void requestFinished(String url, String pathName) {
		Bitmap bitmap = decodeBitmap(pathName);
		if(bitmap != null) {
			notifySuccess(httpRequest, callback, bitmap);
		} 
	}
	@Override
	public void requestFailed(String url, String errorStr) {
		notifyFailure(httpRequest, callback, HttpErrorResult.HTTP_GET_FAIL);
	}

	@Override
	public void progressPublish(String url, int progress) {
		callback.onProgress(httpRequest, progress);
	}

}
```

```java
/**
 * notify success tasks
 * @param httpRequest
 * @param callback
 */
private void notifySuccess(ImageRequest httpRequest, AbsHttpCallback callback, Bitmap bitmap) {
	mBitmapCache.put(httpRequest.url, bitmap);
	Set<ItemTask> set = mTaskQueue.get(httpRequest.url);
	if(set != null){
		for(ItemTask task : set){
			task.callback.onSuccess(task.httpRequest, bitmap);
		}
		set.clear();
		mTaskQueue.remove(httpRequest.url);
	}
}
private void notifyFailure(ImageRequest httpRequest, AbsHttpCallback callback, HttpErrorResult error) {
	Set<ItemTask> set = mTaskQueue.get(httpRequest.url);
	if(set != null){
		for(ItemTask task : set){
			task.callback.onFailure(task.httpRequest, HttpErrorResult.HTTP_GET_FAIL);
		}
		set.clear();
		mTaskQueue.remove(httpRequest.url);
	}
}
```

### 3、 HttpRequestGet.java

get 请求成功后，创建文件路径，将请求到的数据存储到文件中，通知回调成功或者失败的结果。

### 4、 RoundImageView.java

这个类就比较简单了，继承自 ImageViewEx，功能是 设置圆形图片，主要就是重写了 onDraw(canvas); 方法，在这个方法里调用了 Canvas 的 drawRoundRect 方法。注意，如果要设置成圆角图片 则需要调用 setConer(x,y); 如果不调用表示圆形图片：

```java
@Override  
protected void onDraw(Canvas canvas) {  
	Bitmap bitmap = Bitmap.createBitmap(getWidth(), getHeight(),
			Bitmap.Config.ARGB_8888);
	Canvas c = new Canvas(bitmap);
	Paint paint = new Paint(1);
	paint.setColor(Color.BLACK);
	if (x != 0 && y != 0) {
		c.drawRoundRect(
				new RectF(0.0F, 0.0F, getWidth(), getHeight()),
				x, y, paint);
	}else {
		c.drawRoundRect(
				new RectF(0.0F, 0.0F, getWidth(), getHeight()),
				getWidth()/2, getHeight()/2, paint);
	}
	Paint paint0 = new Paint();
	new PorterDuffXfermode(
			PorterDuff.Mode.DST_IN);
	paint0.setFilterBitmap(false);
			paint0.setXfermode(new PorterDuffXfermode(
			PorterDuff.Mode.DST_IN));
	try{
		Drawable drawable = getDrawable();
		if (drawable != null) {
			int saveCount = canvas.saveLayer(0.0F, 0.0F, getWidth(),
					getHeight(), null, 31);
			drawable.setBounds(0, 0, getWidth(), getHeight());
			drawable.draw(canvas);
			canvas.drawBitmap(bitmap, 0.0F, 0.0F, paint0);
			canvas.restoreToCount(saveCount);
		}
	}catch(Exception e){
		e.printStackTrace();
	}catch(Throwable t){
		t.printStackTrace();
	}
}  
```

基本的就是这样，框架其实很简单，将其抽取出来作为一个框架来用的话，还是很方便的。对了如果要显示下载进度，只需要调用 HttpGetProgressCallback 接口就可以了，这个可以自己去封装，我就不搞了，哈哈，后期如果有这个需求可以考虑加上。嗯。。。后面再更新吧。