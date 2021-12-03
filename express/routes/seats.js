const express = require('express');
const router = express.Router();
const { Seat, Bus } = require('../../sequelize/models');
const seatsController = require('../controllers/seatsController');

router.post('/create-bus-map', seatsController.createBusMap);

router.get('/bus-map/:busId', seatsController.getBusMapSpecificToBus);

module.exports = router;