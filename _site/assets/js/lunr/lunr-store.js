var store = [{
        "title": "android navigation drawer - kotlin",
        "excerpt":"참고자료 https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin Script Kotlin home ㄴ HomeActivity.kt note ㄴ NoteActivity.kt notice ㄴ NoticeActivity.kt util ㄴ AppcompatActivityExt.kt Resource (xml) layout ㄴ home_act.xml ㄴ note_act.xml ㄴ notice_act.xml ㄴ nav_header.xml menu ㄴ drawer_actions.xml HomeActivity in onCreate setupActionBar(R.id.toolbar) { setHomeAsUpIndicator(R.drawable.ic_menu) setDisplayHomeAsUpEnabled(true) } setupNavigationDrawer() setupActionBar() -&gt; util/AppcompatActivityExt.kt 에 선언되어 있음 -&gt; 거의 모든 액티비티에서 호출...","categories": ["android-ui"],
        "tags": ["Kotlin","AndroidUI","Android","MVVM"],
        "url": "http://localhost:4000/android-ui/android-navigation-drawer-kotlin-mvvm/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "android local & remote data source - kotlin",
        "excerpt":"참고자료 https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin Script Kotlin data source BookmarkRepository.kt remote BookmarkRemoteDataSource.kt (mock) Injection.kt data/source/BookmarkRemoteDataSource.kt object BookmarkRemoteDataSource : BookmarkDataSource { private const val SERVICE_LATENCY_IN_MILLIS = 5000L private var BOOKMARKS_SERVICE_DATA = LinkedHashMap&lt;String, Bookmark&gt;(2) init { addBookmark(\"Google\", \"Portal\",\"https://www.google.com\") addBookmark(\"Naver\", \"Portal\",\"https://www.naver.com\") addBookmark(\"Daum\", \"Portal\",\"https://www.daum.net\") } private fun addBookmark(title: String, category: String, url: String) { val newBookmark =...","categories": ["android-kotlin"],
        "tags": ["Kotlin","Android","MVVM","Database"],
        "url": "http://localhost:4000/android-kotlin/android-local-remote-data-source-kotlin/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "android room local database - kotlin",
        "excerpt":"참고자료 https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin Bookmark Script Kotlin data Bookmark.kt source BookmarkDataSource.kt BookmarkRepository.kt local BookmarkDatabase.kt BookmarkDao.kt BookmarkLocalDataSource.kt util AppExecutors.kt DiskIOThreadExecutor.kt Bookmark.kt @Entity(tableName= \"bookmarks\") data class Bookmark @JvmOverloads constructor ( @NonNull @PrimaryKey @ColumnInfo(name = \"id\") var id: String = UUID.randomUUID().toString(), @NonNull @ColumnInfo(name= \"title\") var title: String = \"\", @NonNull @ColumnInfo(name= \"url\") var url: String...","categories": ["android-kotlin"],
        "tags": ["Kotlin","Android","Database","MVVM"],
        "url": "http://localhost:4000/android-kotlin/android-room-local-database-kotlin/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "How to format date time in room database - kotlin",
        "excerpt":"참고자료 https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin https://medium.com/androiddevelopers/room-time-2b4cf9672b98 https://developer.android.com/training/data-storage/room/referencing-data?hl=ko home/HomeFilterType.kt enum class HomeFilterType { RECENT_BOOKMARKS, CATEGORY_BOOKMARKS, } 위처럼 Bookmark를 보여줄 home activity에 Recent와 Category로 나누어 데이터를 뿌려줄 계획임 Recent의 경우 최근에 북마크를 생성 or 클릭 한 순서대로 뿌려줄 계획이라 Date Type의 컬럼이 필요함 data/source/Bookmark.kt @Entity(tableName = \"bookmarks\") data class Bookmark @JvmOverloads constructor( @NonNull @ColumnInfo(name =...","categories": ["android-kotlin"],
        "tags": ["Kotlin","MVVM","Android","Database"],
        "url": "http://localhost:4000/android-kotlin/how-to-format-date-time-in-room-database-kotlin/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Data structure - Kotlin Collections Overview",
        "excerpt":"참고자료 https://www.tutorialspoint.com/data_structures_algorithms/index.html 코틀린 학습 + 영어 공부를 위해 kotlin 가이드 문서를 번역함 Kotlin Collections Overview 코틀린 표준 라이브러리는 항목 그룹으로 구성된 컬렉션 관리를 위한 포괄적 도구 세트를 제공하며, 이러한 툴은 해결된 문제에 대한 중요성을 공유하고 공통적으로 운영된다. 컬렉션은 일반적으로 동일한 유형의 여러 객체를 포함한다. 컬렉션안의 객체(object)를 요소(elements) 또는 items라고 한다....","categories": ["programming-theory"],
        "tags": ["Kotlin","DataStructure","KotlinDocs"],
        "url": "http://localhost:4000/programming-theory/data-structure-1-kotlin-data-structure/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Android Intro Activity - font family / text animation",
        "excerpt":"참고자료 https://www.journaldev.com/9481/android-animation-example https://developer.android.com/training/animation/reveal-or-hide-view?hl=ko https://woovictory.github.io/2020/06/12/Android-Font/ TextView를 추가하고 애니메이션 fade in 애니메이션 적용 custom font 다운받아 적용 Coroutine 맛보기 Activity 전환 애니메이션 적용 Ststus bar 크기를 구하고 로고의 위치 조정 res/anim/fadein.xml , fadeout.xml fadein.xml &lt;?xml version=\"1.0\" encoding=\"utf-8\"?&gt; &lt;set xmlns:android=\"http://schemas.android.com/apk/res/android\" android:fillAfter=\"true\"&gt; &lt;alpha android:duration=\"1000\" android:fromAlpha=\"0.0\" android:interpolator=\"@android:anim/accelerate_interpolator\" android:toAlpha=\"1.0\" /&gt; &lt;/set&gt; fadeout.xml &lt;?xml version=\"1.0\" encoding=\"utf-8\"?&gt; &lt;set...","categories": ["android-ui"],
        "tags": ["AndroidUI","AnroidAnimation","Kotlin","Android"],
        "url": "http://localhost:4000/android-ui/android-intro-activity-2-font-family-text-animation/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Android Intro Activity - animations using lottie",
        "excerpt":"참고자료 https://www.youtube.com/watch?v=n7XTizCon0A https://developer.android.com/kotlin/coroutines?hl=ko https://lottiefiles.com/ build.gradle implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.9' implementation 'com.airbnb.android:lottie:3.4.0' res/values/styles.xml &lt;style name=\"AppTheme\" parent=\"Theme.AppCompat.Light.NoActionBar\"&gt; ... &lt;/style&gt; &lt;style name=\"FullScreen\" parent=\"AppTheme\"&gt; &lt;item name=\"android:windowNoTitle\"&gt;true&lt;/item&gt; &lt;item name=\"android:windowActionBar\"&gt;false&lt;/item&gt; &lt;item name=\"android:windowFullscreen\"&gt;true&lt;/item&gt; &lt;item name=\"android:windowContentOverlay\"&gt;@null&lt;/item&gt; &lt;/style&gt; AppTheme은 안드로이드 프로젝트 생성 시 디폴트로 생성되는 테마이다. 이것을 NoActionBar로 지정한다. (추후 ActionBar는 필요시 toolbar를 추가해서 구현) 로 새로운 stype의 테마를 지정할 수...","categories": ["android-ui"],
        "tags": ["Kotlin","AndroidUI","AnroidAnimation"],
        "url": "http://localhost:4000/android-ui/android-intro-activity-animations-using-lottie/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Data structure - Kotlin Constructing Collections",
        "excerpt":"참고자료   https://kotlinlang.org/docs/reference/constructing-collections.html   코틀린 학습 + 영어 공부를 위해 kotlin 가이드 문서를 번역함   Kotlin Constructing Collections  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/data-structure-2-kotlin-constructing-collections/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Java와 Kotlin을 비교하면서 알아보는 객체지향 프로그래밍(OOP) - Class",
        "excerpt":"참고자료 https://opentutorials.org/course/743/6553 https://wikidocs.net/214 https://kotlinlang.org/docs/reference/classes.html https://gmlwjd9405.github.io/2018/09/17/class-object-instance.html Class // java class Car {} // kotlin class Car {} 가장 간단한 형태의 클래스이다. 자바와 코틀린의 문법상의 차이는 없다. (현재까지는..) 클래스의 선언만 있고 내용은 없는 껍데기 클래스이다. 하지만 이러한 껍데기라도 중요한 기능을 가지고 있다. 객체를 생성하는 기능이다. 다음과 같이 만들 수 있다. //java Car...","categories": ["JavaAndKotlin"],
        "tags": ["OOP"],
        "url": "http://localhost:4000/javaandkotlin/java-kotlin-oop/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Use espresso to android UI test",
        "excerpt":"참고자료 https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin https://two22.tistory.com/12 이전에 만들었던 introActivity를 test해보자. build.gradle(Module:app) // local unit test testImplementation 'androidx.test.ext:junit:1.1.2' // android unit test androidTestImplementation 'androidx.test.ext:junit:1.1.2' // android ui test androidTestImplementation 'androidx.test:runner:1.3.0' androidTestImplementation 'androidx.test:rules:1.3.0' androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0' androidTestImplementation 'androidx.test.espresso:espresso-contrib:3.3.0' androidTestImplementation 'androidx.test.espresso:espresso-intents:3.3.0' androidTestImplementation 'androidx.test.espresso.idling:idling-concurrent:3.3.0' implementation 'androidx.test.espresso:espresso-idling-resource:3.3.0' Junit =&gt; Java의 대표적인 Testing Framework java 이외에도 각각의 언어에 테스트 프레임워크가...","categories": ["android-test"],
        "tags": ["TDD","AndroidUITest"],
        "url": "http://localhost:4000/android-test/use-espresso-to-android-ui-test/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "android swipe - 터치 좌표를 따라서 view 이동하기",
        "excerpt":"참고자료 https://sunghyun1038.tistory.com/24 https://developer.android.com/training/gestures/viewgroup?hl=ko https://developer.android.com/guide/topics/graphics/prop-animation?hl=ko fragment_main_swipe.xml &lt;?xml version=\"1.0\" encoding=\"utf-8\"?&gt; &lt;androidx.constraintlayout.widget.ConstraintLayout xmlns:android=\"http://schemas.android.com/apk/res/android\" xmlns:app=\"http://schemas.android.com/apk/res-auto\" xmlns:tools=\"http://schemas.android.com/tools\" android:id=\"@+id/intro_cl\" android:layout_width=\"match_parent\" android:layout_height=\"match_parent\"&gt; &lt;TextView style=\"@style/Text.RankStyle\" android:id=\"@+id/intro_login_text\" android:layout_width=\"match_parent\" android:layout_height=\"50dp\" android:gravity=\"center\" android:text=\"@string/login\" android:textSize=\"20sp\" android:visibility=\"gone\" app:layout_constraintLeft_toLeftOf=\"parent\" app:layout_constraintRight_toRightOf=\"parent\" app:layout_constraintTop_toTopOf=\"parent\" /&gt; &lt;com.airbnb.lottie.LottieAnimationView android:id=\"@+id/intro_swipe_up\" android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\" android:layout_marginStart=\"10dp\" app:layout_constraintLeft_toLeftOf=\"parent\" app:layout_constraintRight_toRightOf=\"parent\" app:layout_constraintTop_toTopOf=\"parent\" app:layout_constraintBottom_toTopOf=\"@+id/intro_logo\" app:lottie_autoPlay=\"true\" app:lottie_loop=\"true\" app:lottie_rawRes=\"@raw/main_swipe_up\"/&gt; &lt;com.airbnb.lottie.LottieAnimationView android:id=\"@+id/intro_cursor\" android:layout_width=\"200dp\" android:layout_height=\"200dp\" android:layout_marginTop=\"30dp\" app:layout_constraintBottom_toBottomOf=\"@id/intro_logo\" app:layout_constraintLeft_toLeftOf=\"@id/intro_logo\" app:layout_constraintRight_toRightOf=\"@id/intro_logo\" app:layout_constraintTop_toTopOf=\"@id/intro_logo\" app:lottie_autoPlay=\"true\"...","categories": ["android-ui"],
        "tags": ["AndroidUI","AnroidAnimation"],
        "url": "http://localhost:4000/android-ui/android-swipe-view/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "android snackbar & move to activity in fragment",
        "excerpt":"참고자료 https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin https://developer.android.com/training/snackbar/action?hl=ko util/ViewExt.kt fun View.showSnackbar(snackbarText: String, timeLength: Int) { Snackbar.make(this, snackbarText, timeLength).run { addCallback(object : Snackbar.Callback() { override fun onShown(sb: Snackbar?) { EspressoIdlingResource.increment() } override fun onDismissed(transientBottomBar: Snackbar?, event: Int) { EspressoIdlingResource.decrement() } }) show() } } snackbar는 위 예제 gif에서 login 선택 시 아래에 등장하는 메시지 이다. Toast와...","categories": ["android-ui"],
        "tags": ["AndroidUI","Kotlin"],
        "url": "http://localhost:4000/android-ui/android-snackbar-move-to-activity-in-fragment/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Data Binding in Android Example",
        "excerpt":"Data Binding 예제를 정리한 글 참고자료 Data Binding - 공식문서 Data Binding - Example Data Binding DataBinding 라이브러리는 XML 레이아웃의 UI 구성요소를 선언적 형식을 사용하여 데이터 소스에 바인딩할 수 있도록 하는 Android Jetpack 라이브러리이다. 해당 예제는 정적 데이터와 일부 관측 가능한 데이터를 보여주는 하나의 화면을 가지고 있다. 데이터가 바뀌면 UI가...","categories": [],
        "tags": ["Kotlin","MVVM","AndroidUI"],
        "url": "http://localhost:4000/data-binding-in-android-example/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Architecture Components Example - Room, LiveData, ViewModel",
        "excerpt":"Architecture Component Architecture Component 예제를 공부하면서 주요 기능으로 자리잡고 있는 Room, LiveData, Repository , ViewModel, 에 대하여 정리한 글이다. 이미지 출처 및 참고자료 https://codelabs.developers.google.com/codelabs/android-room-with-a-view-kotlin?hl=ko#1 공식문서 Room LiveData ViewModel Room? Room은 SQLite 추상화 레이어를 제공하여 SQLite를 완벽히 활용하면서 더 견고한 데이터 베이스 액세스를 가능하게 한다. SQLite 데이터베이스 위에 있는 데이터베이스 계층이다....","categories": ["android-kotlin"],
        "tags": ["Kotlin","MVVM"],
        "url": "http://localhost:4000/android-kotlin/implementing-mvvm-android-livedata/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      },{
        "title": "Using dagger-hilt in Android Example",
        "excerpt":"의존성 주입(Dependency Injection)을 구현하는 dagger-hilt eample을 공부하고 정리한 글 참고자료 Hilt - 공식문서 Hilt - Example Dependency Injection과 Hilt Dependency Injection 줄여서 DI는 프로그래밍에 널리 사용되며 안드로이드 개발에 잘 맞는 기술이다. DI의 원칠을 따르면 좋은 앱 아키텍처의 기초를 갖출 수 있다. DI의 장점 코드의 재사용성 리팩토링 용이성 테스트 용이성 Hilt는...","categories": ["android-kotlin"],
        "tags": ["AndroidUI","MVVM"],
        "url": "http://localhost:4000/android-kotlin/using-dagger-hilt-in-android-example/",
        "teaser": "http://localhost:4000/assets/images/background/teaser1.jpg"
      }]
