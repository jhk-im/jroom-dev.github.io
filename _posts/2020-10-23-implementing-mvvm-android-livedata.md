---
title: Architecture Components Example - Room, LiveData, ViewModel
category: android-kotlin
tags:
- Kotlin
- MVVM
---

## Architecture Component
<p float="center">
  <img src="/assets/images/gif/2020-10-2318-56.gif" width="300" />
</p>

Architecture Component 예제를 공부하면서 주요 기능으로 자리잡고 있는 `Room`, `LiveData`, `Repository` , `ViewModel`, 에 대하여 정리한 글이다.   

<p float="center">
<img src="/assets/images/png/architectureComponent.png"  width="100%"/>
</p>
이미지 출처 및 참고자료   
[https://codelabs.developers.google.com/codelabs/android-room-with-a-view-kotlin?hl=ko#1](https://codelabs.developers.google.com/codelabs/android-room-with-a-view-kotlin?hl=ko#1)

공식문서
[Room](import androidx.lifecycle.viewModelScope)
[LiveData](https://developer.android.com/topic/libraries/architecture/livedata?hl=ko)
[ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel?hl=ko)

##  `Room`?
`Room`은 `SQLite` 추상화 레이어를 제공하여 `SQLite`를 완벽히 활용하면서 더 견고한 데이터 베이스 액세스를 가능하게 한다.   
- `SQLite` 데이터베이스 위에 있는 데이터베이스 계층이다.   
- SQLiteOpenHelper로 처리하던 작업을 처리한다.   
- `DAO`를 사용하여 데이터베이스에 쿼리를 발급한다.   
- 성능저하를 피하기 위해 main thread 에서 Query를 사용하는 것을 허용하지 않는다.   
- `Room`에서 LiveData를 반환하면 백그라운드 스레드에서 Query 비동기로 자동실행된다.   


```
//bulid.gradle

implementation "androidx.room:room-runtime:$rootProject.roomVersion"
kapt "androidx.room:room-compiler:$rootProject.roomVersion"
implementation "androidx.room:room-ktx:$rootProject.roomVersion"
androidTestImplementation "androidx.room:room-testing:$rootProject.roomVersion"
```
#### `Entity`
```
// Word.kt

@Entity(tableName = "word_table")
data class Word(@PrimaryKey @ColumnInfo(name = "word") val word: String)
```
- @Entity(tableName ="")   
	- SQLite table   
	- table name을 설정한다.  
- @PrimaryKey   
	- 모든 entity 는 primary key가 있어야한다.   
- @ColumnInfo -> column 이름을 설정하고 유형을 지정한다.   
-  데이터베이스에 저장된 모든 속성은 public 이며 kotlin의 기본 설정이다.   

#### `DAO`
```
//WordDao.kt

@Dao
interface WordDao {

    @Query("SELECT * from word_table ORDER BY word ASC")
    fun getAlphabetizedWords(): LiveData<List<Word>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insert(word: Word)

    @Query("DELETE FROM word_table")
    suspend fun deleteAll()
}
```
- `Dao`는 interface혹은 abstract 클래스로 설정해야 한다.   
- `@Dao`   
	- Room을 위한 DAO 클래스로 식별한다.   
- `@Insert`   
	- SQL 문법이 필요없는 특별한 DAO 메소드 anottation이다.   
	- 테이블에 데이터를 추가하는 용도   
	- 동일하게 `@Update`, `@Delete`도 제공된다.   
- `OnConflictStrategy.IGNORE`
	- 입력된 값이 테이블에 있는 값과 동일하면 작업을 무시한다.   
- deleteAll()   
	- `@Delete`는 여러개의 entitiy 삭제할 수 없기 때문에 `@Query`로 직접 구현해야 한다.   
- `@Query`
	- `@Query`는 string parameter로 되어있는 SQL을 입력받고 실행하는 annotation이다. 
	-  구현을 위해 SQLite 문법을 이해하고 있어야 한다.   

#### `RoomDatabase`
```
//WordRoomDatabase.kt


@Database(entities = [Word::class], version = 1, exportSchema = false)
abstract class WordRoomDatabase : RoomDatabase() {

    // The database exposes DAOs through an abstract 'getter' method for each @Dao.
    abstract fun wordDao(): WordDao
		
		. . .
}

```
- `Room`클래스는 abstract로 선언해야 하며 `RoomDatabase`객체를 상속받아야 한다.   
- `@Database`   
	- `Entity`와 version을 입력받아 데이터베이스를 셋팅한다.   
	- 각각의 `Entity`는 데이터베이스에 작성 될 테이블에 해당한다.   
	- `exportSchema`   
		- 데이터베이스 마이그레이션은 코드의 범위를 벗어나므로 빌드 경고를 피하기 위해 여기서 exportSchema를 false로 설정해야한다.   
- database schema가 변경될 경우 version number를 업데이트하고 migration을 관리해야 한다.   
- `wordDao()`   
	- 데이터베이스는 각각의 `DAO`에 대해 abstract getter 방법으로 제공한다.   


```
. . .
abstract fun wordDao(): WordDao

private class WordDatabaseCallback(
    private val scope: CoroutineScope
) : RoomDatabase.Callback() {

    override fun onOpen(db: SupportSQLiteDatabase) {
        super.onOpen(db)
        WordRoomDatabase.INSTANCE?.let { database ->
            scope.launch {
                var wordDao = database.wordDao()

                // Delete all content here.
                wordDao.deleteAll()

                // Add sample words.
                var word = Word("Hello")
                wordDao.insert(word)
                word = Word("World!")
                wordDao.insert(word)

                // TODO: Add your own words!
                word = Word("TODO!")
                wordDao.insert(word)
            }
        }
    }
}
. . .
```
- WordDatabase 인스턴스가 생성될 때 실행될 callback 함수이다.   
- scope: CoroutineScope   
	- Room의 Query는 main Thread에서 사용할 수 없다.   
		- 다른 Thread를 사용하기 위해 CoroutineScope를 입력받아 사용한다.   
- wordDao의 동작   
	- deleteAll() -> entity를 모두 지운다.   
	- insert() -> "Hello", "World!", "Todo" 3가지 객체를 생성하고 insert 한다.   
- 실제 데이터베이스에서 entity가 초기화 되어야 하거나 꼭 있어야하는 데이터가 있을 경우 위 방법을 통해 구현한다.      

```
. . .
companion object {
    @Volatile
    private var INSTANCE: WordRoomDatabase? = null

    fun getDatabase(
        context: Context,
        scope: CoroutineScope
    ): WordRoomDatabase {
        // if the INSTANCE is not null, then return it,
        // if it is, then create the database
        return INSTANCE ?: synchronized(this) {
            val instance = Room.databaseBuilder(
                context.applicationContext,
                WordRoomDatabase::class.java,
                "word_database"
            )
                .addCallback(WordRoomDatabase.WordDatabaseCallback(scope))
                .build()
            INSTANCE = instance
            // return instance
            instance
        }
    }
}
. . .
```
-  `getDatabase()`   
	-  해당 메소드를 통해 Database 객체를 싱글턴으로 반환한다.   
	-  context와 callback 함수 실행을 위해 CoroutinScope를 입력받는다.   
- `Room.databaseBuilder()`   
	-  응용 프로그램 context에서 RoomDatabase 객체를 생성한다.   
	- context, Roomdatabase, database name을 입력받는다.   
	-  `addCallback()` 
		-  bulid 전 콜백함수를 실행하여 데이터를 초기화한다.   
	- `bulid()`   
		- 마지막으로 빌드하고 instance를 반환한다.   

## `Repository` ?
- `Repository`는 여러 데이터 소스에 대한 액세스를 추상화한다.    
-  아키텍처 구성요소 라이브러리에 속하지 않지만 코드 분리 및 아키텍처를 위한 권장 모범 사례다.    
-  애플리케이션의 나머지 부분에 대한 데이터 액세스를 위한 API를 제공한다.   
-  `Repository`를 사용하는 이유
	- `Qeury`를 관리하고 여러 백엔드를 사용할 수 있도록 허용한다.   
	-   Network와 Local 데이터베이스 사이에서 캐시된 결과를 어떻게 사용할지를 결정하기위한 로직을 구현한다.   

```
// WordRepository.kt

class WordRepository(private val wordDao:WordDao) {

    val allWords: LiveData<List<Word>> = wordDao.getAlphabetizedWords()

    suspend fun insert(word: Word) {
        wordDao.insert(word)
    }
}

```
- `DAO`를 private으로 생성함   
- `DAO`에 대한 액세스만 필요하므로 전체 데이터베이스 대신 DAO를 전달한다.  
- `Room`은 별도의 쓰레드에서 모든 쿼리를 실행한다.   
-  `Room`+ `DAO` 로 검색된 객체가 LiveData<>로 입력된다.   
	-  관찰된 LiveData는 변경 시 `Observer`에 통지한다.   
- `suspend fun insert()`
	- suspend 를 붙임으로서 코루틴으로 언제든 지연되었다가 재개 될 수 있는 메소드가 정의된다.   

## `LiveData`? 
데이터가 변경될 때 반응하는 `View`가 있다고 가정했을 때 데이터가 어떻게 저장되느냐에 따라 이것이 까다로울 수 있다. 앱의 여러가지 `View`에서 데이터 변경을 관찰하다 보면 코드줄이 길어지고 찾기 힘들어지면서 Test와 디버깅을 어렵게 만든다. `LiveData`는 이러한 문제를 해결한다.    

- 식별 가능한 데이터 홀더 클래스
- 일반 클래스와 달리 수명주기를 인식함   
- activity, fragment, service등의 앱 구성요소 수명주기를 고려함   
- 수명주기 인식을 통해 활성상태에 있는 앱 구성요소의 관찰자만 업데이트 함   

```
참고:
LiveData를 Room과 독립적으로 사용할 경우 데이터 업데이트를 관리해야한다. 
LiveData에는 저장된 데이터를 업데이트하는 데에 대한 공식적은 방법이 없다. 

LiveData 저장된 데이터를 업데이트 하려면 MutableLiveData를 사용해야한다. 
method -> setValue(T), postValue(T)
일반적으로 MutableLiveData는 ViewModel 내에서 사용된다.
ViewModel은 immutable LiveData 객체만 Observers에게 노출시킨다. 
```
다음은 안드로이드 공식문서에 나와있는 LiveData의 장점이다.   
##### `LiveData`의 장점 
- UI와 데이터 상태의 일치 보장   
	- `LiveData`는 수명주기 상태가 변경될 때 `Observer` 객체에 알림   
	- 코드를 통합하여 `Observer`객체에 UI를 업데이트   
	- 데이터가 변경될 때마다 관찰자가 UI를 업데이트 함   

- 메모리누출 없음   
	- `Lifecylce` 객체와 관찰자가 결합되어 있고 수명주기가 끝나면 자동 삭제됨   

- 중지된 activity로 인한 비정상 종료가 없음   
	- 관찰자의 수명주기가 비활성 상태이면 관찰자는 `LiveData` 이벤트를 수신하지 않음   
 
- 수명주기를 수동으로 처리하지 않음   
	- UI 구성요소는 관련 데이터를 관찰하기만 할 뿐 관찰을 중지하거나 다시 시작하지 않음   
	- `LiveData`는 관찰하는 동안 관련 수명주기 상태의 변경을 인식하여 자동으로 관리   

- 최신 데이터 유지   
	- 수명 주기가 비활성화 되고 다시 활성화 될 때 최신 데이터를 수신   
	- ex) 백그라운드에 있던 activity가 포그라운드로 돌아온 직후 최신 데이터 수신   
 
- 적절한 구성 변경   
	- 구성 변경(ex->기기회전)으로 인해 activity, fragment 등이 다시 생성되면 사용할 수 있는 최신정보 를 즉시수신   

- 리소스 공유   
	- 맵에서 시스템 서비스를 공유할 수 있도록 싱글톤 패턴을 사용하는 `LiveData` 객체를 확장하여 시스템 서비스를 래핑   
	- `LiveData` 객체가 시스템 서비스에 한 번 연결되면 리소스가 필요한 모든 관찰자가 `LiveData` 객체를 볼 수 있음


## `ViewModel`?    
- `ViewModel`클래스는 수명주기를 고려하여 UI 관련 데이터를 저장하고 관리하도록 설계되었다.    
- `ViewModel` 클래스를 사용하면 화면 회전과 같이 구성을 변경할 때도 데이터를 유지할 수 있다.    
- `ViewModel`이 없는경우   
	- Android 프레임워크는 UI Controller(activity,fragment..) 의 수명주기를 관리한다. 프레임워크는 특정 사용자 작업이나 완전히 통제할 수 없는 기기 이벤트에 대한 응답으로 UI 컨트롤러를 제거하거나 다시 만들도록 결정할 수 있다. 이러한 경우 컨트롤러에 저장된 일시적은 모든 UI 관련데이터가 손실된다.    
	- 예를들어 activity의 view 구성의 변경을 위해 다시 생성하면 새 activity는 새로운 데이터를 처음부터 다시 가져와야 한다. 간단한 경우에는 `onSaveInstanceState()`메소드를 통해 복원할 수 있으나 이 경우는 소량의 데이터에만 적합하다.   
	- UI 컨트롤러가 비동기 호출을 자주 해야한다.    
		- 이는 비동기 호출관리, 메모리누출 방지, 시스템에서 호출 폐기 후 호출을 하는지 확인해야한다.   
   
ui컨트롤러는 주로 ui 데이터를 표시하거나, 사용자 작업에 반응하거나, 권한요청과 같은 커뮤니케이션을 처리하기 위한 것이다. 여기에 데이터베이스나 네트워크 데이터 로드를 담당하도록 요구하면 클래스가 팽창한다. 이는 테스트를 어렵게 만든다.   
   
`ViewModel`은 UI 컨트롤러에서 뷰 데이터 소유권을 분리하는 방법을 제공한다.   

```
// WordViewModel.kt

class WordViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: WordRepository

    val allWords: LiveData<List<Word>>

    init {
        val wordsDao = WordRoomDatabase.getDatabase(application, viewModelScope).wordDao()
        repository = WordRepository(wordsDao)
        allWords = repository.allWords
    }

    fun insert(word: Word) = viewModelScope.launch(Dispatchers.IO) {
        repository.insert(word)
    }
}
```
- `Application`을 파라미터로 받고 `AndroidViewModel`을 상속받는다.   
- init block을 사용하여 인스턴스 생성 시 해야할 로직을 구현한다.   
	- `WordRoomDatabase`를 생성하고 Dao 객체를 가져온다.   
	- `WordRepository`에 가져온 dao 를 입력하여 인스턴스를 생성한다.   
	-  `allWords`에 repository 내부에서 변화를 관찰하고 있는 allWords를 입력한다.   
- `insert(word: Word)` 
	- ui 컨트롤러에서 호출하여 사용한다. 
	- 데이터에 관련된 로직은 viewModel이 담당하고 ui 컨트롤러는 단지 데이터 입력 후 전달만을 담당하게 된다.   
	- `viewModelScope`를 사용하여 코루틴을 구현한다.   
		-  위에서 생성된 repository내부의 insert() 메소드를 통해 Word 데이터를 추가한다.   

##### `UI Controller`의 `ViewModel`
```
// ArchiTecturecomponentActivity.kt 

...
private lateinit var wordViewModel: WordViewModel

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_architecture_component)
		
		...

    wordViewModel = ViewModelProvider(this).get(WordViewModel::class.java)
    wordViewModel.allWords.observe(this, Observer { words ->
        // Update the cached copy of the words in the adapter.
        words?.let { adapter.setWords(it) }
    })

		...
}
...
```
- `ViewModelProvider(this).get(WordViewModel::class.java)`
	- `ViewModel`인스턴스 생성   
- `wordViewModel.allWords.observe{}`   
	- `ViewModel` 내부의 `allWords` 객체를  `observe{}` 통해 관찰한다.   
		-  관찰하고 있다가 변동이 발생한 경우 `apdater.setWords(it)`로 객체를 전달한다.   

```
// WordListAdapter.kt
...

    override fun onBindViewHolder(holder: WordViewHolder, position: Int) {
        val current = words[position]
        holder.wordItemView.text = current.word
    }

    internal fun setWords(words: List<Word>) {
        this.words = words
        notifyDataSetChanged()
    }
...
```
- `Activity`에서 `viewModel`을 통해 관찰하고있던 `allWords`가 이곳에 전달된다.   
	- 전달되었다는 뜻은 변경되었다는 것을 의미한다.   
	- `notifiDataSetChanged()`메소드로 변경되었음을 알린다.  
		- 그렇게 되면 adpater 내부에서 자동으로 `onBindViewHolder` 를 호출한다.   
			-  재정비 된 words 에서 변경된 내용이 업데이트 된다.


다시한번 아래 이미지를 보며서 정리해보자.   

<p float="center">
<img src="/assets/images/png/architectureComponent.png"  width="100%"/>
</p>

다시보니 ViewModel에서 UI 컨트롤러에 변동사항을 알리는것을 제외하곤  화살표의 방향이 아래로만 되어있는것이 눈에 들어온다.  이러한 flow가 생겨난 이유는 UI 컨트롤러에서 view를 표시하고 사용자 행동에 반응하는 `UI Control` 이외의 작업이 추가되어 팽창하는것을 막기 위함이다.  여기서 이외의 작업을 담당하기위해 분리 된 것이 `ViewModel`이다. 여기서 중요한것은 `UI Controller`는 `ViewModel`를 생성하고 접근하지만 `ViewModel`은 `UI Controller`의 존재를 알지 못하여 직접적으로 접근할 수 없다는 것이다. 
`ViewModel`은 수명주기를 고려하여 UI관련 데이터를 관리한다. 그리고 데이터베이스에서 데이터를 crud하는 작업을 `Repository`에게 일임한다. 이렇게 완벽히 분리된 상태에서 변동된 데이터를 `UI Controller`에 전달하기 위해 존재하는 것이 `LiveData`이다. `LiveData`는 `UI Controller`의 수명주기를 알고있으며 관리를 하기로한 객체에 대해 `Observer`를 두고 변동을 감지한다.
