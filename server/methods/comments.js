Meteor.methods({
  createComment:function(comment){
    comment.username = Meteor.user().username;
    var daId = Random.id();
    comment.saveid = daId

    var newDate = new Date()
    newDate = newDate.toString().split(' ')
    function hourConvert(){
      var timeString = newDate[4];
      var H = +timeString.substr(0, 2);
      var h = H % 12 || 12;
      var ampm = (H < 12 || H === 24) ? "AM" : "PM";
      timeString = h + timeString.substr(2, 3) + ampm;
      newDate[4] = timeString
    }
    hourConvert()
    newDate = newDate[1] + ' ' + newDate[2] + ' ' + newDate[3] + ' ' + newDate[4]

    comment.date = new Date();
    comment.newDate = newDate
    comments.insert(comment);

    posts.update({_id: comment.postId}, {$inc:{comments: 1}});
  }
});
