const { Seat, Bus } = require('../../sequelize/models');

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

const createBusMap = async (req, res) => {
    const seatData = reduceSeatMap(req.body);
    const busId = req.body.selectedBus;
    try {
        const seats = await Seat.bulkCreate(seatData);
        await Bus.update({assignedSeats: true}, {
            where: {
                id: busId
            }
        });
        res.json({redirect: '/create-bus-map'});
    } catch (error) {
        console.log(error);
    }
}

const getBusMapSpecificToBus = async (req, res) => {
    const busId = req.params.busId;
    try {
        const seats = await Seat.findAll({
            where: {
                seatOfBus: busId
            }
        });

        const combinedSeatData = combineSeatMap(seats);
        res.send({seatData: combinedSeatData});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createBusMap,
    getBusMapSpecificToBus
}