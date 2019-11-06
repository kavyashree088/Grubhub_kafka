const mongoose = require("mongoose");
var { restaurant } = require("../models/RestaurantSchema");
var { order } = require("../models/OrderSchema");
var { cart } = require("../models/CartSchema")
var { menu } = require("../models/MenuSchema")
var { user } = require("../models/UserSchema")

exports.orderService = function orderService(msg, callback) {
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch (msg.path) {
        case "searchMenu":
            searchMenu(msg, callback);
            break;
        case "addToCart":
            addToCart(msg, callback);
            break;
        case "deleteCartAll":
            deleteCartAll(msg, callback);
            break;
        case "placeOrder":
            placeOrder(msg, callback);
            break;
        case "getOrders":
            getOrders(msg, callback);
            break;
        case "getUserOrders":
            getUserOrders(msg, callback);
            break;
        case "updateOrderStatus":
            updateOrderStatus(msg, callback);
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

async function searchMenu(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        var regex = new RegExp(["^", msg.body.menu, "$"].join(""), "i");
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            console.log("Connection Successful!");
            menu.find(
                { name: regex },
                {
                    "restaurant._id": 1,
                    "restaurant.name": 1,
                    "restaurant.zipcode": 1,
                    "restaurant.address": 1,
                    "restaurant.phoneNo": 1,
                    "restaurant.cuisine": 1
                },
                function (err, result) {
                    if (err) {
                        callback(null, {
                            status: 400,
                            message: err.message
                        });
                    }
                    callback(null, result)
                }
            );
        })
    } catch (error) {
        callback(null, {
            status: 400,
            message: error.message
        });
    }
}

async function addToCart(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            var item = await menu.findOne({ _id: msg.body.itemId }, (err, result) => {
                if (err) {
                    callback(null, {
                        status: 400,
                        message: err.message
                    });
                }
            });
            console.log(item);
            var person = await user.findOne(
                { _id: msg.body.userId },
                (err, result) => {
                    if (err) {
                        callback(null, {
                            status: 400,
                            message: err.message
                        });
                    }
                }
            );
            console.log(person);

            var cartItem = new cart({
                itemName: msg.body.itemName,
                price: msg.body.price,
                quantity: msg.body.quantity,
                menu: item,
                user: person
            });
            await cartItem.save((err, result) => {
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

async function deleteCartAll(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            await cart.deleteMany({ "user._id": msg.body.id }, (err, result) => {
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

async function placeOrder(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            var orderItems = new order({
                items: msg.body.items,
                createdAt: msg.body.createdAt,
                status: msg.body.status,
                user: msg.body.user,
                restaurant: msg.body.restaurant
            });
            await orderItems.save((err, result) => {
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

async function getOrders(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            await order.find({ "restaurant._id": msg.body.id }, (err, result) => {
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

async function updateOrderStatus(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            await order.updateOne(
                { _id: msg.body.id },
                { status: msg.body.status },
                (err, result) => {
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

async function getUserOrders(msg, callback) {
    console.log(msg);
    try {
        var db = getConnection();
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", async function () {
            await order.find({ "user._id": msg.body.id }, (err, result) => {
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