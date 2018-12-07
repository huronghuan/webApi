/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  return new Promise(function(resolve,reject){
    db.put(key, value, function(err) {
      if (err){
        console.log('Block ' + key + ' submission failed', err);
        reject('failed');
      }else{
        resolve('success');
      }
    });
  });
}

// Get data from levelDB with key
function getLevelDBData(key){
  return new Promise(function(resolve,reject){
    db.get(key, function(err, value) {
      if (err) {
        console.log(err);
        reject(err);
      }else{
        resolve(value);
      }
    });
  });
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    let  $this = this;
    db.createReadStream().on('data', function(data) {
      i++;
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err);
    }).on('close', function() {
      console.log("block #",i);
      console.log(value);
      let addPromis = $this.addLevelDBData(i, value);
      addPromis.then(function(s){
        console.log("block ",i,s);
      }, function(e){
        console.log("block ",i,e);
      });
    });
}

function getLastKey(){
  return new Promise(function(resolve,reject){
    let i = -1;
    db.createKeyStream().on('data', function(data) {
      i = data;
    }).on('error', function(err) {
      console.log('Unable to read data stream!', err);
      reject(err);
    }).on('close', function() {
      console.log('last key #' + i);
      resolve(i);
    });
  });
}
//get all data
function getAllData(){
  return new Promise(function(resolve,reject){
      let dataArray=[];
      db.createReadStream().on('data', function(data) {
        dataArray.push(JSON.parse(data.value));
      }).on('error', function(err) {
          console.log('Unable to read data stream!', err);
          reject(err);
      }).on('close', function() {
          resolve(dataArray);
      });
  });
}
function getDb(){
  return db;
}
//exports all functions
module.exports.addLevelDBData = addLevelDBData;
module.exports.getLevelDBData = getLevelDBData;
module.exports.addDataToLevelDB = addDataToLevelDB;
module.exports.getLastKey = getLastKey;
module.exports.getAllData = getAllData;
module.exports.getDb = getDb;
