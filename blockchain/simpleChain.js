/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/

const SHA256 = require('crypto-js/sha256');

const level_db = require('./levelSandbox');


/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/
class Block{
	constructor(data){
    	this.hash="";
      this.height=0;
    	this.body = data;
      this.time=0;
      this.previousBlockHash="";
    }
}
/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/ 
class BlockChain{
	  constructor(){
      let o = this;
      this.getBlockHeight().then(function(height){
        height = Number(height);
        if (height== -1) {
          o.addBlock(new Block("First block in the chain --Genesis Block"));
        }
      }, function(err){
        console.log(err);
      });
    }
    //add block  
  	addBlock(newBlock,success,failed){
      let o = this;
      let heightPromise =this.getBlockHeight();
      
      heightPromise.then(function(height){
        let chainHeight = Number(height);
        console.log('chainHeight:',chainHeight);
        if (chainHeight == -1) {
            newBlock.height= chainHeight+1; 
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            //get new block hash
            newBlock.hash=SHA256(JSON.stringify(newBlock)).toString();
            //add new block
            level_db.addDataToLevelDB(JSON.stringify(newBlock).toString());
            if (success) {
              success(newBlock);
            }
        }else{
          let blockPromise = o.getBlock(chainHeight);
          blockPromise.then(function(data){
            let value_d = JSON.parse(data);
            newBlock.height= value_d.height+1; 
            newBlock.previousBlockHash = value_d.hash;
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            //get new block hash
            newBlock.hash=SHA256(JSON.stringify(newBlock)).toString();
            //add new block
            level_db.addDataToLevelDB(JSON.stringify(newBlock).toString());
            if (success) {
              success(newBlock);
            }
          }, function(err){
             console.log("get block error:",err); 
             if(failed){
              failed(err);
             }
          });
        }

      }, function(err){
        console.log(err);
        if(failed){
          failed(err);
        }
      });
    }
    //get chain
    get chain(){
      level_db.getAllData().then((dataArray) => {
          console.log(JSON.stringify(dataArray).toString());
      }, (err) => {
          console.log(err);
      });
    }

    //Get block height promise
    getBlockHeight(){
        return level_db.getLastKey();
    }

    // get block promise
    getBlock(blockHeight){
      if (blockHeight < 0) {
        console.log('out of range');
        return Promise.reject("out of range");
      }else{
        return level_db.getLevelDBData(blockHeight);
      }
    }

    // validate block
    validateBlock(blockHeight,callback){
      // get block promise
      let blockPromise = this.getBlock(blockHeight);
      // get block hash
      blockPromise.then(function(data){
          let block = JSON.parse(data);
          let blockHash = block.hash;
          // remove block hash to test block integrity
          block.hash = '';
          // generate block hash
          let validBlockHash = SHA256(JSON.stringify(block)).toString();
          // Compare
          if (blockHash===validBlockHash) {
            console.log('true');
            if (callback) callback(true);
          } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            if (callback) callback(false);
          }
      }, function(err){
        console.log('get block error:',err);
      });
    }

   // Validate blockchain
    validateChain(){
      let o = this;
      let errorLog = [];
      let heightPromise = this.getBlockHeight();
      heightPromise.then(function(chainHeight){
        console.log('validate:',chainHeight);
        chainHeight = Number(chainHeight);
        for (var i = 0; i < chainHeight+1; i++) {
          // validate block
          console.log('for validate:',i);
          o.validateBlock(i,function(bool){
            if (bool == false) {
              errorLog.push(i);
            }
          });
          // compare blocks hash link
          let blockPromise = o.getBlock(i);
          // get block hash
          console.log('for validate block1:',i);
          blockPromise.then(function(data){
              let block = JSON.parse(data);
              let blockHash = block.hash;
              console.log('for validate block height:',block.height);

              if (block.height+1>chainHeight) {
                  console.log("last block")
              }else{
                //nextBlockPromise
                let nextBlockPromise = o.getBlock(block.height+1);
                nextBlockPromise.then(function(value){
                    let nextBlock = JSON.parse(value);
                    let previousHash = nextBlock.previousBlockHash;
                    if (blockHash!==previousHash) {
                      errorLog.push(block.height);
                    }
                }, function(err){
                  console.log('get block error:',err);
                });
              }

          }, function(err){
            console.log('get block error:',err);
          });//end blockPromise
        }

      }, function(err){
        console.log('get height error:',err);
      }).then(function(){
        if (errorLog.length>0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: ',errorLog);
        } else {
          console.log('No errors detected');
        }
      });
    }
}

module.exports = {Block:Block,BlockChain:BlockChain}

