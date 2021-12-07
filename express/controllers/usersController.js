const { getIdParam } = require('../utils/helperMethods');
const {User} = require('../../sequelize/models');
// expand these to services....

const createSingleData = async (req, res) => {
    // Do Stuffs...
}

const findAllData = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
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