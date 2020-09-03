var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.8.100');

var obj = new Object();
obj.key = "1";
obj.name = "ansad@uic.edu";
obj.des = "12312211";

var obj2 = new Object();
obj2.key = "3";
obj2.name = "anssaxaax";
obj2.des = "12312211";

var result = [obj,obj2];
var data = JSON.stringify(result)
client.on('connect', function () {
setInterval(function() {
    client.publish('myTopic2', data);
    console.log('Message Sent');
}, 5000);
});