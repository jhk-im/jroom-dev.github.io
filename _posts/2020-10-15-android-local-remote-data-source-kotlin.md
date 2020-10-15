---
title: android local & remote data source - kotlin
category: android-kotlin
tags:
- Kotlin
- Android
- MVVM
- Database
---

참고자료   
[https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin](https://github.com/ll0301/architecture-samples/tree/todo-mvvm-live-kotlin)

---
---

## Script 
> Kotlin    
* data   
	- source   
		+ BookmarkRepository.kt   
		+ remote   
			+ BookmarkRemoteDataSource.kt     
* (mock)   
	- Injection.kt   

## data/source/BookmarkRemoteDataSource.kt
```
object BookmarkRemoteDataSource : BookmarkDataSource {

    private const val SERVICE_LATENCY_IN_MILLIS = 5000L

    private var BOOKMARKS_SERVICE_DATA = LinkedHashMap<String, Bookmark>(2)

    init {
        addBookmark("Google", "Portal","https://www.google.com")
        addBookmark("Naver", "Portal","https://www.naver.com")
        addBookmark("Daum", "Portal","https://www.daum.net")
    }

    private fun addBookmark(title: String, category: String, url: String) {

        val newBookmark = Bookmark(title, category, url)

        BOOKMARKS_SERVICE_DATA.put(newBookmark.id, newBookmark)
    }

    override fun getBookmarks(callback: BookmarkDataSource.LoadBookmarksCallback) {

        val bookmarks = Lists.newArrayList<Bookmark>(BOOKMARKS_SERVICE_DATA.values)

        // Simulate network
        Handler(Looper.getMainLooper()).postDelayed({
            callback.onBookmarksLoaded(bookmarks)
        }, SERVICE_LATENCY_IN_MILLIS)
    }

    override fun getBookmark(
        bookmarkId: String,
        callback: BookmarkDataSource.GetBookmarkCallback
    ) {

        val bookmark = BOOKMARKS_SERVICE_DATA[bookmarkId]

        // simulate network
        with(Handler(Looper.getMainLooper())) {
            if (bookmark != null) {
                postDelayed({ callback.onBookmarkLoaded(bookmark) }, SERVICE_LATENCY_IN_MILLIS)
            } else {
                postDelayed({ callback.onDataNotAvailable() }, SERVICE_LATENCY_IN_MILLIS)
            }
        }
    }

    override fun saveBookmark(bookmark: Bookmark) {

        BOOKMARKS_SERVICE_DATA.put(bookmark.id, bookmark)
    }

    override fun deleteAllBookmarks() {

        BOOKMARKS_SERVICE_DATA.clear()
    }

    override fun deleteBookmark(bookmarkId: String) {

        BOOKMARKS_SERVICE_DATA.remove(bookmarkId)
    }

    override fun refreshBookmark() {
        //
    }
}

```
-> 아직 원격 데이터베이스와 api가 셋팅되어있지 않기때문에 cache를 활용하여 임시로 구현   
* LinkedHashMap<String, Bookmark>
	-> id와 bookmark 객체를 crud   
	-> remote database 가 구현이 안되어 있어도 linkedhashmap을 통해 테스트 가능   
	-> linkedhasmap은 cache 메모리 이며 속도가 빠름   
		-> 변동이 없는 경우 cache에서 가져오는 편이 속도나 성능면에서 이득   
		-> remote - cache 를 동기화해주는 로직을 구현해야함   
* init {}   
-> init block 이라 하며 객체 생성시 호출 됨   
	-> google, naver, daum 이라는 임시 데이터 모델이 객체 생성 시 자동으로 생성되어 linkedhasmap에 추가됨   
* BookmarkDataSource 상속   
	-> 내부 메소드가 오버라이드 되며 임시 cache linkedmap 를 통해 crud 동작 구현

## data/source/BookmarkRepository.kt
```
class BookmarkRepository(
    private val bookmarkLocalDataSource: BookmarkDataSource,
    private val bookmarkRemoteDataSource: BookmarkDataSource
) : BookmarkDataSource {

    var cachedBookmarks: LinkedHashMap<String, Bookmark> = LinkedHashMap()

    var cacheIsDirty = false

    private fun refreshCache(bookmarks: List<Bookmark>) {
        cachedBookmarks.clear()
        bookmarks.forEach {
            cacheAndPerform(it) {}
        }
        cacheIsDirty = false
    }

    private fun refreshLocalDataSource(bookmarks: List<Bookmark>) {
        bookmarkLocalDataSource.deleteAllBookmarks()
        for (bookmark in bookmarks) {
            bookmarkLocalDataSource.saveBookmark(bookmark)
        }
    }

    private fun getBookmarkFromRemoteDataSource(callback: BookmarkDataSource.LoadBookmarksCallback) {
        bookmarkRemoteDataSource.getBookmarks(object : BookmarkDataSource.LoadBookmarksCallback {
            override fun onBookmarksLoaded(bookmarks: List<Bookmark>) {
                refreshCache(bookmarks)
                refreshLocalDataSource(bookmarks)

                callback.onBookmarksLoaded(ArrayList(cachedBookmarks.values))
            }

            override fun onDataNotAvailable() {
                callback.onDataNotAvailable()
            }

        })
    }

    private fun getBookmarkId(id: String) = cachedBookmarks[id]

    private inline fun cacheAndPerform(bookmark: Bookmark, perform: (Bookmark) -> Unit) {
        val cachedBookmark =
            Bookmark(
                bookmark.id,
                bookmark.category,
                bookmark.url,
                bookmark.title
            ).apply {
                favicon = bookmark.favicon
                position = bookmark.position
            }

        cachedBookmarks[cachedBookmark.id] = cachedBookmark
        perform(cachedBookmark)
    }

		. . .
		BookmarkDataSource override method 
		. . .


    companion object {

        private var INSTANCE: BookmarkRepository? = null

        @JvmStatic
        fun getInstance(
            bookmarkLocalDataSource: BookmarkDataSource,
            bookmarkRemoteDataSource: BookmarkDataSource
        ) =
            INSTANCE ?: synchronized(BookmarkRepository::class.java) {
                INSTANCE ?: BookmarkRepository(
                    bookmarkLocalDataSource,
                    bookmarkRemoteDataSource
                ).also { INSTANCE = it }
            }

        @JvmStatic
        fun destroyInstance() {
            INSTANCE = null
        }
    }
}

```
* BookmarkDataSource 를 2개 입력받아 remote와 local로 나눔   
* var cachedBookmarks: LinkedHashMap<String, Bookmark> = LinkedHashMap()   
	- cache의 사용으로 속도와 성능 향상   
* var cacheIsDirty = false   
 * Bookmark data에 변동이있는지 구분   
 - 변동이 없으면 false / 변동이 있으면 true   
* refreshCache()   
	- LinkedHashMap() 을 refresh 함   
* refreshLocalDataSource()   
	- Room Database의 bookmarks 테이블을 refresh함   
* getMookmarkRemoteDataSource()   
	- local에는 없으나 remote에 객체가 존재할 때 (동기화가 안된 상황)    
		+ cache와 room database를 refresh 하여 동기화   
		+ 가져온 객체를 callback으로 반환   
* getBookmarkId()   
	- cache에서 입력받은 id의 bookmark 객체 찾아 반환   
* cacheAndPerform()   
	- inline fun   
		+ Kotlin은 컴파일 단계에서 함수 타입의 변수(람다)를 FunctionN 인터페이스를 구현한 객체로 저장    
		+ 매개변수에 따라 Function0<R> , Function1<P1, R> ... Function22<...> 까지 제공됨    
		+ 각각의 람다식마다 객체가 생성되어 메모리에 저장되고 invoke() 함수가 각각 호출되어 메모리할당 및 가상 호출에 의한 런타임 오버헤드 발생    
		+ 람다를 매개로하는 고차함수를 inline fun 으로 정의하여 오버헤드를 줄임    
		+ 직접 객체를 호출하기 보단 함수의 본문을 복붙함     
		+ saveBookmark() , refreshCache(),  getBookmark() 등 단일 객체를 가져오거나 저장할 때 cahce 상의 객체를 동기화   
* (Bookmark) -> Unit   
	- 함수의 반환 구문이 없다는 것을 표현하기 위해 사용 = java의 void
