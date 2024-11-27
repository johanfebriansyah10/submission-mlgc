require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/inputError');


(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    }
  })
  
  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', function (request, h){
    const response = request.response;

    if(response.isBoom && response.output.statusCode === 413){
      const nResponse = h.response({
        status: 'fail',
        message: "Payload content length greater than maximum allowed: 1000000",
      })

      nResponse.code(413);
      return nResponse;
    }

    if(response instanceof InputError){
      const nResponse = h.response({
        status: 'fail',
        message: response.message
      })
      nResponse.code(response.statusCode)
      return nResponse;
    }

    if(response.isBoom){
      const nResponse = h.response({
        status: 'fail',
        message: response.message
      })
      nResponse.code(response.output.statusCode)
      return nResponse;
    }

    return h.continue
  })
  await server.start();
  console.log('Server running on %s', server.info.uri);
})();