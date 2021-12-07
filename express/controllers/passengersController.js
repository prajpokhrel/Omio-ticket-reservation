const { Passenger } = require('../../sequelize/models');
const {Op, Sequelize} = require("sequelize");
// expand these to services....

const createSingleData = async (req, res) => {
    // Do Stuffs...
}

const searchPassengers = async (req, res) => {
    const [firstName, lastName] = req.query.fullName.toLowerCase().split(' ', 2);
    const email = req.query.email.toLowerCase();
    const idNumber = req.query.idNumber.toLowerCase();

    try {
        const filteredPassengers = await Passenger.findAll({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), {
                        [Op.substring]: firstName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), {
                        [Op.substring]: lastName
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), {
                        [Op.substring]: email
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('idNumber')), {
                        [Op.substring]: idNumber
                    })
                ],
                adminId: req.query.adminId
            },
            include: ['reservationDetails']
        });
        res.status(200).send(filteredPassengers);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
}

const findAllData = async (req, res) => {
    try {
        const passengers = await Passenger.findAll({
            where: {
                adminId: req.query.adminId
            },
            include: ['reservationDetails']
        });
        res.status(200).send(passengers);
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
    deleteSingleData,
    searchPassengers
}