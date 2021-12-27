const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3'); //web3 constructor
const { interface, bytecode } = require('./compile'); //from our compile script

//setup for HDWalletprovider
const provider = new HDWalletProvider(
  'tennis make claw mad mosquito gorilla slab wide govern angry bomb turtle', //acount mnominic
  'https://rinkeby.infura.io/v3/f4a45206e8ba4badada0e2f8197ce831' //link to the testnetwork
  
);
//connection to the network
const web3 = new Web3(provider);

//to be able ro make 2 async calls
const deploy = async () => {
  //list of all unlocked accounts in the wallet
  const accounts = await web3.eth.getAccounts();
  //address and public key that is deploying the contract
  console.log('Attempting to deploy from account', accounts[0]);
  //Contract deployment statement
  const result = await new web3.eth.Contract(JSON.parse(interface))
    //the bytecode and anyinitial arguments that we want to pass to the contract
    .deploy({ data: bytecode })
    //sends the transaction to the network
    .send({ gas: '1000000', from: accounts[0] });
  //shows the contract interface(ABI)
  console.log(interface);
  //shows the adress that our contract was deployed to
  console.log('Contract deployed to', result.options.address);
  //Preventing a hanging deployment
  provider.engine.stop();
};
deploy();
