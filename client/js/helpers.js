// put template helpers here


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
