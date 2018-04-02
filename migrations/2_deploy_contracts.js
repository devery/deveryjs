var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");




/******************devery******************/

var DeveryRegistry = artifacts.require("./DeveryRegistry.sol")
var DeveryTrust = artifacts.require("./DeveryTrust.sol")
var TestEVEToken = artifacts.require("./TestEVEToken.sol")

module.exports = function(deployer) {
    /********REMOVE***********/
    deployer.deploy(ConvertLib);
    deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(MetaCoin);
    /********REMOVE***********/
    deployer.deploy(DeveryRegistry);
    deployer.deploy(DeveryTrust);
    deployer.deploy(TestEVEToken);


};