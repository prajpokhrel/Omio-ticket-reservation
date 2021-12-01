const express = require('express');
const router = express.Router();
const {Op, Sequelize} = require('sequelize');
const { Destination, RouteSpecificSeat, Passenger, Reservation, Bus } = require('../../sequelize/models');

// doing all these in server, not to be tricked by client changing price value :D
const calculateSeatSpecificPrice = (seats) => {
     return seats.reduce((previousValue, currentValue) => {
          return parseFloat(previousValue) + parseFloat(currentValue.seatSpecificPrice);
     }, 0);
}

const calculateTotalRoutePrice = (reservedSeatPrice, routeFare, serviceTax, passengers) => {
     return parseFloat(reservedSeatPrice) + (parseFloat(routeFare) + parseFloat(serviceTax)) * passengers;
}

const pluck = (array, key) => {
     return array.map((item) => { return item[key]; });
}

const arrangePassengers = (passengers, journeyId, mainAccountUserId, reservationId) => {
     return passengers.map((passenger, index) => {
          return {...passenger, isMainPassenger: index === 0 ? 'true' : 'false', forDestination: journeyId, mainAccountId: mainAccountUserId, reservationId}
     });
}

router.post('/book-seat', async (req, res) => {
     const journeyId = req.body.journeyDetails;
     const seats = req.body.selectedSeats;
     const passengers = req.body.passengers;
     const mainUser = req.body.mainAccount;
     const seatsId = pluck(seats, 'id');
     const passengersCount = passengers.length;

     try {
          const selectedJourney = await Destination.findOne({
               where: {
                    id: journeyId
               }
          });
          const selectedSeats = await RouteSpecificSeat.findAll({
               where: {
                    id: {
                         [Op.or]: seatsId
                    }
               }
          });

          const seatSpecificPrice = calculateSeatSpecificPrice(selectedSeats);
          const totalRouteFare = calculateTotalRoutePrice(seatSpecificPrice, selectedJourney.routeFare, selectedJourney.serviceTax, passengersCount);

          // add reservation form [works fine, update table with decimal in price and then uncomment]
          const reservation = await Reservation.create({
               totalTravelAmount: totalRouteFare, totalPassenger: passengersCount, mainAccountId: mainUser.id, forDestination: selectedJourney.id
          });

          // add passenger form
          const arrangedPassengers = arrangePassengers(passengers, selectedJourney.id, mainUser.id, reservation.id);
          const addPassengers = await Passenger.bulkCreate(arrangedPassengers);

          // update seats as booked
          await RouteSpecificSeat.update({isBookedSeat: true}, {
               where: {
                    id: {
                         [Op.or]: seatsId
                    }
               }
          });

          res.send(addPassengers);

     } catch (error) {
          console.log(error);
     }
});

router.get('/search', async (req, res) => {
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

                    ]
               },
               include: ["mainUserDetails", "destinationDetails"]
          });
          res.send(filteredReservations);
     } catch (error) {
          console.log(error);
     }
});

router.get('/customer/:customerId/:reservationId', async (req, res) => {
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
          console.log(error);
     }
});

router.get('/customer/:id', async (req, res) => {
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
          res.send(reservations);
     } catch (error) {
          console.log(error);
     }
});

router.get('/:reservationId', async (req, res) => {
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
          console.log(error);
     }
});

module.exports = router;