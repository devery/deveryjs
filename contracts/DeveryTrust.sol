pragma solidity ^0.4.18;

import "./DeveryRegistry.sol";



contract DeveryTrust is Admined {
    mapping(address => mapping(address => bool)) approval;
    mapping(address => bool) brandApprovals;
    mapping(address => bool) authorizedApprovers;
    event Approve(address approver, address brandKey);
    event Revoke(address revoker, address brandKey);

    function addAproverAsAdmin(address approverAddress) public onlyAdmin{
        authorizedApprovers[approverAddress] = true;
    }

    function revokeAproverAsAdmin(address approverAddress) public onlyAdmin{
        authorizedApprovers[approverAddress] = false;
    }

    function addApprover(address approverAddress) public {
        require(authorizedApprovers[msg.sender] == true,"You are not authorized to add approvers");
        authorizedApprovers[approverAddress] = true;
    }

    function revokeAprover(address approverAddress) public{
        require(authorizedApprovers[msg.sender] == true, "You are not authorized to revoke approvers");
        authorizedApprovers[approverAddress] = false;
    }

    function isApprover(address addr) public constant returns (bool){
        return authorizedApprovers[addr];
    }


    function approve(address brandKey) public {
        require(authorizedApprovers[msg.sender] == true, "You are not authorized approve brands");
        approval[msg.sender][brandKey] = true;
        brandApprovals[brandKey] = true;
        Approve(msg.sender, brandKey);
    }

    function revoke(address brandKey) public {
        require(authorizedApprovers[msg.sender] == true, "You are not authorized to revoke brands approvals");
        approval[msg.sender][brandKey] = false;
        brandApprovals[brandKey] = false;
        Revoke(msg.sender, brandKey);
    }

    function check(address approver, address brandKey) public constant returns (bool) {
        return approval[approver][brandKey];
    }

    function checkBrand(address brandKey) public constant returns (bool) {
        return brandApprovals[brandKey];
    }
}
