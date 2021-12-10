const { getIdParam } = require('../utils/helperMethods');
const { User, Reservation, Destination, RouteSpecificSeat, Passenger, Bus, sequelize} = require('../../sequelize/models');
const {Op, Sequelize} = require("sequelize");
const sendEmail = require('../services/sendEmailService');
// expand these to services....

// doing all these in server, not to be tricked by client changing price value :D
const calculateSeatSpecificPrice = (seats) => {
    return seats.reduce((previousValue, currentValue) => {
        return parseFloat(previousValue) + parseFloat(currentValue.seatSpecificPrice);
    }, 0);
}

const setSeatsNumber = (seats) => {
    const selectedSeats = [];
    seats.map((seat) => {
        selectedSeats.push(`${seat.row}${seat.col}`);
    });
    return selectedSeats.join(', ');
}

const calculateTotalRoutePrice = (reservedSeatPrice, routeFare, serviceTax, passengers) => {
    return parseFloat(reservedSeatPrice) + (parseFloat(routeFare) + parseFloat(serviceTax)) * passengers;
}

const pluck = (array, key) => {
    return array.map((item) => { return item[key]; });
}

const arrangePassengers = (passengers, journeyId, mainAccountUserId, reservationId, adminId) => {
    return passengers.map((passenger, index) => {
        return {...passenger, isMainPassenger: index === 0 ? 'true' : 'false', forDestination: journeyId, mainAccountId: mainAccountUserId, reservationId, adminId}
    });
}

const reserveASeat = async (req, res) => {
    const journeyId = req.body.journeyDetails;
    const seats = req.body.selectedSeats;
    const passengers = req.body.passengers;
    const mainUser = req.body.mainAccount;
    const seatsId = pluck(seats, 'id');
    const passengersCount = passengers.length;
    const mainPassengerEmail = pluck(passengers, 'email');

    try {
        await sequelize.transaction(async (t) => {
            const selectedJourney = await Destination.findOne({
                where: {
                    id: journeyId
                },
                transaction: t
            });
            const selectedSeats = await RouteSpecificSeat.findAll({
                where: {
                    id: {
                        [Op.or]: seatsId
                    }
                },
                transaction: t
            });

            const seatSpecificPrice = calculateSeatSpecificPrice(selectedSeats);
            const totalRouteFare = calculateTotalRoutePrice(seatSpecificPrice, selectedJourney.routeFare, selectedJourney.serviceTax, passengersCount);
            const setSelectedSeatNumber = setSeatsNumber(selectedSeats);

            const reservation = await Reservation.create({
                seatsNumber: setSelectedSeatNumber,
                totalTravelAmount: totalRouteFare.toFixed(2),
                totalPassenger: passengersCount,
                mainAccountId: mainUser.id,
                forDestination: selectedJourney.id,
                adminId: selectedJourney.adminId
            }, {transaction: t});

            // add passenger form
            const arrangedPassengers = arrangePassengers(passengers, selectedJourney.id, mainUser.id, reservation.id, selectedJourney.adminId);
            const addPassengers = await Passenger.bulkCreate(arrangedPassengers, {transaction: t});

            // update seats as booked
            await RouteSpecificSeat.update({isBookedSeat: true}, {
                where: {
                    id: {
                        [Op.or]: seatsId
                    }
                },
                transaction: t
            });

            let ticketLink = `http://localhost:3000/booking-invoice/${mainUser.id}/${reservation.id}`;

            await sendEmail(
                mainPassengerEmail[0],
                'Your tickets have been booked.',
                `Please print your tickets or show your booking invoice from your profile during your travel. You can print your tickets from ${ticketLink}`
            );

            return res.status(200).send(addPassengers);
        });
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const searchReservations = async (req, res) => {
    const fromSource = req.query.fromSource.toLowerCase();
    const toDestination = req.query.toDestination.toLowerCase();
    const departureDate = new Date(req.query.departureDate);
    const [fromRange, toRange] = req.query.departureDateRange.split('to');
    //handle this if no dates passed
    const fromDateRange = new Date(fromRange.trim());
    const toDateRange = new Date(toRange.trim());
    const [firstName, lastName] = req.query.fullName.toLowerCase().split(' ', 2);
    const email = req.query.email.toLowerCase();

    try {
        const filteredReservations = await Reservation.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('destinationDetails.fromSource')), {
                        [Op.substring]: fromSource
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('destinationDetails.toDestination')), {
                        [Op.substring]: toDestination
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mainUserDetails.firstName')), {
                        [Op.substring]: firstName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mainUserDetails.lastName')), {
                        [Op.substring]: lastName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mainUserDetails.email')), {
                        [Op.substring]: email
                    }),
                    {
                        '$destinationDetails.departureDate$': {
                            [Op.eq]: departureDate
                        }
                    },
                    {
                        '$destinationDetails.departureDate$': {
                            [Op.and]: {
                                [Op.gt]: fromDateRange,
                                [Op.lt]: toDateRange
                            }
                        }
                    }

                ],
                adminId: req.query.adminId
            },
            include: ["mainUserDetails", "destinationDetails"]
        });
        res.status(200).send(filteredReservations);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const detailedReservationDetails = async (req, res) => {
    const reservationId = req.params.reservationId;
    try {
        const reservation = await Reservation.findOne({
            where: {
                id: reservationId
            },
            include: ["destinationDetails", "passengers", "mainUserDetails"]
        });
        const assignedBus = await Bus.findOne({
            where: {
                id: reservation.destinationDetails.assignedBusId
            }
        });
        res.json({reservation, assignedBus});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

// users apis, need requireAuth middleware
const getCustomerSpecificReservationDetails = async (req, res) => {
    const {customerId, reservationId} = req.params;
    try {
        const reservation = await Reservation.findOne({
            where: {
                [Op.and]: {
                    mainAccountId: customerId,
                    id: reservationId
                }
            },
            include: ["destinationDetails", "passengers", "mainUserDetails"]
        });
        // nested eager loading can also be done. :D
        const assignedBus = await Bus.findOne({
            where: {
                id: reservation.destinationDetails.assignedBusId
            }
        });
        res.json({reservation, assignedBus});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const getBookingInvoice = async (req, res) => {
    const {bookingId, email} = req.params;
    console.log(bookingId, email);
    try {
        const getUser = await User.findOne({
            where: {
                email: email
            }
        });
        const getReservation = await Reservation.findOne({
            where: {
                bookingCode: bookingId
            }
        });
        if (!getUser || !getReservation) {
            res.status(400).send("Booking code or email is invalid.");
        }
        res.json({userId: getUser.id, reservationId: getReservation.id});
    } catch (error) {
        res.status(500).send(error);
    }
}

const getAllReservationsOfCustomer = async (req, res) => {
    const customerId = req.params.id;
    try {
        const reservations = await Reservation.findAll({
            where: {
                mainAccountId: customerId
            },
            include: ["destinationDetails", "passengers"], // remove passengers, handled in detailed
            order: [
                ['bookingTime', 'DESC']
            ]
        });
        res.status(200).send(reservations);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const createSingleData = async (req, res) => {
    // Do Stuffs...
}

const findAllData = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: {
                adminId: req.query.adminId
            },
            include: ["mainUserDetails", "destinationDetails"],
            order: [
                ["createdAt", "DESC"]
            ]
        });
        res.status(200).send(reservations);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const findSingleDataById = async (req, res) => {
    // Do Stuffs...
}

const updateSingleData = async (req, res) => {
    // Do Stuffs...
}

const deleteSingleData = async (req, res) => {
    // Do Stuffs...
}

module.exports = {
    findAllData,
    findSingleDataById,
    createSingleData,
    updateSingleData,
    deleteSingleData,
    reserveASeat,
    searchReservations,
    getCustomerSpecificReservationDetails,
    getAllReservationsOfCustomer,
    detailedReservationDetails,
    getBookingInvoice
}