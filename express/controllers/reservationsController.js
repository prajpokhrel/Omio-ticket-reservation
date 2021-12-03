const { getIdParam } = require('../utils/helperMethods');
const { Reservation } = require('../../sequelize/models');
// expand these to services....

const createSingleData = async (req, res) => {
    // Do Stuffs...
}

const findAllData = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: {
                adminId: req.query.adminId
            },
            include: ["mainUserDetails", "destinationDetails"]
        });
        res.send(reservations);
    } catch (error) {
        console.log(error);
    }
}

const findSingleDataById = async (req, res) => {
    // Do Stuffs...
}

const updateSingleData = async (req, res) => {
    // Do Stuffs...
}

const deleteSingleData = async (req, res) => {
    // Do Stuffs...
}

module.exports = {
    findAllData,
    findSingleDataById,
    createSingleData,
    updateSingleData,
    deleteSingleData
}