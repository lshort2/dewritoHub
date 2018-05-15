Meteor.methods({
  badDl:function(id){
    //this will eventually be super mods
    if(Meteor.user().username == 'finchMFG'){
      posts.update({_id: id}, {$set: {bad: 'dl'}})
    }
  },
  badImg: function(id){
    if(Meteor.user().username == 'finchMFG'){
      posts.update({_id: id}, {$set: {bad: 'img'}})
    }
  },
  del:function(id){
    if(Meteor.user().username == 'finchMFG'){
      posts.remove({_id: id})
    }
  }
});
