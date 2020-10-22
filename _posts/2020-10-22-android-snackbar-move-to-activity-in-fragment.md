---
title: android snackbar & move to activity in fragment
category: android-ui
tags:
- AndroidUI
- Kotlin
---

참고자료   
[https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin](https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin)
[https://developer.android.com/training/snackbar/action?hl=ko](https://developer.android.com/training/snackbar/action?hl=ko)

<p float="center">
  <img src="/assets/images/gif/2020-10-2216-28.gif" width="300" />
</p>

## util/ViewExt.kt
```
fun View.showSnackbar(snackbarText: String, timeLength: Int) {
    Snackbar.make(this, snackbarText, timeLength).run {
        addCallback(object : Snackbar.Callback() {
            override fun onShown(sb: Snackbar?) {
                EspressoIdlingResource.increment()
            }
    
            override fun onDismissed(transientBottomBar: Snackbar?, event: Int) {
                EspressoIdlingResource.decrement()
            }
        })
        show()
    }
}
```
* snackbar는 위 예제 gif에서 login 선택 시 아래에 등장하는 메시지 이다.   
* Toast와 함께 안드로이드에서 제공하는 기능이다 .   
* 매번 Snackbar.make()로 필요한 곳에서 구현해도 문제는 없다.   
	* ui test를 위한 EspressoIdlingResource 를 셋팅해야 하기 때문에 코드가 길어진다.
		* 프로젝트 전역에서 손쉽게 사용하기 위해 ViewExt.kt 를 만들고 그안에 함수만 구현해 두는 방식이다.   
		* showSnackbar("Hello", Snackbar.LENGTH_SHORT) 처럼 메시지와 표시될 시간만 지정해 두어 코드 길이를 줄일 수 있다.   
* View.showSnackbar 로 등록되기 때문에 어느곳에서든 view를 가지고있다면 호출하여 사용 가능하다.   
## IntroSwipeFragment.kt 
```
...

   MotionEvent.ACTION_UP -> {
                    when {
                        button.y < (parentHeight * 0.1f) - status -> {
                            button.visibility = View.GONE
                            view?.showSnackbar("Coming soon ...", Snackbar.LENGTH_SHORT)
                        }
            
                        button.y > (parentHeight * 0.9f) - status -> {
                            val intent = Intent(activity, MainActivity::class.java)
                            startActivity(intent)
                            activity?.overridePendingTransition(R.anim.fadein, R.anim.fadeout)
                            activity?.supportFragmentManager?.beginTransaction()?.remove(this)
                                ?.commit()
                            activity?.finish()
                        }
                    }
...
```

* 표시되는 순간이 중앙 로고를 스와이프 하여 Login 텍스트에 가져다 놯을때이다.   
	* 위에 선언한 메소드를 fragment 내부의 view를 통해 호출하여 사용가능하다.   
	* `view?.showSnackbar("Comming soon ...", Snackbar.LENGTH_SHORT)` 와 같이 한줄로 snackbar 구현이 가능하다.   

* activity가 전환되는 부분은 로고를 스와이프 하여 GUEST 텍스트에 가져다 놯을 때이다.   
	* Intent를 사용해 activity 전환 로직을 구현한다.   
	* `activity?.supportFragmentManager?.beginTransaction()?.remove(this)?.commit()`
		* guset text에 중앙로고를 가져돠 놓고 액티비티가 전환되는 과정에서 애니메이션 효과를 넣었다.   
		* 약간의 딜레이가 생기기 때문에 중앙로고가 다시 표시되기 때문에 activity를 통해 현재 프래그먼트 자체를 없애는 로직이다.
