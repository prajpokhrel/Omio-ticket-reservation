const { getIdParam } = require('../utils/helperMethods');
const { Destination, RouteSpecificSeat, Seat } = require('../../sequelize/models');
const {Op, Sequelize} = require("sequelize");

const updateSeatConfiguration = (seats, busId, destinationId) => {
    return seats.map((seat) => {
        console.log(seat);
        return {...seat, seatOfBus: busId, seatOfDestination: destinationId}
    });
};

// combines [{},{},...,{},{}] to [[{},{}],...[{},{}]]
const combineSeatMap = (seatData) => {
    const seatMap = [];
    while (seatData.length) {
        seatMap.push(seatData.splice(0, 5));
    }
    return seatMap;
}

const searchDestinations = async (req, res) => {
    const fromSource = req.query.fromSource.toLowerCase();
    const toDestination = req.query.toDestination.toLowerCase();
    const departureDate = new Date(req.query.departureDate);
    const [fromRange, toRange] = req.query.departureDateRange.split('to');
    // handle this, if no date is passed, it will be undefined
    const fromDateRange = new Date(fromRange.trim());
    const toDateRange = new Date(toRange.trim());
    try {
        const filteredDestinations = await Destination.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fromSource')), {
                        [Op.substring]: fromSource
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('toDestination')), {
                        [Op.substring]: toDestination
                    }),
                    {
                        departureDate: {
                            [Op.eq]: departureDate
                        }
                    },
                    {
                        departureDate: {
                            [Op.and]: {
                                [Op.gt]: fromDateRange,
                                [Op.lt]: toDateRange
                            }
                        }
                    }
                ],
                adminId: req.query.adminId
            }
        });
        res.json(filteredDestinations);
    } catch (error) {
        console.log(error.message);
    }
}

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
    const adminId = req.user.id;

    // this is a transaction
    try {
        const destination = await Destination.create({fromSource, toDestination, midPlaceBetweenRoutes, routeFare, departureDate, departureTime, arrivalDate, estimatedArrivalTime, assignedBusId, adminId});
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

// users api, required requireAuth validations, client side
const availableDestinationsForCustomers = async (req, res) => {
    const fromSource = req.params.fromSource.toLowerCase();
    const toDestination = req.params.toDestination.toLowerCase();
    const travelers = req.params.travelers;
    const departureDate = new Date(req.params.departureDate);

    try {
        const foundRoutes = await Destination.findAll({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fromSource')), {
                        [Op.substring]: fromSource
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('toDestination')), {
                        [Op.substring]: toDestination
                    }),
                    {
                        departureDate: {
                            [Op.eq]: departureDate
                        }
                    },
                ]
            },
            include: ["buses"]
        });
        res.json(foundRoutes);
    } catch (error) {
        console.log(error);
    }
    res.json({fromSource, toDestination, travelers, departureDate});
}

const destinationDetailsWithSeats = async (req, res) => {
    const journeyId = req.params.journeyId;
    try {
        const journeyDetails = await Destination.findOne({
            where: {
                id: journeyId
            }
        });
        // can also add include: ['routeSeats']
        const journeySpecificSeats = await RouteSpecificSeat.findAll({
            where: {
                seatOfDestination: journeyId
            },
            order: [
                ['id', 'ASC']
            ]
        });
        const combinedSeatData = combineSeatMap(journeySpecificSeats);
        res.json({journeyDetails: journeyDetails, specificJourneySeats: combinedSeatData});
    } catch (error) {
        console.log(error);
    }
}

const destinationDetailsWithBus = async (req, res) => {
    const journeyId = req.params.journeyId;
    try {
        const journeyDetails = await Destination.findOne({
            where: {
                id: journeyId
            },
            include: ["buses"]
        });
        res.send(journeyDetails);
    } catch (error) {
        console.log(error);
    }
}

const destinationDetailsWithBusAndPassengers = async (req, res) => {
    const id = req.params.id;
    try {
        const destination = await Destination.findOne({
            where: {
                id: id
            },
            include: ["buses", "passengers"]
        });
        res.send(destination);
    } catch (error) {
        console.log(error.message);
    }
}

const findAllData = async (req, res) => {
    try {
        const destinations = await Destination.findAll({
            where: {
                adminId: req.query.adminId
            }
        });
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
    deleteSingleData,
    searchDestinations,
    availableDestinationsForCustomers,
    destinationDetailsWithSeats,
    destinationDetailsWithBus,
    destinationDetailsWithBusAndPassengers
}