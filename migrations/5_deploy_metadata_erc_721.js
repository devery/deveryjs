const DeveryERC721Token = artifacts.require("./DeveryERC721MetadataToken.sol")

module.exports = function(deployer) {
  deployer.deploy(DeveryERC721Token);
};
