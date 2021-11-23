// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }
require('dotenv').config();
const express = require('express');
const Joi = require('joi');

const viewsRenderer = require('./routes/viewsRenderer');
const authViewsRenderer = require('./routes/authViewsRenderer');

const authRoutes = require('./routes/auth');
const generalRoutes = require('./routes/generalRoutes');
const placesRoutes = require('./routes/places');
const busesRoutes = require('./routes/buses');
const driversRoutes = require('./routes/drivers');
const destinationsRoutes = require('./routes/destinations');

const {sequelize, User} = require('../sequelize/models'); // it directly calls index.js
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

const initializePassport = require("./auth-config/auth-config");
initializePassport(passport);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Modify later for react

// sessions and flash


// image upload code, ... later

// app.set('views', './express/views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes here

app.use('/', viewsRenderer);
app.use('/auth', authViewsRenderer);

app.use('/api/auth', authRoutes);

app.use('/api/general-routes', generalRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/destinations', destinationsRoutes);



// app.get('/create-destinations', (req, res) => {
//     res.render('data-create/create-destination.ejs');
// });

// app.get('/create-drivers', (req, res) => {
//     res.render('data-create/create-driver.ejs');
// });

// app.get('/create-bus', (req, res) => {
//     res.render('data-create/create-bus.ejs');
// });

// app.get('/create-seats', (req, res) => {
//     res.render('data-create/create-seats.ejs');
// })
//
// app.get('/form-template', (req, res) => {
//     res.render('data-create/form-template-validated.ejs');
// });

// app.get('/get-buses', (req, res) => {
//     res.render('data-display/display-buses.ejs');
// });

// app.get('/get-destinations', (req, res) => {
//     res.render('data-display/display-destinations.ejs');
// });

// app.get('/get-drivers', (req, res) => {
//     res.render('data-display/display-drivers.ejs');
// });

// app.get('/get-passengers', (req, res) => {
//     res.render('data-display/display-passengers.ejs');
// });
//
// app.get('/get-reservations', (req, res) => {
//     res.render('data-display/display-reservations.ejs');
// });
//
// app.get('/get-seats', (req, res) => {
//     res.render('data-display/display-seats.ejs');
// });
//
// app.get('/get-users', (req, res) => {
//     res.render('data-display/display-users.ejs');
// });
//
// app.get('/account', (req, res) => {
//     res.render('users/account.ejs');
// });
//
// app.get('/security', (req, res) =>{
//     res.render('users/change-password.ejs');
// });
//
// app.get('/data-display-template', (req, res) => {
//     res.render('data-create/sample.ejs');
// });


module.exports = app;