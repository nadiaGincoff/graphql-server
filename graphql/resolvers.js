const User = require('../models/User')
const Product = require('../models/Product')
const Client = require('../models/Client')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })

/* 
*   Resolvers:
*       Siempre es un objeto, y por lo general, 
*       siempre contiene ===> funciones <=== para consultar la base de datos.
*       No hace falta mapear la data para conseguir informacion
*       gracias a los Types que se encargan de filtrar los campos.
*           Argumentos: 
*               1er: Objeto que contiene los resultados retornados por el resolver padre, 
*                    este argumento es el que te permite crear consultas anidadas en graphQL
*               2do: Input, son los argumentos, es lo que le pasamos al resolver
*               3er: Context, objeto que se comparte entre todos los resolvers, por ejemplo autenticacion
*               4to: Info, tiene informacion sobre la consulta actual 
*/

const createToken = (userExists, SECRET, expiresIn) => {
    console.log(userExists)
    if (!userExists) { console.log(error) }
    const { id, email, name, lastName } = userExists
    return jwt.sign({ id, email, name, lastName }, SECRET, { expiresIn })
}

const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET)
            return userId
        },
        getProducts: async () => {
            try {
                const products = await Product.find({})
                return products
            } catch (error) {
                console.log(error)
            }
        },
        getProduct: async (_, { id }) => {
            try {
                const product = await Product.findById(id)
                if (!product) throw new Error("Product not found")
                return product
            } catch (error) {
                console.log(error)
            }
        },
        getClients: async () => {
            try {
                const clients = await Client.find({})
                return clients
            } catch (error) {
                console.log(error)
            }
        },
        getUsersClient: async (_, { }, ctx) => {
            try {
                const clients = await Client.find({ seller: ctx.user.id.toString() })
                return clients
            } catch (error) {
                console.log(error)
            }
        },
        getClient: async (_, { id }, ctx) => {
            const client = await Client.findById(id)
            if (!client) throw new Error("Product not found")

            if (client.seller.toString() !== ctx.user.id) throw new Error("You don't have the credentials :(")
            return client
        }
    },
    Mutation: {
        newUser: async (_, { input }) => {
            const { email, password } = input

            // If user is register
            const userExist = await User.findOne({ email })
            if (userExist) throw new Error('User is registered')

            // Hash password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try {
                // Save in db
                const user = new User(input)
                user.save()
                return user
            }
            catch (error) {
                console.log(error)
            }
        },
        authenticateUser: async (_, { input }) => {
            const { email, password } = input

            // If user exists
            const userExists = await User.findOne({ email })
            if (!userExists) { throw new Error('Email not found') }

            // Validate password
            const correctPassword = await bcryptjs.compare(password, userExists.password)
            if (!correctPassword) { throw new Error('Password is wrong') }

            // Create token
            return {
                token: createToken(userExists, process.env.SECRET, '24h')
            }
        },
        newProduct: async (_, { input }) => {
            try {
                const newProduct = new Product(input)
                const product = await newProduct.save()
                return product
            } catch (error) {
                console.log(error)
            }
        },
        updateProduct: async (_, { id, input }) => {
            let product = await Product.findById(id)
            if (!product) throw new Error("Product not found")

            // save in db
            product = await Product.findOneAndUpdate({ _id: id }, input, { new: true });
            return product
        },
        deleteProduct: async (_, { id }) => {
            let product = await Product.findById(id)
            if (!product) throw new Error("Product not found")

            await Product.findOneAndDelete({ _id: id })
            return "Product deleted"
        },
        newClient: async (_, { input }, context) => {
            console.log(context)
            const { email } = input
            const client = await Client.findOne({ email })
            if (client) throw new Error(`The client is already registered`)

            const newClient = new Client(input)
            newClient.seller = context.user.id
            try {
                const result = await newClient.save()
                return result
            } catch (error) {
                console.error(error)
            }
        },
        updateClient: async (_, { id, input }, context) => {
            let client = await Client.findById(id)
            if (!client) throw new Error(`Client doesn't exist`)
            if (client.seller.toString() !== context.user.id) throw new Error(`You don't have the credentials :(`)

            client = await Client.findOneAndUpdate({ _id: id }, input, { new: true })
            return client
        },
        deleteClient: async (_, { id }, context) => {
            const client = await Client.findById(id)
            if (!client) throw new Error("Client doesn't exist")
            if (client.seller.toString() !== context.user.id) throw new Error(`You don't have the credentials :(`)
            await Client.findOneAndDelete({ _id: id })
            return "Client deleted"
        }
    }
}

module.exports = resolvers;