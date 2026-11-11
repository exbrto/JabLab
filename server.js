import 'dotenv/config'  // Loads the env file into process.env

import app from './app.js'     // Runs app.js 

import {connectDB} from './config/database.js'    // imports the function that connects to mongodb from the database.js file

const port = process.env.PORT || 8080  // Picks which port to listen too, Render uses it's own port so port 8080 won't work

async function startServer() {      
                                    
    try {                           
        await connectDB()   // async/await forces to wait until mongodb asnwers
        app.listen(port, () => {    // starts the server after it connects to mongofb
            console.log(`server runnning on port ${port}`)
        })
    } catch(error){
        console.error('failed to start the server:', error)
    }
}

startServer()       // runs the function 