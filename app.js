import MongoStore from 'connect-mongo'

import express from 'express';

import sessionRoutes from './routes/sessionRoutes.js'  // imports routes for anyting that starts with /workouts

import Sessions from './models/Sessions.js' // imports the model that are stored in the database.

import session from 'express-session'

import passport from 'passport'

import flash from 'connect-flash'

import configurePassport from './config/passport.js'

const app = express();
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb').MongoClient

configurePassport(passport)

app.set('view engine', 'ejs');      // use ejs to build pages, which is also why res.render 'index' knows to find index.ejs

app.set('views', './views');    // looks for ejs files form the view folder

app.use(express.urlencoded({extended: true}));    // reads form data and adds it to req.body, without req.body would be empty when the form is sumbitted

app.use(express.json());    // needed for updates and deletes

app.use(express.static('public'));  // send files to the browswer when the browser asks for it, taken from the public folder like css, browser-side js, and images

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.WUMBOLOGY, collectionName: 'userSessions'}),
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
}))

app.use(passport.initialize())

app.use(passport.session())

app.use(flash())

app.use('/sessions', sessionRoutes)    // this will send req's to the workoutsRoutes file

// mongoose.connect(url, {
// //   require('./app/routes.js')(app, passport, db, ObjectId); 
// }).then(() => {
//     console.log('Connected to the database')
// })

app.get('/', (req, res) => {
    res.render('main')
})

app.get('/login', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')})
})

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/history',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/signup', (req, res) => {
    res.render('signup', {message: req.flash('signupMessage')})
})

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
}))

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })
})

app.get('/history', isLoggedIn, async (req, res, next) => {      // will display every workout on the homepage    
    
    try {                                                       // gets every worlkout from the databse and 
        const sessions = await Sessions.find().sort({date: -1}) // find then sort returns the data and -1 sorts them by the newest

        res.render('history', {sessions}) 
    } catch(error) {
        console.log('Failed to get data')
        next(error)
        
    }
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

export default app  // keep as last line