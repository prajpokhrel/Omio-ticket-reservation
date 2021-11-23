const { getIdParam } = require('../utils/helperMethods');
// expand these to services....

const createSingleData = async (req, res) => {
    const {
        firstName,
        lastName,
        userName,
        email,
        password
    } = req.body;
}

const findAllData = async (req, res) => {
    // Do Stuffs...
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