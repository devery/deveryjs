import AbstractSmartContract from './AbstractSmartContract';

const deveryERC721Artifact = require('../build/contracts/DeveryERC721Token.json');
const ethers = require('ethers');


/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and list to ownership change related
 * events
 *
 * @version 2
 * @extends AbstractDeverySmartContract
 */
export default class DeveryERC721 extends AbstractSmartContract {
  /**
     *
     * Creates a new instansce of DeveryERC721.
     *```
     * //creates a DeveryERC721Client with the default params
     * let deveryERC721Client = new DeveryERC721();
     *
     * //creates a deveryRegistryClient pointing to a custom address
     * let deveryERC721Client = new DeveryERC721({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
  constructor(options = {
    web3Instance: undefined, acc: undefined, address: undefined, walletPrivateKey: undefined, networkId: undefined,
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
      console.log('it was not possible to find global web3');
    } catch (e) {
      console.log('it was not possible to find global web3');
    }

    if (!network) {
      network = 1;
    }

    if (!address) {
      address = deveryERC721Artifact.networks[network].address;
    }

    this.__deveryERC721Contract = new ethers.Contract(
      address, deveryERC721Artifact.abi,
      this.__signerOrProvider,
    );
  }

  // x.__deveryERC721Contract.claimProduct
  async claimProduct(productAddress, quantity = 1, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .claimProduct(productAddress, quantity, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.getApproved
  async getApproved(address, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract.getApproved(address, overrideOptions);
    return result;
  }

  // x.__deveryERC721Contract.getProductsByOwner
  async getProductsByOwner(addressOwner, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .getProductsByOwner(addressOwner, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.onapproval
  setApprovalEventListener(callback) {
    this.__deveryERC721Contract.onapproval = callback;
  }

  // x.__deveryERC721Contract.onapprovalforall
  setApprovalForAllEventListener(callback) {
    this.__deveryERC721Contract.onapprovalforall = callback;
  }

  // x.__deveryERC721Contract.ontransfer
  setTransferEventListener(callback) {
    this.__deveryERC721Contract.ontransfer = callback;
  }

  // x.__deveryERC721Contract.setMaximumMintableQuantitys
  async setMaximumMintableQuantity(productAddress, quantity, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .setMaximumMintableQuantity(productAddress, quantity, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.tokenIdToProduct
  async tokenIdToProduct(tokenId) {
    const result = await this.__deveryERC721Contract.tokenIdToProduct(tokenId);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.totalAllowedProducts
  async totalAllowedProducts(productAddress) {
    const result = await this.__deveryERC721Contract.totalAllowedProducts(productAddress);
    return result.toNumber();
  }

  // x.__deveryERC721Contract.totalMintedProducts
  async totalMintedProducts(productAddress) {
    const result = await this.__deveryERC721Contract.totalMintedProducts(productAddress);
    return result.toNumber();
  }
}
