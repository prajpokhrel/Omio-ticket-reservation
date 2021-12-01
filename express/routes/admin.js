const express = require('express');
const { Admin } = require('../../sequelize/models');
const bcrypt = require('bcrypt');
const { adminImageUpload } = require('../middlewares/imageUpload');
const fs = require("fs");
const router = express.Router();

router.patch('/update-profile', adminImageUpload.single('displayPicture'), async (req, res) => {
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
        console.log(error);
    }
});

router.patch('/change-password', async (req, res) => {
    const {password, newPassword} = req.body;
    try {
        const currentLoggedAdmin = await Admin.findOne({
            where: {
                id: req.user.id
            }
        });
        const validPassword = await bcrypt.compare(password, currentLoggedAdmin.password);
        if (!validPassword) return res.status(400).send('Please type your correct previous password.');

        const salt = await bcrypt.genSalt(10);
        const updatedPassword = await bcrypt.hash(newPassword, salt);
        await Admin.update({password: updatedPassword}, {
            where: {
                id: req.user.id
            }
        });
        res.redirect('/change-password');
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    const adminId = req.params.id;
    try {
        const admin = await Admin.findOne({
            where: {
                id: adminId
            }
        });
        res.send(admin);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;