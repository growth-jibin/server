//정의
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
// const { text } = require("body-parser");
const crypto = require("crypto");
const { parse } = require("path");
// const { fail } = require("assert");
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

//회원가입
app.post("/auth/register", (req, res) => {
  try {
    db.collection("login").findOne(
      { nickname: req.body.nickname },
      (err, result) => {
        if (result) {
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
                  res.status(500).send({ message: "전송실패" });
                }
                res.status(201).send({ message: "성공" });
              }
            );
          } else {
            res.status(404).send({ message: "일치하지 않는 비밀번호" });
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
        console.log(result);
      }
    }
  )
);

//user에 맞는 세션 생성
passport.serializeUser((user, done) => {
  done(null, user.nickname);
});

//메모데이터 삽입
// app.post("/add", async (req, res) => {
//   try {
//     const cntmemo = await db.collection("count").findOne({ name: "메모 수" });
//     await db.collection("memo").insertOne({
//       _id: cntmemo.totalmemo + 1,
//       title: req.body.title,
//       contents: req.body.contents,
//       tag: req.body.tag,
//       user: req.body.user,
//       date: req.body.date,
//       color: req.body.color,
//     });
//     await db.collection("count").updateOne(
//       {
//         name: "메모 수",
//       },
//       { $inc: { totalmemo: 1 } }
//     );
//     res.status(200).send({ message: "삽입 성공" });
//   } catch (e) {
//     console.log(e);
//   }
// });

//데이터 삭제
app.delete("/delete", async (req, res) => {
  try {
    const id = parseInt(req.body._id);
    await db.collection("memo").deleteOne({ _id: id });
    res.status(200).send({ message: "삭제 성공" });
  } catch (e) {
    console.log(e);
  }
});
//데이터 수정
app.put("/edit", async (req, res) => {
  try {
    await db.collection("memo").updateOne(
      { _id: parseInt(req.body._id) },
      {
        $set: {
          title: req.body.title,
          contents: req.body.contents,
          color: req.body.color,
          tag: req.body.tag,
        },
      }
    );
    res.status(200).send({ message: "수정성공" });
  } catch (e) {
    console.log(e);
  }
});
//몽고DB 연결
MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("growth-jibin");
  app.db = db;
  app.listen(process.env.PORT, () => {
    console.log("listening on 3000");
  });
});


module.exports = app
