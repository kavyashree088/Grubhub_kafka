//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var kafka = require("./kafka/client");
//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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

const mongoose = require("mongoose");
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

const userActions = require("./routes/userActions");
const ownerAction = require("./routes/ownerActions");
const orderAction = require("./routes/orderActions");
const messageAction = require("./routes/messageActions");
app.use("/user", userActions);
app.use("/owner", ownerAction);
app.use(orderAction);
app.use("/message", messageAction);
app.use("/uploads", express.static(__dirname + "/uploads"));
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
