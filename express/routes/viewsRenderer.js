const express = require('express');
const axios = require('../axios-omio');
const {Passenger, Destination, Reservation, Place, Driver, Bus, User} = require('../../sequelize/models');
const viewsController = require('../controllers/viewsController');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/authCheck');

router.get('/', checkAuthenticated, viewsController.renderDashboard);

router.get('/create-bus', checkAuthenticated, viewsController.renderCreateBusPage);

router.get('/create-driver', checkAuthenticated, viewsController.renderCreateDriverPage);

router.get('/create-destination', checkAuthenticated, viewsController.renderCreateDestinationPage);

router.get('/create-bus-map', checkAuthenticated, viewsController.renderCreateBusMapPage);

router.get('/buses/all', checkAuthenticated, viewsController.renderAllBusesPage);

router.get('/destinations/all', checkAuthenticated, viewsController.renderAllDestinationsPage);

router.get('/users/all', checkAuthenticated, viewsController.renderAllUsersPage);

router.get('/reservations/all', checkAuthenticated, viewsController.renderAllReservationsPage);

router.get('/passengers/all', checkAuthenticated, viewsController.renderAllPassengersPage);

router.get('/drivers/all', checkAuthenticated, viewsController.renderAllDriversPage);

router.get('/profile', checkAuthenticated, viewsController.renderAdminProfilePage);

router.get('/change-password', checkAuthenticated, viewsController.renderChangePasswordPage);

router.get('/seats/all', checkAuthenticated, viewsController.renderSeatsDisplayPage);

router.get('/bus/edit/:id', checkAuthenticated, viewsController.renderUpdateBusPage);

router.get('/driver/edit/:id', checkAuthenticated, viewsController.renderUpdateDriverPage);

router.get('/bus/details/:id', checkAuthenticated, viewsController.renderDetailedBusInformationPage);

router.get('/destination/details/:id', checkAuthenticated, viewsController.renderDetailedDestinationInformationPage);

router.get('/passenger/details/:id', checkAuthenticated, viewsController.renderDetailedPassengersInformationPage);

router.get('/reservation/details/:id', checkAuthenticated, viewsController.renderDetailedReservationInformationPage);

module.exports = router;