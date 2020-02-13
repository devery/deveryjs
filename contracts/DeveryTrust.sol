pragma solidity ^0.4.18;

contract DeveryTrust {
    mapping(address => mapping(address => bool)) approval;
    event Approve(address approver, address brandKey);
    event Revoke(address revoker, address brandKey);

    function approve(address brandKey) public {
        approval[msg.sender][brandKey] = true;
        Approve(msg.sender, brandKey);
    }
    
    function revoke(address brandKey) public {
        approval[msg.sender][brandKey] = false;
        Revoke(msg.sender, brandKey);
    }
    
    function check(address approver, address brandKey) public constant returns (bool) {
        return approval[approver][brandKey];
    }
}