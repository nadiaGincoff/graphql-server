const { gql } = require('apollo-server');

/* 
*   Schema:
*       typeDefs: 
*           Se le conoce como type definition, 
*           porque utiliza algo llamado Type
*           Todo lo que este dentro de typeDefs serán typeDefinitions, 
*           nuestro schema, y será código de GraphQL
*           Lo único que es obligatorio, es tener definido un Query dentro de typeDefs
*               Type: 
*                   Utiliza un typing en el que le defines si un campo sera de tipo
*                   string int boolean u otro tipo de dato
*               Input:
*                   Dentro del input se definirán los parámetros que queremos que la Query reciba.
*                   Debemos definir el tipo
*                   Podemos asignarlo a un resolver o query               
*/

const typeDefs = gql`
    type User {
        id: ID
        name: String
        lastName: String
        email: String
        createdAt: String
    }
    
    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        existence: Int
        price: Float
        createdAt: String
    }
    
    type Client {
        id: ID
        name: String
        lastName: String
        company: String
        email: String
        phone: String
        seller: ID
    }

    type Order {
        id: ID
        order: [OrderGroup]
        total: Float
        client: ID
        seller: ID
        createdAt: String
        state: OrderState
    }

    type OrderGroup {
        id: ID
        quantity: Int
    }

    input UserInput {
        name: String
        lastName: String
        email: String
        password: String
    }
    
    input ProductInput {
        name: String!
        existence: Int!
        price: Float!
    }

    input AuthenticateInput {
        email: String!
        password: String!
    }
    
    input ClientInput {
        name: String!
        lastName: String!
        company: String!
        email: String!
        phone: String
    }

    input OrderProductInput {
        id: ID
        quantity: Int
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float!
        client: ID!
        state: OrderState
    }

    enum OrderState {
        PENDING,
        COMPLETED,
        CANCELED
    }

    type Query {
        # Users
        getUser(token: String!): User

        # Products
        getProducts: [Product]
        getProduct(id: ID!): Product
        
        # Clients
        getClients: [Client]
        getUsersClient: [Client]
        getClient(id: ID!): Client
    }

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authenticateUser(input: AuthenticateInput): Token

        # Products
        newProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String

        # Clients
        newClient(input: ClientInput): Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id: ID!): String

        # Orders
        newOrder(input: OrderInput): Order
    }
`;

module.exports = typeDefs;