// put template helpers here
Template.main.helpers({
  posts: function(){
    return posts.find({})
  }
});

Template.content.helpers({
  post: function(){
    return posts.findOne({})
  }
});

// put global helpers here

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

Template.registerHelper("create", function(argument){
  if(appTracker.get() == 'create') return true;
});

Template.registerHelper("settings", function(argument){
  if(appTracker.get() == 'settings') return true;
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
