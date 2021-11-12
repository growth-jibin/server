const router = require("express").Router();

router.post('/add', async (req, res) => {
    try {
        const cntmemo = await req.app.db.collection("count").findOne({ name: "메모 수" });
        await req.app.db.collection("memo").insertOne({
            _id: cntmemo.totalmemo + 1,
            title: req.body.title,
            contents: req.body.contents,
            tag: req.body.tag,
            user: req.body.user,
            date: req.body.date,
            color: req.body.color,
        });
        await req.app.db.collection("count").updateOne(
            {
                name: "메모 수",
            },
            { $inc: { totalmemo: 1 } }
        );
        res.status(200).send({ message: "삽입 성공" });
    } catch (e) {
        console.log(e);
    }
})

module.exports = router