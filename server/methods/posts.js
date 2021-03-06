var Jimp = require("jimp");
const imagemin = require('imagemin');
var fs = Npm.require('fs');

Meteor.methods({
  createPost:function(title, description, excerpt, tags, url, catagory2, minPlayer, maxPlayer, newDat, map, mapName){
    var excerpt = excerpt.substring(0, 300);
    var title = title.substring(0, 300);
    var username = Meteor.user().username

    var daId = Random.id()

    var tags = tags.split(/\s/).reduce(function (previous, word) {
      if (word.charAt(0) === "#") {
        previous.push(word.slice(1));
        word = word.replace(/#/g, "")
        word = '#'+word
      }
      return previous;
    }, []).join(" ");

    tags = tags.split(/\s/);

    var testTags = [];
    for(i = 0; i < tags.length; i++){
      testTags[i] = tags[i].replace(/#/g, "");
      testTags[i] = '#'+testTags[i].toLocaleLowerCase()
    }

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

    for(var i = 0; i < newDat.length; i++){
      saveImage(newDat[i], i)
    }
    function saveImage(target, number){
      // our data URL string from canvas.toDataUrl();
      var imageDataUrl = target;
      // declare a regexp to match the non base64 first characters
      var dataUrlRegExp = /^data:image\/\w+;base64,/;
      // remove the "header" of the data URL via the regexp
      var base64Data = imageDataUrl.replace(dataUrlRegExp, "");
      // declare a binary buffer to hold decoded base64 data
      var imageBuffer = new Buffer(base64Data, "base64");
      trimThumb()
      compressPic()
      function trimThumb(){
        Jimp.read(imageBuffer, function (err, image) {
          if (err) throw err;
          image.resize(400, Jimp.AUTO).quality(50).getBuffer(Jimp.MIME_JPEG, uploadThumb);
        })
      }

      function compressPic(){
        Jimp.read(imageBuffer, function (err, image) {
          if (err) throw err;
          image.resize(1280, Jimp.AUTO).quality(67).getBuffer(Jimp.MIME_JPEG, uploadImage);
        })
      }

      function uploadThumb(err, buffer){
        Meteor.callB2.uploadThumb(daId, buffer, daId, number)
      }

      function uploadImage(err, buffer){
        Meteor.callB2.uploadImage(daId, buffer, daId, number)
      }

      extension = '.jpg'
    }
    function uploadMap(map){
      // declare a regexp to match the non base64 first characters
      var dataUrlRegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)\w+;base64,/;
      // remove the "header" of the data URL via the regexp
      var base64Data = map.replace(dataUrlRegExp, "");
      // declare a binary buffer to hold decoded base64 data
      var mapBuffer = new Buffer(base64Data, "base64");

      Meteor.callB2.uploadMap(daId, mapBuffer, daId, mapName)
    }
    uploadMap(map)

    var thumbnail = '/uploading.jpg'
    var link = '/uploading.jpg'

    try{
      getVideo(url, daId)
    }catch(e){}

    posts.insert({_id: daId, username: username, title: title, description:description, link:link, thumbnail: thumbnail, date: new Date(), tagList:testTags, comments: 0, score: 1, excerpt: excerpt, editDate: 'Never', views: 0, newDate: newDate, imgCount: newDat.length, downloads: 0, newScore: 0, gameMode:catagory2, minPlayer:minPlayer, maxPlayer:maxPlayer, upUsers:[username], downUsers:[]})
    userStuff.update({username: Meteor.user().username}, {$push: {createdPosts: daId}})
    catagory.update({name:catagory2}, {$inc:{count: 1}})

    return daId
  }
});

Meteor.methods({
  deletePost:function(id){
    var username = Meteor.user().username

    if(posts.findOne({_id: id}).username == username){
      var gameMode = posts.findOne({_id:id}).gameMode
      catagory.update({name: gameMode}, {$inc: {count: -1}})
      posts.remove({_id: id})
      return 'deleted'
    }else{
      return 'fail'
    }
  }
});

Meteor.methods({
  featured:function(){
    var theFeatured = featured.find({}).map(function(e) { return e._id; })
    var postInfo = [];

    for(var i = 0; i < theFeatured.length; i++){
      var thePost = posts.findOne({_id: theFeatured[i]})
      postInfo[i] = {username: thePost.username, title:thePost.title, excerpt:thePost.excerpt, comments:thePost.comments, _id:thePost._id, date:thePost.date, newDate: thePost.newDate, gameMode: thePost.gameMode, thumbnail: thePost.thumbnail, views:thePost.views, downloads: thePost.downloads, starRating: thePost.starRating};
    }
    // just the 3 for now. We'll add a dedicated featured sort later.
    if(theFeatured.length >= 3){
      return [postInfo[theFeatured.length - 1], postInfo[theFeatured.length - 2], postInfo[theFeatured.length - 3]]
    }else if(theFeatured.length == 2){
      return [postInfo[1], postInfo[0]]
    }else{
      return [postInfo[0], postInfo[1], postInfo[2]]
    }
  }
});

//the post utility / action methods
Meteor.methods({
  'upvote': (id) =>{
    try{
      var user = Meteor.user().username
      if(posts.findOne({_id: id, upUsers: { $in: [user] } })){
        posts.update({_id: id}, {$pull: {upUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: -1}})
      }else if(posts.findOne({_id: id, downUsers: { $in: [user] }})){
        posts.update({_id: id}, {$push: {upUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: 2}})
        posts.update({_id: id}, {$pull: {downUsers: user}})
      }else{
        posts.update({_id: id}, {$push: {upUsers: user}})
        //pull any potential downpaw
        posts.update({_id: id}, {$pull: {downUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: 1}})
      }
      computeScore(id)
    }catch(e){}
  },
  'downvote': (id) =>{
    try{
      var user = Meteor.user().username
      if(posts.findOne({_id: id, downUsers: { $in: [user] } })){
        posts.update({_id: id}, {$pull: {downUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: 1}})
      }else if(posts.findOne({_id: id, upUsers: { $in: [user] }})){
        posts.update({_id: id}, {$push: {downUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: -2}})
        posts.update({_id: id}, {$pull: {upUsers: user}})
      }else{
        posts.update({_id: id}, {$push: {downUsers: user}})
        //pull any potential downpaw
        posts.update({_id: id}, {$pull: {upUsers: user}})
        posts.update({_id: id}, {$inc: {newScore: -1}})
      }
      computeScore(id)
    }catch(e){}
  },
  'savePost': (id)=>{
    try{
      var user = Meteor.user().username
      if(userStuff.findOne({username: user, savedPosts: { $in: [id] } })){
        userStuff.update({username: user}, {$pull: {savedPosts: id}})
        return 'pulled'
      }else{
        userStuff.update({username: user}, {$push: {savedPosts: id}})
        return 'saved'
      }
    }catch(e){}
  }
})

Meteor.methods({
  updatePost:function(id, desc, map, mapName, mapCata, mapExcerpt, newYoutube){
    var username = Meteor.user().username;

    if(posts.findOne({_id: id}).username == username){
      function uploadMap(map){
        // declare a regexp to match the non base64 first characters
        var dataUrlRegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)\w+;base64,/;
        // remove the "header" of the data URL via the regexp
        var base64Data = map.replace(dataUrlRegExp, "");
        // declare a binary buffer to hold decoded base64 data
        var mapBuffer = new Buffer(base64Data, "base64");

        Meteor.callB2.uploadMap(id, mapBuffer, id, mapName)
      }
      if(map && mapName != 'null'){
        uploadMap(map)
      }

      try{
        getVideo(newYoutube, id)
      }catch(e){}

      // pull the count from the old map catagory and push it to the new one
      var oldCata = posts.findOne({_id: id}).gameMode
      catagory.update({name: oldCata}, {$inc: {count: -1}})
      catagory.update({name: mapCata}, {$inc: {count: 1}})
      posts.update({_id: id}, {$set: {description:desc, lastEdit: new Date(), gameMode: mapCata, excerpt: mapExcerpt}})
      return 'success'
    }else{
      return 'fail'
    }
  }
});

function getVideo(url, id){
  console.log(url)
  if(!url.includes('youtube.com/watch?v=') && !url.includes('youtu.be/')){
    url = ''
  }else{
    if(url.includes('youtu.be/')){
      url = url.replace('youtu.be/', 'youtube.com/watch?v=')
    }
    var ytThumb = url.split('=')[1];
    ytThumb = 'http://img.youtube.com/vi/'+ytThumb+'/mqdefault.jpg'
    ytThumb = ytThumb.replace('&feature', '')
    url = url.replace("watch?v=","embed/");
    url = url.replace('&feature=youtu.be', '')
  }
  posts.update({_id: id}, {$set: {video:url, ytThumb: ytThumb}})
}

/* convert rating to 5 stars
function percent_to_stars(p){
  if(p !> 94){
    var star="X"
    var half="/"
    var stars = (Math.round((p / 10.0)) / 2)
    var halves = (p / 10.0) % 2
    var empties = 5 - stars - halves
    console.log( star.repeat( stars ) + half.repeat( halves ))

    // source: https://gist.github.com/grough/1268290/0f7948640026ef7e8177f55ed0583d0cac1146c1
  }
}
*/
