/**
 * StarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var {Block,BlockChain} = require("../../blockchain/simpleChain");
var mempool = require("../object/mempool");
let myBlockChain = new BlockChain();

var locked={};

function HexToString (hex) {
     return new Buffer(hex,'hex').toString();
}
function StringToHex(str){
	return new Buffer(str).toString('hex');
}
module.exports = {
	//get star by block
  	getBlock:function(req,res){
  		var height = Number(req.param('height'));
  		
  		sails.log("requst param block height is:",height);

  		if (height < 0) {
  			return res.badRequest(new Error('chain height cant smaller than 0'))
  		}
  		
  		let blockPromise = myBlockChain.getBlock(height);
  		blockPromise.then(function(data){
  			data = JSON.parse(data);
  			data.body.star.storyDecoded = HexToString(data.body.star.story);
  			res.json(data);
  		}, function(err){
  			sails.log("get block error:",err);
  			res.json({
  				"error":"Not Found"
  			});
  		});
  	},
  	//get star by hash
  	getByHash:function(req,res){
  		var hash = req.param('hash');
  		if (hash == '' || hash == null) {
  			return res.badRequest(new Error('must be not empty hash'));
  		}
  		myBlockChain.getBlockByHash(hash).then(function(data){
  			data.body.star.storyDecoded = HexToString(data.body.star.story);
  			res.json(data);
  		}, function(err){
  			res.badRequest(err);
  		})

  	},
  	//get star by address
  	getByAddress:function(req,res){
  		var address = req.param('address');
  		if (address == '' || address == null) {
  			return res.badRequest(new Error('must be not empty address'));
  		}
  		myBlockChain.getBlockByAddress(address).then(function(data){
  			for (var i = data.length - 1; i >= 0; i--) {
  				data[i].body.star.storyDecoded = HexToString(data[i].body.star.story);
  			}
  			res.json(data);
  		}, function(err){
  			res.badRequest(err);
  		})

  	},
  	//add star
  	addBlock:function(req,res){
  		sails.log("requst body:",req.body);
  		sails.log("type of the body",typeof req.body);

  		if (typeof req.body != "object") {
  			return res.badRequest(new Error('content error，content must be json format'));
  		}
  		if (req.body == {}) {
  			return res.badRequest(new Error('body can not empty'));
  		}
  		
  		let address = req.body.address;
  		let star = req.body.star;
  		if (!star) {
  			return res.badRequest(new Error("star required"));
  		}
  		if (!star.story) {
  			return res.badRequest(new Error("story required"));
   		}
   		if (typeof star.story != 'string') {
   			return res.badRequest(new Error("story must be string!"));
   		}
   		for(var k = 0; k < star.story.length; k++){
   			if(k>250){
   				return res.badRequest(new Error("story limit 250 words!"));
   			}
   			if(star.story.charCodeAt(k)>127){
   				return res.badRequest(new Error("Stroy must be ascii text!"));
   			}
   		}

  		let RA = star.ra;
        let DEC = star.dec;
        let MAG = star.mag;
        let CEN = star.cen;
        let story = Buffer(star.story).toString('hex');
  		
  		if (!RA) {
  			return res.badRequest(new Error("ra required"));
  		}
        if (!DEC) {
        	return res.badRequest(new Error("dec required"));
        }

		let body = {
		        address: address,
		        star: {
		              ra: RA,
		              dec: DEC,
		              mag: MAG,
		              cen: CEN,
		              story: story
		        }
			};

  		if (address == '' || address == false) {
  			return res.badRequest(new Error('empty address'));
  		}

  		let isvalid = mempool.verifyAddressRequest(address);
  		if (isvalid) {
  			if (isvalid !== true) {
  				return res.json({
  					"error":"duplicate add request"
  				});
  			}
  			//avoid Concurrent
  			mempool.getLock(address);
  			let newBlock = new Block(body);
  			myBlockChain.addBlock(newBlock,function(data){
	  			//data is new block
	  			mempool.removeValidationRequest(address);
	  			//add original story
	  			data.body.star.storyDecoded = star.story;
	  			//释放锁
		  		res.json(data);
	  		},function(err){
	  			//释放锁
  				mempool.freeLock(address);
	  			res.serverError(err);
	  		});

  		}else{
  			return res.badRequest(new Error('invalid address or you did not have signatured jet'));
  		}
  	},

};

