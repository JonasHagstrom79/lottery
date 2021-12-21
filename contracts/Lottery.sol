pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether); //some req has bees satisfied b4 contiune
        players.push(msg.sender);
    }
    
    //Random numbers are tough to do in sol
    function random() private view returns (uint) { //Returns a number, private, and is a view as we are not modifying anything, just returning a number
        return uint(keccak256(block.difficulty, now, players)); //Calls the global function sha256, input global difficulty to solve the block, the time(now) and the array of players
    }
    
    function pickWinner() public restricted { //calls the restricted function DontRepeatYourself
        uint index = random() % players.length; //uses modulo to find a number in the array of players
        players[index].transfer(this.balance); //The winner, an adress will be returned, transfer will send ether to the address, this.balance=all ether in the contract
        //reset the player array
        players = new address[](0); //creates a brand new dynamic array of te type address
    }
    
    //Function modifier, called with the modifier word
    modifier restricted() {
        //require enforces security, not private or public
        require(msg.sender == manager); //Ensures that only the person that created the contrct can use pickWinner
        _; //Adds the code from other functions here
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}   