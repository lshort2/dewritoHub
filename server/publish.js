Meteor.publish("posts", function(limit, currentUser, page, sortBy, post){
  var dl = limit || 5;
  var skip = 0
  if(page){
    skip = page * 10 - 10;
  }
  console.log(skip)
  if(post){
    return posts.find({_id: post})
  }else{
    return posts.find({}, {sort: {date: -1}, skip: skip, limit: dl});
  }
});

Meteor.publish("catagory", function(argument){
  return catagory.find({})
});
