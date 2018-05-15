Meteor.methods({
  badDl:function(id){
    //this will eventually be super mods
    if(Meteor.user().username == 'finchMFG'){
      var mapId = posts.findOne({_id: id}).mapId
      if(mapId){
        posts.update({_id: id}, {$set:{dlMap: 'https://f000.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId='+mapId}})
      }else{
        posts.update({_id: id}, {$set: {bad: 'dl'}})
      }
    }
  },
  badImg: function(id){
    if(Meteor.user().username == 'finchMFG'){
      posts.update({_id: id}, {$set: {bad: 'img'}})
    }
  },
  del:function(id){
    if(Meteor.user().username == 'finchMFG'){
      var type = posts.findOne({_id: id}).gameMode
      posts.remove({_id: id})
      catagory.update({name:type}, {$inc: {count: -1}})
    }
  }
});
