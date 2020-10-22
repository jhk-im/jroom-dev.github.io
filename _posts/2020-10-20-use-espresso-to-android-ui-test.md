---
title: Use espresso to android UI test
category: android-test
tags:
- TDD
- AndroidUITest
---

참고자료   
[https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin](https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin)
[https://two22.tistory.com/12](https://two22.tistory.com/12)

이전에 만들었던 introActivity를 test해보자. 
## build.gradle(Module:app)
```
    // local unit test
    testImplementation 'androidx.test.ext:junit:1.1.2'

    // android unit test
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'

    // android ui test
    androidTestImplementation 'androidx.test:runner:1.3.0'
    androidTestImplementation 'androidx.test:rules:1.3.0'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
    androidTestImplementation 'androidx.test.espresso:espresso-contrib:3.3.0'
    androidTestImplementation 'androidx.test.espresso:espresso-intents:3.3.0'
    androidTestImplementation 'androidx.test.espresso.idling:idling-concurrent:3.3.0'
    implementation 'androidx.test.espresso:espresso-idling-resource:3.3.0'
```
* Junit => Java의 대표적인 Testing Framework   
	* java 이외에도 각각의 언어에 테스트 프레임워크가 있다. (CUnit, PyUnit ...)   
	* 똑같은 junit이 testImplementation과 androidTestImplementation으로 추가되어 있는 이유   
		* app/src에는 main / test / androidTest 패키지로 나뉘어져 있다.   
			* main => 실제 동작하는 코드   
			*  test => unit test를 구현한 코드   
			*  androidTest => ui test를 구현한 코드 (화면터치, 표시내용 등 )    
				* testImplementation => test 소스 세트에 대한 종속성 추가   
				* androidTestImplementation => androidTest 소스 세트에 대한 종속성 추가   
* runner   
	* ui test 관련된 espresso 및 ui automator 프레임워크를 실행   
	* Junit 테스트 클래스를 실행   
* rules   
	*  Junit 규칙 셋   
	*  테스트에 필요한 상용구 코드를 줄이고 유연성을 높임   
* espresso-core   / epresso-contrib / espresso-intents  / idling-concurrent / idling-resource
	* 안드로이드에서 ui test를 위해 대표적으로 사용하는 라이브러리   
	* core => espresso의 기본 메소드가 담긴 패키지   
	* contrilb => DatePicker, RecyclerView, Drawer 등을 지원 하는 패키지   
	* intents => 폐쇄적 테스트를 위한 인턴트 확장이 담긴 패키지   
	* idling 
		* 어떠한 ui의 동작을 테스트할 때 특정 동작의 완료를 기다려야하는 상황에서 Espresso는 해당 작업의 종료를 기다리는 방법을 모름   
		* idling을 작성하여 Espresso가 대기할 수 있도록 함    

## (androidTest)IntroScreenTest.kt
```
@RunWith(AndroidJUnit4::class)
@LargeTest
class IntroScreenTest {
...
}
```
* @RunWith(AndroidJUnit4::class)   
	* 해당 클래스가 Test 클래스임을 명시   
* @LargeTest   
	* 외부 파일 시스템, 네트워크 등에 액세스할 수 있음   
	* @SmallTest => 파일시스템이나 네트워크와 상호작용하지 않음   
	* @Medium => localhost만 액세스   



```
    @get: Rule
    var activityScenarioRule: ActivityScenarioRule<IntroActivity> =
        ActivityScenarioRule(
            Intent(
                ApplicationProvider.getApplicationContext(),
                IntroActivity::class.java
            ).apply { putExtra("MyArgs", "Nothing") })
```
* @get:Rule   
	* ActivityScenarioRule을 사용하기 위함   
	* Testing  진행할 activity를 연결    

```
    @Before
    fun setUp() {
        activityScenarioRule.scenario.onActivity { it ->
            (it.findViewById<ConstraintLayout>(R.id.intro_cl))?.let {
            
            }
            (it.findViewById<TextView>(R.id.intro_logo))?.let {
                // it.text = "ChangeUI"
            }
        }
    }
    
    @After
    fun close() {
        activityScenarioRule.scenario.close()
    }
```
* @Before   
	* 테스트 이전에 실행 됨   
*  @After   
	*  테스트 이후에 실행 됨   
*  ActivityScenarioRule.scenario   
	* 로컬 단위 테스트 및 기기 내 통합 테스트에서 모두 사용할 수 있는 크로스 플랫폼 API 이다.   
	* 테스트 계측 스레드와 테스트실행 스레드를 동기화한다.   
	* onActivity { } 내부에 연결된 activity의 xml view 들을 찾아서 연결할 수 있다.   
	* 테스트에서 글자입력 혹은 클릭등이 필요한경우 셋팅할 수 있음   



```
    @Test
    fun resultTest() {
        activityScenarioRule.scenario.onActivity {
            it.setResult(Activity.RESULT_OK, Intent().apply { putExtra("Result", "Ok") })
            it.finish()
        }
        Assert.assertEquals(activityScenarioRule.scenario.result.resultCode, Activity.RESULT_OK)
        val result = activityScenarioRule.scenario.result.resultData?.extras?.getString("Result")
        Assert.assertEquals(result, "Ok")
    }
```
* @Test   
	* 해당 함수가 테스트용 함수임을 나타냄   
* ActivityScenarioRule.scenario.onActivity {} 
	* 테스트 시 체크할 사항들을 구현할 수 있음     
* Assert   
	* 테스트의 수행결과를 판별하는데 사용한다.   
	* assertEquals(a,b) => 입력된 a,b 가 일치하는지 확인   
		* 이 외에도 assertFalse() , assertNotNull(), assertFail() 등의 메소드가 있음   


```
    @Test
    fun moveToStateTest() {
        activityScenarioRule.scenario?.let {
            it.moveToState(Lifecycle.State.STARTED)
            Assert.assertEquals(it.state, Lifecycle.State.STARTED)
            it.moveToState(Lifecycle.State.CREATED)
            Assert.assertEquals(it.state, Lifecycle.State.CREATED)
            it.moveToState(Lifecycle.State.RESUMED)
            Assert.assertEquals(it.state, Lifecycle.State.RESUMED)
            it.moveToState(Lifecycle.State.DESTROYED)
            Assert.assertEquals(it.state, Lifecycle.State.DESTROYED)
            // activityScenario.recreate()
        }
    }
```
* moveToStae()    
	* 액티비티의 라이프 사이클을 임의로 변경할 수 있음      
	* 현재상태를 Lifecycle.State 변수를 통해 확인가능  
	*  recreate 메소드를 이용하면 앱을 onSaveInstanceState와 함께 재실행할 수 있음   

```
lateinit var activityScenario: ActivityScenario<IntroActivity>
    
    @Before
    fun setUp() {
        activityScenario = ActivityScenario.launch(
            Intent(
                ApplicationProvider.getApplicationContext(),
                IntroActivity::class.java
            ).apply {
                putExtra("MyArgs", "Nothing")
            })
        
        activityScenario.onActivity {
            (it.findViewById<ConstraintLayout>(R.id.intro_cl))?.let {
            
            }
        }
    }
```
* ActivityScenario만 단독으로 사용 가능
