---
title: Data structure - Kotlin Collections Overview
category: programming-theory
tags:
- Kotlin
- DataStructure
- KotlinDocs
---

참고자료   
[https://www.tutorialspoint.com/data_structures_algorithms/index.html](https://www.tutorialspoint.com/data_structures_algorithms/index.html)

코틀린 학습 + 영어 공부를 위해 kotlin 가이드 문서를 번역함   

## Kotlin Collections Overview
코틀린 표준 라이브러리는 항목 그룹으로 구성된 컬렉션 관리를 위한 포괄적 도구 세트를 제공하며, 이러한 툴은 해결된 문제에 대한 중요성을 공유하고 공통적으로 운영된다.   

컬렉션은 일반적으로 동일한 유형의 여러 객체를 포함한다.    

컬렉션안의 객체(object)를 요소(elements) 또는 items라고 한다.    

예를들어, 한 학과의 모든 학생들은 그들의 평균 나이를 계산하는 데 사용될 수 있는 컬렉션을 형성한다. 다음 컬렉션 유형은 kotlin과 관련있다.    

* List   

List는 지수(indices) - integer numbers(위치를 반영하는 정수)에 의해 요소(elements)에 접근할 수 있는 순서형 집합이다. elements는 list에서 두개 이상 존재할 수 있다. List의 예는 문장이다. 문장은 단어들의 그룹이며, 순서가 중요하며, 반복될 수 있다.    

* Set   

Set은 unique elements의 컬렉션이다. 집합(set)의 수학적(mathematical) 추상화(abstraction)를  반영(reflects) 한다.  반복없는 객체의 그룹.  일반적으로, 집합 요소(set elements)의 순서는 의미(significance)가 없다. 예를들면, 알파벳은 글자의 집합이다.  (set of letters)   

* Map(or dictionary)    

Map은 key-value 쌍(pairs)의 집합이다. key는 unique이며 각각은(each of them) 정확히 하나의 값에 maps한다. 값은 중복(duplicates)될수 있다. 객체 사이에서 논리적 연결을(logical connections) 저장하는데(storing) 유용하다(useful). 예를들면 종업원(employee)의 ID와 position처럼.   

코틀린은 컬랙션에 저장된 객체의 정확한 타입의 독립적 컬렉션을  다루도록 해준다.즉,  정수 혹은 사용자 정의(user-defined)같은 방법으로 문자열 목록에 추가한다. kotlin standard library는 모든 타입의 컬렉션을 만들고 채우고 관리하기 위한 일반적인 인터페이스, 클래스, 함수를 제공한다.   

컬렉션 인터페이스와 관련된(related) 함수는 kotlin.collections.package.에 위치한다.    

## Collection types

코틀린 표준 라이브러리는 set, list, map과 같은 기본 컬렉션 타입의 구현(implementations)을 제공한다.   

* 컬렉션 elements에 accessing하기 위한 작업을(operations) 제공하는 read-only interface.   

* 해당(corresponding) read-only interface를 쓰기 작업으로 확장(extends)하는 변경가능한(mutable) interface.   

참고로 (Note that) mutable collection을 변경할 때 var이 요구되지 않는다. 쓰기 작업에서 동일한 mutable collection 객체를 수정(modify)하여 참조가 변경되지 않도록 해야한다.  val 컬렉션을 재할당(reassign) 하면 컴파일 에러가 발생한다.   

```
val numbers = mutableListOf("one", "two", "three", "four")   
numbers.add("five")   // this is OK    
//numbers = mutableListOf("six", "seven")      // compilation error   
```
read-only 컬렉션 type은 공변한다. 이것의 의미는 만약 직사각형 클래스가 shape에서 상속(inherits)되면,  `List<Shape>`가 요구된 모든 곳에서 `List<Rectangle>` 을 사용할 수 있다는 것이다. 즉, 컬렉션 타입은  elements 타입과 같은 'subtyping(하위형식)' 관계를 갖는다. map은 값 유형은 공변하지만 key 유형은 공변하지 않는다.   

다시 말하면(In turn), mutable collections 는 공변하지 않는다. 그렇지 않으면(otherwise), runtime failures로 이어질 수 있다. 만약  `MutableList<Rectangle>`가 `MutableList<Shape>` 의 subtype 이라면 다른 Shape 상속(예를들어 Circle)을 삽입하면 사각형 type의 argument를 (이와같이) 위반할 수 있다.   

#### Diagram of the Kotlin collection interface   
![collection diagram](/assets/images/screenshot/collections-diagram.png)
출처 : [https://www.tutorialspoint.com/data_structures_algorithms/index.htm](https://www.tutorialspoint.com/data_structures_algorithms/index.htm)

각 인터페이스와 구현에 대하여 알아보자.

## Collection 
`Collection<T>` 는 collection 계층(hierarchy)의 root이다. retrieving size(사이즈 검색), item membership checking 등등  read-only collection의 일반적인 행동(common behavior)에 해당하는 인터페이스이다. Collection은  반복 요소 작업을 정의(defines)하는 `Iterable<T>`인터페이스로 부터 상속받는다.  Collection을 다른 collection types 에서 사용하는 함수의  paramiter로 사용할 수 있다. 더 구체적인 경우는 컬렉션의 상속인 List와 Set을 사용한다.
```
fun printAll(strings: Collection<String>) {
        for(s in strings) print("$s ")
        println()
    }
    
fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)
    
    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}

result : 
one two one 
one two three 
```

`MutableCollection` 은 `add`와 `remove`와 같은 쓰기 작업이 있는 Collection이다.   
```
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // throwing away the articles
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}

result :
[ago, in, far, far]
```

## List
`List<T>`는 명시된(specified) 순서대로 요소를 저장하고 요소에 대한 indexed access 를 제공한다.  index의 첫번째 element 0 부터 시작하여 마지막  index까지(list.size - 1)   
```
val numbers = listOf("one", "two", "three", "four")
println("Number of elements: ${numbers.size}")
println("Third element: ${numbers.get(2)}")
println("Fourth element: ${numbers[3]}")
println("Index of element \"two\" ${numbers.indexOf("two")}")

result : 
Number of elements: 4
Third element: three
Fourth element: four
Index of element "two" 1
```

List elements (null 포함)는 복제 (duplicate) 할수있다. (List는 다른 동일한 객체 혹은 단일 객체의 발생 횟수를 포함할 수 있다.)   
두개의 List는 만약 크기가 같거나 구조적(structurally)으로 같은 요소가 같은 position에 있을 경우 동등하다고 간주된다(considered).   
```
val bob = Person("Bob", 31)
val people = listOf(Person("Adam", 20), bob, bob)
val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
println(people == people2)
bob.age = 32
println(people == people2)

result : 
true
false
```

`MtableList<T>`는 예를들어 특정 position에서 특정(specific)요소를 추가하거나 제거하는 특정 리스트 쓰기작업을 하는 List이다.   
```
val numbers = mutableListOf(1, 2, 3, 4)
numbers.add(5)
numbers.removeAt(1)
numbers[0] = 0
numbers.shuffle()
println(numbers)

result : 
[4, 5, 0, 3]
```

보는것과 같이(As you see) 어떤 측면(aspects)에서 list는 array와 매우 유사(similar)하다. 그러나, Array의 크기는 초기화(initialization)에서 정의되며 절대 변경되지 않지만 List는  미리 정의된(predefined) 크기를 가지지 않으며 list의 크기는 elements의 추가,변경, 삭제와 같은 쓰기작업의 결과로 변경될수 있다는 하나의 중요한 차이점이 있다.

## Set
`Set<T>`는 일반적으로 정의되지 않은 (generally undefined) unique elements를 저장한다. null elements도 unique 하다. (Set은 하나의 null만 포함할 수 있기 때문) 두개의 Sets은 같은 크기라면 동일하며, 하나의 Set의 각각의 element는 다른 Set안의 element와 동일하다.   
```
val numbers = setOf(1, 2, 3, 4)
println("Number of elements: ${numbers.size}")
if (numbers.contains(1)) println("1 is in the set")

val numbersBackwards = setOf(4, 3, 2, 1)
println("The sets are equal: ${numbers == numbersBackwards}")

result : 
Number of elements: 4
1 is in the set
The sets are equal: true
```

`MutableSet`은 `MutableCollection`의 쓰기 작업이 있는 Set이다.  `LinkedHashSet`의 기본 구현은 elements의 삽입  순서를 보존한다.  이런 이유로(Hence), first() 혹은 last() 처럼  순서에 의존(rely)하는 함수는 set에서 예측할수있는(predicatable) 결과를  반환한다.    
```
val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
val numbersBackwards = setOf(4, 3, 2, 1)

println(numbers.first() == numbersBackwards.first())
println(numbers.first() == numbersBackwards.last())

result : 
false
true
```

대체가능한(alternative) 구현인 `HashSet`은 elements 순서에 대하여 아무 말도 하지 않는다. 그래서 그러한 함수를 호출하면 예측할 수 없는(unpredicatable) 결과를 반환한다. 하지만 `HashSet`은 같은 elements 수를 저장하는데 적은 메모리를 요구한다.

## Map
`Map<K, V>`는 Collection 인터페이스 상속자(inheritor)가 아니다. 하지만,  Kotlin 컬렉션 타입이다. `Map`은 key-value 쌍(혹은 항목 entires)을 저장한다. key는 unique 하지만 다른 키는 e동일한 값으로 짝을 지을 수있다(can be paired). `Map` 인터페이스는 key에 의한 value access, key와 value 의 검색 등의 구체적인(specific) 함수를 제공한다.   
```
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)

println("All keys: ${numbersMap.keys}")
println("All values: ${numbersMap.values}")
if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
if (1 in numbersMap.values) println("The value 1 is in the map")
if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous

result : 
All keys: [key1, key2, key3, key4]
All values: [1, 2, 3, 1]
Value by key "key2": 2
The value 1 is in the map
The value 1 is in the map
```
같은 쌍을 포함하는(containing) 두개의 map은 쌍의 순서와 관계없이(regardless) 동일하다.   
```
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)

result : 
println("The maps are equal: ${numbersMap == anotherMap}")
The maps are equal: true
```

`MutableMap`은 쓰기작업이 포함된 Map이다. 예를들어 새로운 key-value 쌍을 추가하거나 지정된 키(given key)와 관련된 값을 update 할 수 있다.   
```
val numbersMap = mutableMapOf("one" to 1, "two" to 2)
numbersMap.put("three", 3)
numbersMap["one"] = 11

println(numbersMap)

result : 
{one=11, two=2, three=3}
```

Map의 기본 구현인 `LinkedHashMap`은 Map이 반복될 때  요소의 삽입 순서를 보존한다. 다시말해 (in turn) 대체 구현(alternative implementation)인 `HashMap` 은 순서를 보존하지 않는다.
