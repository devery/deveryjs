pragma solidity ^0.4.25;

contract IDeveryRegistry {
    uint public fee;
    mapping(address => App) public apps;
    mapping(address => Brand) public brands;
    mapping(address => Product) public products;
    address[] public appAccounts;
    address[] public brandAccounts;
    address[] public productAccounts;
}
