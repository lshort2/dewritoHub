// get current post
currentPost = new ReactiveVar("");

// get current user
currentUser = new ReactiveVar("");

// get current app location
appTracker = new ReactiveVar("");

// get sort prederence ** defaults to hot
sortBy = new ReactiveVar('New')

// get reactive state of Posts
reactPost = new ReactiveVar(true)

// view where you are on profile
profileTracker = new ReactiveVar('')

// post limit per lazy load
postLimit = new ReactiveVar(10)

// comment limit per lazy load
commentLimit = new ReactiveVar(100)

// for searching
postSearch = new ReactiveVar('')

// for tracking page number
pageNum = new ReactiveVar('')
lastPage = new ReactiveVar(0)
