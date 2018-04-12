pragma solidity ^0.4.21;

import "./Ownable.sol";

// Stock contract is owned and deployed by auditor, should be public
contract Stock is Ownable {
    struct stock {
        uint id;
        string name;
    }
    mapping (uint => stock) public stocks;
    uint public stockCounter;

    function addStock(string _name) public onlyOwner {
        stockCounter++;
        stocks[stockCounter] = stock({id: stockCounter, name: _name});
    }
}
