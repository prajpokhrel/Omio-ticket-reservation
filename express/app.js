require('dotenv').config();
const express = require('express');
const Joi = require('joi');

const error = require('./middlewares/error');

const viewsRenderer = require('./routes/viewsRenderer');
const authViewsRenderer = require('./routes/authViewsRenderer');

const authRoutes = require('./routes/auth');
const generalRoutes = require('./routes/generalRoutes');
const placesRoutes = require('./routes/places');
const busesRoutes = require('./routes/buses');
const driversRoutes = require('./routes/drivers');
const destinationsRoutes = require('./routes/destinations');
const seatsRoutes = require('./routes/seats');
const usersRoutes = require('./routes/users');
const reservationsRoute = require('./routes/reservations');
const passengersRoute = require('./routes/passengers');
const adminsRoute = require('./routes/admin');

const { sequelize } = require('../sequelize/models');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');

// initialize sequelize with session store
let SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

const initializePassport = require("./auth-config/auth-config");
initializePassport(passport);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));


// app.set('views', './express/views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

// app.use('/assets/admin/image', express.static(path.join(__dirname, 'assets/adminProfileImages')));
// app.use('/assets/bus/image', express.static(path.join(__dirname, 'assets/busImages')));
// app.use('/assets/driver/image', express.static(path.join(__dirname, 'assets/driverImages')));

let myStore = new SequelizeStore({
    db: sequelize
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: myStore,
    resave: false,
    saveUninitialized: false
}));
myStore.sync();

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));

// routes here
app.use('/', viewsRenderer);
app.use('/auth', authViewsRenderer);

app.use('/api/auth', authRoutes);

app.use('/api/general-routes', generalRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reservations', reservationsRoute);
app.use('/api/passengers', passengersRoute);
app.use('/api/admins', adminsRoute);

app.use(error);


module.exports = app;