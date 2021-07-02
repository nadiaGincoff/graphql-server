const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        console.log('Db connected')
    } catch (error) {
        console.log('Error connecting db')
        console.log(error)
        process.exit(1) // stop the app
    }
}

module.exports = connectDB