---
title: Android Intro Activity 1 - animations using lottie
category: android-ui
tags:
- Kotlin
- AndroidUI
- AnroidAnimation
---

참고자료
[https://www.youtube.com/watch?v=n7XTizCon0A](https://www.youtube.com/watch?v=n7XTizCon0A)
[https://developer.android.com/kotlin/coroutines?hl=ko](https://developer.android.com/kotlin/coroutines?hl=ko)
[https://lottiefiles.com/](https://lottiefiles.com/)


<p float="center">
  <img src="/assets/images/gif/2020-10-2017-03.gif" width="300" />
</p>
## build.gradle
```
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.9'
implementation 'com.airbnb.android:lottie:3.4.0'
```

## res/values/styles.xml
```
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
...
</style>

<style name="FullScreen" parent="AppTheme">
  <item name="android:windowNoTitle">true</item>
  <item name="android:windowActionBar">false</item>
  <item name="android:windowFullscreen">true</item>
  <item name="android:windowContentOverlay">@null</item>
</style>
```
* AppTheme은 안드로이드 프로젝트 생성 시 디폴트로 생성되는 테마이다.    
	* 이것을 NoActionBar로 지정한다. (추후 ActionBar는 필요시 toolbar를 추가해서 구현)   
	*  로 새로운 stype의 테마를 지정할 수 있다.    
	* 기본 테마를 상속받는다.  (기본 컬러가 지정되어있으며 그것을 따르게 됨)   
	* 내부 item 설정   

## AdroidManifest.xml
```
...
<activity android:name=".IntroActivity"
  android:theme="@style/FullScreen">
    <intent-filter>
      <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
...
```
*  맨 처음으로 IntroActivity가 실행되도록 action.Main와 caegory.LAUNCHER를 변경   

## lottiefiles.com
* 애니메이션을 선택하고 lottie.json 으로 다운로드   
* res 위치에 raw 디렉토리 생성하고 다운로드받은 json 파일 이동시킨다. 
* bulid.gradle에 추가한 lottie 라이브러리를 활용하여 xml에서 다운로드받은 json 파일을 랜더링 한다.    

## activity_intro.xml
```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical"
    tools:context=".IntroActivity">

    <com.airbnb.lottie.LottieAnimationView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:lottie_rawRes="@raw/intro"
        app:lottie_autoPlay="true"
        app:lottie_loop="true"/>
</LinearLayout>
```

## IntroActivity.kt
```
class IntroActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_intro)
        
        // Coroutine
       CoroutineScope(Dispatchers.Main).launch {
           withContext(CoroutineScope(Dispatchers.Default).coroutineContext) {
               delay(5000L)
               val intent = Intent(this@IntroActivity, MainActivity::class.java)
               startActivity(intent)
               finish()
           }
       }
    }
}

```
* 5초뒤 MainActivity로 이동하고 IntroActivity 는 finish()   


##
