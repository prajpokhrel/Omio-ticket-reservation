const express = require('express');
const router = express.Router();
const {User, ResetTokenClient} = require('../../sequelize/models');
const {Op, Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const requireAuth = require('../middlewares/requireAuth');
const sendEmail = require('../services/sendEmailService');

const maxAge = 3 * 24 * 60 * 60;

router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: { exclude: ['password'] }
        });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/auth/register', async (req, res) => {
    try {

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
        res.status(400).send(error.message);
    }
});

router.patch('/update/:id', requireAuth, async (req, res) => {
   const userId = req.params.id;
   const {firstName, lastName, email} = req.body;
   try {
       await User.update({firstName, lastName, email}, {
           where: {
               id: userId
           }
       });
       res.status(200).send("updated");
   } catch (error) {
       res.status(400).send(error.message);
   }
});

router.post('/auth/login', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).send(error.message);
    }
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
        res.status(500).send(error.message);
    }
});

router.post('/requestResetPassword', async (req, res) => {
    try {
        const { forgotEmail } = req.body;

        const user = await User.findOne({
            where: {
                email: forgotEmail
            }
        });
        if (!user) res.status(400).send("Email address does not exists.");
        let token = await ResetTokenClient.findOne({
            where: {
                clientId: user.id
            }
        });
        if (token) await token.destroy();
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);
        const saveToken = await ResetTokenClient.create({
            clientId: user.id,
            token: hash
        });

        let resetLink = `http://localhost:3000/users/reset-password/${resetToken}/${user.id}`;
        await sendEmail(
            user.email,
            "Password Reset Request",
            `Name: ${user.firstName} & Reset Link: ${resetLink}`
        );
        res.status(200).send("Please check your email for further instructions about your password reset.");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/resetPassword', async (req, res) => {
    try {
        const {userId, token} = req.body;
        const {newPassword} = req.body.newPassword;

        let passwordResetToken = await ResetTokenClient.findOne({
            where: {
                clientId: userId
            }
        });

        if (!passwordResetToken) {
            throw new Error("Invalid or expired password reset token.");
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            throw new Error("Invalid or expired password reset token.");
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await User.update({password: hash}, {
            where: {
                id: userId
            }
        });

        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        await sendEmail(
            user.email,
            "Password Reset Successful.",
            "You have reset your password, you can login."
        )
        await passwordResetToken.destroy();
        res.status(200).send("password reset successful, redirect to login");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.patch('/change-password', requireAuth, async (req, res) => {
    const {password, newPassword} = req.body.formData;
    const userId = req.body.currentUser.id;
    try {
        const currentLoggedUser = await User.findOne({
            where: {
                id: userId
            }
        });
        const validPassword = await bcrypt.compare(password, currentLoggedUser.password);
        if (!validPassword) return res.status(400).send('Your previous password do not match.');

        const salt = await bcrypt.genSalt(10);
        const updatedPassword = await bcrypt.hash(newPassword, salt);
        await User.update({password: updatedPassword}, {
            where: {
                id: userId
            }
        });
        res.status(200).send("Password change complete");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/total-users', async (req, res) => {
    try {
        const count = await User.count();
        res.json({count});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/logout', requireAuth, (req, res) => {
    res.cookie('omioClientJWT', '', {maxAge: 1, sameSite: "none", secure: true });
    res.send('Logged Out.');
});

module.exports = router;