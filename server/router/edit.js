const router = require('express').Router()


router.put("/edit", async (req, res) => {
    try {
        await req.app.db.collection("memo").updateOne(
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

module.exports = router