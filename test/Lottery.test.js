const assert = require('assert'); 
const ganache = require('ganache-cli'); //our local test network, created when running a test
const Web3 = require('web3'); //ctor function
const web3 = new Web3(ganache.provider()); //provider allows us to connect to any given network

//require our interface and bytecode
const { interface, bytecode } = require('../compile');
//two local varables
let lottery; //holding an instance of our contract
let accounts; //holding a list of generated accounts

//deploy the contract
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    //deploys an instance of our contract
    lottery = await new web3.eth.Contract(JSON.parse(interface)) //pass in the interface after it's parsed from JSON
      //takes in the raw compiled contract  
      .deploy({ data: bytecode})
      //send as a transaction to the local test network
      .send({ from: accounts[0], gas: '1000000'});

});
//get a list of all accounts