const { Passenger } = require('../../sequelize/models');
// expand these to services....

const createSingleData = async (req, res) => {
    // Do Stuffs...
}

const findAllData = async (req, res) => {
    try {
        const passengers = await Passenger.findAll();
        res.send(passengers);
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