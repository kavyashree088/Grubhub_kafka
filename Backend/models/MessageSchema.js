var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const MessageSchema = new Schema({
  senderId: {
    type: String,
    required: true
  },
  recieverId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  recieverName: {
    type: String,
    required: true
  },
  messages: [
    {
      message: {
        type: String,
        required: true
      },
      time: {
        type: Date,
        required: true
      },
      sent: {
        type: String,
        required: true
      }
    }
  ]
});
var message = mongoose.model("message", MessageSchema);
module.exports = { message, MessageSchema };
