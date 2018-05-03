Deps.autorun( function(){
  reactPost.set(true)
  Meteor.subscribe('posts', postLimit.get(), currentUser.get(), pageNum.get(), sortBy.get(), currentPost.get(), currentGame.get())
});

Deps.autorun(function(){
  Meteor.subscribe('comments', currentPost.get())
});

Meteor.subscribe('catagory')

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

// push route
Meteor.pushState ={
  pushState:(target, type) =>{
    console.log(target)
    if(type == 'post'){
      var title = posts.findOne({_id: target}).title
      document.title = title
      title = title.replace(/\s+/g, '-')
      title = title.replace(/[^0-9\-\w]/ig, '')
      title = title.toLocaleLowerCase()
      title = encodeURI(title) + "/"
      target = target + "/" +title
      window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
      history.pushState('', document.title, "map/"+target);
    }else if(type == 'user'){
      reset()
      window.history.pushState("object or string", "Title", "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
      history.pushState('', document.title, "user/"+target);
      currentUser.set(target.toLocaleLowerCase())
    }else if(target == "home" || !target){
      pageNum.set('')
      history.pushState('', document.title, "/");
      document.title = "DewRito Hub"
    }
  }
}
