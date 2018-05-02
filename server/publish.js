Meteor.publish("posts", function(argument){
  return posts.find({})
});
