const express = require('express');
const { Bus, Driver} = require('../../sequelize/models');
const { Op, Sequelize } = require('sequelize');
const {busLogoUpload} = require('../middlewares/imageUpload');
const fs = require('fs');
const router = express.Router();
const busesController = require('../controllers/busesController');

router.get('/', busesController.getAllBuses);

router.get('/with-no-seats', busesController.getBusesWithNoSeatsAssigned);

router.post('/add-bus', busLogoUpload.single('busServiceLogo'), busesController.addNewBus);

router.get('/ready-for-route', busesController.busesReadyForRoutes);

router.get('/search', busesController.searchBuses);

router.get('/:id', busesController.busWithDriverAndDestinations);

module.exports = router;