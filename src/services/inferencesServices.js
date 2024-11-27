const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/inputError')

async function predictClassification(model, image) {
  try{
    const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    let result = {
      confidenceScore,
      label: "Cancer",
      suggestion: "Segera periksa ke Dokter!"
    };
    if(confidenceScore < 1){
      result.label = "Non-cancer";
      result.suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return result;
    
  } catch(error){
    throw new InputError('Terjadi Kesalahan dalam melakukan prediksi')
  }
}

module.exports = predictClassification;