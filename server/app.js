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
const { parse } = require("path");
require("dotenv").config();
var db;


//use
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(
  session({
    secret: "beagteun",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./router/list'))
app.use('/', require('./router/write'))
app.use('/', require('./router/edit'))
app.use('/auth', require('./router/login'))
app.use('/auth', require('./router/register'))

passport.use(
  new LocalStrategy(
    {
      usernameField: "nickname",
      userwordField: "passowrd",
      session: true,
      passReqToCallback: false,
    },
    (name, pw, done) => {
      try {
        var cipher = crypto.createCipher("aes-256-ecb", pw);
        cipher.update(pw, "utf8");
        var cipherpw = cipher.final("hex");
        db.collection("login").findOne({ nickname: name }, (err, result) => {
          if (err) {
            return done(err);
          }
          if (!result) {
            return done(null, false, { message: "존재하지 않는 아이디" });
          }
          if (cipherpw == result.password) {
            return done(null, result);
          } else {
            return done(null, false, { message: "일치하지 않는 비밀번호" });
          }
        });
      } catch (e) {
        console.log("여기서 잡은 버그임ㅋㅋ");
        console.log(e);
      }
    }
  )
);

//몽고DB 연결
MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("growth-jibin");
  app.db = db;
});


module.exports = app
