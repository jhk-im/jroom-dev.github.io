---
title: android swipe - 터치 좌표를 따라서 view 이동하기
category: android-ui
tags:
- AndroidUI
- AnroidAnimation
---

참고자료
[https://sunghyun1038.tistory.com/24](https://sunghyun1038.tistory.com/24)
[https://developer.android.com/training/gestures/viewgroup?hl=ko](https://developer.android.com/training/gestures/viewgroup?hl=ko)
[https://developer.android.com/guide/topics/graphics/prop-animation?hl=ko](https://developer.android.com/guide/topics/graphics/prop-animation?hl=ko)

<p float="center">
  <img src="/assets/images/gif/2020-10-2200-42.gif" width="300" />
</p>

## fragment_main_swipe.xml   
```
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/intro_cl"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        style="@style/Text.RankStyle"
        android:id="@+id/intro_login_text"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:gravity="center"
        android:text="@string/login"
        android:textSize="20sp"
        android:visibility="gone"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <com.airbnb.lottie.LottieAnimationView
        android:id="@+id/intro_swipe_up"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="10dp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@+id/intro_logo"
        app:lottie_autoPlay="true"
        app:lottie_loop="true"
        app:lottie_rawRes="@raw/main_swipe_up"/>

    <com.airbnb.lottie.LottieAnimationView
        android:id="@+id/intro_cursor"
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:layout_marginTop="30dp"
        app:layout_constraintBottom_toBottomOf="@id/intro_logo"
        app:layout_constraintLeft_toLeftOf="@id/intro_logo"
        app:layout_constraintRight_toRightOf="@id/intro_logo"
        app:layout_constraintTop_toTopOf="@id/intro_logo"
        app:lottie_autoPlay="true"
        app:lottie_loop="true"
        app:lottie_rawRes="@raw/main_cursor" />

    <TextView
        android:id="@+id/intro_logo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:text="@string/app_name"
        android:textSize="30sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        style="@style/Text.TitleStyle"/>

    <com.airbnb.lottie.LottieAnimationView
        android:id="@+id/intro_swipe_down"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginEnd="10dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/intro_logo"
        app:lottie_autoPlay="true"
        app:lottie_loop="true"
        app:lottie_rawRes="@raw/main_swipe_down"/>

    <TextView
        style="@style/Text.RankStyle"
        android:id="@+id/intro_guest_text"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:gravity="center"
        android:text="@string/guest"
        android:textSize="20sp"
        android:visibility="gone"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintBottom_toBottomOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

* Constraintlayout => parent layout   
	* intro_login_text: TextView => `LOGIN` text   
		* visibility=gone  => 처음엔 렌더링되지 않음   
	* intro_swipe_up: LottieAnimation => 중앙로고 클릭 시 위로 향하는 화살표 애니메이션   
	* intro_cursr: LottieAnimation => 로고 아래에 클릭을 유도하는 손모양 애니메이션   
	* intro_logo : Textview => 중앙로고   
	* intro_swipe_down: LottieAnimation => 중앙 로고 클릭 시 아래로 향하는 화살표 애니메이션   
	* intro_guest_text: TextView => `GUEST` text   


## MainSwipeFragment.kt
```
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        
        return inflater.inflate(R.layout.fragment_main_swipe, container, false)
    }
```
* Fragment override 함수   
* inflater를 통해 위에서 생성한 xml 프래그먼트를 입력한다.   
* container는 activity에서 fragment 생성 시 입력받는다.   
	* container => 프래그먼트가 표시 될 액티비티   

```
    private lateinit var parentView: ConstraintLayout
    private lateinit var logoSwipeButton: TextView
    private lateinit var loginTextView: TextView
    private lateinit var guestTextView: TextView
    
    private lateinit var cursorAnimation: LottieAnimationView
    private lateinit var swipeUpAnimation: LottieAnimationView
    private lateinit var swipeDownAnimation: LottieAnimationView
		
		...
		
		    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        logoSwipeButton = view.findViewById(R.id.intro_logo)
        cursorAnimation = view.findViewById(R.id.intro_cursor)
        
        swipeUpAnimation = view.findViewById(R.id.intro_swipe_up)
        swipeDownAnimation = view.findViewById(R.id.intro_swipe_down)
        swipeDownAnimation.visibility = View.GONE
        swipeUpAnimation.visibility = View.GONE
        
        parentView = view.findViewById(R.id.intro_cl)
        
        loginTextView = view.findViewById(R.id.intro_login_text)
        guestTextView = view.findViewById(R.id.intro_guest_text)
        
        var statusBarHeight: Int = 0
        var resId = resources.getIdentifier("status_bar_height", "dimen", "android")
        if (resId > 0) {
            statusBarHeight = resources.getDimensionPixelSize(resId)
        }
        
        setOnTouchListener(statusBarHeight)
    }
```
*  lateinit var로 위에서 생성한 각각의 뷰의 타입을 지정한다.   
	*  onView() 함수를 사용하여 view를 넘겨받아 findViewById로 xml내부의 뷰들과 연결한다.   
	*  swipedown, swipeup 애니메이션은 클릭 시 보여지기 때문에 visibility = gone 으로 설정한다.   
	*  상태바 크기를 구하는 이유는 중앙 로고를 스와이프로 이동하고 다시 원위치로 돌아갈 때 필요하기 때문이다.   
		*  중앙정렬에서 약간 빗나감   
	* setOnTouchListener() 내부에 중앙로고인 logoSwipeButton에 리스너를 연결하여 구현   
	
	
```
    @SuppressLint("ClickableViewAccessibility", "Recycle", "ResourceAsColor")
    private fun setOnTouchListener(status: Int) {
        logoSwipeButton.setOnTouchListener { button, event ->
            //var parentWidth = parentView.width
            var parentHeight = parentView.height
            
						when (event!!.action) {
                MotionEvent.ACTION_DOWN -> {
                    cursorAnimation.visibility = View.GONE
                    guestTextView.visibility = View.VISIBLE
                    loginTextView.visibility = View.VISIBLE
                    swipeDownAnimation.visibility = View.VISIBLE
                    swipeUpAnimation.visibility = View.VISIBLE
                    swipeDownAnimation.playAnimation()
                    swipeUpAnimation.playAnimation()
                }
    
                MotionEvent.ACTION_UP -> {
                    button.y = ((parentHeight * 0.5f) - status)
                    button.visibility = View.VISIBLE
                    cursorAnimation.visibility = View.VISIBLE
                    swipeDownAnimation.visibility = View.GONE
                    swipeUpAnimation.visibility = View.GONE
                    guestTextView.visibility = View.GONE
                    loginTextView.visibility = View.GONE
                    guestTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
                    loginTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
                }
    
                MotionEvent.ACTION_MOVE -> {
                    button.y = button.y + (event.y - (button.height * 0.5f))
                    button.visibility = View.VISIBLE
                    guestTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
                    loginTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
                    when {
                        button.y < (parentHeight * 0.1f) - status -> {
                            button.visibility = View.GONE
                            loginTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 30f)
                        }
            
                        button.y > (parentHeight * 0.9f) - status -> {
                            button.visibility = View.GONE
                            guestTextView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 30f)
                        }
            
                        button.y < (parentHeight * 0.45f) - status ||
                                button.y > (parentHeight * 0.55f) - status  -> {
                            swipeUpAnimation.visibility = View.GONE
                            swipeDownAnimation.visibility = View.GONE
                        }
                    }
                }
            }
            true
        }
    }
```
*  MotionEvent.ACTION_DOWN   
	*  화면에 손가락이 닿는 순간을 의미함   
	*  눌려지는 순간 보여져야 할 상황이 구현되어 있음   
*  MotionEvent.ACTION_UP
	*  화면에서 손가락이 뗴어지는 순가을 의미함   
	*  변경된 사항들이 원래 위치로 reset 되도록 구현되어 있음   
*  MotionEvent.ACTION_MOVE
	*  터치 되어진 상태에서 움직임을 감지하는 모든 순간을 의미함   
	*  var parentHeight = parentView.height   
		*  현재 최상단 레이아웃의 실제 높이를 구현하고 좌표값을 구함   
	* button.y = button.y + (event.y - (button.height * 0.5f))   
		* y축에서 터치된 손가락의 실제 좌표를 구함   
		* y축만 구현되어있음
	* button.y < (parentHeight * 0.1f) - status    
		* 터치된 손가락이 최상단 `LOGIN` text 범위에 닿는 순간을 의미함   
	* button.y > (parentHeight * 0.9f) - status   
		* 터치된 손가락이 최하단 `GUEST` text 범위에 닿는 순간을 의미함   
	* 	button.y < (parentHeight * 0.45f) - status || button.y > (parentHeight * 0.55f) - status   
	*  중앙 로고를 기준으로 위 아래로 조금씩 움직였을 때의 범위를 의미함   
	

## MainActivity.kt
```
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        supportFragmentManager.beginTransaction()
            .replace(R.id.contentFrame, MainSwipeFragment())
            .commit()
    }
```
* supportFragmentManager => 프래그먼트 생성
