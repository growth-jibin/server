const router = require('express').Router()
const db = require('../app')

router.get('/list', (req, res) => {
    try {
        req.app.db.collection("memo").find().toArray((result) => {
            console.log(result);
            res.send({ message: "찾기 성공" })
        })
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;