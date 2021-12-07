const { getIdParam } = require('../utils/helperMethods');
const { Bus, Driver, Destination, sequelize } = require('../../sequelize/models');
const fs = require("fs");
const {Op, Sequelize} = require("sequelize");
// expand these to services....
// asyncErrors middleware to reduce try catch will be implemented later on

const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.findAll({
            where: {
                adminId: req.query.adminId
            }
        });
        res.status(200).send(buses);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const getBusesWithNoSeatsAssigned = async (req, res) => {
    try {
        const busWithNoSeatsAssigned = await Bus.findAll({
            where: {
                assignedSeats: false,
                adminId: req.query.adminId
            }
        });
        res.status(200).send(busWithNoSeatsAssigned);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const getBusesWithSeatsAssigned = async (req, res) => {
    try {
        const busWithSeatsAssigned = await Bus.findAll({
            where: {
                assignedSeats: true,
                adminId: req.query.adminId
            }
        });
        res.status(200).send(busWithSeatsAssigned);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const addNewBus = async (req, res) => {
    const {busServiceName, busNumber, busStatus, driverId} = req.body;
    const busServiceLogo = req.file.filename;
    const adminId = req.user.id;
    // multer will handle form image this
    // this is a transaction, handle wisely, works for now
    try {
        if (req.body.id) {
            res.status(400).send("Bad request: ID should not be provided, since it is determined automatically by the database.");
        } else {
            await sequelize.transaction(async (t) => {
                const getBus = await Bus.findOne({
                    where: {
                        busNumber: busNumber
                    }
                });
                if (getBus) {
                    res.status(400).send("Bus number should be unique.");
                } else {
                    const bus = await Bus.create(
                        {busServiceName,
                            busNumber,
                            busServiceLogo,
                            busStatus,
                            driverId,
                            adminId}, {transaction: t});
                    await Driver.update({driverStatus: 'assigned'}, {
                        where: {
                            id: bus.driverId
                        },
                        transaction: t
                    });
                    return res.redirect('/create-bus');
                }
            });
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                console.log(error);
            });
        }
        res.status(400).send(error.message);
    }
}

const busesReadyForRoutes = async (req, res) => {
    try {
        const availableBuses = await Bus.findAll({
            where: {
                busStatus: {
                    [Op.or]: ['available', 'en route']
                },
                assignedSeats: true,
                adminId: req.query.adminId
            }
        });
        res.status(200).send(availableBuses);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const searchBuses = async (req, res) => {
    const busServiceName = req.query.busServiceName.toLowerCase();
    const busNumber = req.query.busNumber.toLowerCase();

    try {
        const filteredBuses = await Bus.findAll({
            // sequelize.fn('upper', sequelize.col('username'))
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('busServiceName')), {
                        [Op.substring]: busServiceName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('busNumber')), {
                        [Op.substring]: busNumber
                    })
                ],
                adminId: req.query.adminId
            }
        });
        res.json(filteredBuses);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const busWithDriverAndDestinations = async (req, res) => {
    try {
        const id = req.params.id;
        const bus = await Bus.findOne({
            where: {id: id},
            include: ["destinations", "driverDetails"],
        });
        res.status(200).send(bus);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const findAllData = async (req, res) => {
    try {
        const buses = await Bus.findAll({
            where: {
                adminId: req.query.adminId
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
        // const buses = await Bus.findAll({include: ['driverDetails']});
        res.status(200).send(buses);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const findSingleDataById = async (req, res) => {
    try {
        const id = req.params.id;
        const bus = await Bus.findOne({
            where: {id: id},
            // include: ["destinations", "driverDetails"],
        });
        res.status(200).send(bus);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateBus = async (req, res) => {
    const { busServiceName, busNumber, busStatus, driverId } = req.body;
    const busServiceLogo = req.file.filename;
    const id = req.params.id;
    try {
        await sequelize.transaction(async (t) => {
            const getBus = await Bus.findOne({
                where: {
                    id: id
                },
                transaction: t
            });
            if (driverId !== getBus.driverId) {
                await Driver.update({driverStatus: 'available'}, {
                    where: {
                        id: getBus.driverId
                    },
                    transaction: t
                });
            }
            // find bus for previous driver info, and then update, and update new driver to bus if thats the case
            await Bus.update({busServiceName, busNumber, busServiceLogo, busStatus, driverId}, {
                where: {
                    id: id
                },
                transaction: t
            });
            await Driver.update({driverStatus: 'assigned'}, {
                where: {
                    id: driverId
                },
                transaction: t
            });
            return res.redirect('/buses/all');
            // res.send(200).send(updatedBus);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteSingleData = async (req, res) => {
    const id = req.params.id;
    try {
        await sequelize.transaction(async (t) => {
            const deletedBus = await Bus.findOne({
                where: {
                    id: id
                },
                transaction: t
            });
            await Driver.update({driverStatus: 'available'}, {
                where: {
                    id: deletedBus.driverId
                },
                transaction: t
            });
            await deletedBus.destroy({transaction: t});
            return res.status(200).json({"message": "Bus Deleted"});
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    findAllData,
    findSingleDataById,
    updateBus,
    deleteSingleData,
    getAllBuses,
    getBusesWithNoSeatsAssigned,
    getBusesWithSeatsAssigned,
    addNewBus,
    busesReadyForRoutes,
    searchBuses,
    busWithDriverAndDestinations
}