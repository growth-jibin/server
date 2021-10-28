//정의
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const crypto = require("crypto");
require("dotenv").config();

var db;
//use
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//회원가입
app.post("/auth/register", (req, res) => {
  try {
    db.collection("login").findOne(
      { nickname: req.body.nickname },
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else if (result) {
          res.status(401).send("/Unauthorized");
        } else {
          if (req.body.password === req.body.checkpassword) {
            var password = req.body.password;
            var cipher = crypto.createCipher("aes-256-ecb", password);
            cipher.update(password, "utf8");
            var cipheredpassword = cipher.final("hex");
            db.collection("login").insertOne(
              {
                nickname: req.body.nickname,
                password: cipheredpassword,
              },
              (err, result) => {
                if (err) {
                  res.status(500).send("/fail");
                }
                res.status(201).send("/");
              }
            );
          } else {
            res.status(404).send("/fail/404");
          }
        }
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
