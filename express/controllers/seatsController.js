const { Seat, Bus, sequelize } = require('../../sequelize/models');

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
        await sequelize.transaction(async (t) => {
            await Seat.bulkCreate(seatData, {transaction: t});
            await Bus.update({assignedSeats: true}, {
                where: {
                    id: busId
                },
                transaction: t
            });
            return res.json({redirect: '/create-bus-map'});
        });
    } catch (error) {
        res.status(500).send(error.message);
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
        res.status(200).send({seatData: combinedSeatData});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const deleteSeats = async (req, res) => {
    const busId = req.params.busId;
    try {
        await sequelize.transaction(async (t) => {
            await Seat.destroy({
                where: {
                    seatOfBus: busId
                },
                transaction: t
            });
            await Bus.update({assignedSeats: false}, {
                where: {
                    id: busId
                },
                transaction: t
            });
            return res.status(200).send("Seats deleted.");
        });
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

module.exports = {
    createBusMap,
    getBusMapSpecificToBus,
    deleteSeats
}