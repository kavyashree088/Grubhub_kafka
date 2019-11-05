var { user } = require("../models/UserSchema");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var passport = require("passport");

exports.userService = function userService(msg, callback) {
  console.log("msg", msg);
  console.log("In Property Service path:", msg.path);
  switch (msg.path) {
    case "get":
      get(msg, callback);
      break;
    case "createUser":
      createUser(msg, callback);
      break;
    case "loginUser":
      loginUser(msg, callback);
      break;
    case "userdetails":
      userdetails(msg, callback);
      break;
    case "updateName":
      updateName(msg, callback);
      break;
    case "updateEmail":
      updateEmail(msg, callback);
      break;
    case "updatePassword":
      updatePassword(msg, callback);
      break;
    case "updateAddress":
      updateAddress(msg, callback);
      break;
    case "updatePhoneNo":
      updatePhoneNo(msg, callback);
      break;
    case "updateProfilePhoto":
      updateProfilePhoto(msg, callback);
      break;
  }
};
function getConnection() {
  mongoose.connect(
    "mongodb://root:root@clusterkc-shard-00-00-cr6mm.mongodb.net:27017,clusterkc-shard-00-01-cr6mm.mongodb.net:27017,clusterkc-shard-00-02-cr6mm.mongodb.net:27017/grubhub?ssl=true&replicaSet=ClusterKC-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true, poolSize: 10 },
    function(err) {
      if (err) {
        console.log(err);
        console.log("ERROR! MONGO MONGOOSE");
        throw err;
      } else {
        console.log("Successfully connected to MongoDB");
      }
    }
  );
  return mongoose.connection;
}

async function get(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", async function() {
      console.log("Connection Successful!");
      var users = await user.find({});
      console.log("got users");
      console.log(JSON.stringify(users));
      callback(null, users);
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}
async function createUser(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));

    var newUser = new user({
      firstName: msg.body.firstName,
      lastName: msg.body.lastName,
      email: msg.body.email,
      password: msg.body.hashPassword,
      phoneNo: "",
      address: "",
      profilePic: ""
    });
    db.once("open", async function() {
      console.log("Connection Successful!");
      var result = newUser.save(function(err, user) {
        if (err)
          callback(null, {
            status: 400,
            message: err.message
          });
      });
      console.log("here");
      callback(null, result);
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}
async function loginUser(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      user
        .find({
          email: msg.body.email // search query
        })
        .then(doc => {
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc[0]);
            if (bcrypt.compareSync(msg.body.password, doc[0].password)) {
              console.log("true");
              var token = {
                signinSuccess: "success",
                email: doc[0].email
              };
              var signed_token = jwt.sign(token, "cmpe273", {
                expiresIn: 86400 // in seconds
              });
              callback(null, {
                status: 200,
                message: "authentication done ",
                token: signed_token,
                userType: "user",
                user: doc
              });
            } else {
              callback(null, {
                status: 400,
                message: err.message
              });
            }
          } else {
            console.log("here");
            callback(null, {
              status: 500,
              errors: ["Invalid Login"]
            });
          }
        })
        .catch(err => {
          console.error(err);
          callback(null, {
            status: 500,
            errors: ["Invalid Login"]
          });
        });
    });
  } catch (error) {
    console.log("error");
    console.log(error);
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}
async function userdetails(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
      console.log("Connection Successful!");
      user
        .find({
          email: msg.body.email // search query
        })
        .then(doc => {
          callback(null, doc);
        })
        .catch(err => {
          callback(null, {
            status: 400,
            message: err.message
          });
        });
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}

async function updateName(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: msg.body.email },
        { firstName: msg.body.firstName, lastName: msg.body.lastName },
        function(err, user) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, user);
        }
      );
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}

async function updateEmail(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: msg.body.email },
        { email: msg.body.newEmail },
        function(err, user) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, user);
        }
      );
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}

async function updatePassword(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: msg.body.email },
        { password: msg.body.hashPassword },
        function(err, user) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, user);
        }
      );
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}

async function updateAddress(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: msg.body.email },
        { address: msg.body.address },
        function(err, user) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, user);
        }
      );
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}

async function updatePhoneNo(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: msg.body.email },
        { phoneNo: msg.body.phoneNo },
        function(err, user) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, user);
        }
      );
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}

async function updateProfilePhoto(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: msg.body.email },
        { profilePic: msg.body.profilePic },
        function(err, user) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, user);
        }
      );
    });
  } catch (error) {
    callback(null, {
      status: 400,
      message: error.message
    });
  }
}
