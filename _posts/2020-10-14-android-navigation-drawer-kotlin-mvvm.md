---
title: android navigation drawer - kotlin
category: android-kotlin
tags:
- Kotlin
- AndroidUI
- Android
- MVVM
---

참고자료   
[https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin](https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin)
## Script   
#### Kotlin 
home   
ㄴ HomeActivity.kt   
note   
ㄴ NoteActivity.kt   
notice   
ㄴ NoticeActivity.kt   
util   
ㄴ AppcompatActivityExt.kt
#### Resource (xml)
layout   
ㄴ home_act.xml   
ㄴ note_act.xml   
ㄴ notice_act.xml   
ㄴ nav_header.xml   
menu   
ㄴ drawer_actions.xml   
   

## HomeActivity
* in onCreate   

```
setupActionBar(R.id.toolbar) {
	setHomeAsUpIndicator(R.drawable.ic_menu)
	setDisplayHomeAsUpEnabled(true)
}

 setupNavigationDrawer()
```
   
* setupActionBar()   
-> util/AppcompatActivityExt.kt 에 선언되어 있음   
-> 거의 모든 액티비티에서 호출 될 가능성이 높은 메소드이기 때문에 util에 선언 후 손쉽게 가져다 사용함   
-> 입력 값으로 main_act.xml에 선언된 appcompat.widget.Toolbar 를 입력값으로 받음   
		-> toolbar는 material.appbar.AppBarLayout으로 감싸고 있음   
-> setHomeAsUpIndicator()는 AppBar 왼쪽 상단에 버튼 이미지 커스텀   
-> setDisPlayHomeAsUpEnabled(true)  왼쪽 상단 버튼 활성화   
```
fun AppCompatActivity.setupActionBar(@IdRes toolbarId: Int, action: ActionBar.() -> Unit) {
    setSupportActionBar(findViewById(toolbarId))
    supportActionBar?.run {
        action()
    }
}
```
* setActionBar()
-> @IdRes 는 ui 리소스의 id값만을 입력받도록 강제      
-> ActionBar.() -> Unit   
	-> Unit은 java의 void와 같은 역할   
	-> unit type은 인자로도 사용할 수 있음   
	-> return 없이 사용할 수 있음   
-> toolbarid 를 입력하여 생성   
	-> actionBar가 deprecated 되면서 등장한 새로운 릴리즈가 toolbar   
	-> toolbar를 셋팅하는 방법   
	
* setupNavigationDrawer	
```
private fun setupNavigationDrawer() {
	mDrawerLayout = (findViewById<DrawerLayout>(R.id.drawer_layout)).apply {
		// 상태바의 색상을 지정함 
		setStatusBarBackground(R.color.colorPrimaryDark)
	}
	// main_act.xml 에 선언된 navagationView를 content로 셋팅
	setupDrawerContent(findViewById(R.id.navigation_view))
}
```
-> apply 는 T의 확장 함수이며 블럭안에서 프로퍼티를 호출할 때 it 이나 this를 사용할 필요가 없음   
	-> run과 유사하지만 블럭에서 return값을 받지 않으며 자기 자신인 T를 반환   
	* setupDrawerContent()   
	```
	private fun setupDrawerContent(navigationView: NavigationView) {
    navigationView.setNavigationItemSelectedListener { menuItem ->
        when (menuItem.itemId) {
            R.id.navigation_menu_home -> {
                //
            }
            R.id.navigation_menu_notice -> {
                val intent = Intent(this@HomeActivity, NoticeActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                }
                startActivity(intent)
            }
            R.id.navigation_menu_note -> {
                val intent = Intent(this@HomeActivity, NoteActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                }
                startActivity(intent)
            }
        }
        menuItem.isChecked = true
        mDrawerLayout.closeDrawers()
        true
    }
}
	```
	-> 3가지 버튼을 셋팅 home, notice, note   
	-> notice, note 도 home 과 동일하게 셋팅    
	-> intent를 활용한 activity 이동   
	
	Android Emulator Test   
	![](/assets/images/gif/2020-10-1500-07.gif){: width="80%" height="80%"}{: .center}
