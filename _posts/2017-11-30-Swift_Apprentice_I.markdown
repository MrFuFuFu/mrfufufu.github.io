---
layout: post
title:  Swift Apprentice I -- Basic Topics
subtitle: Swift notes
author: MrFu
date:   2017-11-30 17:23:00
catalog:    true
header-img: "img/post-bg-swift-apprentice.png"
tags:
    - Swift
---

> The notes of [Swift Apprentice](https://store.raywenderlich.com/products/swift-apprentice)

## Collection

### Array

#### updating elements

```swift
var players = ["A", "B", "C", "D"]
players[0...1] = ["1", "2", "3", "4"]
print(players)
// > ["1", "2", "3", "4", "C", "D"]
```
This code means using `["1", "2", "3", "4"]` to replace the first two players. The size of the range doesn't have to be equal to the size of the array that holds the values you're adding.

#### Moving elements

```swift
//Remove "4" and instert it into 0 position
let player4 = players.remove(at: 3)
players.insert(player4, at: 0)
print(players)
// > "["4", "1", "2", "3", "C", "D"]

//Swap position 1 and 3
players.swapAt(1, 3)
print(players)
// > "["4", "3", "2", "1", "C", "D"]
```

#### Iterating

```swift
for (index, player) in players.enumerated() {
    print("\(index + 1). \(player)")
}
// > 1. 4
// > 2. 3
// > 3. 2
// > 4. 1
// > 5. C
// > 6. D
```

### Dictionaries

#### Adding pairs / Updating values / Removing pairs
```swift
var bobData = ["name": "Bob", "profession": "Card Player", "country": "USA"]
//Adding
bobData.updateValue("CA", forKey: "state")
bobData["city"] = "San Francisco"

//Updating
bobData.updateValue("Bobby", forKey: "name")
bobData["profession"] = "Mailman"

//Removing
bobData.removeValue(forKey: "state")
bobData["city"] = nil
```

#### Iterating

```swift
for (player, score) in namesAndScores {//key and value
  print("\(player) - \(score)")
}
for player in namesAndScores.keys {//only key
  print("\(player), ", terminator: "") // no newline
}
print("") // print one final newline
```

### Sets

> A set is an unordered collection of unique values of the same type.

#### Creating sets

Sets don't have their own literals. We use **array literals** to create a set with initial values.

```swift
var someSet: Set<Int> = [1, 2, 3, 1]
print(someSet)
// > [2, 3, 1]
```

As you see, there is no specific ordering and the values are unique.


### Collection Iteration with Closures

#### Closures basics

```swift
//Declaration
var multiplyClosure: (Int, Int) -> Int

//Assign a closure to a variable
multiplyClosure = { (a: Int, b: Int) -> Int in
  return a * b
}
//Use
let result = multiplyClosure(4, 2)

//Shorthand syntax
multiplyClosure = { (a: Int, b: Int) -> Int in
  a * b
}
//or
multiplyClosure = { (a, b) in
  a * b
}
//or
multiplyClosure = {
  $0 * $1
}
```

Further more, if the parameter list is much longer it can be confusing to remember. We can use the named syntax.

```swift
func operateOnNumbers(_ a: Int, _ b: Int, operation: (Int, Int) -> Int) -> Int {
  let result = operation(a, b)
  print(result)
  return result
}

//and then

let addClosure = { (a: Int, b: Int) in
  a + b
}
operateOnNumbers(4, 2, operation: addClosure)
```

Closures are simply functions without names. So we can also pass in a function as the parameter, like so:

```swift
func addFunction(_ a: Int, _ b: Int) -> Int {
  return a + b
}
operateOnNumbers(4, 2, operation: addFunction)

```

or even, define the closure inline with the function call, so no need to define the closure and assign it to a local variable or constant. Just simply declare the closure right whre you pass it into the function as a parameter! like this:

```swift 
operateOnNumbers(4, 2, operation: { (a: Int, b: Int) -> Int in
  return a + b
})
//Shorthand syntax
operateOnNumbers(4, 2, operation: { $0 + $1 })
//or
operateOnNumbers(4, 2, operation: +)
//or move to outside of the function call
operateOnNumbers(4, 2) {//This is called trailing closure syntax.
  $0 + $1
}
```

#### Closures with no return value

```swift
let voidClosure: () -> Void = {
  print("Swift Apprentice is awesome!")
}
voidClosure()
```

The closure's type is `() -> Void`. No parameters, no return type (But you must declare a return type)

```swift
func countingClosure() -> () -> Int {
  var counter = 0
  let incrementCounter: () -> Int = {
    counter += 1
    return counter
  }
  return incrementCounter
}

let counter1 = countingClosure()
let counter2 = countingClosure()

counter1() // 1
counter2() // 1
counter1() // 2
counter1() // 3
counter2() // 2
//The two counters are mutually exclusive and count independently.
```

This function taks no parameters and returns a closure. The closure it returns an *Int*.

The closure returned from this function will increment its internal counter each time it is called. Each time you call this function you get a different counter.

#### Custom sorting with closures

Sorting

```swift
let names = ["ZZZZZZ", "BB", "A", "CCCC", "EEEEE"]
let sortedByLength = names.sorted {
  $0.count > $1.count
}
sortedByLength //["ZZZZZZ", "EEEEE", "CCCC", "BB", "A"]
```

Functional

```swift
var prices = [  1.5, 10, 4.99, 2.30, 8.19]

//func filter(_ isIncluded: (Element) -> Bool) -> [Element]
let largePrices = prices.filter {
  return $0 > 5
}//[10, 8.19] // new array

let salePrices = prices.map {
  return $0 * 0.9
}//[1.35, 9, 4.491, 2.07, 7.371]

let userInput = ["0", "11", "haha", "42"]

let numbers1 = userInput.map {
  Int($0)//it's optional
}//[{some 0}, {some 11}, nil, {some 42}]

//flatMap will filter out the invalide values
let numbers2 = userInput.flatMap {
  Int($0)
}//[0, 11, 42]

```

```swift
//reduce takes a starting value and a closure. 
//The closure takes two values: the current value and an element from the array. 
//The closure returns the next value that should be passed into the closure as the current value parameter.

let sum = prices.reduce(0) {
  return $0 + $1
}//26.98

let stock = [1.5: 5, 10: 2, 4.99: 20, 2.30: 5, 8.19: 30]
let stockSum = stock.reduce(0) {
  return $0 + $1.key * Double($1.value)
}//384.5

//reduce(into:_:)
let farmAnimals = ["🐎": 1, "🐄": 2, "🐑": 3, "🐶": 1]
let allAnimals = farmAnimals.reduce(into: []) {
  (result, this: (key: String, value: Int)) in
  for _ in 0 ..< this.value {
    result.append(this.key)
  }
}//["🐎", "🐑", "🐑", "🐑", "🐄", "🐄", "🐶"]
```

#### Others

```swift
var prices = [  1.5, 10, 4.99, 2.30, 8.19]
let removeFirst = prices.dropFirst()//[10, 4.99, 2.3, 8.19]
let removeFirstTwo = prices.dropFirst(2)//[4.99, 2.3, 8.19]

let removeLast = prices.dropLast()//[1.5, 10, 4.99, 2.3]
let removeLastTwo = prices.dropLast(2)//[1.5, 10, 4.99]

let firstTwo = prices.prefix(2)//[1.5, 10]
let lastTwo = prices.suffix(2)//[2.3, 8.19]
```

### Strings

> strings are collections.

#### Indexing strings

```swift
let cafeCombining = "cafe\u{0301}"
let firstIndex = cafeCombining.startIndex // type is String.Index
let firstChar = cafeCombining[firstIndex]//"c"

let lastIndex = cafeCombining.index(before: cafeCombining.endIndex)
let lastChar = cafeCombining[lastIndex]//"é"
```

#### Strings as bi-directional collections

```swift
let name = "Matt"
let backwardsName = name.reversed()//Type is ReversedCollection<String>
let secondCharIndex = backwardsName.index(backwardsName.startIndex, offsetBy: 1)//Type is ReversedIndex<String>
let secondChar = backwardsName[secondCharIndex]//"t"

let backwardsNameString = String(backwardsName)//"ttaM"
```

#### Substrings

```swift
let fullName = "Matt Galloway"
let spaceIndex = fullName.index(of: " ")!
let firstName = fullName[..<spaceIndex]//"Matt"
let lastName = fullName[fullName.index(after: spaceIndex)...]//"Galloway"  Type is String.SubSequence
let lastNameString = String(lastName)"Galloway"
```


## Building Your Own Types

### Generics

**Type constraints**

There are two kinds of constraints. The simplest kind of type constraint looks like this:

```swift
class Cat {
  var name: String
  
  init(name: String) {
    self.name = name
  }
}

class Dog {
  var name: String
  
  init(name: String) {
    self.name = name
  }
}

protocol Pet {
  var name: String { get }  // all pets respond to a name
}
extension Cat: Pet {}
extension Dog: Pet {}

class Keeper<Animal: Pet> {
  var name: String
  var morningCare: Animal
  var afternoonCare: Animal
  
  init(name: String, morningCare: Animal, afternoonCare: Animal) {
    self.name = name
    self.morningCare = morningCare
    self.afternoonCare = afternoonCare
  }
}

let cats = ["Miss Gray", "Whiskers", "Sleepy"].map { Cat(name: $0) }
let dogs = ["Sparky", "Rusty", "Astro"].map { Dog(name: $0) }
let pets: [Pet] = [Cat(name: "Mittens"), Dog(name: "Yeller")]

//This method handles a array of type *Pet* that can mix *Dog* and *Cat* elements together.
func herd(_ pets: [Pet]) {
  pets.forEach {
    print("Come \($0.name)!")
  }
}

//Handles arrays of any kind of *Pet*, but they all need to be of a single type.
func herd<Animal: Pet>(_ pets: [Animal]) {
  pets.forEach {
    print("Here \($0.name)!")
  }
}

//Handles dogs and only dogs (or subtypes of dogs)
func herd<Animal: Dog>(_ dogs: [Animal]) {
  dogs.forEach {
    print("Here \($0.name)! Come here!")
  }
}

herd(dogs)
herd(cats)
herd(pets)

//output:
//Here Sparky! Come here!
//Here Rusty! Come here!
//Here Astro! Come here!
//Here Miss Gray!
//Here Whiskers!
//Here Sleepy!
//Come Mittens!
//Come Yeller!
```

You can restrict what kinds of types are allowed to fill the type parameter. *type constraints*

The second kind of type constraint in volves making explicit assertions that a type parameter, or its associated type, must equal another parameter or one of its conforming types.

```swift
extension Array where Element: Cat {
  func meow() {
    forEach { print("\($0.name) says meow!") }
  }
}

// dogs.meow() // error: 'Dog' is not a subtype of 'Cat'
cats.meow()
```









