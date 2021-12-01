const express = require('express');
const router = express.Router();
const {User} = require('../../sequelize/models');
const {Op, Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const requireAuth = require('../middlewares/requireAuth');

const maxAge = 3 * 24 * 60 * 60;

router.get('/me', requireAuth, async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.currentUser.id
        },
        attributes: { exclude: ['password'] }
    });
    res.status(200).send(user);
});

router.post('/auth/register', async (req, res) => {
    try {
        // validate error using joo req.body

        const {firstName, lastName, email} = req.body;

        let checkUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if(checkUser) return res.status(400).send("User is already registered, please login.");

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
            firstName, lastName, email, password
        });

        const token = user.generateAuthToken();
        res.cookie('omioClientJWT', token, {httpOnly: true, maxAge: maxAge * 1000, sameSite: 'none', secure: true});
        res.status(201).send({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        });
    } catch (error) {
        console.log(error);
        // maybe redirect to register page
    }
});

router.post('/auth/login', async (req, res) => {
    let user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(400).send('Invalid E-mail or Password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid E-mail or Password.');

    const token = user.generateAuthToken();
    res.cookie('omioClientJWT', token, {httpOnly: true, maxAge: maxAge * 1000, sameSite: "none", secure: true});
    res.status(200).json({userId: user.id});
});

router.get('/search', async (req, res) => {
    const [firstName, lastName] = req.query.fullName.toLowerCase().split(' ', 2);
    const email = req.query.email.toLowerCase();
    try {
        const filteredUsers = await User.findAll({
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
                    })
                ]
            }
        });
        res.json(filteredUsers);
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', requireAuth, (req, res) => {
    res.cookie('omioClientJWT', '', {maxAge: 1, sameSite: "none", secure: true });
    res.send('Logged Out.');
});

module.exports = router;