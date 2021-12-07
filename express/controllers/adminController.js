const {Admin} = require("../../sequelize/models");
const fs = require("fs");
const bcrypt = require("bcrypt");

const createSingleData = async (req, res) => {
    // Do Stuffs...
}

const findAllData = async (req, res) => {
    // Do Stuffs...
}

const findAdminById = async (req, res) => {
    const adminId = req.params.id;
    try {
        const admin = await Admin.findOne({
            where: {
                id: adminId
            }
        });
        res.status(200).send(admin);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateAdminProfile = async (req, res) => {
    let withImageData;
    if (req.file) {
        withImageData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName,
            displayPicture: req.file.filename
        }
    } else {
        withImageData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            userName: req.body.userName
        }
    }
    try {
        await Admin.update(withImageData, {
            where: {
                id: req.user.id
            }
        });
        res.redirect('/profile');
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (error) => {
                console.log(error);
            });
        }
        res.status(400).send(error.message);
    }
}

const changeAdminPassword = async (req, res) => {
    const {password, newPassword} = req.body;
    try {
        const currentLoggedAdmin = await Admin.findOne({
            where: {
                id: req.user.id
            }
        });
        const validPassword = await bcrypt.compare(password, currentLoggedAdmin.password);
        // if (!validPassword) return res.status(400).send('Please type your correct previous password.');
        if (!validPassword) {
            req.flash('error', 'Your previous password do not match.');
            res.redirect('/change-password');
        }

        const salt = await bcrypt.genSalt(10);
        const updatedPassword = await bcrypt.hash(newPassword, salt);
        await Admin.update({password: updatedPassword}, {
            where: {
                id: req.user.id
            }
        });
        req.flash('success', 'Your password has been changed.')
        res.redirect('/change-password');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteSingleData = async (req, res) => {
    // Do Stuffs...
}

module.exports = {
    findAllData,
    findAdminById,
    createSingleData,
    updateAdminProfile,
    changeAdminPassword,
    deleteSingleData
}