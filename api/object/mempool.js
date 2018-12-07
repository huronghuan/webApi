
const bitcoinMessage = require('bitcoinjs-message'); 

var valid =  {};//valid address
var pool = {}; //mempool

//mempool
module.exports= {
	//设置过期时间
	setTimeOut:function(walletAddress,TimeoutRequestsWindowTime){
		let self = this;
		setTimeout(function(){ self.removeValidationRequest(walletAddress) }, TimeoutRequestsWindowTime*1000 );
	},
	//add request to mempool
	addRequestToMempool:function(req,TimeoutRequestsWindowTime){
		let walletAddress = req.param('address');
		pool[walletAddress] = req.response;
		this.setTimeOut(walletAddress, TimeoutRequestsWindowTime);
	},
	//remove validation requests
	removeValidationRequest:function(walletAddress){
		delete pool[walletAddress];
		delete valid[walletAddress];
	},
	//get wallet address
	getRequestByAddress:function(walletAddress){
		sails.log(pool);
		return pool[walletAddress];
	},
	//validate by wallet
	validateRequestByWallet:function(message,address,signature){
		let isValid = bitcoinMessage.verify(message, address, signature);
		if (isValid) {
			valid[address] = true;
		}
		return isValid;
	},
	//check address isvalidate
	verifyAddressRequest:function(walletAddress){
		return valid[walletAddress];
	},
	deleteValidAddress:function(walletAddress){
		delete valid[walletAddress];
	},
	//为了防止重复提交加锁
	getLock:function(address){
		valid[address] = 'active';
	},
	//释放锁
	freeLock:function(address){
		if (valid[address]) {
			valid[address] =true;
		}
	}
};

