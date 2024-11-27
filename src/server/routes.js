const { predictHandler, getPredictHandler } = require('./handler')

const routes = [{
  path: '/predict',
  method: 'POST',
  handler: predictHandler,
  options: {
    payload: {
      allow: 'multipart/form-data',
      multipart: true,
      maxBytes: 1000000,
    }
  }
},
{
  path: 'predict/history',
  method: 'GET',
  handler: getPredictHandler,
}];


module.exports = routes;