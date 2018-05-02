var Jimp = require("jimp");
const imagemin = require('imagemin');
Fiber = Npm.require('fibers');
var fs = Npm.require('fs');

Meteor.methods({
  createPost:function(title, description, excerpt, tags, url, catagory2, minPlayer, maxPlayer, newDat){
    var excerpt = excerpt.substring(0, 300);
    var title = title.substring(0, 300);
    var username = Meteor.user().username

    var daId = Random.id()

    var tags = title.split(/\s/).reduce(function (previous, word) {
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
      testTags[i] = '#'+testTags[i]
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
          image.resize(1280, Jimp.AUTO).quality(80).getBuffer(Jimp.MIME_JPEG, uploadImage);
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

    var thumbnail = '/uploading.jpg'
    var link = '/uploading.jpg'

    posts.insert({_id: daId, username: username, title: title, description:description, link:link, thumbnail: thumbnail, date: new Date(), tagList:testTags, comments: 0, score: 1, excerpt: excerpt, editDate: 'Never', views: 0, newDate: newDate, imgCount: newDat.length, downloads: 0, gameMode:catagory2, minPlayer:minPlayer, maxPlayer:maxPlayer})
    userStuff.update({username: Meteor.user().username}, {$push: {createdPosts: daId}})
    catagory.update({name:catagory2}, {$inc:{count: 1}})
  }
});
