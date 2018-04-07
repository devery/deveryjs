var DeveryRegistry = artifacts.require("./DeveryRegistry.sol")
var DeveryTrust = artifacts.require("./DeveryTrust.sol")
var TestEVEToken = artifacts.require("./TestEVEToken.sol")

module.exports = function(deployer) {
    deployer.deploy(DeveryRegistry);
    deployer.deploy(DeveryTrust);
    deployer.deploy(TestEVEToken);
};