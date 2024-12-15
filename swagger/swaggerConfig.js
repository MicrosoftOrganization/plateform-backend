const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API MVC avec Express et Swagger',
      version: '1.0.0',
      description:
        "Documentation de l'API avec Swagger dans une architecture MVC"
    },
    servers: [
      {
        url: 'http://localhost:4000'
      }
    ]
  },
  apis: ['./routes/*.js'] // Chemin vers les fichiers de routes
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
