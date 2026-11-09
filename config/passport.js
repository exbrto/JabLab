// config/passport.js

// load all the things we need
import {Strategy as LocalStrategy} from 'passport-local';

// load up the user model
import User from '../models/user.js';

// expose this function to our app using module.exports
export default function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(async function(id, done) {
        try {
            
            const user = await User.findById(id)
            done(null, user);

        } catch(error) {

            return done(error)

        }
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    async function(req, email, password, done) {

		try {
            
            const user = await User.findOne({ 'local.email' :  email });

            if (user) {

                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

            } else {

                const newUser = new User();

                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

				
                await newUser.save();
                return done(null, newUser);
            }
        } catch(error) {
            
            return done(error);
        }

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    async function(req, email, password, done) { // callback with email and password from our form

         try {

            const user = await User.findOne({'local.email' : email})

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);

        } catch(error) {

            return done(error)

        }

    }));

};
