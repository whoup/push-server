'use strict';
var Queue = require('firebase-queue')
var Firebase = require('firebase');
var apn = require("apn");

var userRef = new Firebase('https://whoup.firebaseIO.com/users');
var qRef = new Firebase('https://whoup.firebaseIO.com/push-notifs/');

var options = {
  'numWorkers': 10,
};
var queue = new Queue(qRef, options, function(data, progress, resolve, reject) {
  userRef.child(data.to).child('deviceTokens').once('value', function(snapshot) {
    progress(50);
    var tokens = snapshot.val();
    var tokensList = [];
    for (var t in tokens) {
      tokensList.push(tokens[t])
    }
    sendNotification(data, tokensList)
    resolve();
  });


})
var service = new apn.connection({production: true});
function sendNotification(notificationData, tokens) {
  var notification = new apn.notification();
  notification.sound = notificationData.sound;
  notification.alert = notificationData.message;
  notification.payload = {'fromUser': notificationData.username,
                          'message': notificationData.message,
                          "type": notificationData.type,
                          "fromId": notificationData.from
                          };
  service.pushNotification(notification, tokens);
}
