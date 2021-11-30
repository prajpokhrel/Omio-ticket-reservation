const express = require('express');
const { Driver } = require('../../sequelize/models');
const { Op, Sequelize} = require('sequelize');
const {driverImageUpload} = require('../middlewares/imageUpload');
const fs = require("fs");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.findAll({
            where: {
                driverStatus: 'available'
            }
        });
        res.send(drivers);
    } catch (error) {
        console.log(error.message);
    }
});

router.post('/add-driver', driverImageUpload.single('driverImage'), async (req, res) => {
    const {firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber} = req.body;
    const driverImage = req.file.filename;
    if (req.body.id) {
        res.status(400).send("ID should not be supplied");
    }

    try {
        const driver = await Driver.create({firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber, driverImage});
        res.redirect('/create-driver');
        // res.status(201).send(driver);
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                console.log(error);
            });
        }
        console.log(error.message);
    }
});

router.get('/search', async (req, res) => {
    // const { firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber } = req.query;
    const [firstName, lastName] = req.query.fullName.toLowerCase().split(' ', 2);
    const email = req.query.email.toLowerCase();
    const contactNumber = req.query.contactNumber.toLowerCase();
    const citizenshipNumber = req.query.citizenshipNumber.toLowerCase();
    const licenseNumber = req.query.licenseNumber.toLowerCase();
    try {
        const filteredDrivers = await Driver.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), {
                        [Op.substring]: firstName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), {
                        [Op.substring]: lastName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), {
                        [Op.substring]: email
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('contactNumber')), {
                        [Op.substring]: contactNumber
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('citizenshipNumber')), {
                        [Op.substring]: citizenshipNumber
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('licenseNumber')), {
                        [Op.substring]: licenseNumber
                    }),
                ]
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.json(filteredDrivers);
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/:driverId', async (req, res) => {
    const driverId = req.params.driverId;
    try {
        const drivers = await Driver.findAll({
            where: {
                [Op.or]: {
                    driverStatus: 'available',
                    id: driverId
                }
            }
        });
        res.send(drivers);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;