const { getIdParam } = require('../utils/helperMethods');
const { Destination, RouteSpecificSeat, Seat } = require('../../sequelize/models');

const updateSeatConfiguration = (seats, busId, destinationId) => {
    return seats.map((seat) => {
        console.log(seat);
        return {...seat, seatOfBus: busId, seatOfDestination: destinationId}
    });
};

const createSingleData = async (req, res) => {
    const {
        fromSource,
        toDestination,
        midPlaceBetweenRoutes,
        routeFare,
        departureDate,
        departureTime,
        arrivalDate,
        estimatedArrivalTime,
        assignedBusId
    } = req.body;

    // this is a transaction
    try {
        const destination = await Destination.create({fromSource, toDestination, midPlaceBetweenRoutes, routeFare, departureDate, departureTime, arrivalDate, estimatedArrivalTime, assignedBusId});
        const seatsOfAssignedBus = await Seat.findAll({
            where: {
                seatOfBus: destination.assignedBusId
            },
            attributes: {exclude: ['id']},
            raw: true
        });
        // console.log(seatsOfAssignedBus);
        const configuredSeats = updateSeatConfiguration(seatsOfAssignedBus, destination.assignedBusId, destination.id);
        // res.send({config: configuredSeats});
        await RouteSpecificSeat.bulkCreate(configuredSeats);

        res.redirect('/create-destination');
        // res.status(201).send(destination);
    } catch (error) {
        console.log(error);
    }
}

const findAllData = async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        // const destinations = await Destination.findAll({
        //     include: ['buses']
        // });
        res.status(200).send(destinations);
    } catch (error) {
        console.log(error);
    }
}

const findSingleDataById = async (req, res) => {
    // Do Stuffs...
}

const updateSingleData = async (req, res) => {
    const {
        fromSource,
        toDestination,
        midPlaceBetweenRoutes,
        routeFare,
        departureDate,
        departureTime,
        arrivalDate,
        estimatedArrivalTime,
        assignedBusId
    } = req.body;
    const id = req.params.id;

    try {
        const updatedDestination = await Destination.update({fromSource, toDestination, midPlaceBetweenRoutes, routeFare, departureDate, departureTime, arrivalDate, estimatedArrivalTime, assignedBusId},{
            where: {
                id: id
            }
        });
        res.send(updatedDestination);
    } catch (error) {
        console.log(error.message);
    }
}

const deleteSingleData = async (req, res) => {
    const id = req.params.id;
    try {
        // find by Id
        const deletedDestination = await Destination.findOne({
            where: {
                id: id
            }
        });
        if (deletedDestination) {
            await deletedDestination.destroy();
            res.sendStatus(200).json({"message": "Destination Deleted"});
        } else {
            res.send("Destination Not Found");
        }
    } catch (error) {
        res.send(error.message);
    }
}

module.exports = {
    findAllData,
    findSingleDataById,
    createSingleData,
    updateSingleData,
    deleteSingleData
}