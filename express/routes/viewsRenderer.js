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
        // where status === available, add to controller
        const buses = await axios.get('/buses');
        res.render('data-create/create-destination.ejs', {buses: buses.data});
    } catch (error) {

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

router.get('/bus/edit/:id', async (req, res) => {
    const busId = req.params.id;
    try {
        const drivers = await axios.get('/drivers');
        const bus = await axios.get(`/general-routes/buses/${busId}`);
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