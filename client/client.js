Meteor.subscribe('userStuff')

Deps.autorun( function(){
  reactPost.set(true)
  Meteor.subscribe('posts', postLimit.get(), currentUser.get(), pageNum.get(), sortBy.get(), currentPost.get(), currentGame.get(), saved.get(), postSearch.get())
});

Deps.autorun(function(){
  Meteor.subscribe('comments', currentPost.get())
});

Meteor.subscribe('catagory')

Meteor.subscribe('featured')

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

window.onload = function () {
  if (typeof history.pushState === "function") {
    history.pushState("jibberish", null, null);
    window.onpopstate = function () {
      history.pushState('newjibberish', null, null);
      // Handle the back (or forward) buttons here
      // Will NOT handle refresh, use onbeforeunload for this.
      currentPost.set('')
      appTracker.set('')
      profileTracker.set('')
      currentUser.set('')
      Meteor.pushState.pushState('home')
    };
  }
  else {
    var ignoreHashChange = true;
    window.onhashchange = function () {
      if (!ignoreHashChange) {
        ignoreHashChange = true;
        window.location.hash = Math.random();
        // Detect and redirect change here
        // Works in older FF and IE9
        // * it does mess with your hash symbol (anchor?) pound sign
        // delimiter on the end of the URL
      }
      else {
        ignoreHashChange = false;
      }
    };
  }
}
