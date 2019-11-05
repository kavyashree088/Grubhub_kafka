var express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var { user } = require("../models/UserSchema");
const multer = require("multer");

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
router.get("/", (req, res) => {
  var db = getConnection();

  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", function() {
    console.log("Connection Successful!");

    // a document instance
    // var newUser = new user({
    //   firstName: "Kavya",
    //   lastName: "Chandrashekar",
    //   email: "kavya@gmail.com",
    //   password: "kavya"
    // });

    // // save model to database
    // newUser.save(function(err, user) {
    //   if (err) return console.error(err);
    //   console.log(user.name + " saved to bookstore collection.");
    // });
    user
      .find({
        email: "dhanya@gmail.com" // search query
      })
      .then(doc => {
        console.log(doc);
        res.end(JSON.stringify(doc));
      })
      .catch(err => {
        console.error(err);
      });
  });
});

router.post("/createUser", async (req, res) => {
  try {
    console.log("post");
    console.log(req.body);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let email = req.body.email;
    let hashPassword = bcrypt.hashSync(password, saltRounds);
    console.log(hashPassword.length);
    var newUser = new user({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      phoneNo: "",
      address: "",
      profilePic: ""
    });
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      var result = newUser.save(function(err, user) {
        if (err) res.json({ message: error.message });
      });
      res.statusCode = 200;
      console.log("here");
      return res.send(result);
    });
  } catch (error) {
    res.statusCode = 500;
    console.log("err");
    return res.json({ message: error.message });
  }
});
router.post("/loginUser", async function(req, res) {
  try {
    var db = getConnection();

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", function() {
      console.log("Connection Successful!");
      user
        .find({
          email: req.body.email // search query
        })
        .then(doc => {
          console.log(doc);
          if (doc.length !== 0) {
            console.log("Success");
            console.log(doc);
            if (bcrypt.compareSync(req.body.password, doc[0].password)) {
              console.log("true");
              var token = {
                signinSuccess: "success",
                email: doc[0].email
              };
              var signed_token = jwt.sign(token, "cmpe273", {
                expiresIn: 86400 // in seconds
              });
              res.statusCode = 200;
              res.json({
                message: "authentication done ",
                token: signed_token,
                userType: "user",
                user: doc
              });
            } else {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end();
            }
          } else {
            console.log("here");
            res.statusCode = 500;
            return res.json({ errors: ["Invalid Login"] });
          }
        })
        .catch(err => {
          console.error(err);
          res.statusCode = 500;
          return res.json({ errors: ["Invalid Login"] });
        });
    });
  } catch (error) {
    console.log("error");
  }
});

router.get("/userdetails/:email", (req, res) => {
  console.log("User Details " + req.params.email);
  db = getConnection();
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("Connection Successful!");
    user
      .find({
        email: req.params.email // search query
      })
      .then(doc => {
        console.log(doc);
        res.end(JSON.stringify(doc));
      })
      .catch(err => {
        console.error(err);
      });
  });
});

router.put("/update/name", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: req.body.email },
        { firstName: req.body.firstName, lastName: req.body.lastName },
        function(err, user) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(user);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/email", (req, res) => {
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: req.body.email },
        { email: req.body.newEmail },
        function(err, user) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(user);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/password", (req, res) => {
  console.log(req.body);
  let hashPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
  console.log(hashPassword);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: req.body.email },
        { password: hashPassword },
        function(err, user) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(user);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/address", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: req.body.email },
        { address: req.body.address },
        function(err, user) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(user);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

router.put("/update/phoneNo", (req, res) => {
  console.log(req.body);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: req.body.email },
        { phoneNo: req.body.phoneNo },
        function(err, user) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(user);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    let newFileName = Date.now() + file.originalname;
    cb(null, newFileName);
  }
});
var upload = multer({ storage: storage });
router.post("/update/profilePhoto", upload.single("imageFile"), (req, res) => {
  console.log(req.file);
  const file = req.file;
  console.log(file.originalname);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return res.json({ errors: ["Cannot upload ProfileImage"] });
  }
  let filePath = file.filename;
  console.log(filePath);
  try {
    var db = getConnection();
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      user.updateOne(
        { email: req.body.email },
        { profilePic: filePath },
        function(err, user) {
          if (err) {
            res.statusCode = 500;
            return res.json({ errors: err.message });
          }
          res.statusCode = 200;
          return res.send(user);
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.json({ errors: error.message });
  }
});

module.exports = router;
