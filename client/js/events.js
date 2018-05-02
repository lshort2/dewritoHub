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
  postLimit.set(20)
  postSearch.set('')
  pageNum.set('')
  lastPage.set(0)
}

Template.nav.events({
  "click .createAcc": function(event, template){
    $('.registerModal').show()
  },
  'click .brand': ()=>{
    reset()
  },
  'click .upload': ()=>{
    reset()
    appTracker.set('create')
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

Template.main.events({
  "click .postCard": function(event, template){
    reset()
    currentPost.set('hello')
    appTracker.set('post')
  }
});

Template.create.events({
  "click .mapPost": function(event, template){
    var title = $('.mapTitle').val()
    var description = $('.mapDescription').val()
    var excerpt = $('.mapExcerpt').val()
    var tags = $('.mapTags').val()
    var url = $('.mapUrl').val()
    // TODO: ouch. Loop this shit.
    var maxImages = 4;
    var img = []
    var imgDat = []
    for(var i = 0; i < maxImages; i++){
      if(i == 0){
        img[i] = $('#files')[0].files[0]
      }else{
        img[i] = $('#files'+[i])[0].files[0]
      }
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
          imgDat[i] = e.target.result;
        });
      }
    }

    var newDat = [];
    for (var i = 0; i < newImages.length; i++) {
      if (newImages[i]) {
        newDat.push(newImages[i]);
      }
    }

    function readFile(file, onLoadCallback){
      var reader = new FileReader();
      reader.onload = onLoadCallback;
      reader.readAsDataURL(file);
    }

    function checkVariable() {
      var canPost = [];
      for(var i = 0; i < newImages.length; i++){
        if(newImages[i] && newDat[i]){
          canPost[i] = 'true'
        }
      }
      if(title && description && excerpt){
        canPost.push('true')
      }

      if(canPost.length == newImages.length +1){
        console.log('can post!!!')
      }
    }
    setTimeout(checkVariable, 500);
  }
});
