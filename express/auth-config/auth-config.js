const LocalStrategy = require('passport-local').Strategy;
const { Admin } = require('../../sequelize/models');
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await Admin.findOne({
           where: {
               email: email
           }
        });
        if (user === null) {
            return done(null, false, { message: "Incorrect email or password." });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Incorrect email or password"});
            }
        } catch (error) {
            console.log("I am error");
            return done(error.message);
        }

    }

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        return done(null, await Admin.findOne({where: {id: id}}));
    });
}

module.exports = initialize;