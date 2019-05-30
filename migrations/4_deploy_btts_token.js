const BTTSLib = artifacts.require('./BTTSLib.sol');

async function doDeploy(deployer, network) {
  deployer.deploy(BTTSLib);
}

module.exports = (deployer, network) => {
  deployer.then(async () => {
    await doDeploy(deployer, network);
  });
};
