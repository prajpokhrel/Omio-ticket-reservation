const express = require('express');
const router = express.Router();

// this file is used for general CRUD operations

const controllers = {
    generalRoutes: require('../controllers/generalRoutesController'),
    drivers: require('../controllers/driversController'),
    buses: require('../controllers/busesController'),
    destinations: require('../controllers/destinationsController'),
    places: require('../controllers/placesController'),
    users: require('../controllers/usersController'),
    admins: require('../controllers/adminController'),
    reservations: require('../controllers/reservationsController'),
    passengers: require('../controllers/passengersController')
    // other controllers...
}

// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(controllers)) {
    if (routeController.findAllData) {
        router.get(`/${routeName}`, routeController.findAllData);
    }
    if (routeController.findSingleDataById) {
        router.get(`/${routeName}/:id`, routeController.findSingleDataById);
    }
    if (routeController.createSingleData) {
        router.post(`/${routeName}`, routeController.createSingleData);
    }
    if (routeController.updateSingleData) {
        router.put(`/${routeName}/:id`, routeController.updateSingleData); // or patch -- use wisely
    }
    if (routeController.deleteSingleData) {
        router.delete(`/${routeName}/:id`, routeController.deleteSingleData);
    }
}

module.exports = router;

