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
//Test
describe('Lottery Contract', () => {
    it('deploys a contract', () => { //sucessfully deployed to the local network?
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            //who is attempting to enter the lottery
            from: accounts[0], 
            //send along some Wei
            value: web3.utils.toWei('0.02', 'ether')
        });

        //gets a list of players
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        //checks that there is only one record in the array and that the correct adress is stored inside
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length); //value it should be(1) and te value it is(players.lenght)
    });

    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            //who is attempting to enter the lottery
            from: accounts[0], 
            //send along some Wei
            value: web3.utils.toWei('0.02', 'ether')
        });
        //account 2
        await lottery.methods.enter().send({
            //who is attempting to enter the lottery
            from: accounts[1], 
            //send along some Wei
            value: web3.utils.toWei('0.02', 'ether')
        });
        //account 3
        await lottery.methods.enter().send({
            //who is attempting to enter the lottery
            from: accounts[2], 
            //send along some Wei
            value: web3.utils.toWei('0.02', 'ether')
        });

        //gets a list of players
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        //checks that the adress record in the array are correct and that the correct adresses is stored inside
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length); //value it should be(1) and te value it is(players.lenght)
    });
    //send in atleast 0.01 ether
    it('requires a minimum amount of ether to enter', async () =>{
       try{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: 0
        });
        assert(false);//to be 100% sure that we get an error
       } catch (error) {
           assert(error);//that we got the eror we want
       }
        
    });
});
//get a list of all accounts