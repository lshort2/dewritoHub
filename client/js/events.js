function notiSet(type, text){
  var id = Math.random().toString(36).substr(2, 10);
  var timePF = new Date()
  timePF = timePF.toString().split(" ");
  timePF = timePF[1] + " " + timePF[2] + " " + timePF[3]
  var date = new Date();
  var options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  var timeString = date.toLocaleString('en-US', options);
  if(type == 'success'){
    $('.notifications').append('<div class="notify gr" id="'+id+'">'+text+'</div>')
  }else{
    $('.notifications').append('<div class="notify rd" id="'+id+'">'+text+'</div>')
  }
  Meteor.notiDecay.notiDecay(id)
}

function reset(){
  appTracker.set('')
  currentPost.set('')
  currentUser.set('')
  postLimit.set(10)
  postSearch.set('')
  pageNum.set('')
  lastPage.set(0)
  saved.set('')

  $('.gameSelect').each(function() {
    $( this ).removeClass('active')
  });
  currentGame.set('')
  $(document).scrollTop(0)
}

Template.nav.events({
  "click .createAcc": function(event, template){
    $('.registerModal').show()
  },
  'click .brand': ()=>{
    reset()
    Meteor.pushState.pushState()
  },
  'click .upload': ()=>{
    reset()
    appTracker.set('create')
  },
  'click .fa-cog': ()=>{
    $(".profileDropdown").show()
  },
  'click .logout': ()=>{
    Meteor.logout();
  },
  'click .appSet': ()=>{
    reset()
    appTracker.set('settings')
  },
  'click .saved':()=>{
    saved.set('go')
    reactPost.set(true)
  },
  'keyup .search': (event)=>{
    if(event.keyCode == 13){
      var searchVal = $('.search').val()
      Meteor.pushState.pushState('home')
      reset()
      postSearch.set(searchVal)
    }
    //or when the search is empty
    else if($('.search').val().length == 0){
      postSearch.set($('.search').val())
    }
  },
  'click .goProfile':()=>{
    reset()
    Meteor.pushState.pushState(Meteor.user().username, 'user')
  }
});

Template.register.events({
  'click .acc-action': ()=>{
    var username = $('.username').val()
    var password = $('.password').val()

    if($('.acc-action').html() == 'Login'){
      Meteor.loginWithPassword(username, password, function(err, res){
        if(!err){ $('.registerModal').hide(); location.reload(); notiSet('success', 'Welcome '+username)}
        else{
          notiSet('fail', 'Somethings not right')
        }
      });
    }else{
      var passwordConf = $('.passwordConf').val()

      //if we meet minimal requirements
      if(username.length >= 4 && password.length >= 6 && password == passwordConf){
        if(/^[A-Za-z0-9_-]+$/.test(username)){
          Meteor.call('userExists', username, function(err,res){
            if(res){notiSet('fail', 'Username Taken')}
          })
          Meteor.call('signup', username, password, function(err, res){
            if(res == 'All Good!'){
              $('.registerModal').hide()
              notiSet('success', 'Welcome '+username)
              Meteor.loginWithPassword(username, password, function(err, res){
                if(!err){ $('.registerModal').hide() }
              });
            }
          })
        }else{
          notiSet('fail','Username can be A-Za-z0-9_-')
        }
      }
      if(username.length < 4){
        notiSet('fail', 'Username too short')
      }
      if(password.length < 6){
        notiSet('fail', 'Password Too Short')
      }
      if(password != passwordConf){
        notiSet('fail', "Passwords Don't Match")
      }
    }
  },
  'click .acc-switch': ()=>{
    if($('.acc-action').html() == 'Login'){
      $('.acc-action').html('Register')
      $('.acc-switch').html('Login')
      $('.passwordConf').show()
    }else{
      $('.acc-action').html('Login')
      $('.acc-switch').html('Register')
      $('.passwordConf').hide()
    }
  }
})

Template.content.events({
  "click .thumb": function(e){
    var thumb = e.currentTarget.src
    thumb = thumb.replace('thumbs', 'images')
    $('.hero').attr('src', thumb)
  },
  'click .download': ()=>{
    Meteor.call('download', currentPost.get())
  },
  'click .postDelete': ()=>{
    $('.deleteModal').show()
  },
  'click .upVote':(e)=>{
    Meteor.call('upvote', e.currentTarget.id)
    if(!$(e.currentTarget).addClass('voted')){
      $(e.currentTarget).addClass('voted')
    }else{
      $(e.currentTarget).removeClass('voted')
    }
    $('.downVote').removeClass('voted')
  },
  'click .downVote': (e)=>{
    Meteor.call('downvote', e.currentTarget.id)
    if(!$(e.currentTarget).addClass('voted')){
      $(e.currentTarget).addClass('voted')
    }else{
      $(e.currentTarget).removeClass('voted')
    }
    $('.upVote').removeClass('voted')
  },
  'click .mapMaker':(e)=>{
    e.preventDefault()
    reset()
    Meteor.pushState.pushState($(e.currentTarget).html(), 'user')
    currentUser.set($(e.currentTarget).html())
  },
  'click .commentMaker':(e)=>{
    e.preventDefault()
    reset()
    Meteor.pushState.pushState($(e.currentTarget).html(), 'user')
    currentUser.set($(e.currentTarget).html())
  },
  'click .addFave':(e)=>{
    Meteor.call('savePost', e.currentTarget.id, function(err,res){
      if(res == 'pulled'){
        notiSet('fail', 'Pulled from Saved')
        $('.addFave').removeClass('voted')
      }if(res == 'saved'){
        notiSet('success', "Saved post");
        $('.addFave').addClass('voted')
      }
    })
  },
  'click .comDelete':(e)=>{
    var id = e.currentTarget.id
    $('.deleteModal').show()
    $('.forType').html('comment')
    $('.forType').attr('id', id)
  },
  'click .comEdit':(e)=>{
    var id = e.currentTarget.id
    $('#'+id+'meat').hide()
    $('#'+id+'act').hide()
    $('.saveCom').addClass('saveComVis')
    $('#'+id+'newCom').show()
  },
  'click .goSaveCom':(e)=>{
    var id = e.currentTarget.id
    var meat = $('#'+id+'newCom').val()
    Meteor.call('editComment', id, meat, function(err,res){
      if(res == 'edit'){
        notiSet('success','Comment edited')
        $('#'+id+'meat').show()
        $('#'+id+'act').show()
        $('.saveCom').removeClass('saveComVis')
        $('#'+id+'newCom').hide()
      }
      else{notiSet('fail', "You can't do that")}
    })
  },
  'click .comEditCan':(e)=>{
    var id = e.currentTarget.id
    $('#'+id+'meat').show()
    $('#'+id+'act').show()
    $('.saveCom').removeClass('saveComVis')
    $('#'+id+'newCom').hide()
  },
  'click .postEdit':()=>{
    $('.proper').hide()
    $('.edit').show()
  },
  'click .savePostEdit': ()=>{
    var newDesc = $('.newDesc').val()
    var newMap = ''
    var newMapExcerpt = $('.newExcerpt').val()
    var newMapCata = $('.newMapCatagory').val()

    function readFile(file, onLoadCallback){
      var reader = new FileReader();
      reader.onload = onLoadCallback;
      reader.readAsDataURL(file);
    }

    if($('#newMapFile')[0].files[0]){
      readFile($('#newMapFile')[0].files[0], function(e){
        newMap = e.target.result;
      })
    }

    function checkVariable() {
      if(newMap && newDesc && newMapCata && newMapExcerpt){
        $('.savePostEdit').prop('disabled', true);
        Meteor.call('updatePost', currentPost.get(), newDesc, newMap, $('#newMapFile')[0].files[0].name, newMapCata, newMapExcerpt, function(err,res){
          if(res == 'success'){notiSet('success', 'Post updated'); location.reload()}else{
            notiSet('fail', 'Somethings not right')
            $('.savePostEdit').prop('disabled', false);
          }
        })
      }else if(!$('#newMapFile')[0].files[0] && newDesc && newMapCata && newMapExcerpt){
        $('.savePostEdit').prop('disabled', true);
        Meteor.call('updatePost', currentPost.get(), newDesc, newMap, 'null', newMapCata, newMapExcerpt, function(err,res){
          if(res == 'success'){notiSet('success', 'Post updated'); location.reload()}else{
            notiSet('fail', 'Somethings not right')
            $('.savePostEdit').prop('disabled', false);
          }
        })
      }
    }
    setTimeout(checkVariable, 500);
  }
});

Template.createComment.events({
  'click .commentBttn':(e, tmpl)=>{
    var comment = {
      postId: currentPost.get(),
      meat: tmpl.find(".commentText").value,
      date: new Date(),
    };

    if(comment.meat.length >= 5){
      if(parentId.get()) {
        comment.parentId = parentId.get();
        comment.postId1 = this.postId1;
      }
      else {
        comment.postId1 = this._id;
      }
      Meteor.call("createComment", comment);
      //resets comment field
      $('.commentText').val('')
      parentId.set(null);
    }
  }
});

Template.commentItem.events({
  "click .reply": function(e){
    console.log(e.currentTarget.id)
    parentId.set(e.currentTarget.id);
  }
});

Template.delete.events({
  "click .deleteBttn": function(){
    if($('.forType').html() == 'comment'){
      Meteor.call('deleteComment', $('.forType').attr('id'), function(err, res){
        if(res == 'deleted'){notiSet('success','Deleted comment'); $('.deleteModal').hide()}
        else{notiSet('fail', "You can't do that"); $('.deleteModal').hide()}
      })
    }else{
      Meteor.call('deletePost', currentPost.get(), function(err, res){
        if(res == 'deleted'){notiSet('success','Deleted post'); reset(); $('.deleteModal').hide()}
        else{notiSet('fail', "You can't do that"); $('.deleteModal').hide()}
      })
    }
  },
  'click .deleteCancel':()=>{
    $('.deleteModal').hide()
  }
});
Template.main.events({
  "click .postCard": function(event, template){
    reset()
    event.preventDefault()
    currentPost.set(event.currentTarget.id)
    Meteor.pushState.pushState(event.currentTarget.id, 'post')
    appTracker.set('post')
  },
  'click .fa-chevron-left':()=>{
    if(pageNum.get() < 1){
      // do nothing
    }else{
      pageNum.set(pageNum.get() - 1)
      history.pushState('', document.title, "/page="+pageNum.get());
    }
  },
  'click .fa-chevron-right':()=>{
    if(pageNum.get() < 1){
      pageNum.set(2)
      history.pushState('', document.title, "/page="+pageNum.get());
    }else{
      pageNum.set(pageNum.get() + 1)
      history.pushState('', document.title, "/page="+pageNum.get());
    }
  },
  'click .gameSelect':(e)=>{
    currentGame.set($(e.currentTarget).html())
    $('.gameSelect').each(function() {
      $( this ).removeClass('active')
    });
    $(e.currentTarget).addClass('active')
  },
  'click .sixteen-nine':(event)=>{
    reset()
    currentPost.set(event.currentTarget.id)
    appTracker.set('post')
    event.preventDefault()
    Meteor.pushState.pushState(event.currentTarget.id, 'post')
    appTracker.set('post')
  },
  'click .goPrivy':()=>{
    appTracker.set('privacy')
  },
  'click .goTos':()=>{
    appTracker.set('terms')
  },
  'click .sortHot':()=>{
    sortBy.set('hot')
    reactPost.set(true)
    $('.sortHot').addClass('active')
    $('.sortNew, .sortTop').removeClass('active')
  },
  'click .sortNew':()=>{
    sortBy.set('new')
    reactPost.set(true)
    $('.sortNew').addClass('active')
    $('.sortHot, .sortTop').removeClass('active')
  },
  'click .sortTop':()=>{
    sortBy.set('top')
    reactPost.set(true)
    $('.sortTop').addClass('active')
    $('.sortNew, .sortHot').removeClass('active')
  }
});

Template.create.events({
  "click .mapPost": function(event, template){
    var title = $('.mapTitle').val()
    var description = $('.mapDescription').val()
    var excerpt = $('.mapExcerpt').val()
    var tags = $('.mapTags').val()
    var url = $('.mapUrl').val()
    var catagory = $('.mapCatagory').val()
    var minPlayer = $('.minPlayer').val()
    var maxPlayer = $('.maxPlayer').val()

    var mapFile = ''

    // TODO: ouch. Loop this shit.
    var maxImages = 5;
    var img = []
    var imgDat = []
    for(var i = 0; i < maxImages; i++){
      img.push($('#files'+[i])[0].files[0])
    }

    var newImages = [];
    for (var i = 0; i < img.length; i++) {
      if (img[i]) {
        newImages.push(img[i]);
      }
    }

    for(var i = 0; i < newImages.length; i++){
      if(newImages[i]){
        readFile(newImages[i], function(e) {
          // use result in callback...
          imgDat.push(e.target.result);
        });
      }
    }

    readFile($('#mapFile')[0].files[0], function(e){
      mapFile = e.target.result;
    })

    function readFile(file, onLoadCallback){
      var reader = new FileReader();
      reader.onload = onLoadCallback;
      reader.readAsDataURL(file);
    }

    function checkVariable() {
      var newDat = [];
      for (var i = 0; i < imgDat.length; i++) {
        if (imgDat[i]) {
          newDat.push(imgDat[i]);
        }
      }
      var canPost = [];
      for(var i = 0; i < newImages.length; i++){
        if(newImages[i] && newDat[i]){
          canPost[i] = 'true'
        }
      }
      if(mapFile){
        canPost.push('true')
      }
      if(title && description && excerpt && minPlayer && maxPlayer){
        canPost.push('true')
      }else{
        var vals = [title, description, excerpt, minPlayer, maxPlayer]
        var titles = ['title', 'description', 'short description', 'min players', 'max players']
        for(var c = 0; c < vals.length; c++){
          // look at me, I know c++ !
          if(!vals[c]){
            notiSet('fail', 'Missing '+titles[c])
          }
        }
      }

      if(canPost.length == newImages.length +2){
        $('.mapPost').prop('disabled', true);
        Meteor.call('createPost', title, description, excerpt, tags, url, catagory, minPlayer, maxPlayer, newDat, mapFile, $('#mapFile')[0].files[0].name, function(err, res){
          if(!err){notiSet('success', 'Posted successfully'); currentPost.set(res); appTracker.set('post')}
          else{
            $('.mapPost').prop('disabled', false);
          }
        })
      }
    }
    setTimeout(checkVariable, 500);
  }
});


Template.settings.events({
  "click .goGen": function(event, template){
    $('.gen').show()
    $('.adv').hide()
  },
  'click .goAdv': ()=>{
    $('.gen').hide()
    $('.adv').show()
  },
  'click .saveAdv': ()=>{
    var oldPassword = $('.curPass').val()
    var newPassword = $('.newPass').val()
    var newConf = $('.newPassConf').val()

    if(newPassword == newConf && newPassword.length >= 6){
      Accounts.changePassword(oldPassword, newPassword, function(err,res){
        if(!err){
          notiSet('success', 'Password Changed')
          reset()
        }else{
          notiSet('fail', 'Somethings not right')
        }
      })
    }

  },
  'click .saveGen':()=>{
    var email = $('.setEmail').val()
    var reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if(email.match(reg)){
      Meteor.call('updateUser', email, function(err,res){
        if(!err){
          notiSet('success', 'Settings Updated')
          reset()
        }
      })
    }else{
      notiSet('fail', 'Email not valid')
    }
  }
});
