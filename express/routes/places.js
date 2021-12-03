const express = require('express');
const axios = require('../axios-omio');
const { Sequelize, Op } = require('sequelize');
const { Place, Destination } = require('../../sequelize/models');
const router = express.Router();
const placesController = require('../controllers/placesController');

router.get('/source', placesController.getAllDistinctSources);

router.get('/bus-specific-source/:id', placesController.getBusSpecificSource);

router.get('/source/:sourceName', placesController.getAvailableDestinationsBasedOnSource);

module.exports = router;