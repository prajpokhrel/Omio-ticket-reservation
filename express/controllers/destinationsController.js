const { getIdParam } = require('../utils/helperMethods');
const { Destination, RouteSpecificSeat, Seat, sequelize } = require('../../sequelize/models');
const {Op, Sequelize} = require("sequelize");

const updateSeatConfiguration = (seats, busId, destinationId) => {
    return seats.map((seat) => {
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
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const createSingleData = async (req, res) => {
    const {
        fromSource,
        toDestination,
        routeFare,
        departureDate,
        departureTime,
        arrivalDate,
        estimatedArrivalTime,
        assignedBusId
    } = req.body;
    const adminId = req.user.id;

    try {
        await sequelize.transaction(async (t) => {
            const destination = await Destination.create(
                {fromSource, toDestination,
                    routeFare, departureDate,
                    departureTime, arrivalDate,
                    estimatedArrivalTime,
                    assignedBusId, adminId}, {transaction: t});
            const seatsOfAssignedBus = await Seat.findAll({
                where: {
                    seatOfBus: destination.assignedBusId
                },
                attributes: {exclude: ['id']},
                raw: true,
                transaction: t
            });
            // console.log(seatsOfAssignedBus);
            const configuredSeats = updateSeatConfiguration(seatsOfAssignedBus, destination.assignedBusId, destination.id);
            // res.send({config: configuredSeats});
            await RouteSpecificSeat.bulkCreate(configuredSeats, {transaction: t});

            return res.redirect('/create-destination');
            // res.status(201).send(destination);
        });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}

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
        res.status(500).send(error.message);
        console.log(error);
    }
    // res.json({fromSource, toDestination, travelers, departureDate});
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
        res.status(500).send(error.message);
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
        res.status(200).send(journeyDetails);
    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(200).send(destination);
    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
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
        res.status(200).send(updatedDestination);
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error.message);
    }
}

const deleteSingleData = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedDestination = await Destination.findOne({
            where: {
                id: id
            }
        });
        if (deletedDestination) {
            await deletedDestination.destroy();
            res.sendStatus(200).json({"message": "Destination Deleted"});
        } else {
            res.status(404).send("Destination Not Found");
        }
    } catch (error) {
        res.status(500).send(error.message);
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