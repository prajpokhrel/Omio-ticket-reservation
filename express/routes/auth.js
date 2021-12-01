const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Admin, ResetToken } = require('../../sequelize/models');
const passport = require('passport');
const crypto = require('crypto');
const sendEmail = require('../services/sendEmailService');

router.get('/all/admins', async (req, res) => {
    const admins = await Admin.findAll();
    res.send(admins);
});

router.get('/admin/:id', async (req, res) => {
    const admin = await Admin.findOne({
        where: {
            id: req.params.id
        }
    });
    res.send(admin);
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true })
);

router.post('/register', async (req, res) => {
    // validate req.body using joi
    // handle try catch
    try {
        // get all the req.body
        const {firstName, lastName, userName, email } = req.body;
        // check if email and username already exists
        let checkUsername = await Admin.findOne({
            where: {
                userName: userName
            }
        });
        if (checkUsername) return res.status(400).send("User name is already registered, please pick a new one or login");
        let checkEmail = await Admin.findOne({
            where: {
                email: email
            }
        });
        if (checkEmail) return res.status(400).send("Email is already registered, please pick a new one or login");
        // create a new user

        // generate salt using bcrypt and hash password - add to services later on
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        // save the user
        const admin = await Admin.create({
            firstName, lastName, userName, email, password
        });

        // res.json(admin);
        res.redirect('/auth/login');
    } catch (error) {
        res.redirect('/auth/register');
        // res.send(error);
    }
});

router.post('/requestResetPassword', async (req, res) => {
    const { forgotPasswordEmail } = req.body;

    const user = await Admin.findOne({
        where: {
            email: forgotPasswordEmail
        }
    });
    if (!user) throw new Error("Email does not exists.");
    let token = await ResetToken.findOne({
        where: {
            userId: user.id
        }
    });
    if (token) await token.destroy();

    let resetToken = crypto.randomBytes(32).toString("hex");
    // add 10 to env variable, Number(bcryptSalt)
    const hash = await bcrypt.hash(resetToken, 10);
    const saveToken = await ResetToken.create({
        userId: user.id,
        token: hash
    });

    // create another function to create a link
    let resetLink = `http://127.0.0.1:5000/auth/reset-password/${resetToken}/${user.id}`;

    // send email
    await sendEmail(
        user.email,
        "Password Reset Request",
        `Name: ${user.firstName} & Reset Link: ${resetLink}`
    );
    res.send("Please check your email for further instructions about your password reset");
});

router.post('/resetPassword', async (req, res) => {
    const {userId, token, newPassword} = req.body;
    // check for different password
    // handle this nicely, it only throws error, you should end the response if something is wrong

    let passwordResetToken = await ResetToken.findOne({
        where: {
    //         // also check if it is expired or not
            userId: userId
        }
    });

    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token.");
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await Admin.update({password: hash}, {
        where: {
            id: userId
        }
    });

    const user = await Admin.findOne({
        where: {
            id: userId
        }
    });

    await sendEmail(
        user.email,
        "Password Reset Successfully.",
        "You have reset your password, you can login."
    );

    await passwordResetToken.destroy();
    res.redirect('/auth/login');
});

router.get('/logout', async (req, res) => {
    req.logOut();
    res.redirect('/auth/login');
})

module.exports = router;