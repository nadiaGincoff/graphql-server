require('dotenv').config()
const server = require('./api/server')
const port = process.env.PORT || 3307

server.listen({ port }, () => console.log(
    `🚀 Server ready at http://localhost:${port}/api`,
));
