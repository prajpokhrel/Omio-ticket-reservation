const { getIdParam } = require('../utils/helperMethods');
const { Driver } = require('../../sequelize/models');
// expand these to services....

const createSingleData = async (req, res) => {
    console.log(req.body);
    const {
        firstName,
        lastName,
        email,
        contactNumber,
        citizenshipNumber,
        licenseNumber,
        driverImage
    } = req.body;

    if (req.body.id) {
        res.status(400).send("ID should not be supplied");
    }

    try {
        const driver = await Driver.create({firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber, driverImage});
        res.redirect('/create-driver');
        // res.status(201).send(driver);
    } catch (error) {
        console.log(error.message);
    }
}

const findAllData = async (req, res) => {
    try {
        const drivers = await Driver.findAll();
        res.send(drivers);
    } catch (error) {
        console.log(error.message);
    }
}

const findSingleDataById = async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await Driver.findOne({
            where: {
                id: driverId
            }
        });
        res.send(driver);
    } catch (error) {
        console.log(error.message);
    }
}

const updateSingleData = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        contactNumber,
        citizenshipNumber,
        licenseNumber,
        driverImage
    } = req.body;
    const id = req.params.id;

    try {
        const updatedDriver = await Driver.update({firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber, driverImage},
            {
                where: {id: id}
            });
        res.status(200).send(updatedDriver);
    } catch (error) {
        console.log(error.message);
    }
}

const deleteSingleData = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedDriver = await Driver.findOne({
            where: {
                id: id
            }
        });
        if (deletedDriver) {
            await deletedDriver.destroy();
            res.sendStatus(200).json({"message": "Driver Deleted"});
        } else {
            res.send("Driver Not Found");
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