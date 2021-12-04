const express = require('express');
const axios = require('../axios-omio');
const {Passenger, Destination, Reservation, Place, Driver, Bus, User} = require('../../sequelize/models');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

router.get('/', viewsController.renderDashboard);

router.get('/create-bus', viewsController.renderCreateBusPage);

router.get('/create-driver', viewsController.renderCreateDriverPage);

router.get('/create-destination', viewsController.renderCreateDestinationPage);

router.get('/create-bus-map', viewsController.renderCreateBusMapPage);

router.get('/buses/all', viewsController.renderAllBusesPage);

router.get('/destinations/all', viewsController.renderAllDestinationsPage);

router.get('/users/all', viewsController.renderAllUsersPage);

router.get('/reservations/all', viewsController.renderAllReservationsPage);

router.get('/passengers/all', viewsController.renderAllPassengersPage);

router.get('/drivers/all', viewsController.renderAllDriversPage);

router.get('/profile', viewsController.renderAdminProfilePage);

router.get('/change-password', viewsController.renderChangePasswordPage);

router.get('/seats/all', viewsController.renderSeatsDisplayPage);

router.get('/bus/edit/:id', viewsController.renderUpdateBusPage);

router.get('/driver/edit/:id', viewsController.renderUpdateDriverPage);

router.get('/bus/details/:id', viewsController.renderDetailedBusInformationPage);

router.get('/destination/details/:id', viewsController.renderDetailedDestinationInformationPage);

router.get('/passenger/details/:id', viewsController.renderDetailedPassengersInformationPage);

router.get('/reservation/details/:id', viewsController.renderDetailedReservationInformationPage)

module.exports = router;