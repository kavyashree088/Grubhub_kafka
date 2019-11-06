var connection = new require("./kafka/Connection");
var userService = require("./services/userService");
var ownerService = require("./services/ownerService")
var orderService = require("./services/orderService")
var messageService = require("./services/messageService")

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://root:root@clusterkc-shard-00-00-cr6mm.mongodb.net:27017,clusterkc-shard-00-01-cr6mm.mongodb.net:27017,clusterkc-shard-00-02-cr6mm.mongodb.net:27017/grubhub?ssl=true&replicaSet=ClusterKC-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, poolSize: 10 },
  function (err) {
    if (err) {
      console.log(err);
      console.log("ERROR! MONGO MONGOOSE");
      throw err;
    } else {
      console.log("Successfully connected to MongoDB");
    }
  }
);

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    switch (topic_name) {
      case "userActions":
        userService.userService(data.data, function (err, res) {
          response(data, res, producer);
          return;
        });
        break;
      case "ownerActions":
        ownerService.ownerService(data.data, function (err, res) {
          response(data, res, producer);
          return;
        });
        break;
      case "orderActions":
        orderService.orderService(data.data, function (err, res) {
          response(data, res, producer);
          return;
        });
        break;
      case "messageActions":
        messageService.messageService(data.data, function (err, res) {
          response(data, res, producer);
          return;
        });
        break;
    }
  });
}
function response(data, res, producer) {
  console.log("after handle", res);
  var payloads = [
    {
      topic: data.replyTo,
      messages: JSON.stringify({
        correlationId: data.correlationId,
        data: res
      }),
      partition: 0
    }
  ];
  producer.send(payloads, function (err, data) {
    console.log("producer send", data);
  });
  return;
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("userActions", userService);
handleTopicRequest("ownerActions", ownerService);
handleTopicRequest("orderActions", orderService);
handleTopicRequest("messageActions", messageService);
