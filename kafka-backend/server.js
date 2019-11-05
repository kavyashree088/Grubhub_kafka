var connection = new require("./kafka/Connection");
var userService = require("./services/userService");

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://root:root@clusterkc-cr6mm.mongodb.net/grubhub?",
  function(err) {
    if (err) {
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
  consumer.on("message", function(message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    // fname.handle_request(data.data, function(err, res) {
    //   console.log("after handle" + res);
    //   var payloads = [
    //     {
    //       topic: data.replyTo,
    //       messages: JSON.stringify({
    //         correlationId: data.correlationId,
    //         data: res
    //       }),
    //       partition: 0
    //     }
    //   ];
    //   producer.send(payloads, function(err, data) {
    //     console.log(data);
    //   });
    //   return;
    // });
    switch (topic_name) {
      case "userActions":
        userService.userService(data.data, function(err, res) {
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
  producer.send(payloads, function(err, data) {
    console.log("producer send", data);
  });
  return;
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("userActions", userService);
