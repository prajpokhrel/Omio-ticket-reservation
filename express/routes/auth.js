const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Admin, ResetToken } = require('../../sequelize/models');
const passport = require('passport');
const crypto = require('crypto');
const sendEmail = require('../services/sendEmailService');
const authController = require('../controllers/authController');

router.get('/all/admins', authController.getAllAdmins);

router.get('/admin/:id', authController.getAdminById);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true })
);

router.post('/register', authController.registerAdmin);

router.post('/requestResetPassword', authController.requestAdminPasswordReset);

router.post('/resetPassword', authController.resetAdminPassword);

router.get('/logout', async (req, res) => {
    req.logOut();
    res.redirect('/auth/login');
})

module.exports = router;