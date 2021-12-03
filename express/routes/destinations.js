const express = require('express');
const { Destination, RouteSpecificSeat } = require('../../sequelize/models');
const {Op, Sequelize} = require("sequelize");
const router = express.Router();
const destinationsController = require('../controllers/destinationsController');

router.get('/search', destinationsController.searchDestinations);

router.get('/find-routes/:fromSource/:toDestination/:travelers/:departureDate', destinationsController.availableDestinationsForCustomers);

router.get('/journey-details/:journeyId', destinationsController.destinationDetailsWithSeats);

router.get('/journey-details/with-bus/:journeyId', destinationsController.destinationDetailsWithBus);

router.get('/:id', destinationsController.destinationDetailsWithBusAndPassengers);

module.exports = router;