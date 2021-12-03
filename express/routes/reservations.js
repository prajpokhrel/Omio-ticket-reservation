const express = require('express');
const router = express.Router();
const {Op, Sequelize} = require('sequelize');
const { Destination, RouteSpecificSeat, Passenger, Reservation, Bus } = require('../../sequelize/models');
const reservationsController = require('../controllers/reservationsController');

router.post('/book-seat', reservationsController.reserveASeat);

router.get('/search', reservationsController.searchReservations);

router.get('/customer/:customerId/:reservationId', reservationsController.getCustomerSpecificReservationDetails);

router.get('/customer/:id', reservationsController.getAllReservationsOfCustomer);

router.get('/:reservationId', reservationsController.detailedReservationDetails);

module.exports = router;