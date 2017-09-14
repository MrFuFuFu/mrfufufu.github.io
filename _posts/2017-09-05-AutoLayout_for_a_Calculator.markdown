---
layout: post
title:  Auto Layout for a Calculator
author: MrFu
date:   2017-09-05 18:43:00
catalog:    true
tags:
    - Swift
    - AutoLayout
---

## Prologue

In this article, I will talk about **Auto Layout** in iOS (Swift 3). It is a basic skill for iOS development nowadays. This article will be not very complicated, but very easy to understand. I will give you the code at the end of this article. Besides, you will know how to use storyboard to make Auto Layout.

[Apple's Auto Layout Guide](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/index.html#//apple_ref/doc/uid/TP40010853-CH7-SW1) is a great document to read. The below's equation is a very useful guide. For more detail, please visit: [Anatomy of a Constraint](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/AnatomyofaConstraint.html#//apple_ref/doc/uid/TP40010853-CH9-SW1).

> This constraint states that the red view’s leading edge must be 8.0 points after the blue view’s trailing edge.

![blog_autolayout_view_formula_2x](/img/article/autolayout/blog_autolayout_view_formula_2x.png)

## Auto Layout for a Calculator

Today, I will implement this kind of user interface which showed on below. It is a Calculator, I will focus on how to make constraints for this UI, instead of how to calculate. I will show this code sample at the end of this article.

![blog_autolayout_calculator](/img/article/autolayout/blog_autolayout_calculator.png)

### Step 1 Put all needed buttons into Storyboard

Just put all of this buttons and a label into storyboard.

<img src="/img/article/autolayout/blog_autolayout_step1.png" width="300" height="334"/>


### Step 2 Enbed In to Stack View

There is a great video to talk about why we should use the Stack View: [Mysteries of Auto Layout, Part 1](https://developer.apple.com/videos/play/wwdc2015/218/).

* 4 buttons as a line and choose them, then click `Editor --> Enbed In --> Stack View`(or you can just click right bottom's `Embed In Stack View`). 
* Click the `Show the Attributes inspector` and selecte `Distribution's` value to `Fill Equally` and `Spacing: 10`. 
* Do the same thing with others buttons to the stack view. 

Finally, we will get this the last picture showed on the screen. It's not finished. All of these steps showed on the below picture.

 ![blog_autolayout_step2](/img/article/autolayout/blog_autolayout_step2.png)
 
### Step 3 Continue to Enbed In

#### Combine all of views into stack views

* Select these five buttons lines *(`+-÷×`, `π789`, `√456`, `cos123`, `±.0=`)* and Embed In to a Stack View, set it's attributes to: `Alignment: Fill`, `Spacing: 10`.**(Picture 1, 2)**
* Continue to select to both **label** and **buttons' stack view** and Embed In to a Stack View, set the same attributes with above. **(Picture 3)**

Steps instructions show on the blow:

![blog_autolayout_step3_1](/img/article/autolayout/blog_autolayout_step3_1.png)

#### Make the outside stack view match to the screen

In this step, we will set our calculator fit into our any devices.

* Click the `Add New Constraints`, which located in the right-side bottom of Storyboard, then choose all four directions line to hightlight and set the vaule to `Standard`, Click `Add 4 Constraints`.**(Picture 1)**
* Click `Show the Size inspector`, we can see what's kind of constraints we already set: `Trailling`, `Leading`, `Bottom` and `Top` to the `Superview`.**(Picture 2)**
* But we got a problem, The first line buttons (`+-÷×`) is not the same with our expection. Select all buttons stack view(including all buttons stack view but not include label), and then set the `Distribution's` value to `Fill Equally`, which can solve this problem.

![blog_autolayout_step3_2](/img/article/autolayout/blog_autolayout_step3_2.png)

Fianlly, we have got this kind of view. It already match our requirements, which can showing on all devices.


![blog_autolayout_step3_3](/img/article/autolayout/blog_autolayout_step3_3.jpg)

## Make it more easier to use

In following steps, we will talk about how to make it to fit different orientation, both height compact and width compact.

### Step 4 Height compact style

OK, that's fine for above code, but if users want to change some buttons position when they rotate their screen, how to achieve this? (Just like this article mentioned at start) It means this calculator will become five columns instead of four columns when I rotate the screen.

#### Do some pre-work for Height Compact style

Firstly, I want to introduce some attributes for every view. On the below **(Picture 1)**, there is a plus mark for `Background`. It means when `Height` is `Compact`, the background color we set it to green, `Height compact` means height's value less than width's value (Screen's orientation is horizontal).

Then, we continue to our steps:

* Make top's stack view `Unembed`, which means remove this stack view **(Picture 2)**
* Select both label and buttons's stack view, click `Clear Constraints` **(Picture 3)**
* Select label, and press **control** keyboard and **drag mouse** to the **left-top corner**, press **shift** to select both `Leading` and `Vertical Spacing`.**(Picture 4)**
* Select buttons stack view, make the constraints to **left-bottom corner** and **values** are `0` and `Standard`.(*Picture 5*)
* Drag out **first line buttons** from buttons stack view, and **Command+X** to **Cut** it.**(Picture 6)**

![blog_autolayout_step4_1](/img/article/autolayout/blog_autolayout_step4_1.png)

#### Height Compact style set 1

* Click `Orientation` to the `horizontal` and click `Vary for Traits`, then select the `Height` `introduce variations`. This step is for setting our view to Horizontal model, so that it will be different with vertical model.**(Picture 1)**
* **Command+V** to paste the buttons(`+-÷×`), set its `Axis: Vertical`, and put it into this side.**(Picture 2)**
* Select both two button's stack view and then click `Add New Alignment Constraints` to set the `Top Edges` and `Bottom Edges`.**(Picture 3)**
* Then you will see a error tips: `Need constraints for: X position or width`, because there is no constraints for the stack view(`+-÷×`).**(Picture 4)**
* Select this stack view(`+-÷×`), add a new constraint for it.**(Picture 5)**
* Drag one of the stack view's button to the right buttons' stack view and set its attribute to `Equal Widths`.**(Picture 6)**

![blog_autolayout_step4_2](/img/article/autolayout/blog_autolayout_step4_2.png)


#### Height Compact style set 2

* Select right-side buttons' stack view, and add new constraints to `Top Space to 0`.**(Picture 1)**
* Select left-side buttons' stack view(`+-÷×`), and add new constraints to `Leading Space to SuperView`.**(Picture 2)**
* Click `Done Varying`.**(Picture 3)**

![blog_autolayout_step4_3](/img/article/autolayout/blog_autolayout_step4_3.png)


### Step 5 Width compact style

I wound not tell you how to do it when the user interface style is width compact, because the steps is almost same with above. But there are some things, you need to know:

* When you click `Orientation` back to the `vertiacal`, **(Picture 1)** shows some unusable attributes, which means they are not used in this orientation.
* Set style for `width compact`, you need to set `Vary for Traits` to `Width`.**(Picture 2)**

![blog_autolayout_step5](/img/article/autolayout/blog_autolayout_step5.png)

You also need to know the stack view(`+-÷×`) is not exist on this orientation, because it is unusable, so you need to copy that unusable stack view to this orientation, be careful, there is some little tricks. :)


## Postscript

> Code Sample: [Calculator-demo-Swift](https://github.com/MrFuFuFu/Calculator-demo-Swift)
> 
> Learn from: [Stanford University - CS 193P iPhone Application Development](https://web.stanford.edu/class/cs193p/cgi-bin/drupal/)