const express = require('express');
const { Bus, Driver} = require('../../sequelize/models');
const { Op, Sequelize } = require('sequelize');
const {busLogoUpload} = require('../middlewares/imageUpload');
const fs = require('fs');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const buses = await Bus.findAll();
        res.send(buses);
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/with-no-seats', async (req, res) => {
    try {
        const busWithNoSeatsAssigned = await Bus.findAll({
            where: {
                assignedSeats: false
            }
        });
        res.send(busWithNoSeatsAssigned);
    } catch (error) {
        console.log(error.message);
    }
});

router.post('/add-bus', busLogoUpload.single('busServiceLogo'), async (req, res) => {
    console.log(req.body);
    const {busServiceName, busNumber, busStatus, driverId} = req.body;
    const busServiceLogo = req.file.filename;
    // multer will handle form image this
    // this is a transaction, handle wisely, works for now
    try {
        if (req.body.id) {
            res.status(400).send("Bad request: ID should not be provided, since it is determined automatically by the database.");
        } else {
            const bus = await Bus.create({busServiceName, busNumber, busServiceLogo, busStatus, driverId});
            await Driver.update({driverStatus: 'assigned'}, {
                where: {
                    id: bus.driverId
                }
            });
            res.redirect('/create-bus');
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                console.log(error);
            });
        }
        res.send(error.message);
    }
});

router.get('/ready-for-route', async (req, res) => {
    try {
        const availableBuses = await Bus.findAll({
            where: {
                busStatus: {
                    [Op.or]: ['available', 'en route']
                },
                assignedSeats: true
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