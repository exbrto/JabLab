import 'dotenv/config'

import app from './app.js'        // imports app from app.js which is wherer the routes are

import {connectDB} from './config/database.js'      // imports the function that connects use to mongodb from the database.js file

const port = 8080

async function startServer() {      // use async on this function because connecteing to the database isnt instant
                                    // and need to wait for it to connect to the databse
    try {      //connect to the database first and wait until the connection finishes, if connection fails it jumps to the catch error                     
        await connectDB()
        app.listen(port, () => {            // if it connects to the databse, then the server starts and begins listening for requests
            console.log(`server runnning on port ${port}`)
        })
    } catch(error){
        console.error('failed to start the server:', error)
    }
}

startServer()       // runs the function 