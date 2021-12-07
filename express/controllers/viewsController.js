const axios = require('../axios-omio');
const {Passenger, Destination, Reservation, Place, Driver, Bus, User} = require('../../sequelize/models');

const renderDashboard = async (req, res) => {
    try {
        const totalPassengers = await Passenger.count();
        const totalRoutes = await Place.count();
        const totalDrivers = await Driver.count();
        const totalReservations = await Reservation.count();
        const totalBuses = await Bus.count();
        const totalUsers = await User.count();
        const totalDestinations = await Destination.count();
        res.render('dashboard.ejs', {totalPassengers, totalRoutes, totalUsers, totalDestinations, totalBuses, totalDrivers, totalReservations, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

const renderCreateBusPage = async (req, res) => {
    try {
        const params = {
            adminId: req.user.id
        }
        const drivers = await axios.get('/drivers', {params});
        res.render('data-create/create-bus.ejs', {drivers: drivers.data, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

const renderCreateDriverPage = async (req, res) => {
    res.render('data-create/create-driver.ejs', {adminD: req.user});
}

const renderCreateDestinationPage = async (req, res) => {
    try {
        const params = {
            adminId: req.user.id
        }
        const buses = await axios.get('/buses/ready-for-route', {params});
        res.render('data-create/create-destination.ejs', {buses: buses.data, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

const renderCreateBusMapPage = async (req, res) => {
    try {
        const params = {
            adminId: req.user.id
        }
        const buses = await axios.get('/buses/with-no-seats', {params});
        res.render('data-create/create-seats.ejs', {buses: buses.data, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

const renderAllBusesPage = async (req, res) => {
    try {
        const params = {
            busServiceName: req.query.busServiceName,
            busNumber: req.query.busNumber,
            adminId: req.user.id
        };
        if (Object.entries(req.query).length !== 0) {
            const filteredBuses = await axios.get('/buses/search', {params});
            // res.json(filteredBuses.data);
            res.render('data-display/display-buses.ejs', {buses: filteredBuses.data, adminD: req.user});
        } else {
            const buses = await axios.get('/general-routes/buses', {params});
            res.render('data-display/display-buses.ejs', { buses: buses.data, adminD: req.user});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const renderAllDestinationsPage = async (req, res) => {
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
            res.render('data-display/display-destinations.ejs', {destinations: filteredDestinations.data, adminD: req.user});
        } else  {
            const destinations = await axios.get('/general-routes/destinations', {params});
            res.render('data-display/display-destinations.ejs', {destinations: destinations.data, adminD: req.user});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const renderAllUsersPage = async (req, res) => {
    try {
        const totalUsers = await axios.get('/users/total-users');
        if (Object.entries(req.query).length !== 0) {
            const params = {
                fullName: req.query.fullName,
                email: req.query.email
            };
            const filteredUsers = await axios.get('/users/search', {params});
            res.render('data-display/display-users.ejs', {users: filteredUsers.data, userCount: totalUsers.data.count, adminD: req.user});
        } else {
            const users = await axios.get('/general-routes/users');
            res.render('data-display/display-users.ejs', {users: users.data, userCount: totalUsers.data.count, adminD: req.user});
        }
    } catch (error) {
        console.log(error);
    }
}

const renderAllReservationsPage = async (req, res) => {
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
        console.log(params);
        if (Object.entries(req.query).length !== 0) {
            const filteredReservations = await axios.get('/reservations/search', {params});
            // res.send(filteredReservations.data);
            res.render('data-display/display-reservations.ejs', {reservations: filteredReservations.data, adminD: req.user});
        } else {
            const reservations = await axios.get('/general-routes/reservations', {params});
            res.render('data-display/display-reservations.ejs', {reservations: reservations.data, adminD: req.user});
        }
    } catch (error) {
        console.log(error);
    }
}

const renderAllPassengersPage = async (req, res) => {
    try {
        const params = {
            fullName: req.query.fullName,
            email: req.query.email,
            idNumber: req.query.idNumber,
            adminId: req.user.id
        };
        if (Object.entries(req.query).length !== 0) {
            const filteredPassengers = await axios.get('/passengers/search', {params});
            res.render('data-display/display-passengers.ejs', {passengers: filteredPassengers.data, adminD: req.user});
        } else {
            const passengers = await axios.get('/general-routes/passengers', {params});
            res.render('data-display/display-passengers.ejs', {passengers: passengers.data, adminD: req.user});
        }
    } catch (error) {
        console.log(error);
    }
}

const renderAllDriversPage = async (req, res) => {
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
            res.render('data-display/display-drivers', { drivers: filteredDrivers.data, adminD: req.user });
        } else {
            const drivers = await axios.get('/general-routes/drivers', {params});
            res.render('data-display/display-drivers', { drivers: drivers.data, adminD: req.user });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const renderAdminProfilePage = async (req, res) => {
    const currentAdmin = req.user.id;
    try {
        const currentUser = await axios.get(`/admins/${currentAdmin}`);
        res.render('users/account.ejs', {adminData: currentUser.data, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

const renderChangePasswordPage = async (req, res) => {
    res.render('users/change-password.ejs', {adminD: req.user});
}

const renderSeatsDisplayPage = async (req, res) => {
    const params = {
        adminId: req.user.id
    }
    try {
        const buses = await axios.get('/buses/with-seats', {params});
        res.render('data-display/display-seats', {buses: buses.data, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

const renderUpdateBusPage = async (req, res) => {
    const busId = req.params.id;
    const params = {
        adminId: req.user.id
    };
    try {
        const bus = await axios.get(`/general-routes/buses/${busId}`);
        // find all the available drivers as well as the driver from bus data,
        // driver assigned to that bus - done
        const drivers = await axios.get(`/drivers/${bus.data.driverId}`, {params});
        res.render('data-update/update-bus.ejs', {drivers: drivers.data, bus: bus.data, adminD: req.user});
    } catch (error) {
        console.log(error.message);
    }
}

const renderUpdateDriverPage = async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await axios.get(`/general-routes/drivers/${driverId}`);
        res.render('data-update/update-driver', {driver: driver.data, adminD: req.user});
    } catch (error) {
        console.log(error.message);
    }
}

const renderDetailedBusInformationPage = async (req, res) => {
    const busId = req.params.id;
    try {
        const busDetails = await axios.get(`/buses/${busId}`);
        res.render('data-display-detailed/bus-details.ejs', { busDetails: busDetails.data, adminD: req.user });
    } catch (error) {
        console.log(error.message);
    }
}

const renderDetailedDestinationInformationPage = async (req, res) => {
    const destinationId = req.params.id;
    try {
        const destinationDetails = await axios.get(`/destinations/${destinationId}`);
        res.render('data-display-detailed/destination-details.ejs', { destinationDetails: destinationDetails.data, adminD: req.user });
    } catch (error) {
        console.log(error.message);
    }
}

const renderDetailedPassengersInformationPage = async (req, res) => {
    const passengerId = req.params.id;
    try {
        const passengerDetails = await axios.get(`/passengers/${passengerId}`);
        res.render('data-display-detailed/passenger-details.ejs', { passengerDetails: passengerDetails.data, adminD: req.user });
    } catch (error) {
        console.log(error);
    }
}

const renderDetailedReservationInformationPage = async (req, res) => {
    const reservationId = req.params.id;
    try {
        const reservationDetails = await axios.get(`/reservations/${reservationId}`);
        res.render('data-display-detailed/reservation-details.ejs', {reservationDetails: reservationDetails.data, adminD: req.user});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    renderDashboard,
    renderCreateBusPage,
    renderCreateDriverPage,
    renderCreateDestinationPage,
    renderCreateBusMapPage,
    renderAllBusesPage,
    renderAllDestinationsPage,
    renderAllUsersPage,
    renderAllReservationsPage,
    renderAllPassengersPage,
    renderAllDriversPage,
    renderAdminProfilePage,
    renderChangePasswordPage,
    renderSeatsDisplayPage,
    renderUpdateBusPage,
    renderUpdateDriverPage,
    renderDetailedBusInformationPage,
    renderDetailedDestinationInformationPage,
    renderDetailedPassengersInformationPage,
    renderDetailedReservationInformationPage
}