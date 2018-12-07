
/**
 * ValidationController.js
 *
 * @description 验证器
 */

var mempool = require("../object/mempool")

const TimeoutRequestsWindowTime = 5*60*1000;



module.exports ={

	//validate request
	request:function(req,res){
		var currentStamp = new Date().getTime().toString().slice(0,-3);
		var validationWindow = TimeoutRequestsWindowTime/1000;
		var address = req.param('address');
		if (address == null || address == '') {
			return res.badRequest(new Error("Application can't access empty address"));
		}else{
			let response = null;
			if (response =  mempool.getRequestByAddress(address)) {
				response.validationWindow = Number(response.requestTimeStamp)+(TimeoutRequestsWindowTime/1000) - Number(currentStamp);
				return res.json(response);
			}else{
				req.response = {
					"address":address,
					"requestTimeStamp":currentStamp,
					"message":address+":"+currentStamp+":starRegistry",
					"validationWindow":validationWindow,
				};
				response = req.response;
				//cache data 缓存数据
				mempool.addRequestToMempool(req,validationWindow);
				return res.json(response);
			}
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
		let response = mempool.getRequestByAddress(address);
		if (!response) {
			return res.badRequest(new Error("request not validated"));
		}
		let isValid = mempool.validateRequestByWallet(response.message,address,signature);
		if (isValid) {
			response.validationWindow = Number(response.requestTimeStamp)+(TimeoutRequestsWindowTime/1000) - Number(currentStamp);
			response.messageSignature = 'valid';
			return res.json({
				"registerStar": true,
				"status": response
			});
		}else{
			return res.json({
				"registerStar": false,
				"status": 'signature message failed'
			});
		}
	},



};