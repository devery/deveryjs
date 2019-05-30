const DeveryERC721Token = artifacts.require("./DeveryERC721Token.sol")

module.exports = function(deployer) {
  deployer.deploy(DeveryERC721Token);
};
