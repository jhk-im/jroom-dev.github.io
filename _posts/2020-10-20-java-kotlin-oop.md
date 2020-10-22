---
title: Java와 Kotlin을 비교하면서 알아보는 객체지향 프로그래밍(OOP) - Class
category: JavaAndKotlin
tags:
- OOP
---

참고자료   
[https://opentutorials.org/course/743/6553](https://opentutorials.org/course/743/6553)
[https://wikidocs.net/214](https://wikidocs.net/214)
[https://kotlinlang.org/docs/reference/classes.html](https://kotlinlang.org/docs/reference/classes.html)
[https://gmlwjd9405.github.io/2018/09/17/class-object-instance.html](https://gmlwjd9405.github.io/2018/09/17/class-object-instance.html)

## Class 
```
// java
class Car {}

// kotlin 
class Car {}
```
가장 간단한 형태의 클래스이다. 자바와 코틀린의 문법상의 차이는 없다. (현재까지는..)   
클래스의 선언만 있고 내용은 없는 껍데기 클래스이다. 하지만 이러한 껍데기라도 중요한 기능을 가지고 있다.  객체를 생성하는 기능이다.   
다음과 같이 만들 수 있다.   

```
//java
Car car = new Car();

//kotlin
val car = Car() 
```
코틀린에선 new 키워드가 없다는 차이점이 있다.  또한 val 이란 키워드를 사용하고 이는 생성된 객체가 불변(immutable type)임을 명시하는 것인데 여기선 아직 중요하지 않으니 넘어가도록 하자.   

! 여기서 `Car()`는 Class 이고 `car`는 객체이며 instance 이다. 객체(object)와 instance는 흡사하지만 차이점이 있다. 위에서 생성된 `car`라는 객체는 `Car()` 클래스의 instance이다. instance는 특정 객체가 어떤 클래스의 객체인지를 설명할 때 사용된다.    
* `car`는 객체이다.   
	* 구현할 대상이자 생성 된 실체 (추상적개념의 원본)   
* `car`는 `Car()`의 instance이다.   
	* 설계를 바탕으로 구현된 구체적인 실체   
		* 객체를 실체화 한 것   
		* 실체화 된 인스턴스는 메모리에 할당된다.    
		* 추상적 개념의 원본으로 부터 생성 된 `복제본`   

## 객체 변수 (Instance variable)
`Car()` 라는 껍데기 클래스에 의해 생성된 `car` 객체에 이름을 붙여주자.   
```
//java 
class Car {
  String name;
}

//kotlin
class Car {
  var name: String = "Tucsan"
}
```
클래스 내부에 선언된 변수를 객체변수(or 멤버변수) 라고 부른다.  코틀린에선 var 키워드로 객체가 가변 (mutable type)임을 명시한다.  String으로 선언이 되어있기 때문에 "Tucsan"과 같이 객체를 초기화 해야 에러가 발생하지 않는다. 반면 자바에선 초기화하지 않아도 된다.   

! NullPointException   
위처럼 자바에선 객체의 기본값 초기화를 강제하지 않는다. 이는 NullPointException이 발생할 확률이 높아지며 이를 대처해야한다. try catch를 활용하여 대처하는데 이는 소스코드의 양이 많아지게 되며 유지보수시 어려움을 겪게 된다.  코틀린은 변수에 대하여 어떤 값을 가지고 어떤 값이 바뀔 여지가 있는지 고민하여 코드를 작성하게 도와주어 NullPointException을 막는다. 변수에 값을 초기화하지 않으면 에러가 발생하는 것처럼.   

!객체 변수에 접근하는 방법   
```
// java 
Car car = new Car();
system.out.println(car.name)

result : null

// kotlin
var car = Car()
println(car.name)

result : Tusan 
```

## 메소드 (method)
객체 변수에 값을 대입하여 보자. 다양한 방법이 있지만 일반적으로 메소드를 활용한다. 메소드는 클래스 내에 구현된 함수를 의미한다.    
```
// java
class Car {
  String name;
  public void setName(String name) {
    this.name = name;
  }
}

//main 
Car car = new Car();
car.setName("Avante");
system.out.println(car.name); 

result : Avante

// kotlin
class Car {
  var name: String = ""
}

//main
var car = Car()
car.name = "Tucsan"
println(car.name)

result : Tusan
```
자바에서 구현한 `setName()` 메소드는 객체지향에서 클래스내부에 기본적으로 구현하게 되는 getter/setter 메소드중 setter에 속하는 메소드이다. 멤버 변수에 직접적으로 접근하여 변경하는 것이 아니라 `car.setName("Avante")` 처럼 setter 메소드를 통해 접근하여 값을 지정하는 것이다. 반면 코틀린에선 변수 선언시 컴파일러에서 자동으로 get/set 함수를 생성하여 `car.name = "Tusan"` 처럼 값을 바로 입력할 수 있다.   


## 객체 변수는 공유되지 않는다 
다음의 예를 살펴보자.
```
// java
Car avante = new Car();
avante.setName("Avante")
Car tucsan = new Car();
tucsan.setName("Tucsan")
System.out.pirntln(avante.name)
System.out.println(tucsan.name)

result :
Avante
Tucsan

// kotlin
var avante = Car()
avante.name = "Avante"
var tucsan = Car()
tucsan.name = "Tucsan"
println(avante.name)
println(tucsan.name)

result : 
Avante
Tucsan
```
