const router = require('express').Router()
const db = require('../app')

router.get('/list', (req, res) => {
    try {
        req.app.db.collection("memo").find().toArray((err, result) => {
            console.log(result);
            res.status(200).send(result)
        })
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;