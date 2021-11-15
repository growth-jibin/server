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

//user에 맞는 세션 생성
passport.serializeUser((user, done) => {
    done(null, user.nickname);
});

passport.deserializeUser((nickname, done) => {
    req.app.db.collection('login').findOne({ nickname: nickname }, (err, result) => {
        console.log(result);
        done(null, result)
    })
})

module.exports = router;