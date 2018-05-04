Meteor.publish("posts", function(limit, currentUser, page, sortBy, post, game){
  var dl = limit || 5;
  var skip = 0
  var featured = ['']
  try{
    featured = featured.find({}).map(function(e) { return e._id; })
  }catch(e){}

  if(page){
    skip = page * 10 - 10;
  }
  if(post){
    return posts.find({_id: post})
  }else{
    if(currentUser){
      var createdPosts = userStuff.findOne({username: {$regex: new RegExp (currentUser, "i")}}).createdPosts
      if(game){
        return posts.find({_id: {$in: createdPosts}, gameMode: game}, {sort: {date: -1}, skip: skip, limit: dl});
      }else{
        return posts.find({_id: {$in: createdPosts}}, {sort: {date: -1}, skip: skip, limit: dl});
      }
    }else{
      if(game){
        return posts.find({gameMode: game}, {sort: {date: -1}, skip: skip, limit: dl});
      }else{
        return posts.find({}, {sort: {date: -1}, skip: skip, limit: dl});
      }
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
