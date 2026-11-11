import mongoose from 'mongoose' 

const sessionsSchema =  new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // ref: User points to the User.js model
    date: {type: Date, required: true},
    duration: {type: Number, required: true},
    jab: {type: Number, default: 0},
    cross: {type: Number, default: 0},
    kicks: {type: Number, default: 0},
    knees: {type: Number, default: 0},
    ringIQ: {type: Number, required: true},
    mistakes:{type: String, required: true},
    notes: {type: String, default: ''}  // Users own notes for a training session
})

// The model is what we use to Create, Read, Update, and Delete sessions
// Sessions is what becomes the collection 'sessions' in the mongodb database
const Sessions = mongoose.model('Sessions', sessionsSchema)

export default Sessions   // exports the model so sessionsController can use it