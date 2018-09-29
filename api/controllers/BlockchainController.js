/**
 * BlockchainController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var {Block,BlockChain} = require("../../blockchain/simpleChain");

let myBlockChain = new BlockChain();

module.exports = {
  	getBlock:function(req,res){
  		var height = Number(req.param('height'));
  		
  		sails.log("requst param block height is:",height);

  		if (height < 0) {
  			return res.badRequest(new Error('chain height cant smaller than 0'))
  		}
  		
  		let blockPromise = myBlockChain.getBlock(height);
  		blockPromise.then(function(data){
  			res.send(data);
  		}, function(err){
  			sails.log("get block error:",err);
  			res.send(new Error('internal error'));
  		});
  	},
  	addBlock:function(req,res){
  		sails.log("requst body:",req.body);
  		sails.log("type of the body",typeof req.body);
  		if (typeof req.body != "object") {
  			return res.badRequest(new Error('content error，content must be json format'));
  		}
  		if (req.body == {}) {
  			return res.badRequest(new Error('body can not empty'));
  		}
  		if (req.body.body == null) {
  			return res.badRequest(new Error('bad json request'));
  		}
  		if (typeof req.body.body =="string") {
			req.body.body = req.body.body.trim();
  		}
  		if(req.body.body == "") {
  			return res.badRequest(new Error('payload must not empty'));
  		}
  		myBlockChain.duplicateValidate(req.body.body).then(function(){
	  		let newBlock = new Block(req.body.body);
	  		myBlockChain.addBlock(newBlock,function(data){
	  			//data is new block
		  		res.json(data);
	  		},function(err){
	  			res.serverError(err);
	  		});
  		}, function(err){
  			if (typeof err == 'number') {
  				res.json({
  					error:"the body content duplicate from the block which height is "+err
  				});
  			}else{
	  			res.serverError(err);
  			}
  		});


  	},

};

