const express = require('express');
const router = express.Router();
const { Seat } = require('../../sequelize/models');

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

router.post('/create-bus-map', async (req, res) => {
    const seatData = reduceSeatMap(req.body);
    // try {
    //     const seats = await Seat.bulkCreate(seatData);
    //     res.json({seatData: seats});
    // } catch (error) {
    //     console.log(error);
    // }
    res.json({seatData: seatData});
});

module.exports = router;