const express = require('express');
const { Admin } = require('../../sequelize/models');
const bcrypt = require('bcrypt');
const { adminImageUpload } = require('../middlewares/imageUpload');
const adminController = require('../controllers/adminController');
const fs = require("fs");
const router = express.Router();

router.patch('/update-profile', adminImageUpload.single('displayPicture'), adminController.updateAdminProfile);

router.patch('/change-password', adminController.changeAdminPassword);

router.get('/:id', adminController.findAdminById);

module.exports = router;