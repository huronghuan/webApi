
/**
 * ValidationController.js
 *
 * @description 验证器
 */

var cacheBase =  require('cache-base');
var cache = new cacheBase();

module.exports ={

	//validate request
	request:function(req,res){
		var currentStamp = new Date().getTime().toString().slice(0,-3);
		var address = req.param('address');
		if (address == null || address == '') {
			return res.badRequest(new Error("Application can't access empty address"));
		}else{
			let response = {
				"address":address,
				"requestTimeStamp":currentStamp,
				"message":address+":"+currentStamp+":starRegistry",
				"validationWindow":300,
			};
			//cache data 缓存数据
			cache.set(address,response);
			return res.json(response);
		}

	},
	//钱包数字签名
	signature:function(req,res){

		var currentStamp = new Date().getTime().toString().slice(0,-3);
		var address  = req.param("address");
		var signature = req.param("signature");
		if (address == null || address == '') {
			return res.badRequest(new Error("Application can't access empty address"));
		}
		if (signature == null || signature == '') {
			return res.badRequest(new Error("Application can't access empty signature"));
		}
		if (cache.has(address) ==false) {
			return res.badRequest(new Error("request not validated"));
		}
		//get cacheObj
		let cacheObj =  cache.get(address);
		//check if timeout
		if (currentStamp - cacheObj.requestTimeStamp>cacheObj.requestTimeStamp) {
			return res.badRequest(new Error("out of validationWindow !"));
		}
		//delete cacheObj
		cache.del(address);
		//cache signature
		cache.set(signature,address);
		
		return res.json({
			"registerStar": true,
			"status": {
			    "address": address,
			    "requestTimeStamp": currentStamp,
			    "message": address+":"+currentStamp+":starRegistry",
			    "validationWindow": currentStamp - cacheObj.requestTimeStamp,
			    "messageSignature": "valid"
			}
		});

	},

};