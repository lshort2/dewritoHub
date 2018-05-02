Meteor.publish("posts", function(argument){
  return posts.find({})
});

Meteor.publish("catagory", function(argument){
  return catagory.find({})
});
