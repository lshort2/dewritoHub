//awesome MIT score decay
var decay = require('decay')
Fiber = Npm.require('fibers');

computeScore = function(id){
  //get the details
  var date = posts.findOne({_id:id}).date
  var up = posts.findOne({_id:id}).upUsers
  var down = posts.findOne({_id:id}).downUsers
  up = up.length
  down = down.length

  var redditHotScore = decay.redditHot(45000);
  var daScore = redditHotScore(up, down, date);
  console.log('post: ' + id + ' score: '+daScore)

  posts.update({_id: id}, {$set: {score: daScore}})
}
function doSomething() {}

(function loop() {
  // update score every 15-30 minutes
  var rand = Math.floor((Math.random() * 1800000) + 900000)
  setTimeout(function() {
    console.log('Doing score computation \n')
    Fiber(function() {
      posts.find({}).map(function(post) {
        computeScore(post._id)
      });
    }).run();

    loop();
  }, rand);
}());
