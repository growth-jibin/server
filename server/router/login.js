const router = require('express').Router();
const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const crypto = require("crypto");

//로그인
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "fail",
    }),
    (req, res) => {
        res.send("/");
    }
);

//로그인 판단 코드
// passport.use(
//     new LocalStrategy(
//         {
//             usernameField: "nickname",
//             userwordField: "passowrd",
//             session: true,
//             passReqToCallback: false,
//         },
//         (name, pw, done) => {
//             try {
//                 var cipher = crypto.createCipher("aes-256-ecb", pw);
//                 cipher.update(pw, "utf8");
//                 var cipherpw = cipher.final("hex");
//                 req.app.db.collection("login").findOne({ nickname: name }, (err, result) => {
//                     if (err) {
//                         return done(err);
//                     }
//                     if (!result) {
//                         return done(null, false, { message: "존재하지 않는 아이디" });
//                     }
//                     if (cipherpw == result.password) {
//                         return done(null, result);
//                     } else {
//                         return done(null, false, { message: "일치하지 않는 비밀번호" });
//                     }
//                 });
//             } catch (e) {
//                 console.log("여기서 잡은 버그임ㅋㅋ");
//                 console.log(e);
//             }
//         }
//     )
// );

//user에 맞는 세션 생성
passport.serializeUser((user, done) => {
    done(null, user.nickname);
});

module.exports = router;