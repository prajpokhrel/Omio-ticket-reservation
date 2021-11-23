const express = require('express');
const { Bus } = require('../../sequelize/models');
const { Op, Sequelize } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const buses = await Bus.findAll();
        res.send(buses);
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/search', async (req, res) => {
    // const { busServiceName, busNumber } = req.query;
    const busServiceName = req.query.busServiceName.toLowerCase();
    const busNumber = req.query.busNumber.toLowerCase();

    try {
        const filteredBuses = await Bus.findAll({
            // sequelize.fn('upper', sequelize.col('username'))
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('busServiceName')), {
                        [Op.substring]: busServiceName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('busNumber')), {
                        [Op.substring]: busNumber
                    })
                ]
            }
        });
        res.json(filteredBuses);
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const bus = await Bus.findOne({
            where: {id: id},
            // OMG: Bus with all its destinations and driver details. HAIT so powerful.
            include: ["destinations", "driverDetails"],
        });
        res.send(bus);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;