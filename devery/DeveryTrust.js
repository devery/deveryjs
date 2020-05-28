import AbstractSmartContract from './AbstractSmartContract';

const deveryTrustArtifact = require('../build/contracts/DeveryTrust');
const ethers = require('ethers');


/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and listen to ownership change related
 * events
 *
 * @version 1
 * @extends AbstractSmartContract
 */
class DeveryTrust extends AbstractSmartContract {

  constructor(options = {
    web3Instance: undefined,
    acc: undefined,
    address: undefined,
    walletPrivateKey: undefined,
    networkId: undefined,
  }) {
    super(...arguments);

    options = Object.assign(
      {
        web3Instance: undefined,
        acc: undefined,
        address: undefined,
        walletPrivateKey: undefined,
        networkId: undefined,
      }
      , options,
    );

    let address = options.address;
    let network = options.networkId;

    try {
      if (!options.web3Instance) {
        options.web3Instance = web3;
      }
      network = options.web3Instance.version.network;
      // console.log('it was not possible to find global web3');
    } catch (e) {
      // console.log('it was not possible to find global web3');
    }

    if (!network) {
      network = options.networkId || 1;
    }

    if (!address) {
      address = deveryTrustArtifact.networks[network].address;
    }

    this.__deveryTrustContract = new ethers.Contract(
      address, deveryTrustArtifact.abi,
      this.__signerOrProvider,
    );
  }


  async approve(brandKey,overrideOptions = {}){
    const result = await this.__deveryTrustContract.approve(brandKey,overrideOptions);
    return result.valueOf();
  }

  async revoke(brandKey,overrideOptions = {}){
    const result = await this.__deveryTrustContract.revoke(brandKey,overrideOptions);
    return result.valueOf();
  }

  async check(approver,brandKey,overrideOptions = {}){
    throw new Error('Deprecated method');
  }

  async checkBrand(brandKey,overrideOptions = {}){
    throw new Error('Deprecated method');
  }

  async isApprover(addr,overrideOptions = {}){
    throw new Error('Deprecated method');
  }

  async getAddressApprovals(addr) {
    const result = await this.__deveryTrustContract.getAddressApprovals(addr);
    return result;
  }

  async getBrandApprovals(addr) {
    const result = await this.__deveryTrustContract.getBrandApprovals(addr);
    return result;
  }


}

export default DeveryTrust;
