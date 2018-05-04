// put template helpers here

theFeatured = new ReactiveVar(false);
Template.main.helpers({
  posts: function(){
    if(sortBy.get() == 'hot'){
      return posts.find({}, {sort: {score: -1}})
    }if(sortBy.get() == 'top'){
      return posts.find({}, {sort: {newSate: -1}})
    }if(sortBy.get() == 'new'){
      return posts.find({}, {sort: {date: -1}})
    }
  },
  'catagory': ()=>{
    return catagory.find({})
  },
  featured: function() {
    if (theFeatured.get() === false) {
      Meteor.call('featured', function(err, res){
        theFeatured.set(res)
      })
    }
    return theFeatured.get();
  }
});

Template.content.helpers({
  post: function(){
    return posts.findOne({_id: currentPost.get()})
  },
  comment: function() {
    return comments.find({postId: currentPost.get()}, {sort: {date: -1}});
  }
});

// put global helpers here

Template.registerHelper("email", function(argument){
  try{
    return userStuff.findOne({username: Meteor.user().username}).email
  }catch(e){}
});

Template.registerHelper("equals", function(a, b){
  return a === b;
});

Template.registerHelper('cons', function (a, b) {
  try{
    for (var i = 0; i < a.length; i++) {
      if (a[i] === b) {
        return true;
      }
    }
  }catch(e){}
});

Template.registerHelper("home", function(argument){
  if(appTracker.get() == '' || appTracker.get() == 'home') return true;
});

Template.registerHelper("post", function(argument){
  if(currentPost.get()) return true;
});

Template.registerHelper("saved", function(argument){
  if(saved.get()) return true;
});

Template.registerHelper("onUser", function(argument){
  if(currentUser.get()) return currentUser.get();
});

Template.registerHelper("create", function(argument){
  if(appTracker.get() == 'create') return true;
});

Template.registerHelper("settings", function(argument){
  if(appTracker.get() == 'settings') return true;
});

Template.registerHelper("privacy", function(argument){
  if(appTracker.get() == 'privacy') return true;
});

Template.registerHelper("terms", function(argument){
  if(appTracker.get() == 'terms') return true;
});

Template.registerHelper("curPage", function(argument){
  if(pageNum.get() == '') {return '1'}
  else{return pageNum.get()}
});


// markdown
Template.registerHelper('markdown', function (text, options) {
  kramed.setOptions({
    renderer: new kramed.Renderer()
    , gfm: true
    , tables: true
    , breaks: false
    , pedantic: false
    , sanitize: true
    , smartLists: true
    , smartypants: false
  });
  text = kramed(text);
  //text = text.replace(/\n{1,9}/g, '<br>');
  text = text.replace(/\\n/g, '');

  //text = text.replace(/(?:\\[rn])+/g, '<br><br>');
  text = text.replace(/\\/g, '');
  text = text.slice(0, -5);

  return new Spacebars.SafeString(text);
});
