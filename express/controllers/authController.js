const bcrypt = require('bcrypt');
const { Admin, ResetToken } = require('../../sequelize/models');
const crypto = require('crypto');
const sendEmail = require('../services/sendEmailService');

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).send(admins);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send(admin);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const registerAdmin = async (req, res) => {
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
        // if (checkUsername) return res.status(400).send("User name is already registered, please pick a new one or login");
        if (checkUsername) {
            req.flash('error', 'User name is already registered, please pick a new one.');
            res.redirect('/auth/register');
        }
        let checkEmail = await Admin.findOne({
            where: {
                email: email
            }
        });
        // if (checkEmail) return res.status(400).send("Email is already registered, please pick a new one or login");
        if (checkEmail) {
            req.flash('error', 'Email is already registered, please pick a new one or login.');
            res.redirect('/auth/register');
        }
        // create a new user

        // generate salt using bcrypt and hash password - add to services later on
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        // save the user
        const admin = await Admin.create({
            firstName, lastName, userName, email, password
        });

        // res.json(admin);
        req.flash('success', 'Successfully registered. Please login.');
        res.redirect('/auth/login');
    } catch (error) {
        req.flash('error', 'Oops! error occurred.')
        res.redirect('/auth/register');
    }
}

const requestAdminPasswordReset = async (req, res) => {
    try {
        const { forgotPasswordEmail } = req.body;

        const user = await Admin.findOne({
            where: {
                email: forgotPasswordEmail
            }
        });
        if (!user) res.status(400).send("Email address does not exists.");
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
        res.redirect('/confirmation');
        // res.status(200).send("Please check your email for further instructions about your password reset");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const resetAdminPassword = async (req, res) => {
    const {userId, token, newPassword} = req.body;

    let passwordResetToken = await ResetToken.findOne({
        where: {
            userId: userId
        }
    });

    if (!passwordResetToken) {
        res.status(400).send("Invalid or expired password reset token.");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        res.status(400).send("Invalid or expired password reset token.")
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
}

module.exports = {
    getAllAdmins,
    getAdminById,
    registerAdmin,
    requestAdminPasswordReset,
    resetAdminPassword
}