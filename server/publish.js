Meteor.publish("posts", function(limit, currentUser, page, sortBy, post, game){
  var dl = limit || 5;
  var skip = 0
  if(page){
    skip = page * 10 - 10;
  }
  console.log(skip)
  if(post){
    return posts.find({_id: post})
  }else{
    if(game){
      return posts.find({gameMode: game}, {sort: {date: -1}, skip: skip, limit: dl});
    }else{
      return posts.find({}, {sort: {date: -1}, skip: skip, limit: dl});
    }
  }
});

Meteor.publish("catagory", function(argument){
  return catagory.find({})
});

Meteor.publish("comments", function(post){
  console.log(post)
  return comments.find({postId:post})
});
