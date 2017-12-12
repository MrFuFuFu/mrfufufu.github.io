---
layout: post
title:  Swift Apprentice II -- Advanced Topics
subtitle: Swift notes
author: MrFu
date:   2017-12-12 19:24:00
catalog:    true
header-img: "img/post-bg-swift-apprentice.png"
tags:
    - Swift
---

> The notes of [Swift Apprentice](https://store.raywenderlich.com/products/swift-apprentice)

## Code Organization

A theme of access control is the idea that your code should be loosely coupled and highly cohesive. Loosely coupled code limits how much one entity knows about another, which in turn makes different parts of your code less dependent on others.

### Extensions by protocol conformance

```swift
extension CheckingAccount: CustomStringConvertible {
  public var description: String {
    return "Checking Balance: $\(balance)"
  }
}
```

* Makes it obvious *description* is part of * CustomStringConvertible*
* Doesn't help conform to other protocols
* Can easily be removed without doing collateral damage to the rest of * CheckingAccount*
* Is easy to grok!

### Singleton pattern

```swift
class MyManager {
	static let shared = MyManager()
	private init() {}
}
```
### Subscripts

```swift
	subscript(parameterList) -> ReturnType {
		get {
			//return someValue of ReturnType
		}
		
		set(newValue) {
			// set someValue of ReturnType to newValue
		}
	}
```

* The subscript's prototype looks like a function's signature: It has a parameter list and a return type, but instead of the `func` keyword and the function's name, you use the `subscript` keyword.
* It has both a getter and a setter. The setter is optional, so the subscript can be either read-write or read-only.


```swift
class Person {
  let name: String
  let age: Int
  
  init(name: String, age: Int) {
    self.name = name
    self.age = age
  }
}

let me = Person(name: "Cosmin", age: 31)

extension Person {
  subscript(property key: String) -> String? {
    switch key {
      case "name":
        return name
      case "age":
        return "\(age)"
      default:
        return nil
    }
  }
}

me[property: "name"]
me[property: "age"]
me[property: "gender"]

//output
//Cosmin
//31
//nil
```

### Keypaths

**Keypaths** enable you to store references to properties. For example, this is how you model the tutorials on a website:


```swift
class Tutorial {
  let title: String
  let author: Person
  let type: String
  let publishDate: Date
  
  init(title: String, author: Person, type: String, publishDate: Date) {
    self.title = title
    self.author = author
    self.type = type
    self.publishDate = publishDate
  }
}

let tutorial = Tutorial(title: "Object Oriented Programming in Swift", author: me, type: "Swift", publishDate: Date())

//a *backslash* to create a keypath for the `title` property of the `Tutorial` class and then access its corresponding data with the `keyPath(_:)` subscript.
let title = \Tutorial.title
let tutorialTitle = tutorial[keyPath: title]

//Keypaths can access properties several levels deep:
let authorName = \Tutorial.author.name
var tutorialAuthor = tutorial[keyPath: authorName]

let authorPath = \Tutorial.author
let authorNamePath = authorPath.appending(path: \.name)
tutorialAuthor = tutorial[keyPath: authorNamePath]

```

#### Setting properties

Using keypaths is more involved than using properties. It becomes a wo-step process:

1. First, you decide which property you need and create a keypath.
2. Then, you pass this keypath to an instance using the keypath subscript to access the selected property.


```swift
class Jukebox {
  var song: String
  
  init(song: String) {
    self.song = song
  }
}

let jukebox = Jukebox(song: "Nothing else matters")

let song = \Jukebox.song
jukebox[keyPath: song] = "Stairway to heaven"
```

The benefit of this process is that it allows you to parameterize the properties you use in your code. Instead of hard coding them, you can store them in variables as keypaths. You could even leave it up to your users to decide which properties should be used!


## Pattern Matching

```swift
let coordinate = (x: 1, y: 0, z: 0)
//1
if (coordinate.y == 0) && (coordinate.z == 0) {
  print("along the x-axis")
}
//2
if case (_, 0, 0) = coordinate {
  print("along the x-axis")
}
```

1 and 2 code snippets will achieve the same result.

The first option digs into the internals of a tuple and has a long equatable comparison.

The second option, using pattern matching, is concise and readable.

> Patterns provide rules to match values.
> 
> You can also use patterns in `switch` cases, as well as in `if`, `while`, `guard` and `for` statements. You can also use patterns in variable and constant declarations.

#### switch

```swift
func process(point: (x: Int, y: Int, z: Int)) -> String {
  let closeRange = -2...2
  let midRange = -5...5
  switch point {
  case (0, 0, 0):
    return "At origin"
  case (closeRange, closeRange, closeRange):
    return "Very close to origin"
  case (midRange, midRange, midRange):
    return "Nearby origin"
  default:
    return "Not near origin"
  }
}
let point = (x: 15, y: 5, z: 3)
let response = process(point: point)// Not near origin
```

This code introduces a couple of new concepts:

1. You can match against ranges of numbers.
2. The `switch` statement allows for multiple cases to match patterns.

#### for

```swift
let groupSizes = [1, 5, 4, 6, 2, 1, 3]
for case 1 in groupSizes {
  print("Found an individual")// 2 times
}
```

### Patterns 

```swift
if case (_, 0, 0) = coordinate {
  // x can be any value. y and z must be exactly 0.
  print("On the x-axis") // On the x-axis
}

//Value-binding pattern
if case (let x, 0, 0) = coordinate {
  print("On the x-axis at \(x)") // On the x-axis at 1
}
```

#### Enumeration case pattern

```swift
enum Organism {
  case plant
  case animal(legs: Int)
}
let pet = Organism.animal(legs: 4)
switch pet {
case .animal(let legs):
  print("Potentially cuddly with \(legs) legs") 
default:
  print("No chance for cuddles")
}
// output
// Potentially cuddly with 4 legs
```

#### Optional pattern

```swift
let names: [String?] = ["Michelle", nil, "Brandon", "Christine", nil, "David"]

for case .some(let name) in names {
  print(name) // 4 times
}
//or
for case let name? in names {
  print(name) // 4 times
}
```

#### "Is" and "As" type-casting pattern

```swift
let array: [Any] = [15, "George", 2.0]
for element in array {
  switch element {
  case is String: // aha
    print("Found a string") // 1 time
  //This case will never be executed just for example
  //case let text as String: // 1 time
  //  print("Found a string: \(text)")
  default:
    print("Found something else") // 2 times
  }
}
```

### Advanced patterns

```swift
for number in 1...9 {
  switch number {
  case let x where x % 2 == 0:
    print("even") // 4 times
  default:
    print("odd") // 5 time
  }
}

enum LevelStatus {
  case complete
  case inProgress(percent: Double)
  case notStarted
}
let levels: [LevelStatus] = [.complete, .inProgress(percent: 0.9), .notStarted]
for level in levels {
  switch level {
  case .inProgress(let percent) where percent > 0.8 :
    print("Almost there!")
  case .inProgress(let percent) where percent > 0.5 :
    print("Halfway there!")
  case .inProgress(let percent) where percent > 0.2 :
    print("Made it through the beginning!")
  default:
    break
  }
}
// Almost there!
```

```swift
func timeOfDayDescription(hour: Int) -> String {
  switch hour {
  case 0, 1, 2, 3, 4, 5:
    return "Early morning"
  case 6, 7, 8, 9, 10, 11:
    return "Morning"
  case 12, 13, 14, 15, 16:
    return "Afternoon"
  case 17, 18, 19:
    return "Evening"
  case 20, 21, 22, 23:
    return "Late evening"
  default:
    return "INVALID HOUR!"
  }
}
let timeOfDay = timeOfDayDescription(hour: 12) // Afternoon
```

Here you see several identifier patterns matched in each case condition. You can use the constants and variables you bind in preceding patterns in the patterns that follow after each comma.


```swift
enum Organism {
  case plant
  case animal(legs: Int)
}
let pet = Organism.animal(legs: 4)
if case .animal(let legs) = pet, case 2...4 = legs {
  print("potentially cuddly") // Printed!
} else {
  print("no chance for cuddles")
}
```

The first patteran, before the comma, binds the associated value of the enumeration to the constant *legs*.

`if` statement is surprisingly capable.

* **Simple logical test** E.g.: `foo == 10 || bar > baz`.
* **Optional binding** E.g.: `let foo = maybeFoo`.
* **Pattern matching** E.g.: `case .bar(let something) = theValue`.

### Custom tuple

```swift
let name = "Bob"
let age = 23
if case ("Bob", 23) = (name, age) {
  print("Found the right Bob!") // Printed!
}

var username: String?
var password: String?
switch (username, password) {
case let (username?, password?):
  print("Success! User: \(username) Pass: \(password)")
case let (username?, nil):
  print("Password is missing. User: \(username)")
case let (nil, password?):
  print("Username is missing. Pass: \(password)")
case (nil, nil):
  print("Both username and password are missing") // Printed!
}
```

### Programming exercises

#### Fibonacci

```swift
func fibonacci(position: Int) -> Int {
  switch position {
  // 1
  case let n where n <= 1:
    return 0 // 233 times
  // 2
  case 2:
    return 1 // 377 times
  // 3
  case let n:
    return fibonacci(position: n - 1) + fibonacci(position: n - 2) // 609 times
  }
}
let fib15 = fibonacci(position: 15) // 377
```

### Expression pattern

```swift
let matched = (1...10 ~= 5) // ture

if case 1...10 = 5 {
  print("In the range") // Printed!
}
```

#### Overloading ~=

```swift
// 1 The function takes an array of integers as its pattern parameter and an integer as its value parameter. The function returns a Bool
func ~=(pattern: [Int], value: Int) -> Bool {
  //iterates through each element in the array.
  for i in pattern {
    if i == value {
      return true
    }
  }
  return false
}

let list = [0, 1, 2, 3]
let integer = 2

let isInArray = (list ~= integer) // true

if case list = integer {
  print("The integer is in the array") // Printed!
} else {
  print("The integer is not in the array")
}

// Sure, you could check if the integer is in the array like this:
let isInList = list.contains(integer)
```

## Error Handling

### Failable initializers

```swift
enum PetFood: String {
  case kibble, canned
}

let morning = PetFood(rawValue: "kibble") // Optional(3)
let snack = PetFood(rawValue: "fuuud!") // nil
```

As you can see, failable initializers return optionals instead of regular instances. The return value will be `nil` if initialization failed.

You can create failable initializers yourself:

```swift
struct PetHouse {
  let squareFeet: Int
  // Simply name it init?(...) and return nil if it fails
  init?(squareFeet: Int) {
    if squareFeet < 1 {
      return nil
    }
    self.squareFeet = squareFeet
  }
}
 
let tooSmall = PetHouse(squareFeet: 0) // nil
let house = PetHouse(squareFeet: 1) // Optional(PetHouse)
```

By using a failable initializer, you can `guarantee` that your instance has the correct attributes or it will never exist.

### Optional chaining

```swift
if let dogBreed = janie.pet.breed {
  print("Olive is a \(dogBreed)")
} else {
  print("Olive's breed is unknown.")
}
```

#### Example

```swift
class Toy {
    
  enum Kind {
    case ball
    case zombie
    case bone
    case mouse
  }
    
  enum Sound {
    case squeak
    case bell
  }
    
  let kind: Kind
  let color: String
  var sound: Sound?
    
  init(kind: Kind, color: String, sound: Sound? = nil) {
    self.kind = kind
    self.color = color
    self.sound = sound
  }
}

class Pet {
    
  enum Kind {
    case dog
    case cat
    case guineaPig
  }
    
  let name: String
  let kind: Kind
  let favoriteToy: Toy?
    
  init(name: String, kind: Kind, favoriteToy: Toy? = nil) {
    self.name = name
    self.kind = kind
    self.favoriteToy = favoriteToy
  }
}

class Person {
  let pet: Pet?
    
  init(pet: Pet? = nil) {
    self.pet = pet
  }
}

let janie = Person(pet: Pet(name: "Delia", kind: .dog, favoriteToy: Toy(kind: .ball, color: "Purple", sound: .bell)))
let tammy = Person(pet: Pet(name: "Evil Cat Overlord", kind: .cat, favoriteToy: Toy(kind: .mouse, color: "Orange")))
let felipe = Person()
```

Now you want to check to see if any of the team members has a pet with a favorite toy that makes a sound.

##### Using **optional chaining**:

```swift
if let sound = janie.pet?.favoriteToy?.sound {
  print("Sound \(sound)")
} else {
  print("No sound.")
}

if let sound = tammy.pet?.favoriteToy?.sound {
  print("Sound \(sound)")
} else {
  print("No sound.")
}

if let sound = felipe.pet?.favoriteToy?.sound {
  print("Sound \(sound)")
} else {
  print("No sound.")
}
```

This is an awful lot of repetitive code.

##### Map and flatMap

```swift
let team = [janie, tammy, felipe]
let petNames = team.map { $0.pet?.name }

for pet in petNames {
  // compiler warns you about conversion from Optional to Any
  // print(pet)
  print(pet as Any) // cast to Any to shut the warning off
  //output
  //Optional("Delia")
  //Optional("Evil Cat Overlord")
  //nil
}

let betterPetNames = team.flatMap { $0.pet?.name }

for pet in betterPetNames {
  print(pet)
  //output
  //Delia
  //Evil Cat Overlord
}
```

In this case, you're using `flatMap` to flatten the return type `[Optional<String>]` into the simpler type `[String]`. Another common use of `flatMap is to turn an array of arrays into a single array.


### Error protocol

The `Error` protocol (showed on below) tells the compiler that this enumeration can be used to represent errors that can be thrown.

```swift
class Pastry {
  let flavor: String
  var numberOnHand: Int
    
  init(flavor: String, numberOnHand: Int) {
    self.flavor = flavor
    self.numberOnHand = numberOnHand
  }
}

enum BakeryError: Error {
  case tooFew(numberOnHand: Int)
  case doNotSell
  case wrongFlavor
}

class Bakery {
  var itemsForSale = [
    "Cookie": Pastry(flavor: "ChocolateChip", numberOnHand: 20),
    "PopTart": Pastry(flavor: "WildBerry", numberOnHand: 13),
    "Donut" : Pastry(flavor: "Sprinkles", numberOnHand: 24),
    "HandPie": Pastry(flavor: "Cherry", numberOnHand: 6)
  ]
    
  func orderPastry(item: String,
                 amountRequested: Int,
                 flavor: String)  throws  -> Int {
    guard let pastry = itemsForSale[item] else {
      throw BakeryError.doNotSell
    }
    guard flavor == pastry.flavor else {
      throw BakeryError.wrongFlavor
    }
    guard amountRequested <= pastry.numberOnHand else {
      throw BakeryError.tooFew(numberOnHand: pastry.numberOnHand)
    }
    pastry.numberOnHand -= amountRequested
        
    return pastry.numberOnHand
  }
}
```

#### Handling errors

```swift
let bakery = Bakery()
do {
    try bakery.orderPastry(item: "Albatross",
                           amountRequested: 1,
                           flavor: "AlbatrossFlavor")
} catch BakeryError.doNotSell {
  print("Sorry, but we don't sell this item")
} catch BakeryError.wrongFlavor {
  print("Sorry, but we don't carry this flavor")
} catch BakeryError.tooFew {
  print("Sorry, we don't have enough items to fulfill your order")
}

```

##### Not looking at the detailed error

If you don't really care about the details of the rror you can use `try?` to wrap the result of a function in an optional.

```swift
let remaining = try? bakery.orderPastry(item: "Albatross",
                                        amountRequested: 1,
                                        flavor: "AlbatrossFlavor")
```

##### Stoping your program on an error

Sometimes you know for sure that your code is not going to fail:

```swift
do {
  try bakery.orderPastry(item: "Cookie", amountRequested: 1, flavor: "ChocolateChip")
}
catch {
  fatalError()
}
```

And there is a short way to write the same thing:

```swift 
try! bakery.orderPastry(item: "Cookie", amountRequested: 1, flavor: "ChocolateChip")
```

It's delicious syntactic sugar. Be extra careful when using `try!`.

#### Rethrows

A function that takes a throwing closure as a parameter has to make a choice: either catch every error, or be a throwing funciton itself.

```swift
func perform(times: Int, movement: () throws -> ()) rethrows {
  for _ in 1...times {
    try movement()
  }
}
```

Notice the `rethrows` here. This function does not handle errors like `moveSafely`, but instead leaves the error handling up to the caller of the function, like *goHome*. By using `rethrows` instead of `throws`, this function indicates that it will only rethrow errors thrown by the function passed into it, but never errors of its own.

## Asynchronous Closures and Memory Management

```swift
do {
  let author = Author(name: "Cosmin")
  let tutorial: Tutorial = Tutorial(title: "Memory management", author: author)
}
```

These are placed in a scope (created with `do{}`) so that as soon as they go out of scope they are deallocated.


### Weak references

**Weak references** don't play any part in the **reference count** of a certain object. You declare them as optionals, so they become `nil` once the reference count reaches zero.

### Unowned references

**Unowned references** behave much like weak ones: they don't increase the object's reference count.

It always expect to have a value - you can't declare them as optionals. 

### Handling asynchronous closures

In **multi-threaded**, work can happen simultaneously on multiple **threads of execution**. For example, all networking operations execute in a background thread so they don't block the user interface that happends on the main thread.

In practice, working in multi-threaded environments can be very tricky. For example, just as one thread is writing some data, another therad might be trying to read it and get a half-baked value but only very occasionally making it very difficult to diagnose.

That's why **synchronization** becomes necessary. You can use a framework called **Grand Central Dispatch (GCD)** to simplify many of these issues in Swift.

To run tasks on a background queue, you first need to create a queue:

```swift
let queue = DispatchQueue(label: "queue")
```

Next, create a method like so:

```swift
//1
func execute<Result>(backgroundWork: @escaping () -> Result, mainWork: @escaping (Result) -> ()) {
  //2
  queue.async {
    let result = backgroundWork()
    //3
    DispatchQueue.main.async {
      mainWork(result)
    }
  }
}
```

1. You make the function generic because the `backgroundWork` closure returns a generic result while the `mainWork` closure works with that result. You mark both closures with the `@escaping` attribute because they **escape** the function: you use them asynchronously, so they get called after the function returns.

2. You run the `backgroundWork` closure asynchronously on the serial queue previously defined and store its return value.

3. You dispatch the `mainWork` closure asynchronously on the main queue and you use the `backgroundWork` closure's result as its argument.


```swift
execute(backgroundWork: { addNumbers(upTo: 100) },
        mainWork:  { log(message: "The sum is \($0)") })
//Background thread: Adding numbers...
//Main thread: The sum is 5050
```

```swift
func editTutorial(_ tutorial: Tutorial) {
	queue.async() {
	  [weak self] in
	  
	  guard let strongSelf = self else {
	    print("I no longer exist so no feedback for you!")
	    return
	  }
	  DispatchQueue.main.async {
	    print(strongSelf.feedback(for: tutorial))
	  }
	}
}
```

This code is all or nothing. If the editor has gone away by the time the closure runs, it will print a snarky message. If `strongSelf` is not `nil` it will stick around until the print statement finishes.

## Value Types and Value Semantics

> Two kinds of types in Swift: value types and reference types. Structs and enums are value types; classes and functions are reference types.

These types differ in their behavior. The behavior you've come to expect from value types is the result of **Value semantics**.

Reference types use **assign-by-reference**.

Value types use **assign-by-copy**.

### When to prefer value semantics

Value semantics are good for representing inert, descriptive data. For example: numbers; strings; physical quantities like angle, length, and color; mathematical objects like vectors and matrices; pure binary data; collections of such values; and finally, large rich structures made from such values, like media.

Reference semantics are good for representing distinct items in your program or in the world. For example: constructs within your program such as specific buttons or memory buffers; an object which plays a specific role in coordinating certain other objects; or a particular person or physical object in the real world.

## Protocol-Oriented Programming

### Type Constraints

By using a **type constraints** on a protocol extension, you're able to use methods and properties from another type inside the implementation of your extension.

```swift
protocol PostSeasonEligible {
  var minimumWinsForPlayoffs: Int { get }
}

extension TeamRecord where Self: PostSeasonEligible {
  var isPlayoffEligible: Bool {
    return wins > minimumWinsForPlayoffs
  }
}

protocol Tieable {
  var ties: Int { get }
}

extension TeamRecord where Self: Tieable {
  var winningPercentage: Double {
    return Double(wins) / Double(wins + losses + ties)
  }
}

struct RugyRecord: TeamRecord, Tieable {
  var wins: Int
  var losses: Int
  var ties: Int
}

let rugbyRecord = RugyRecord(wins: 8, losses: 7, ties: 1)
rugbyRecord.winningPercentage // 0.5
```

You can see that with a combination of protocol extensions and `constrained` protocol extensions, you can provide default implementations that make sense for very specific cases.

### Protocol-oriented benefits

#### Programming to interfaces, not implementations

By focusing on protocols instead of implementations, you can apply code contracts to any type - even those that don't support inheritance.

#### Traits, mixins, and multiple inheritance

Speaking of supporting one-off features such as a divisional win or loss, one of the real benefits of protocols is that they allow a form of multiple inheritance.

When creating a type, you can use protocols to decorate it with all the unique characteristics you want:

```swift
protocol TieableRecord {
  var ties: Int { get }
}

protocol DivisionalRecord {
  var divisionalWins: Int { get }
  var divisionalLosses: Int { get }
}

protocol ScoreableRecord {
  var totalPoints: Int { get }
}

extension ScoreableRecord where Self: TieableRecord, Self: TeamRecord {
  var totalPoints: Int {
    return (2 * wins) + (1 * ties)
  }
}

struct NewHockeyRecord: TeamRecord, TieableRecord, DivisionalRecord, CustomStringConvertible, Equatable {
  var wins: Int
  var losses: Int
  var ties: Int
  var divisionalWins: Int
  var divisionalLosses: Int
    
  var description: String {
    return "\(wins) - \(losses) - \(ties)"
  }
    
  static func ==(lhs: NewHockeyRecord, rhs: NewHockeyRecord) -> Bool {
    return lhs.wins == rhs.wins &&
           lhs.ties == rhs.ties &&
           lhs.losses == rhs.losses
  }
}
```

Using protocols in this way is described as using **traits** or **mixins**. These terms reflect that you can use protocols and protocol extensions to add, or mix in, additional behaviors, or traits, to a type.

#### Simplicity

When you write a computed property to calculate the winning percentage, you only need wins, losses and ties. When you write code to print the full name of a person, you only need a first and a last name.

### Why Swift is a protocol-oriented language

Protocol extensions greatly affect your ability to write expressive and decoupled code - and many of the design patterns that protocol extensions enable are reflected in the Swift language itself.

With a design centered around protocols rather than specific classes, structs or enums, your code is instantly more portable and decoupled, because methods now apply to a range of types instead of one specific type. Your code is also more cohesive, because it operates only on the properties and methods within the protocol you’re extending and its type constraints, and ignores the internal details of any type that conforms to it.

Understanding protocol-oriented programming is a powerful skill that will help you become a better Swift developer, and give you new ways to think about how to design your code.