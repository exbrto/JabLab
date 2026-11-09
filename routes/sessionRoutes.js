import express from 'express'

import {postSession, updateSession, deleteSession} from '../controllers/sessionsController.js'  // this imports the function from workoutsController which handles workoout sessions beig saved to the databse.

const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: 'Hello World'
    })
})

router.post('/', postSession)

router.put('/:id', updateSession)

router.delete('/:id', deleteSession)

export default router   // exports router to app.js