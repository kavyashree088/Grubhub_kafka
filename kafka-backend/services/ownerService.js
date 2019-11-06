const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var passport = require("passport");
var { restaurant } = require("../models/RestaurantSchema");
var { owner } = require("../models/OwnerSchema");
var { menu } = require("../models/MenuSchema")

exports.ownerService = function ownerService(msg, callback) {
  console.log("msg", msg);
  console.log("In Property Service path:", msg.path);
  switch (msg.path) {
    case "createOwner":
      createOwner(msg, callback);
      break;
    case "loginOwner":
      loginOwner(msg, callback);
      break;
    case "ownerdetails":
      ownerdetails(msg, callback);
      break;
    case "restaurantDetails":
      restaurantDetails(msg, callback);
      break;
    case "restaurantDetailsById":
      restaurantDetailsById(msg, callback);
      break;
    case "getMenu":
      getMenu(msg, callback);
      break;
    case "createMenu":
      createMenu(msg, callback);
      break;
    case "updateMenu":
      updateMenu(msg, callback);
      break;
    case "deleteMenu":
      deleteMenu(msg, callback);
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
    case "updateRestaurantDetails":
      updateRestaurantDetails(msg, callback);
      break;
    case "updateRestaurantImage":
      updateRestaurantImage(msg, callback);
      break;
    case "deleteSection":
      deleteSection(msg, callback);
      break;
  }
};

function getConnection() {
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
  return mongoose.connection;
}

async function createOwner(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));

    var newRestaurant = new restaurant({
      name: msg.body.restaurant.name,
      address: "",
      phoneNo: "",
      cuisine: "",
      zipcode: msg.body.restaurant.zipCode,
      image: ""
    });
    var newOwner = new owner({
      firstName: msg.body.firstName,
      lastName: msg.body.lastName,
      email: msg.body.email,
      password: msg.body.password,
      restaurant: newRestaurant
    });
    db.once("open", async function () {
      console.log("Connection Successful!");
      var result = newOwner.save(function (err, user) {
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
async function loginOwner(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function () {
      console.log("Connection Successful!");
      owner
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
                userType: "owner",
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
async function ownerdetails(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connection Successful!");
      owner
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

async function restaurantDetails(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connection Successful!");
      owner
        .find({
          email: msg.body.email // search query
        })
        .then(doc => {
          callback(null, doc[0].restaurant);
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

async function restaurantDetailsById(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connection Successful!");
      owner
        .find(
          {
            "restaurant._id": msg.body.id // search query
          },
          {
            "restaurant._id": 1,
            "restaurant.name": 1,
            "restaurant.zipcode": 1,
            "restaurant.address": 1,
            "restaurant.phoneNo": 1,
            "restaurant.cuisine": 1,
            "restaurant.image": 1
          }
        )
        .then(doc => {
          callback(null, doc[0].restaurant);
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
async function getMenu(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connection Successful!");
      menu
        .find({
          "restaurant._id": msg.body.id
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

async function createMenu(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connection Successful!");
      owner
        .find({
          email: msg.body.email
        })
        .then(doc => {
          if (doc.length !== 0) {
            restaurant = doc[0].restaurant;
            var newMenu = new menu({
              name: msg.body.name,
              description: msg.body.description,
              section: msg.body.section,
              price: msg.body.price,
              image: msg.body.filePath,
              restaurant: restaurant
            });
            var result = newMenu.save(function (err, menu) {
              if (err)
                callback(null, {
                  status: 400,
                  message: err.message
                });
            });
            callback(null, result);
          } else {
            callback(null, {
              status: 400,
              errors: ["no restaurant"]
            });
          }
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

async function updateMenu(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
      console.log("Connection Successful!");
      await menu.updateOne(
        { _id: msg.body.id },
        {
          name: msg.body.name,
          description: msg.body.description,
          price: msg.body.price,
          section: msg.body.section,
          image: msg.body.image
        },
        function (err, menu) {
          if (err) {
            callback(null, {
              status: 400,
              message: error.message
            });
          }
          callback(null, menu);
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

async function deleteMenu(msg, callback) {
  console.log(msg);
  try {
    db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
      console.log("Connection Successful!");
      await menu.remove({ _id: msg.body.id }, function (err, menu) {
        if (err) {
          callback(null, {
            status: 400,
            message: err.message
          });
        }

        callback(null, menu);
      })
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
    db.once("open", async function () {
      owner.updateOne(
        { email: msg.body.email },
        { firstName: msg.body.firstName, lastName: msg.body.lastName },
        function (err, user) {
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
    db.once("open", async function () {
      owner.updateOne(
        { email: msg.body.email },
        { email: msg.body.newEmail },
        function (err, user) {
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
    db.once("open", async function () {
      owner.updateOne(
        { email: msg.body.email },
        { password: msg.body.hashPassword },
        function (err, owner) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, owner);
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

async function updateRestaurantDetails(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
      await owner.updateOne(
        {
          "restaurant._id": msg.body.id
        },
        {
          "restaurant.name": msg.body.name,
          "restaurant.address": msg.body.address,
          "restaurant.phoneNo": msg.body.phoneNo,
          "restaurant.zipcode": msg.body.zipcode,
          "restaurant.cuisine": msg.body.cuisine
        },
        function (err, owner) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          menu.updateMany(
            {
              "restaurant._id": msg.body.id
            },
            {
              "restaurant.name": msg.body.name,
              "restaurant.address": msg.body.address,
              "restaurant.phoneNo": msg.body.phoneNo,
              "restaurant.zipcode": msg.body.zipcode,
              "restaurant.cuisine": msg.body.cuisine
            },
            function (err, result) {
              if (err) {
                callback(null, {
                  status: 400,
                  message: error.message
                });
              }
              console.log(result);
            }
          );
          callback(null, owner);
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

async function updateRestaurantImage(msg, callback) {
  console.log(msg);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
      await owner.updateOne(
        {
          "restaurant._id": msg.body.id
        },
        {
          "restaurant.image": msg.body.image
        },

        function (err, owner) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, owner);
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

async function deleteSection(msg, callback) {
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function () {
      await menu.remove(
        { "restaurant._id": msg.body.id, section: msg.body.section },

        function (err, owner) {
          if (err) {
            callback(null, {
              status: 400,
              message: err.message
            });
          }
          callback(null, owner);
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