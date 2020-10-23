---
title: Data Binding in Android Example
Category: android-kotlin
tags:
- Kotlin
- MVVM
- AndroidUI
---

<p float="center">
  <img src="/assets/images/gif/2020-10-2323-36.gif" width="300" />
</p>

Data Binding 예제를 정리한 글   

참고자료   
[Data Binding - 공식문서](https://developer.android.com/topic/libraries/data-binding?hl=ko)   
[Data Binding - Example](https://codelabs.developers.google.com/codelabs/android-databinding?hl=ko#0)
## Data Binding
<p float="center">
<img src="/assets/images/png/dataBinding.png"  width="100%"/>
</p>
`DataBinding` 라이브러리는 XML 레이아웃의 UI 구성요소를 선언적 형식을 사용하여 데이터 소스에 바인딩할 수 있도록 하는 `Android Jetpack` 라이브러리이다.   
해당 예제는 정적 데이터와 일부 관측 가능한 데이터를 보여주는 하나의 화면을 가지고 있다. 데이터가 바뀌면 UI가 자동으로 업데이트 된다. 데이터는 `ViewModel`에서 제공된다. `MVVM` (Model / View / ViewModel) 은 Data Binding과 잘 어울리는 프레젠테이션 계층 패턴이다.

## Data Binding Example
해당 예제는 총 6가지로 구현되어있다. 처음에는 `ViewModel` 만 사용하여 구현하였고 점차 `DataBinding`과 `LiveData` 가 추가되면서 `MVVM`의 모습을 갖추어 간다.  추가되는 기능들이 어떤 변화를 주는지 제대로 파악하는것이 목표이다.    
   
처음에는 `ViewModel`이 간략하게  정의되어있다.   
```
// ViewModel

class SimpleViewModel : ViewModel() {
    val name = "Grace"
    val lastName = "Hopper"
    var likes = 0
        private set // This is to prevent external modification of the variable.

    fun onLike() {
        likes++
    }

    val popularity: Popularity
        get() {
            return when {
                likes > 9 -> Popularity.STAR
                likes > 4 -> Popularity.POPULAR
                else -> Popularity.NORMAL
            }
        }
}

enum class Popularity {
    NORMAL,
    POPULAR,
    STAR
}
```
-  페이지의 데이터가 구현되어있다.   
	-  name, lastName, likes
-  enum => NORMAL, POPULAR, START 
	-  likes 가 올라갈 때 마다 이미지가 변경될때 지정되는 enum type   
- onLike()   
	- like를 1씩 추가하는 메소드   

##### DataBindingActivity.kt 
`XML`+ `Activity` + `ViewModel`로 구현되어있다.   
```
// DataBindingActivity.kt

private val viewModel by lazy { ViewModelProvider(this).get(SimpleViewModel::class.java) }
```
- SimpleViewModel로 `ViewModel` 인스턴스를 생성한다.   


```
// DataBindingActivity.kt 

fun onLike(view: View) {
        viewModel.onLike()
        updateLikes()
    }

   private fun updateName() {
        findViewById<TextView>(R.id.plain_name).text = viewModel.name
        findViewById<TextView>(R.id.plain_lastname).text = viewModel.lastName
    }

   private fun updateLikes() {
        findViewById<TextView>(R.id.likes).text = viewModel.likes.toString()
        findViewById<ProgressBar>(R.id.progressBar).progress =
            (viewModel.likes * 100 / 5).coerceAtMost(100)
        val image = findViewById<ImageView>(R.id.imageView)

        val color = getAssociatedColor(viewModel.popularity, this)

        ImageViewCompat.setImageTintList(image, ColorStateList.valueOf(color))

        image.setImageDrawable(getDrawablePopularity(viewModel.popularity, this))
    }
```
- onLike(), updateName(), updateLikes() 모두 ui 데이터를 업데이트 하는데 사용되는 메소드다.   
	- `findViewById` 가 자중 사용된다.   
	-  updateLikes() 에서는 likes 숫자와 이미지 종류 + 색상까지 update 해야하므로 코드줄이 길어졌다.

```
// DataBindingActivity.kt

    private fun getAssociatedColor(popularity: Popularity, context: Context): Int {
			. . .
    }

    private fun getDrawablePopularity(popularity: Popularity, context: Context): Drawable? {
			. . .
    }
```
- 여기에 UI controller의 본분 UI를 표시하는 부분까지 만들어주어야 한다.   
- 좋은코드인지 나쁜코드인지를 판별하기 보다는 현재의 코드에서 어떠한 부분들이 개선되는지를 살펴보는데 집중하도록 하자.   

#### SolutionActivity1.kt
이제 `DataBinding`을 추가해보자.   
우선 builde.gradle에 다음을 추가하여 dataBinding을 활성화한다.   
```
//build.gradle

...

android {
  buildFeatures {
    dataBinding true
  }
}
...
```
이제 `XML` 을 수정해보자.   
```
// activity_solution1.xml

<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">

    <data>

        <variable
            name="name"
            type="String"/>

        <variable
            name="lastName"
            type="String"/>
    </data>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">
				
				...
    </androidx.constraintlayout.widget.ConstraintLayout>
</layout>
				
```
- SolutionActivity1.kt의 레이아웃으로써 `ConstraintLayout` 이다.   
- 레이아웃을 `DataBinding`으로 변환하려면 `<layout></layout>` 태그로 감싸야 한다.   
- `<data></data>` 내부에 변수를 선언할 수 있고 다음과 같이 사용 가능하다.   
```
// Some examples of complex layout expressions
android:text="@{String.valueOf(index + 1)}"
android:visibility="@{age < 13 ? View.GONE : View.VISIBLE}"
android:transitionName='@{"image_" + id}'
```
	- 레이아웃 내부에서 형변환을 구현   
	- 조건문을 레이아웃 내부에 구현   
	- 레이아웃 내부에서 데이터를 유동적으로 변경

!! 해당 기능은 많은 도움이 되지만 너무 복잡한 논리가 레이아웃 내부에 있으면 가독성이 떨어지며 유지보수를 어렵게 할 수 있다. 적절히 사용한다면 다음과 같은 이점을 얻을 수 있다.   
- 앱의 성능 향상   
- 메모리 누수 및 Null 포인터 예외 방지   
- UI 프레임워크 호출을 제거하여 활동 코드 간소화   

해당 예제는 다음과 같은 방식으로 `DataBindidng`을 활용한다.     
```
Android:text="@{viewmodel.name}"
Android:visibility="@{viewmodel.nameVisible}"
Android:onClick="@{() -> viewmodel.onLike()}"
```

이제 `Activity`를 수정해보자.   
```
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_solution1)

        val binding: ActivitySolution1Binding =
            DataBindingUtil.setContentView(this, R.layout.activity_solution1)

        binding.name = "Ada"
        binding.lastName = "Lovelace"

        updateLikes()
    }
```
- 변동된 사항은 거의없고 onCreate() 내부에 `ActivitySolution1Binding`이라는 객체의 인스턴스를 생성하는 코드만 늘어났다.   
	- `ActivitySolution1Binding`은 `activity_solution.xml`을 `<layout>/layout>`으로 감싸면서 `dataBinding`이 자동으로 생성한 객체이다.   
- 코드만 늘어난거 아닌가?   
	- `binding.name = "Ada"` 보면 `dataBinding` 객체의 인스턴스를 얻는것만으로 내부에 있는 데이터를 변경할 수 있게 되었다.   
		- 큰 변화는 아니지만 이러한 변화가 어떤 유용함을 가져다 주는지 다음 solution을 통해 알아보도록 하자.   

#### SolutionActivity2.kt 
우선 `XML`을 다음과 같이 변경한다.   

```
...
    <data>

        <variable
            name="viewmodel"
            type="com.example.androidsamples.dataBinding.data.SimpleViewModel"/>
    </data>			
...
        <TextView
            android:id="@+id/plain_name"
            ...
            android:text="@{viewmodel.name}" />
				
        <TextView
            android:id="@+id/plain_lastname"
            ...
            android:text="@{viewmodel.lastName}"/>
       
			 <Button
			     android:id="@+id/like_button"
					 ...
					 android:onClick="@{() -> viewmodel.onLike()}" />
...
...
```
- 레이아웃 표현식은 @기호로 시작하여 {} 내부에 작성한다.   
- `<data></data>` 내부에 `ViewModel` 자체를 객체로 작성하였다.   
	- `TextView`에 변경되는 로직을 관리하는 권한이 `Activity`에서 `ViewModel`로 변경되었다.    
		-  `@{name}`에서 `@{viewmodel.main}`으로 변경되었다.   
	- Button 의 onClick설정이 `@{() -> viewmodel.onLike()}`으로 변경되었다.   
		- onLike() 메소드의 위치가 `Activity`에서 `ViewModel`로 변경되었다.   

`Activity`변동사항   
```
//onCreate()
...
    val binding: ActivitySolution2Binding=
    DataBindingUtil.setContentView(this, R.layout.activity_solution2)

    binding.viewmodel = viewModel
...
```
- `setContentView(R.layout.activity_data_binding)`가 완전히 사라지고 `DataBinding`으로 변경되었다.   
-  onLike() 함수가 사라지고 `ViewModel`내부에 구현되었으며 `xml`에서 사용한다.   
- `DataBinding`객체로 레이아웃 데이터에 접근 할 수 있게되었지만 그 과정을 `ViewModel`을 통해서 해야한다.   
	- 이렇게 점차 `Activity`와 `ViewModel`은 분리되어간다.   

!! 아직 위 코드는 작동하지않는다. 정확히 말하면 `XML`의 버튼의 onClick이 작동하지 않는다.  다음 솔루션에서 해당 내용을 구현한다.   

#### SolutionActivity3.kt
`ViewModel` 변경 사항   
`XML`    
`Activity`   
여기부터 정리
