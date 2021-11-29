const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const { Destination, RouteSpecificSeat, Passenger, Reservation } = require('../../sequelize/models');

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

const arrangePassengers = (passengers, journeyId, mainAccountUserId) => {
     return passengers.map((passenger, index) => {
          return {...passenger, isMainPassenger: index === 0 ? 'true' : 'false', forDestination: journeyId, mainAccountId: mainAccountUserId}
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

          // add passenger form
          const arrangedPassengers = arrangePassengers(passengers, selectedJourney.id, mainUser.id);
          const addPassengers = await Passenger.bulkCreate(arrangedPassengers);

          // add reservation form [works fine, update table with decimal in price and then uncomment]
          // const addReservation = await Reservation.create({
          //      totalRouteFare, passengersCount, mainAccountId: mainUser.id, forDestination: selectedJourney.id
          // });

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


module.exports = router;