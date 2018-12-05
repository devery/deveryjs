pragma solidity ^0.4.25;
import "./Owned.sol"

contract Admined is Owned {

    mapping (address => bool) public admins;

    event AdminAdded(address addr);
    event AdminRemoved(address addr);

    modifier onlyAdmin() {
        require(isAdmin(msg.sender));
        _;
    }

    function isAdmin(address addr) public constant returns (bool) {
        return (admins[addr] || owner == addr);
    }
    function addAdmin(address addr) public onlyOwner {
        require(!admins[addr] && addr != owner);
        admins[addr] = true;
        AdminAdded(addr);
    }
    function removeAdmin(address addr) public onlyOwner {
        require(admins[addr]);
        delete admins[addr];
        AdminRemoved(addr);
    }
}
