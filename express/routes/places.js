const express = require('express');
const axios = require('../axios-omio');
const { Sequelize, Op } = require('sequelize');
const { Place, Destination } = require('../../sequelize/models');
const router = express.Router();


router.get('/source', async (req, res) => {
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
});

router.get('/bus-specific-source/:id', async (req, res) => {
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
});

router.get('/source/:sourceName', async (req, res) => {
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
});


module.exports = router;