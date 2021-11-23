const express = require('express');
const { Destination } = require('../../sequelize/models');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const destination = await Destination.findOne({
            where: {
                id: id
            },
            include: ["buses", "passengers"]
        });
        res.send(destination);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;