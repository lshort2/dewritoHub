Deps.autorun( function(){
  reactPost.set(true)
  Meteor.subscribe('posts')
});

Deps.autorun(function(){
  Meteor.subscribe('comments', currentPost.get())
});

Deps.autorun( function(){
  Meteor.subscribe('userStuff', currentUser.get())
});

//modal closer
Meteor.modals ={
  closeModal : (target, target2) =>{
    $(document).bind("mouseup touchend", function (e) {
      var container = $(target2);
      var modal = $(target);

      if (!container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        modal.hide();
      }
    });
  },
  closeDropdown: (trigger, dropdown)=>{
    $(document).bind("mouseup touchend", function (event) {
      if (!event.target.matches(trigger)) {
        $(dropdown).hide()
      }
    })
  }
}

//notification decay
Meteor.notiDecay = {
  notiDecay : (target) =>{
    var thisOne = $('#'+target)
    setTimeout(function () {
      thisOne.fadeOut();
      setTimeout(function () {
        thisOne.remove();
      }, 400);
    }, 3800);
  }
}
