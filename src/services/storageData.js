const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();

    const predictCollection = db.collection('prediction');
    return predictCollection.doc(id).set(data);

}

function dataDoc(doc) {
  return {
    id: doc.id,
    history: {
      result: doc.data().result,
      createdAt: doc.data().createdAt,
      suggestion: doc.dat().suggestion,
      id: doc.id
    }
  };
};


async function getHistory(id = null) {
  const predictCollection = db.collection('prediction');
  if(id){
    const doc = await predictCollection.doc(id).get();
    if(!doc.exists) return null;
    return dataDoc();

  }else {
    const snapshop = await predictCollection.get();
    const allData = [];
    snapshop.forEach(doc => allData.push(dataDoc(doc)));
    return allData;
  }
}

module.exports = { storeData, getHistory }