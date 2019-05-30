const DeveryRegistry = artifacts.require('./DeveryRegistry.sol');
const DeveryTrust = artifacts.require('./DeveryTrust.sol');
const TestEVEToken = artifacts.require('./TestEVEToken.sol');

module.exports = function (deployer) {
  deployer.deploy(DeveryRegistry);
  deployer.deploy(DeveryTrust);
  deployer.deploy(TestEVEToken);
};
