'use strict';

var Firebase = require('firebase');

var pushRef = new Firebase('https://whoup.firebaseIO.com/push-notifs');
var receiveRef = new Firebase('https://whoup.firebaseIO.com/receive-ref');



pushRef.on("child_added", function(snapshot) {
  var data = snapshot.val();
  receiveRef.push().set({
    author: "Tai is awesome",
    message: data.message
  });

});
