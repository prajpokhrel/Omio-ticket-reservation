const express = require('express');
const { Driver } = require('../../sequelize/models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.findAll();
        res.send(drivers);
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/search', async (req, res) => {
    const { firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber } = req.query;
    res.send(req.query);
    try {
        const filteredDrivers = await Driver.findAll({
            where: {
                firstName: firstName // refactor it later
            }
        });
        res.json(filteredDrivers);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;