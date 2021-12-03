const { getIdParam } = require('../utils/helperMethods');
const { Bus, Driver, Destination } = require('../../sequelize/models');
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
        res.send(buses);
    } catch (error) {
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
        res.send(busWithNoSeatsAssigned);
    } catch (error) {
        console.log(error.message);
    }
}

const addNewBus = async (req, res) => {
    console.log(req.body);
    const {busServiceName, busNumber, busStatus, driverId} = req.body;
    const busServiceLogo = req.file.filename;
    const adminId = req.user.id;
    // multer will handle form image this
    // this is a transaction, handle wisely, works for now
    try {
        if (req.body.id) {
            res.status(400).send("Bad request: ID should not be provided, since it is determined automatically by the database.");
        } else {
            const bus = await Bus.create({busServiceName, busNumber, busServiceLogo, busStatus, driverId, adminId});
            await Driver.update({driverStatus: 'assigned'}, {
                where: {
                    id: bus.driverId
                }
            });
            res.redirect('/create-bus');
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                console.log(error);
            });
        }
        res.send(error.message);
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
        res.send(availableBuses);
    } catch (error) {
        console.log(error);
    }
}

const searchBuses = async (req, res) => {
    // const { busServiceName, busNumber } = req.query;
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
        res.send(bus);
    } catch (error) {
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
        res.send(error.message);
    }
}

const findSingleDataById = async (req, res) => {
    // Do Stuffs... Refactor as needed.
    const id = req.params.id;
    const bus = await Bus.findOne({
        where: {id: id},
        // include: ["destinations", "driverDetails"],
    });
    res.send(bus);
}

const updateSingleData = async (req, res) => {
    const {
        busServiceName,
        busNumber,
        busServiceLogo,
        busStatus,
        driverId
    } = req.body;
    const id = req.params.id;
    try {
        // find bus for previous driver info, and then update, and update new driver to bus if thats the case
        const updatedBus = await Bus.update({busServiceName, busNumber, busServiceLogo, busStatus, driverId}, {
            where: {
                id: id
            }
        });
        res.send(200).send(updatedBus);
    } catch (error) {
        res.send(error.message);
    }
}

const deleteSingleData = async (req, res) => {
    const id = req.params.id;
    try {
        // find by Id
        const deletedBus = await Bus.findOne({
            where: {
                id: id
            }
        });
        await Driver.update({driverStatus: 'available'}, {
            where: {
                id: deletedBus.driverId
            }
        });
        if (deletedBus) {
            await deletedBus.destroy();
            res.sendStatus(200).json({"message": "Bus Deleted"});
        } else {
            res.send("Bus Not Found");
        }
    } catch (error) {
        res.send(error.message);
    }
}

module.exports = {
    findAllData,
    findSingleDataById,
    updateSingleData,
    deleteSingleData,
    getAllBuses,
    getBusesWithNoSeatsAssigned,
    addNewBus,
    busesReadyForRoutes,
    searchBuses,
    busWithDriverAndDestinations
}