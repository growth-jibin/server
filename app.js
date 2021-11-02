//정의
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { text } = require("body-parser");
const crypto = require("crypto");
const { fail } = require("assert");
require("dotenv").config();

var db;
//use
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "비밀코드",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
//로그인
app.post(
  "/auth/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
  }),
  (req, res) => {
    res.send("/");
  }
);

//로그인 판단 코드
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
        console.log(e);
      }
    }
  )
);

//user에 맞는 세션 생성
passport.serializeUser((user, done) => {
  done(null, user.nickname);
});

//메모데이터 삽입
app.post("/add", (req, res) => {
  db.collection("memo").insertOne(
    {
      title: req.body.title,
      contents: req.body.contents,
      tag: req.body.tag,
      user: req.body.user,
      date: req.body.date,
      color: req.body.color,
    },
    (err) => {
      if (err) {
        res.status(400).send("/fail");
      }
      res.status(200).send("/list");
    }
  );
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
