const express = require('express');
const { Driver } = require('../../sequelize/models');
const { Op, Sequelize} = require('sequelize');
const { driverImageUpload } = require('../middlewares/imageUpload');
const fs = require("fs");
const driversController = require('../controllers/driversController');
const router = express.Router();

router.get('/', driversController.getAllAvailableDrivers);

router.post('/add-driver', driverImageUpload.single('driverImage'), driversController.addNewDriver);

router.get('/search', driversController.driversSearch);

router.get('/:driverId', driversController.findCurrentDriverWithAllAvailableDrivers);

module.exports = router;