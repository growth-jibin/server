//정의
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
require("dotenv").config();
var db;
//use
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/auth/join", (req, res) => {
  try {
    db.collection("login").insertOne(
      { nickname: req.body.nickname, password: req.body.password },
      (err, result) => {
        if (err) {
          res.status(400).send({ message: "실패" });
        }
        res.status(200).send("/");
      }
    );
  } catch (e) {
    console.log(e);
  }
});

//몽고DB 연결
MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("growth-jibin"); //파일 불러오기
  app.listen(process.env.PORT, () => {
    console.log("listening on 3000");
  });
});
