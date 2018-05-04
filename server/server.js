//first time init
var catagoriesList = ['Slayer','Oddball','King of the Hill','Capture the Flag','Assault', 'Territories', 'Juggernaut', 'Infection', 'Other', 'Mini game', 'Aesthetic', 'Puzzle', 'VIP', 'Race', 'Prefabs']

for(var i = 0; i < catagoriesList.length; i++){
  if(catagory.findOne({name: catagoriesList[i]})){

  }else{
    catagory.insert({name: catagoriesList[i], count: 0})
  }
}

// the signup method
Meteor.methods({
  'signup': (username, password) =>{
    if(username.length >= 4 && password.length >= 6 && username.length < 20 && /^[A-Za-z0-9_-]+$/.test(username)){
      Accounts.createUser({
        username: username,
        password: password
      });
      Meteor.call("userStuffCreate", username);
      return 'All Good!'
    }
  },
  'userStuffCreate': function (username){
    console.log('firing')
    if(userStuff.findOne({username: username})){

    }
    else{
      userStuff.insert({username: username, createdPosts: [], createdComments: [], savedPosts: []});
    }
  }
})

Meteor.methods({
  'userExists' : (params) =>{
    if(userStuff.findOne({username:{$regex: new RegExp (params, "i")}})){
      return userStuff.findOne({username:{$regex: new RegExp (params, "i")}}).username.toLocaleLowerCase();
    }
  }
})

Meteor.methods({
  'postExists' : (params) =>{
    if(posts.findOne({_id: params})){
      posts.update({_id: params}, {$inc: {views: 1}})
      return [posts.findOne({_id:params})._id, posts.findOne({_id:params}).title];
    }
    else if(announcements.findOne({_id: params})){
      return announcements.findOne({_id: params})._id;
    }
  }
})

Meteor.methods({
  'download' : (params) =>{
    if(posts.findOne({_id: params})){
      setTimeout(function(){
        Fiber(function() {
          posts.update({_id: params}, {$inc: {downloads: 1}})
        }).run();
      }, Math.floor((Math.random() * 100000) + 10000));
    }
  }
})
