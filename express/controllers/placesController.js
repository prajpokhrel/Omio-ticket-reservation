const { getIdParam } = require('../utils/helperMethods');
const { Place } = require('../../sequelize/models');
const fs = require('fs');

const createSingleData = async (req, res) => {
    // delete all records first
    await Place.destroy({
        truncate: true
    });
    // creates a new one
    const placesPath = "sequelize/places/route-destinations.json";
    fs.readFile(placesPath, async (error, data) => {
        if (error) {
            console.log(error);
        }
        const places = await Place.bulkCreate(JSON.parse(data));
        res.send(places);
    });
}

const findAllData = async (req, res) => {
    try {
        const places = await Place.findAll();
        res.send(places);
    } catch (error) {
        res.send(error.message);
    }
}

const findSingleDataById = async (req, res) => {

}

const updateSingleData = async (req, res) => {

}

const deleteSingleData = async (req, res) => {

}

module.exports = {
    findAllData,
    findSingleDataById,
    createSingleData,
    updateSingleData,
    deleteSingleData
}