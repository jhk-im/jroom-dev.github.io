---
title: android room local database - kotlin
category: android-kotlin
tags:
- Kotlin
- Android
- Database
- MVVM
---

참고자료   
[https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin](https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin)

---
---

## Bookmark
<p float="left">
  <img src="/assets/images/gif/2020-10-1509-47.gif" width="300" />
	<img src="/assets/images/gif/2020-10-1509-48.gif" width="300" />
</p>
## Script 
> Kotlin 
* data
	- Bookmark.kt   
	- source
		+ BookmarkDataSource.kt   
		+ BookmarkRepository.kt   
		+ local
			+ BookmarkDatabase.kt   
			+ BookmarkDao.kt   
			+ BookmarkLocalDataSource.kt   
* util   
	- AppExecutors.kt   
	- DiskIOThreadExecutor.kt   

## Bookmark.kt 
```
@Entity(tableName= "bookmarks")
data class Bookmark @JvmOverloads constructor (
    @NonNull @PrimaryKey @ColumnInfo(name = "id") var id: String = UUID.randomUUID().toString(),
    @NonNull @ColumnInfo(name= "title") var title: String = "",
    @NonNull @ColumnInfo(name= "url") var url: String = "",
    @NonNull @ColumnInfo(name= "category") var category: String = ""
) {

    @ColumnInfo(name = "position") var position: Int = 0
    
    @ColumnInfo(name = "favicon") var favicon: String = ""
    
    val isEmpty
        get() = title.isEmpty()
}
```
* Bookmark Entity Model   
* Bookmarks Table을 생성하고 id, title 등의 데이터 컬럼 작성   
* Bookmark 객체 생성자  
* @Entity()   
	-> room anotation   
	-> table name 을 입력하고 아래 클래스가 room entity 임을 나타냄   
* data class   
	-> 데이터를 보유하면서 아무것도 하지 않는 model에 특화된 class   
-> @JvmOverloads   
	-> Default 메소드를 사용할 수 있음   
		-> Java에는 Kotlin 처럼 파라미터 안에 Default 값을 넣을 수 없음   
		-> @JvmOverloads를 기입하면 java에서 Default 값을 오버로딩하여 할당함   
-> constructor   
	-> java의 생성자 역할   
	-> java에서는 클래스 내부에 직접 생성자를 등록해야함   
		-> Kotlin에선 constructor 를 파라미터 앞에 선언하면 간단하게 생성자 등록 가능   
			-> 객체 생성시 반드시 필요한 값은 파라미터에   
			-> 그렇지 않은 값은 클래스 내부에 선언   
->  @NonNull, @PrimaryKey, @ColumnInfo   
	-> Room의 anotation

## data/source/BookmarkDataSource.kt
```
interface BookmarkDataSource {

    interface LoadBookmarksCallback {
        fun onBookmarksLoaded(bookmarks: List<Bookmark>)
        fun onDataNotAvailable()
    }

    interface GetBookmarkCallback {
        fun onBookmarkLoaded(book: Bookmark)
        fun onDataNotAvailable()
    }

    fun getBookmarks(callback: LoadBookmarksCallback)

    fun getBookmark(bookmarkId: String, callback: GetBookmarkCallback)

    fun saveBookmark(bookmark: Bookmark)

    fun deleteAllBookmarks()

    fun deleteBookmark(bookmarkId: String)
}
```
-> interface   
	-> java와 마찬가지로 해당 interface를 상속받은 클래스는 내부에 구현된 함수를 강제 오버라이드 하게 됨   
-> LoadBookmarksCallback | GetBookmarkCallbaclk   
	-> 데이터 베이스와 클라이언트 사이에서 단일객체 혹은 복수의 객체들을 체크하여 callback   
-> 나머지는 bookmark객체를 데이터베이스로부터 CRUD를 구현 할 메소드   

## data/source/BookmarkRepository.kt
```
class BookmarkRepository(
    val bookmarksLocalDataSource: BookmarkLocalDataSource
		// 추후 에 remote도 추가 
		// val bookmarkRemoteDataSource : BookmarkRemoteDataSource
) : BookmarkDataSource {

		. . .
		// override method 구현 

    companion object {

        private var INSTANCE: BookmarkRepository? = null

        @JvmStatic
        fun getInstance(bookmarksLocalDataSource: BookmarkLocalDataSource) =
            INSTANCE ?: synchronized(BookmarkRepository::class.java) {
                INSTANCE ?: BookmarkRepository(bookmarksLocalDataSource).also { INSTANCE = it }
            }

        @JvmStatic
        fun destroyInstance() {
            INSTANCE = null
        }
    }
}

```
-> DataSource(interface)를 입력받음   
-> BookmarkDataSource 상속받아 내부 메소드 오버라이드   
-> 추후에 RemoteLocalDataSource.kt 추가 됨   
	-> Local | Remote <-> 데이터 요청 로직 사이에서 데이터 crud 구현하여 callback 구현   
* companion object   
-> Kotlin에는 자바의 static 메소드가 없음   
	-> 싱글턴 패턴을 구현하기 위해서 companion object를 마지막에 넣어주어야 함    
		-> 패키지 전역에서 접근하여 활용   
* @JvmStatic   
-> java에서 해당 코드를 static으로 인지하도록 anotation 추가

## data/source/local/BookmarkDatabase.kt 
```
@Database(entities = [Bookmark::class], version = 1)
abstract class BookmarkDatabase : RoomDatabase() {

    abstract fun bookmarkDao(): BookmarkDao

    companion object {

        private var INSTANCE: BookmarkDatabase? = null

        private val lock = Any()

        fun getInstance(context: Context): BookmarkDatabase {
            synchronized(lock) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                        context.applicationContext,
                        BookmarkDatabase::class.java,
                        "bookmarks.db"
                    ).build()
                }
                return  INSTANCE!!
            }
        }
    }
}
```
-> abstract class (추상 클래스)   
	->  인터페이스와 흡사하지만 내부에 선언된 메소드를 강제하지 않음   
	->  이 객체를 생성할 경우 bookmarkDao interface를 선택적으로 사용함   
-> 싱글턴 패턴   
-> Room.databaseBuilder() 
	-> Bookmark.kt 에 선언된 entity를 기반으로 실제 bookmarks.db라는 파일을 생성하여 실제 로컬 table 생성   

## data/source/local/BookmarkDao.kt
```
@Dao
interface BookmarkDao {

    @Query("SELECT * FROM bookmarks")
    fun getBookmarks(): List<Bookmark>

    @Query("SELECT * FROM bookmarks WHERE id = :bookmarkId")
    fun getBookmarkById(bookmarkId: String): Bookmark?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertBookmark(bookmark: Bookmark)

    @Update
    fun updateBookmark(bookmark: Bookmark): Int

    @Query("DELETE FROM bookmarks WHERE id = :bookmarkId")
    fun deleteBookmarkById(bookmarkId: String): Int

    @Query("DELETE FROM bookmarks") fun deleteBookmarks()
}

```
-> 실제 Room database에서 활용되는 Query가 메소드로 구현   
-> BookmarkDatabase 추상 클래스에 선언되어 있음   
	-> BookmarkDatabase 를 통해 사용   
-> 실제 Database 의 query 문을 사용   

## data/source/local/BookmarkLocalDataSource.kt
```
class BookmarkLocalDataSource private constructor(
    private val appExecutors: AppExecutors,
    private val bookmarkDao: BookmarkDao
) : BookmarkDataSource {

    override fun getBookmarks(callback: BookmarkDataSource.LoadBookmarksCallback) {
        appExecutors.diskIO.execute {
            val bookmarks = bookmarkDao.getBookmarks()
            appExecutors.mainThread.execute {
                if (bookmarks.isEmpty()) {
                    callback.onDataNotAvailable()
                } else {
                    callback.onBookmarksLoaded(bookmarks)
                }
            }
        }
    }

    override fun getBookmark(
        bookmarkId: String,
        callback: BookmarkDataSource.GetBookmarkCallback
    ) {
        appExecutors.diskIO.execute {
            val bookmark = bookmarkDao.getBookmarkById(bookmarkId)
            appExecutors.mainThread.execute {
                if (bookmark != null) {
                    callback.onBookmarkLoaded(bookmark)
                } else {
                    callback.onDataNotAvailable()
                }
            }
        }
    }

    override fun saveBookmark(bookmark: Bookmark) {
        appExecutors.diskIO.execute { bookmarkDao.insertBookmark(bookmark) }
    }

    override fun deleteAllBookmarks() {
        appExecutors.diskIO.execute { bookmarkDao.deleteBookmarks() }
    }

    override fun deleteBookmark(bookmarkId: String) {
        appExecutors.diskIO.execute { bookmarkDao.deleteBookmarkById(bookmarkId) }
    }

    companion object {
        private var INSTANCE: BookmarkLocalDataSource? = null

        @JvmStatic
        fun getInstance(appExecutors: AppExecutors, bookmarkDao: BookmarkDao): BookmarkLocalDataSource {
            if (INSTANCE == null) {
                synchronized(BookmarkLocalDataSource::javaClass) {
                    INSTANCE = BookmarkLocalDataSource(appExecutors, bookmarkDao)
                }
            }
            return INSTANCE!!
        }

        @VisibleForTesting
        fun clearInstance() {
            INSTANCE = null
        }
    }
}

```
-> Room database에 실제 접근 할 bookmarkDao 인터페이스를 입력값으로 받음   
-> 로컬 데이터베이스 사용 시 thread 관리 할 AppExcutors를 입력값으로 받음   
-> BookmarkDataSource를 상속받음   
	-> 인터페이스 내부 메소드 오버라이드   
-> crud 메소드 내부에 bookmarkDao의 쿼리 인터페이스를 활용하여 실제 CRUD 구현   
	-> crud 결과를 callback 함수를 통해 요청한 로직에 전달   
> companion object 로 싱글턴 패턴 구현과 전역적으로 사용 할 수 있도록 선언    

## util/AppExcutors.kt
```
open class AppExecutors constructor(
    val diskIO: Executor = DiskIOThreadExecutor(),
    val mainThread: Executor = MainThreadExecutor()
		// 추후 networkIO도 추가됨
		 // val networkIO: Executor = Executors.newFixedThreadPool(THREAD_COUNT)
) {

    private class MainThreadExecutor : Executor {
        private val mainThreadHandler = Handler(Looper.getMainLooper())

        override fun execute(command: Runnable?) {
            if (command != null) {
                mainThreadHandler.post(command)
            }
        }
    }
}
```
-> 데이터베이스 접근 시 MainThread를 사용하면 충돌이 일어나 앱이 멈춰버림   
	-> 그렇기 때문에 새로운 Thread를 생성해서 사용해야 함     
	-> AppExcutors는 main, local, network thread를 각각 생성 함   
		-> 필요에 따라 각각의 thread를 꺼내쓰도록 함    
* open class   
-> java와 다르게 Kotlin은 class와 메소드가 기본적으로 final임    
	-> 클래스의 상속을 허용하려면 클래스 앞에 open 변경자를 붙여야함   
	-> 마찬가지로 오버라이드하고 싶은 메소드 or 프로퍼티 앞에도 open 변경자를 붙여야함   
	
## util/DiskIOThreadExecutor.kt
```
class DiskIOThreadExecutor : Executor {

    private val diskIO = Executors.newSingleThreadExecutor()

    override fun execute(command: Runnable?) { diskIO.execute(command) }
}
```
-> local database crud 할 때 사용할 thread 를 생성함
