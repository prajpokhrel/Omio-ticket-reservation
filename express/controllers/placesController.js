const { getIdParam } = require('../utils/helperMethods');
const { Place, Destination} = require('../../sequelize/models');
const fs = require('fs');
const {Sequelize, Op} = require("sequelize");
const axios = require("../axios-omio");

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

const getAllDistinctSources = async (req, res) => {
    try {
        const places = await Place.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('source')) , 'source'],
            ]
        });
        res.send(places);
    } catch (error) {
        res.send(error);
    }
}

const getBusSpecificSource = async (req, res) => {
    const busId = req.params.id;
    try {
        const latestDestination = await Destination.findAll({
            where: {
                assignedBusId: {
                    [Op.eq]: busId
                }
            },
            order: [
                ['departureDate', 'DESC']
            ],
            limit: 1,
            attributes: ['fromSource', 'toDestination', 'departureDate', 'arrivalDate']
        });
        if (latestDestination.length < 1) {
            const getAvailableSources = await axios.get('/places/source');
            res.json({"allSource": getAvailableSources.data});
        } else {
            res.json({"currentRoute": latestDestination});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const getAvailableDestinationsBasedOnSource = async (req, res) => {
    const source = req.params.sourceName;
    try {
        const availableDestination = await Place.findAll({
            where: {
                source: source
            },
            attributes: ['destination']
        });
        res.send(availableDestination);
    } catch (error) {
        console.log(error.response);
    }
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
    deleteSingleData,
    getAllDistinctSources,
    getBusSpecificSource,
    getAvailableDestinationsBasedOnSource
}