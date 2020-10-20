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
* 각각에 대한 설명    
## (androidTest)IntroScreenTest.kt
```
@RunWith(AndroidJUnit4::class)
@LargeTest
class IntroScreenTest {
...
}
```
* @RunWith(AndroidJUnit4::class)   
* @LargeTest   



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
* ActivityScenarioRule   



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
*  @After
*  ActivityScenarioRule.scenario


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
* ActivityScenarioRule.scenario.onActivity {}   
* Assert   

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
