const express = require('express');
const {Passenger} = require('../../sequelize/models');
const {Op, Sequelize} = require('sequelize');
const router = express.Router();

router.get('/search', async (req, res) => {
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
            }
        });
        res.send(filteredPassengers);
    } catch (error) {
        console.log(error);
    }
});

// router.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const passenger = await Passenger.findOne({
//             where: {
//                 id: id
//             },
//             include: ['reservationDetails']
//         });
//         res.send(passenger);
//     } catch (error) {
//         console.log(error);
//     }
// });


module.exports = router;