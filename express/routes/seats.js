const express = require('express');
const router = express.Router();
const { Seat } = require('../../sequelize/models');

// reduces [[{},{}],...,[{},{}]] to [{},{},..,{},{}]
const reduceSeatMap = (seatData) => {
    const seatOfBus = seatData.selectedBus;
    const sociallyDistancedSeatFare = seatData.sociallyDistancedSeatFare;
    const reservedSeatFare = seatData.reservedSeatFare;
    const seatMap = [];
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 5; col++) {
            seatMap.push({...seatData.seatMap[row][col], seatOfBus, sociallyDistancedSeatFare, reservedSeatFare});
        }
    }
    return seatMap;
}

// combines [{},{},...,{},{}] to [[{},{}],...[{},{}]]
const combineSeatMap = (seatData) => {
    const seatMap = [];
    while (seatData.length) {
        seatMap.push(seatData.splice(0, 5));
    }
    return seatMap;
}

router.post('/create-bus-map', async (req, res) => {
    const seatData = reduceSeatMap(req.body);
    try {
        const seats = await Seat.bulkCreate(seatData);
        res.json({seatData: seats});
    } catch (error) {
        console.log(error);
    }
    const combinedSeatData = combineSeatMap(seatData);
    res.redirect('/create-bus-map');
    // res.json({seatData: combinedSeatData});
});

router.get('/bus-map/:busId', async (req, res) => {
    const busId = req.params.busId;
    try {
        const seats = await Seat.findAll({
             where: {
                 seatOfBus: busId
             }
        });
        const combinedSeatData = combineSeatMap(seats);
        res.json({seatData: combinedSeatData});
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;