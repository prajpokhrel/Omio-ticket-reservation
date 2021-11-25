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

router.get('/ready-for-route', async (req, res) => {
    try {
        const availableBuses = await Bus.findAll({
            where: {
                busStatus: {
                    [Op.or]: ['available', 'en route']
                }
            }
        });
        res.send(availableBuses);
    } catch (error) {
        console.log(error);
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

// this can go to buses controllers findSingleDataById
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const bus = await Bus.findOne({
            where: {id: id},
            include: ["destinations", "driverDetails"],
        });
        res.send(bus);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;