import mongoose from 'mongoose'

// Schema is like a blueprint for one worklout session. enum: [] --> says these are the only values allowd for this feild.
// lowercase: true ==> turn the value into lowercase before saging it. 
const sessionsSchema =  new mongoose.Schema({
    date: {type: Date, required: true},
    duration: {type: Number, required: true},    // option value must in the select must be the same as the string must lowercased
    jab: {type: Number, required: true},
    cross: {type: Number, required: true},
    kicks: {type: Number, required: true},
    knees: {type: Number, required: true},
    ringIQ: {type: Number, required: true},
    mistakes:{type: String, required: true},
    notes: {type: String, default: ''}
})

// The model is what we use to Create, Read, Update, and Delete workout sessions
// Workouts is what becomes the collection 'workouts' in the mongodb database
const Sessions = mongoose.model('Sessions', sessionsSchema)

export default Sessions   // exports the model so that workoutsContoler.js can usse it