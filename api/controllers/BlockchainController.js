/**
 * BlockchainController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var {Block,BlockChain} = require("/blockchain/simpleChain");

let myBlockChain = new BlockChain();

module.exports = {
  	getBlock:function(req,res){
  		var height = Number(req.param('height'))
  		if (height == 0) {
  			return res.badRequest(new Error('chain height must greater than 0'))
  		}
  		let blockPromise = myBlockChain.getBlock(height);
  		blockPromise.then(function(data){
  			res.send(data);
  		}, function(err){
  			res.send('internal error');
  		});
  	},
  	addBlock:function(req,res){
  		if (req.body == '') {
  			return res.badRequest(new Error('body can not empty'));
  		}
  		let body = JSON.parse(req.body);

  		if (body == false || body.body == null) {
  			return res.badRequest(new Error('bad json request'));
  		}
  		let newBlock = new Block(body.body);

  		myBlockChain.addBlock(newBlock,function(data){
  			//data is new block
	  		res.json(data);
  		});


  	},

};

