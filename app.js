'use strict';
var Queue = require('firebase-queue')
var Firebase = require('firebase');
var apn = require("apn");

var userRef = new Firebase('https://whoup.firebaseIO.com/users');
var qRef = new Firebase('https://whoup.firebaseIO.com/push-notifs/');

var options = {
  'numWorkers': 5,
  'sanitize': false,
  'suppressStack': true
};
var queue = new Queue(qRef, function(data, progress, resolve, reject) {
  userRef.child(data.to).child('deviceToken').on('value', function(snapshot) {
    progress(50);
    if (snapshot.val()) {
      data.token = snapshot.val();
      sendNotification(data);
      resolve();
    } else {
      resolve();
    }


  });


})
var service = new apn.connection({production: false})

function sendNotification(notificationData) {
  var notification = new apn.notification();

  notification.sound = "ping.aiff";
  notification.alert = notificationData.message;
  notification.payload = {'fromUser': notificationData.username,
                          'message': notificationData.message,
                          "type": notificationData.type,
                          "fromId": notificationData.from
                          };
  service.pushNotification(notification, [notificationData.token]);
  service.shutdown();
}
