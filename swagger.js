const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Minha API',
    description: 'Documentação interativa da API',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Insira o token JWT no formato: Bearer {token}'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);