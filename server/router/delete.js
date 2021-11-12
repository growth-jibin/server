const router = require('express').Router()


router.delete("/delete", async (req, res) => {
    try {
        const id = parseInt(req.body._id);
        await req.app.db.collection("memo").deleteOne({ _id: id });
        res.status(200).send({ message: "삭제 성공" });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;