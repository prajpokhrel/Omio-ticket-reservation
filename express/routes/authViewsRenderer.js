const express = require('express');
const axios = require('../axios-omio');
const router = express.Router();

// const initializePassport = require('../auth-config/auth-config');
// initializePassport(
//     passport,
//     (email) => {users.find(user => user.email === email);},
//     (id) => {users.find(user => user.id === id)}
// );
//
// const users = [];
//
// router.get('/index', checkAuthenticated, (req, res) => {
//     res.render('some/views.ejs', {name: req.user.name});
// });

router.get('/login', (req, res) => {
    res.render('auth/login.ejs', { error: req.flash("error") });
});

router.get('/register', (req, res) => {
    res.render('auth/register.ejs');
});

router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password.ejs');
});

router.get('/reset-password/:token/:userId', (req, res) => {
    res.render('auth/reset-password.ejs');
});

// this will be put
router.post('/reset-password/:token/:userId', async (req, res) => {
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
        res.send(error);
    }
});

router.delete('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;