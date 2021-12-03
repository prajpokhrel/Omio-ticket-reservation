const express = require('express');
const axios = require('../axios-omio');
const {Passenger, Destination, Reservation, Place, Driver, Bus, User} = require('../../sequelize/models');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const totalPassengers = await Passenger.count();
        const totalRoutes = await Place.count();
        const totalDrivers = await Driver.count();
        const totalReservations = await Reservation.count();
        const totalBuses = await Bus.count();
        const totalUsers = await User.count();
        const totalDestinations = await Destination.count();
        res.render('dashboard.ejs', {totalPassengers, totalRoutes, totalUsers, totalDestinations, totalBuses, totalDrivers, totalReservations});
    } catch (error) {
        console.log(error);
    }
});

router.get('/create-bus', async (req, res) => {
    try {
        // only available drivers who are not assigned to any buses
        const params = {
            adminId: req.user.id
        }
        const drivers = await axios.get('/drivers', {params});
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
        const params = {
            adminId: req.user.id
        }
        const buses = await axios.get('/buses/ready-for-route', {params});
        res.render('data-create/create-destination.ejs', {buses: buses.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/create-bus-map', async (req, res) => {
    try {
        // this requires only buses who have not assigned any seats
        const params = {
            adminId: req.user.id
        }
        const buses = await axios.get('/buses/with-no-seats', {params});
        res.render('data-create/create-seats.ejs', {buses: buses.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/buses/all', async (req, res) => {
    try {
        const params = {
            busServiceName: req.query.busServiceName,
            busNumber: req.query.busNumber,
            adminId: req.user.id
        };
        if (Object.entries(req.query).length !== 0) {
            // const { busServiceName, busNumber } = req.query;
            const filteredBuses = await axios.get('/buses/search', {params});
            // res.json(filteredBuses.data);
            res.render('data-display/display-buses.ejs', {buses: filteredBuses.data});
        } else {
            const buses = await axios.get('/general-routes/buses', {params});
            res.render('data-display/display-buses.ejs', { buses: buses.data});
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/destinations/all', async (req, res) => {
    try {
        const params = {
            fromSource: req.query.fromSource,
            toDestination: req.query.toDestination,
            departureDate: req.query.departureDate,
            departureDateRange: req.query.departureDateRange,
            adminId: req.user.id
        };
        if (Object.entries(req.query).length !== 0) {
            const filteredDestinations = await axios.get('/destinations/search', {params});
            // res.send(filteredDestinations.data);
            res.render('data-display/display-destinations.ejs', {destinations: filteredDestinations.data});
        } else  {
            const destinations = await axios.get('/general-routes/destinations', {params});
            res.render('data-display/display-destinations.ejs', {destinations: destinations.data});
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/users/all', async (req, res) => {
    try {
        const totalUsers = await axios.get('/users/total-users');
        if (Object.entries(req.query).length !== 0) {
            const params = {
                fullName: req.query.fullName,
                email: req.query.email
            };
            const filteredUsers = await axios.get('/users/search', {params});
            res.render('data-display/display-users.ejs', {users: filteredUsers.data, userCount: totalUsers.data.count});
        } else {
            const users = await axios.get('/general-routes/users');
            res.render('data-display/display-users.ejs', {users: users.data, userCount: totalUsers.data.count});
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/reservations/all', async (req, res) => {
    try {
        const params = {
            fromSource: req.query.fromSource,
            toDestination: req.query.toDestination,
            departureDate: req.query.departureDate,
            departureDateRange: req.query.departureDateRange,
            fullName: req.query.fullName,
            email: req.query.email,
            adminId: req.user.id
        };
        if (Object.entries(req.query).length !== 0) {
            const filteredReservations = await axios.get('/reservations/search', {params});
            // res.send(filteredReservations.data);
            res.render('data-display/display-reservations.ejs', {reservations: filteredReservations.data});
        } else {
            const reservations = await axios.get('/general-routes/reservations', {params});
            res.render('data-display/display-reservations.ejs', {reservations: reservations.data});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/passengers/all', async (req, res) => {
    try {
        const params = {
            fullName: req.query.fullName,
            email: req.query.email,
            idNumber: req.query.idNumber,
            adminId: req.user.id
        };
        if (Object.entries(req.query).length !== 0) {
            const filteredPassengers = await axios.get('/passengers/search', {params});
            res.render('data-display/display-passengers.ejs', {passengers: filteredPassengers.data});
        } else {
            const passengers = await axios.get('/general-routes/passengers', {params});
            res.render('data-display/display-passengers.ejs', {passengers: passengers.data});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/drivers/all', async (req, res) => {
    try {
        const params = {
            fullName: req.query.fullName,
            email: req.query.email,
            contactNumber: req.query.contactNumber,
            citizenshipNumber: req.query.citizenshipNumber,
            licenseNumber: req.query.licenseNumber,
            adminId: req.user.id
        }
        if (Object.entries(req.query).length !== 0) {
            // res.send(params);
            const filteredDrivers = await axios.get('/drivers/search', {params});
            res.render('data-display/display-drivers', { drivers: filteredDrivers.data });
        } else {
            const drivers = await axios.get('/general-routes/drivers', {params});
            res.render('data-display/display-drivers', { drivers: drivers.data });
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/profile', async (req, res) => {
    const currentAdmin = req.user.id;
    try {
        const currentUser = await axios.get(`/admins/${currentAdmin}`);
        res.render('users/account.ejs', {adminData: currentUser.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/change-password', (req, res) => {
    res.render('users/change-password.ejs');
});

router.get('/seats/all', async (req, res) => {
    const params = {
        adminId: req.user.id
    }
    try {
        const buses = await axios.get('/buses', {params});
        res.render('data-display/display-seats', {buses: buses.data});
    } catch (error) {
        console.log(error);
    }
});

router.get('/bus/edit/:id', async (req, res) => {
    const busId = req.params.id;
    const params = {
        adminId: req.user.id
    };
    try {
        const bus = await axios.get(`/general-routes/buses/${busId}`);
        // find all the available drivers as well as the driver from bus data,
        // driver assigned to that bus - done
        const drivers = await axios.get(`/drivers/${bus.data.driverId}`, {params});
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

router.get('/passenger/details/:id', async (req, res) => {
    const passengerId = req.params.id;
    try {
        const passengerDetails = await axios.get(`/passengers/${passengerId}`);
        res.render('data-display-detailed/passenger-details.ejs', { passengerDetails: passengerDetails.data });
    } catch (error) {
        console.log(error);
    }
});

router.get('/reservation/details/:id', async (req, res) => {
    const reservationId = req.params.id;
    try {
        const reservationDetails = await axios.get(`/reservations/${reservationId}`);
        res.render('data-display-detailed/reservation-details.ejs', {reservationDetails: reservationDetails.data});
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;