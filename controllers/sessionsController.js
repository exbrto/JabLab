import Sessions from '../models/Sessions.js'        // imports the model from Workouts.js so that it can be saved to the databse

export async function postSession(req, res, next) {       // this function runs when the form is submitted (the POST request)
                                                            // next passes errors to express 
    try {
        const { date, duration, jab, cross, kicks, knees, ringIQ, mistakes, notes } = req.body    // pulls each field out and req.body holds the form data
                                                                                                                            // like a selection is held in req.body.sessionType
        const newSession = await Sessions.create({     // creates a new wokrout in the database, await means mongoose checks every
            date,                                       // value first to make sure something that isnt allowd is wasnt entered, then   
            duration,                                // it an erorr will occur and itll jump to catch.
            jab, 
            cross, 
            kicks,
            knees,
            ringIQ,
            mistakes,
            notes
    })
        // res.status(201).json({          // use to test and see fi a workout is savedin the databse
        //    success: true,
        //    msg: 'Medication list has been created',
        //    newWorkouts
        res.redirect('/history')       
    
}   catch(error) {   // if the save attempt fails then an error is thrown.
        next(error)
    }
    
}

export async function updateSession(req, res, next) {

    try {
        const {id} = req.params

        const {notes} = req.body  // take the new value that was edited and saved

        const updatedSessionNotes = await Sessions.findByIdAndUpdate(
            id,
            {notes},
            {new: true, runValidators: true}
        )

        res.status(200).json({
            success: true,
            msg: 'Session Notes have been updated',
            updatedSessionNotes
        })
}   catch(error) {
        next(error)
    }

}

export async function deleteSession(req, res, next) {

    try {
        const {id} = req.params

        const deleteThisShi = await Sessions.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            msg: 'Session has been deleted',
            deleteThisShi
        })
}   catch(error) {
        next(error)
}

}