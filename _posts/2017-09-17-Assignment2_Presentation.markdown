---
layout: keynote
title:  Assignment2 Presentation
iframe:    "//mrfu.me/assignment2-keynote/"
author: MrFu
date:   2017-09-17 14:35:00
tags:
    - Swift
    - iOS
---



> Click *Watch Slides to separate page*

Hi, Swift

I shared this article in our assignment 2 of iOS course class. This keynote is about the **Swift** and what's different between Swift, Kotline and Java.




### [Watch Slides →](//mrfu.me/assignment2-keynote)

<img src="https://raw.githubusercontent.com/MrFuFuFu/assignment2-keynote/master/attach/1505640285.png" width="300" height="300"/>


<small class="img-hint">You can also scan QR code to browser it on your mobile devices</small>

[Github](https://github.com/MrFuFuFu/assignment2-keynote)






## Part 1

### List the new technologies I have learned:

#### `info.plist` configuration: How to acquire photo library permission.

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>I need your permission to save this image to album.</string>
```
#### `UIBezierPath` it's a very very important class for UIKit, 

```swift
func triangle(startPoint: CGPoint, translationPoint: CGPoint) -> UIBezierPath {
    let rect = CGRect(x: startPoint.x, y: startPoint.y,
    	 width: translationPoint.x, height: translationPoint.y)
    let trianglePath = UIBezierPath() //create BezierPath object
    // move to point
    trianglePath.move(to: CGPoint(x: rect.minX, y: rect.minY))
    // add line
    trianglePath.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
    // add line
    trianglePath.addLine(to: CGPoint(x: (2 * rect.minX - rect.maxX), y: rect.maxY))
    // close start point and last point
    trianglePath.close() 
    return trianglePath
}
```

`Linear Bézier curves`, `Quadratic Bézier curves`, `Cubic Bézier curves`


#### Extension:

```swift
extension CALayer {
    /// Add border color for view
    var borderUIColor: UIColor {
        set {
            self.borderColor = newValue.cgColor
        }
        get {
            return UIColor(cgColor: self.borderColor!)
        }
    }
}
```

#### Using `UIImage.withRenderingMode` and `tintColor` to change UIImage color

It's quite important to understand that if we can import less images, the app size will be more samll. `withRenderingMode` and `tintColor` can help us to achieve that, only using one image to implement many color of this image.

```swift
// get an image from assets
let imgOval = UIImage(named: "ic_panorama_fish_eye_48pt")
//Creates and returns a new image object with the specified rendering mode.
let tintOval = imgOval?.withRenderingMode(.alwaysTemplate)
//set it into button
button.setImage(tintOval, for: .normal)
//set button's tintColor
button.tintColor = UIColor.black
```

#### Save a photo to Photos

```swift
/// save to photos
///
/// - Parameter view: the view need to save
func saveToPhotos(view:UIView) {
    UIGraphicsBeginImageContext(CGSize(width: view.frame.size.width, height: view.frame.size.height))
    view.drawHierarchy(in: CGRect(x: 0.0, y: 0.0, width: view.frame.size.width, height: view.frame.size.height), afterScreenUpdates: true)
    let image = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    //Adds the specified image to the user’s Camera Roll album.
    UIImageWriteToSavedPhotosAlbum(image!, self, #selector(image(_:didFinishSavingWithError:contextInfo:)), nil)

}
    
/// call back for save image to Photos
///
/// - Parameters:
///   - image: UIImage
///   - error: Error for that
func image(_ image: UIImage, didFinishSavingWithError error: NSError?, contextInfo: UnsafeRawPointer) {
    if let error = error {
        // we got back an error!
        let ac = UIAlertController(title: "Save error", message: error.localizedDescription, preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "OK", style: .default))
        present(ac, animated: true)
    } else {//tell users save successful
        let ac = UIAlertController(title: "Saved!", message: "Your altered image has been saved to your photos.", preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "OK", style: .default))
        present(ac, animated: true)
    }
}
```

#### Others

`UIPanGestureRecognizer`, `CAShapeLayer`, Gesture Recognizer state (`began`, `changed`), etc.

### Which part did I do well?

![drawTool](/img/article/assignment2/drawTool.png)

* **Reuse `Slider`**: when click from shapes to pan or line, `Slider` will switch from `Opacity` to `Line width`
* Using only one copy image to change Images color (showed above code)
* Color buttons don't need to use images. Using `⦁` symbol, and then change text color to implement.

### Which part I can improve?

![improvePart](/img/article/assignment2/improvePart.png)

In this screenshot, it's iPhone 5 screen, some components are out of screen edge. Actually, it's easy to understand, because I constrain all of these components' size.

The solution is remove these Constraints and make these components Constraints as `Horizontally in Container`.

There is an article I have written several days ago, it is about `Auto Layout`, it may some help: [Auto Layout for a Calculator](https://mrfu.me/2017/09/05/AutoLayout_for_a_Calculator/)

### Apple Human Interface Guideline

In terms of Alert to users, some alert's buttons should be more easy to use, see below picture:

![alertDelete](/img/article/assignment2/alertDelete.png)

There is an guideline for iOS: [Alerts](https://developer.apple.com/ios/human-interface-guidelines/views/alerts/).


### iOS app life cycle

![core_objects_2x](/img/article/assignment2/core_objects_2x.png) ![high_level_flow_2x](/img/article/assignment2/high_level_flow_2x.png)

* Get data from server-side or Core Data or iCloud.
* Save data to server-side or Core Data or iCloud.

See: [The App Life Cycle](https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/TheAppLifeCycle/TheAppLifeCycle.html)


## Part 2: Swift, Java and Kotlin

For more detail, please visit [Assignment2-keynote](https://mrfu.me/assignment2-keynote/#/)

