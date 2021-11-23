const { getIdParam } = require('../utils/helperMethods');
const { Bus, Driver, Destination } = require('../../sequelize/models');
// expand these to services....
// asyncErrors middleware to reduce try catch will be implemented later on
const createSingleData = async (req, res) => {
    console.log(req.body);
    const {
        busServiceName,
        busNumber,
        seatCapacity,
        busServiceLogo,
        busStatus,
        driverId
    } = req.body;

    // multer will handle form image this
    try {
        if (req.body.id) {
            res.status(400).send("Bad request: ID should not be provided, since it is determined automatically by the database.");
        } else {
            const bus = await Bus.create({busServiceName, busNumber, busServiceLogo, seatCapacity, busStatus, driverId});
            res.redirect('/create-bus');
            // res.status(201).send(bus);
            // res.status(201).end();
        }
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
}

const findAllData = async (req, res) => {
    try {
        const buses = await Bus.findAll();
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
        // OMG: Bus with all its destinations and driver details. HAIT so powerful.
        // include: ["destinations", "driverDetails"],
    });
    res.send(bus);
}

const updateSingleData = async (req, res) => {
    const {
        busServiceName,
        busNumber,
        busServiceLogo,
        seatCapacity,
        busStatus,
        driverId
    } = req.body;
    const id = req.params.id;
    try {
        const updatedBus = await Bus.update({busServiceName, busNumber, busServiceLogo, seatCapacity, busStatus, driverId}, {
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
    createSingleData,
    updateSingleData,
    deleteSingleData
}