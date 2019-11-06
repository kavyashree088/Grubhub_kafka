const mongoose = require("mongoose");
var { message } = require("../models/MessageSchema");

exports.messageService = function messageService(msg, callback) {
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch (msg.path) {
        case "getMessages":
            getMessages(msg, callback);
            break;
        case "postMessages":
            postMessages(msg, callback);
            break;
    }
};
function getConnection() {
    mongoose.connect(
        "mongodb://root:root@clusterkc-shard-00-00-cr6mm.mongodb.net:27017,clusterkc-shard-00-01-cr6mm.mongodb.net:27017,clusterkc-shard-00-02-cr6mm.mongodb.net:27017/grubhub?ssl=true&replicaSet=ClusterKC-shard-0&authSource=admin&retryWrites=true&w=majority",
        { useNewUrlParser: true, poolSize: 10 },
        function (err) {
            if (err) {
                console.log(err)
                console.log("ERROR! MONGO MONGOOSE");
                throw err;
            } else {
                console.log("Successfully connected to MongoDB");
            }
        }
    );
    return mongoose.connection;
}

async function getMessages(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            message.find(
                {
                    $or: [
                        { senderId: msg.body.sender },
                        { recieverId: msg.body.sender }
                    ]
                }, (err, result) => {
                    if (err) {
                        callback(null, {
                            status: 400,
                            message: err.message
                        });
                    }
                    callback(null, result);
                });
        })
    } catch (error) {
        callback(null, {
            status: 400,
            message: error.message
        });
    }
}

async function postMessages(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        let time = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            await message.find(
                { senderId: msg.body.senderId, recieverId: msg.body.recieverId }, (err, result) => {
                    if (err) {
                        callback(null, {
                            status: 400,
                            message: err.message
                        });
                    }
                    if (result.length > 0) {
                        let updatedMessages = result[0].messages;
                        updatedMessages.push({
                            message: msg.body.message,
                            time: time,
                            sent: msg.body.sent
                        });
                        console.log(updatedMessages);
                        message.updateOne(
                            { senderId: msg.body.senderId, recieverId: msg.body.recieverId },
                            { messages: updatedMessages },
                            (err, result) => {
                                if (err) {
                                    callback(null, {
                                        status: 400,
                                        message: err.message
                                    });
                                }
                                callback(null, result);
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
                                callback(null, {
                                    status: 400,
                                    message: err.message
                                });
                            }
                            callback(null, result);
                        });
                    }
                });
        })
    } catch (error) {
        callback(null, {
            status: 400,
            message: error.message
        });
    }
}
