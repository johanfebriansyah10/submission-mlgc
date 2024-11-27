const crypto = require('crypto');
const predictClassification = require('../services/inferencesServices');
const { storeData, getHistory } = require('../services/storageData');


async function predictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt,
  }

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: confidenceScore > 0 ? 'Model Berhasil Melakukan Prediksi' : 'gunakan foto yang benar',
    data,
  });
  response.code(200);
  return response;
  
}

async function getPredictHandler(request, h) {
  const { id } = request.params;
  const data = await getHistory(id);

  if(!data){
    const response = h.response({
      status: 'fail',
      message: 'Data tidak ditemukan',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'success',
    data,
  });

  response.code(200);
  return response;
}

module.exports = { predictHandler, getPredictHandler };