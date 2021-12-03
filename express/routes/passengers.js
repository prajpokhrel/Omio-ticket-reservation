const express = require('express');
const {Passenger} = require('../../sequelize/models');
const {Op, Sequelize} = require('sequelize');
const router = express.Router();
const passengersController = require('../controllers/passengersController');

router.get('/search', passengersController.searchPassengers);

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