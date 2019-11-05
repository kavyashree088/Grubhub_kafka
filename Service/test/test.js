process.env.NODE_ENV = "test";

var app = require("../index");

var chai = require("chai");
chai.use(require("chai-http"));
var expect = require("chai").expect;

var agent = require("chai").request.agent(app);

describe("GrubHub App", function() {
  it("GET / Users", function() {
    agent.get("/users").then(function(res) {
      expect(res.body.count).to.greaterThan(0);
    });
  });
});

describe("Login User", function() {
  it("Post /loginuser", function() {
    let user = {
      email: "some@gmail.com",
      password: "password1"
    };
    agent
      .post("/loginuser")
      .send(user)
      .then(function(res) {
        expect(res.status).to.equal(200);
      });
  });
});

describe("Login owner", function() {
  it("Post /loginOwner", function() {
    let user = {
      email: "kavyashree@gmail.com",
      password: "password"
    };
    agent
      .post("/loginOwner")
      .send(user)
      .then(function(res) {
        expect(res.status).to.equal(200);
      });
  });
});

describe("GrubHub App", function() {
  it("GET /searchMenu/:menu", function() {
    agent.get("/searchMenu/pizza").then(function(res) {
      expect(res.body.count).to.greaterThan(0);
    });
  });
});

describe("GrubHub App", function() {
  it("GET /cart/:id", function() {
    agent.get("/cart/9").then(function(res) {
      expect(res.status).to.equal(200);
    });
  });
});
