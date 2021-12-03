const { getIdParam } = require('../utils/helperMethods');
const { Bus, Driver, Destination } = require('../../sequelize/models');
// expand these to services....
// asyncErrors middleware to reduce try catch will be implemented later on

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
    deleteSingleData
}