const router = require('express').Router();
const passport = require('passport');
const crypto = require("crypto");

router.post("/register", (req, res) => {
    try {
        req.app.db.collection("login").findOne(
            { nickname: req.body.nickname },
            (err, result) => {
                if (result) {
                    res.status(401).send("Unauthorized");
                } else {
                    if (req.body.password === req.body.checkpassword) {
                        var password = req.body.password;
                        var cipher = crypto.createCipher("aes-256-ecb", password);
                        cipher.update(password, "utf8");
                        var cipheredpassword = cipher.final("hex");
                        req.app.db.collection("login").insertOne(
                            {
                                nickname: req.body.nickname,
                                password: cipheredpassword,
                            },
                            (err) => {
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

module.exports = router;