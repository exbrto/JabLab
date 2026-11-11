import MongoStore from 'connect-mongo'  // Saves logins in mognodb

import express from 'express';

import sessionRoutes from './routes/sessionRoutes.js'

import Sessions from './models/Sessions.js'

import session from 'express-session'   // gives browsers a login cookie

import passport from 'passport'     // for logins and signups

import flash from 'connect-flash'

import configurePassport from './config/passport.js'

const app = express();

configurePassport(passport)

// tells Express im using ejs and which folder to find ejs files
app.set('view engine', 'ejs');
app.set('views', './views');

// puts form submision fields into req.body and requests get put on req.body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));  // send files to the browswer when the browser asks for it, taken from the public folder like css, browser-side js, and images

// Gives each loggedin user a browser cookie
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                      
    saveUninitialized: false, // non-loggedin users don't get a login record
    store: MongoStore.create({mongoUrl: process.env.WUMBOLOGY, collectionName: 'userSessions'}),  // saves logins in userSessions
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}   // cookie last for 7 days
}))

// starts and connects passport to the login session
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/sessions', isLoggedIn, sessionRoutes) // every /sessions request must go through isLoggedIn first then to sessionRotues 

app.get('/', (req, res) => {
    res.render('main')
})

app.get('/login', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')})
})

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true  // a failled login sends an error message that shows in the login.ejs
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

app.get('/dashboard', isLoggedIn, async (req, res, next) => {

    try {
        const sessions = await Sessions.find({userId: req.user._id}).sort({date: -1})   // grabs all of the users sessions, sorted by newest first
        
        // Recent sessions takes the 3 most recent sessions
        const recentSessions = sessions.slice(0, 3)
        const totalSessions = sessions.length

        // ringIQ average (adds all session scores and divides by the total, then rounded to the nearest integer)
        // the ternary operator prevetns dividing by 0 which would cause undefined
        const ringIQ = totalSessions ? Math.round(sessions.reduce((acc, session) => acc + session.ringIQ, 0) / totalSessions) : 0
                                    // starting at 0 acc each sessions score then divide by the total amount of sessions, if there are no sessions then return 0

        // Days Trained inside of Set gets rid any duplicates, streak shouldn't count same day sessions 
        const daysTrained = new Set(sessions.map(session => session.date.toISOString().slice(0, 10)))
        const currentDay = new Date().toLocaleDateString('en-CA', {timeZone: 'America/New_York'})
        const days = new Date(currentDay)

        if (!daysTrained.has(days.toISOString().slice(0, 10))) {    // if they haven't trained on the current day, then start counting from 
            days.setUTCDate(days.getUTCDate() - 1)                  // yesterday so streak doesn't break at the start of a new day
        }

        // Count one day at a time starting from newest to oldest sessoin until there's a gap to get the streak
        let trainingStreak = 0
        while (daysTrained.has(days.toISOString().slice(0, 10))) {
            trainingStreak++
            days.setUTCDate(days.getUTCDate() - 1)
        }

        // passes values to the dashboard.ejs to be used
        res.render('dashboard', {recentSessions, totalSessions, ringIQ, trainingStreak, user: req.user})
    } catch (error) {
        console.log('Failed to add to dashboard', error)
        next(error)
    }
})

// Returns all of the users sessions from newest to oldest, and sends them to the history.ejs
app.get('/history', isLoggedIn, async (req, res, next) => {          
    
    try {                                                       
        const sessions = await Sessions.find({userId: req.user._id}).sort({date: -1}) // find then sort returns the data and -1 sorts them by the newest

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

export default app  // makes what's in app.js available to other files (server.js)