const { getIdParam } = require('../utils/helperMethods');
const { Driver } = require('../../sequelize/models');
const fs = require("fs");
const {Op, Sequelize} = require("sequelize");

const createSingleData = async (req, res) => {
    // Do stuffs...
}

const getAllAvailableDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll({
            where: {
                driverStatus: 'available',
                adminId: req.query.adminId
            }
        });
        res.status(200).send(drivers);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const addNewDriver = async (req, res) => {
    const {firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber} = req.body;
    const driverImage = req.file.filename;
    const adminId = req.user.id;
    if (req.body.id) {
        res.status(400).send("ID should not be supplied");
    }

    try {
        const getDriver = await Driver.findOne({
            where: {
                [Op.or]: {
                    citizenshipNumber: citizenshipNumber,
                    licenseNumber: licenseNumber
                }
            }
        });
        if (getDriver) {
            res.status(400).send("Driver's citizenship or license number should be unique");
        } else {
            const driver = await Driver.create({firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber, driverImage, adminId});
            res.redirect('/create-driver');
            // res.status(201).send(driver);
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                console.log(error);
            });
        }
        res.status(400).send(error.message);
        console.log(error.message);
    }
}

const driversSearch = async (req, res) => {
    const [firstName, lastName] = req.query.fullName.toLowerCase().split(' ', 2);
    const email = req.query.email.toLowerCase();
    const contactNumber = req.query.contactNumber.toLowerCase();
    const citizenshipNumber = req.query.citizenshipNumber.toLowerCase();
    const licenseNumber = req.query.licenseNumber.toLowerCase();
    try {
        const filteredDrivers = await Driver.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), {
                        [Op.substring]: firstName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), {
                        [Op.substring]: lastName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), {
                        [Op.substring]: email
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('contactNumber')), {
                        [Op.substring]: contactNumber
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('citizenshipNumber')), {
                        [Op.substring]: citizenshipNumber
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('licenseNumber')), {
                        [Op.substring]: licenseNumber
                    }),
                ],
                adminId: req.query.adminId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.json(filteredDrivers);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const findCurrentDriverWithAllAvailableDrivers = async (req, res) => {
    const driverId = req.params.driverId;
    try {
        const drivers = await Driver.findAll({
            where: {
                [Op.or]: {
                    driverStatus: 'available',
                    id: driverId
                },
                adminId: req.query.adminId
            }
        });
        res.status(200).send(drivers);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const findAllData = async (req, res) => {
    try {
        const drivers = await Driver.findAll({
            where: {
                adminId: req.query.adminId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(200).send(drivers);
    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(200).send(driver);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
}

const updateDriver = async (req, res) => {
    const {firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber, driverStatus} = req.body;
    const driverImage = req.file.filename;
    const id = req.params.id;

    try {
        await Driver.update({firstName, lastName, email, contactNumber, citizenshipNumber, licenseNumber, driverStatus, driverImage},
            {
                where: {id: id}
            });
        res.redirect('/drivers/all');
        // res.status(200).send(updatedDriver);
    } catch (error) {
        res.status(400).send(error.message);
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
            res.status(404).send("Driver Not Found");
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
    updateDriver,
    deleteSingleData,
    getAllAvailableDrivers,
    addNewDriver,
    driversSearch,
    findCurrentDriverWithAllAvailableDrivers
}