
// let sleep = require('sleep-promise/sleep');
let sleep = require('sleep-promise');

var simpleChain = require("./simpleChain")
let BlockChain = simpleChain.BlockChain
let Block = simpleChain.Block


//block chain construct
let myBlockChain = new BlockChain();


	(function theLoop (i) {
	    setTimeout(function () {
	        let blockTest = new Block("Test Block - " + (i + 1));
	        myBlockChain.addBlock(blockTest);
	        i++;
	        if (i == 3) {
				myBlockChain.chain;
	        }
	        if (i < 3) {
	        	theLoop(i);
	        }
	    }, 100);
	  })(0);
		sleep(1000).then(function(){
		  console.log("success");
		  myBlockChain.validateBlock(2);
		  myBlockChain.validateChain();		
		});






