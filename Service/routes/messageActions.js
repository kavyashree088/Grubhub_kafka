var express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var { message } = require("../models/MessageSchema");

var jwt = require("jsonwebtoken");
var passport = require("passport");
var requireAuth = passport.authenticate("jwt", { session: false });
function getConnection() {
  mongoose.connect(
    "mongodb+srv://root:root@clusterkc-cr6mm.mongodb.net/grubhub?retryWrites=true&w=majority",
    { useNewUrlParser: true, poolSize: 10 },
    function(err) {
      if (err) {
        console.log("ERROR! MONGO MONGOOSE");
        throw err;
      } else {
        console.log("Successfully connected to MongoDB");
      }
    }
  );
  return mongoose.connection;
}

router.get("/getMessages/:sender/", (req, res) => {
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      console.log("Connection Successful!");
      message.find(
        {
          $or: [
            { senderId: req.params.sender },
            { recieverId: req.params.sender }
          ]
        },
        function(err, result) {
          if (err) {
            res.statusCode = 500;
            console.log("err");
            return res.json({ message: err.message });
          }
          res.statusCode = 200;
          console.log("here");
          return res.send(result);
        }
      );
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});

router.post("/postMessages", async (req, res) => {
  try {
    var db = getConnection();
    let time = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      console.log("Connection Successful!");
      await message.find(
        { senderId: req.body.senderId, recieverId: req.body.recieverId },
        function(err, result) {
          if (err) {
            res.statusCode = 500;
            console.log("err");
            return res.json({ message: err.message });
          }
          if (result.length > 0) {
            let updatedMessages = result[0].messages;
            updatedMessages.push({
              message: req.body.message,
              time: time,
              sent: req.body.sent
            });
            console.log(updatedMessages);
            message.updateOne(
              { senderId: req.body.senderId, recieverId: req.body.recieverId },
              { messages: updatedMessages },
              (err, result) => {
                if (err) {
                  res.statusCode = 500;
                  console.log("err");
                  return res.json({ message: err.message });
                }
                res.statusCode = 200;
                console.log("here");
                return res.send(result);
              }
            );
          } else {
            let newMessage = new message({
              senderId: req.body.senderId,
              recieverId: req.body.recieverId,
              senderName: req.body.senderName,
              recieverName: req.body.recieverName,
              messages: [
                {
                  message: req.body.message,
                  time: time,
                  sent: req.body.sent
                }
              ]
            });
            newMessage.save((err, result) => {
              if (err) {
                res.statusCode = 500;
                console.log("err");
                return res.json({ message: err.message });
              }
              res.statusCode = 200;
              console.log("here");
              return res.send(result);
            });
          }
        }
      );
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});
module.exports = router;
