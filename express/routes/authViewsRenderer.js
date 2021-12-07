const express = require('express');
const axios = require('../axios-omio');
const router = express.Router();
const { checkNotAuthenticated } = require('../middlewares/authCheck');

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('auth/login.ejs', { error: req.flash("error"), success: req.flash("success") });
});

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('auth/register.ejs', {message: req.flash('error')});
});

router.get('/forgot-password', checkNotAuthenticated, (req, res) => {
    res.render('auth/forgot-password.ejs');
});

router.get('/confirmation', checkNotAuthenticated, (req, res) => {
    res.render('auth/confirmation-message.ejs');
});

router.get('/not-found', (req, res) => {
    res.render('extras/not-found.ejs');
});

router.get('/not-authorized', (req, res) => {
    res.render('extras/not-authorized.ejs');
});

router.get('/reset-password/:token/:userId', checkNotAuthenticated,(req, res) => {
    res.render('auth/reset-password.ejs');
});

// this will be put
router.post('/reset-password/:token/:userId', checkNotAuthenticated, async (req, res) => {
    const {token, userId} = req.params;
    const { resetPasswordNew } = req.body;
    const formData = {
        token: token,
        userId: userId,
        newPassword: resetPasswordNew
    }
    try {
        await axios.post('/auth/resetPassword', formData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;