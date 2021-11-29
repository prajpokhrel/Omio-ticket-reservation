const express = require('express');
const axios = require('../axios-omio');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`<h1>Welcome to OMIO</h1> ${req.user.email}`);
});

router.get('/create-bus', async (req, res) => {
    try {
        // only available drivers who are not assigned to any buses
        const drivers = await axios.get('/drivers');
        res.render('data-create/create-bus.ejs', {drivers: drivers.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/create-driver', (req, res) => {
    res.render('data-create/create-driver.ejs');
});

router.get('/create-destination', async (req, res) => {
    try {
        // where status === available, en route add to controller
        const buses = await axios.get('/buses/ready-for-route');
        res.render('data-create/create-destination.ejs', {buses: buses.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/create-bus-map', async (req, res) => {
    try {
        // this requires only buses who have not assigned any seats
        const buses = await axios.get('/buses');
        res.render('data-create/create-seats.ejs', {buses: buses.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/buses/all', async (req, res) => {
    try {
        if (Object.entries(req.query).length !== 0) {
            const params = {
                busServiceName: req.query.busServiceName,
                busNumber: req.query.busNumber
            };
            // const { busServiceName, busNumber } = req.query;
            const filteredBuses = await axios.get('/buses/search', {params});
            // res.json(filteredBuses.data);
            res.render('data-display/display-buses.ejs', {buses: filteredBuses.data});
        } else {
            const buses = await axios.get('/general-routes/buses');
            res.render('data-display/display-buses.ejs', { buses: buses.data});
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/destinations/all', async (req, res) => {
    try {
        if (Object.entries(req.query).length !== 0) {
            const params = {
                fromSource: req.query.fromSource,
                toDestination: req.query.toDestination,
                departureDate: req.query.departureDate,
                departureDateRange: req.query.departureDateRange
            };
            const filteredDestinations = await axios.get('/destinations/search', {params});
            // res.send(filteredDestinations.data);
            res.render('data-display/display-destinations.ejs', {destinations: filteredDestinations.data});
        } else  {
            const destinations = await axios.get('/general-routes/destinations');
            res.render('data-display/display-destinations.ejs', {destinations: destinations.data});
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/reservations/all', async (req, res) => {
    try {
        if (Object.entries(req.query).length !== 0) {
            const params = {};
            const filteredReservations = await axios.get('/reservations/search', {params});
            res.render('data-display/display-reservations.ejs', {reservations: filteredReservations.data});
        } else {
            const reservations = await axios.get('/general-routes/reservations');
            res.render('data-display/display-reservations.ejs', {reservations: reservations.data});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/passengers/all', async (req, res) => {
    try {
        if (Object.entries(req.query).length !== 0) {
            const params = {};
            const filteredPassengers = await axios.get('/passengers/search', {params});
            res.render('data-display/display-passengers.ejs', {passengers: filteredPassengers.data});
        } else {
            const passengers = await axios.get('/general-routes/passengers');
            res.render('data-display/display-passengers.ejs', {passengers: passengers.data});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/drivers/all', async (req, res) => {
    try {
        if (Object.entries(req.query).length !== 0) {
            const params = {
                fullName: req.query.fullName,
                email: req.query.email,
                contactNumber: req.query.contactNumber,
                citizenshipNumber: req.query.citizenshipNumber,
                licenseNumber: req.query.licenseNumber,
            }
            // res.send(params);
            const filteredDrivers = await axios.get('/drivers/search', {params});
            res.render('data-display/display-drivers', { drivers: filteredDrivers.data });
        } else {
            const drivers = await axios.get('/general-routes/drivers');
            res.render('data-display/display-drivers', { drivers: drivers.data });
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/profile', (req, res) => {
    res.render('users/account.ejs');
});

router.get('/change-password', (req, res) => {
    res.render('users/change-password.ejs');
});

router.get('/seats/all', async (req, res) => {
    try {
        const buses = await axios.get('/buses');
        res.render('data-display/display-seats', {buses: buses.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/bus/edit/:id', async (req, res) => {
    const busId = req.params.id;
    try {
        const bus = await axios.get(`/general-routes/buses/${busId}`);
        // find all the available drivers as well as the driver from bus data,
        // driver assigned to that bus
        const drivers = await axios.get(`/drivers/${bus.data.driverId}`);
        res.render('data-update/update-bus.ejs', {drivers: drivers.data, bus: bus.data});
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/driver/edit/:id', async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await axios.get(`/general-routes/drivers/${driverId}`);
        res.render('data-update/update-driver', {driver: driver.data});
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/bus/details/:id', async (req, res) => {
    const busId = req.params.id;
    try {
        const busDetails = await axios.get(`/buses/${busId}`);
        res.render('data-display-detailed/bus-details.ejs', { busDetails: busDetails.data });
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/destination/details/:id', async (req, res) => {
    const destinationId = req.params.id;
    try {
        const destinationDetails = await axios.get(`/destinations/${destinationId}`);
        res.render('data-display-detailed/destination-details.ejs', { destinationDetails: destinationDetails.data });
    } catch (error) {
        console.log(error.message);
    }
});


module.exports = router;