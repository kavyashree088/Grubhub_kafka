var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cors = require("cors");
const mysql = require("mysql");

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kavya10ka",
    database: "grubhub"
  });
}
const router = require("./routes/user");
const owner = require("./routes/owner");
const userActions = require("./routes/userActions");
const ownerAction = require("./routes/ownerActions");
const orderAction = require("./routes/orderActions");
const messageAction = require("./routes/messageActions");
// app.use(router);
// app.use(owner);
// app.use(order);
app.use("/user", userActions);
app.use("/owner", ownerAction);
app.use(orderAction);
app.use("/message", messageAction);
app.use("/uploads", express.static(__dirname + "/uploads"));
app.listen(3001);
console.log("Server Listening on port 3001");
module.exports = app;
