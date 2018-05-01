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

Template.nav.events({
  "click .createAcc": function(event, template){
    $('.registerModal').show()
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
