const express = require('express');
const { Destination, RouteSpecificSeat } = require('../../sequelize/models');
const {Op, Sequelize} = require("sequelize");
const router = express.Router();

router.get('/search', async (req, res) => {
    const fromSource = req.query.fromSource.toLowerCase();
    const toDestination = req.query.toDestination.toLowerCase();
    const departureDate = new Date(req.query.departureDate);
    const [fromRange, toRange] = req.query.departureDateRange.split('to');
    // handle this, if no date is passed, it will be undefined
    const fromDateRange = new Date(fromRange.trim());
    const toDateRange = new Date(toRange.trim());
    try {
        const filteredDestinations = await Destination.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fromSource')), {
                        [Op.substring]: fromSource
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('toDestination')), {
                        [Op.substring]: toDestination
                    }),
                    {
                        departureDate: {
                            [Op.eq]: departureDate
                        }
                    },
                    {
                        departureDate: {
                            [Op.and]: {
                                [Op.gt]: fromDateRange,
                                [Op.lt]: toDateRange
                            }
                        }
                    }
                ]
            }
        });
        res.json(filteredDestinations);
    } catch (error) {
        console.log(error.message);
    }
});

/*
* First API: /find-routes/:fromSource/:toDestination/:travelers/:departureDate
* Second API: /reserve-seats/:destinationUUID/:destinationID - gets destination details, bus details, seats details
* Third API: /passengers-reservatioin/:destinatoinUUID/:destinationID/:price details/
* */
router.get('/find-routes/:fromSource/:toDestination/:travelers/:departureDate', async (req, res) => {
    const fromSource = req.params.fromSource.toLowerCase();
    const toDestination = req.params.toDestination.toLowerCase();
    const travelers = req.params.travelers;
    const departureDate = new Date(req.params.departureDate);

    try {
        const foundRoutes = await Destination.findAll({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fromSource')), {
                        [Op.substring]: fromSource
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('toDestination')), {
                        [Op.substring]: toDestination
                    }),
                    {
                        departureDate: {
                            [Op.eq]: departureDate
                        }
                    },
                ]
            },
            include: ["buses"]
        });
        res.json(foundRoutes);
    } catch (error) {
        console.log(error);
    }
    res.json({fromSource, toDestination, travelers, departureDate});
});

// combines [{},{},...,{},{}] to [[{},{}],...[{},{}]]
const combineSeatMap = (seatData) => {
    const seatMap = [];
    while (seatData.length) {
        seatMap.push(seatData.splice(0, 5));
    }
    return seatMap;
}

router.get('/journey-details/:journeyId', async (req, res) => {
    const journeyId = req.params.journeyId;
    try {
        const journeyDetails = await Destination.findOne({
            where: {
                id: journeyId
            }
        });
        // can also add include: ['routeSeats']
        const journeySpecificSeats = await RouteSpecificSeat.findAll({
            where: {
                seatOfDestination: journeyId
            }
        });
        const combinedSeatData = combineSeatMap(journeySpecificSeats);
        res.json({journeyDetails: journeyDetails, specificJourneySeats: combinedSeatData});
    } catch (error) {
        console.log(error);
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const destination = await Destination.findOne({
            where: {
                id: id
            },
            include: ["buses", "passengers"]
        });
        res.send(destination);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;