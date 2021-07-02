const { ApolloServer } = require('apollo-server');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

const connectDB = require('../config/db')

// Connect database
connectDB()

// Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        const token = req.headers['authorization'] || ""

        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET)
                return { user }
            } catch (error) {
                console.log("Token verify error")
                console.log(error)
            }
        }
    }
})

module.exports = server;