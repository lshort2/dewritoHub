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
