const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI =  require('swagger-ui-express')
const { version } = require('../../package.json')

const options = {
    definition:{
        openmpi:'3.0.0',
        info:{
            title:'XRide API',
            version,
            description: 'XRide API documentation'
        },
        servers: [
            {
            url:'http://localhost:3001',
            description:'Development server',
        },

    ],

    },
    apis:['../routes/webservices/*.js'],
}

const specs = swaggerJSDoc(options)

module.exports = specs
 