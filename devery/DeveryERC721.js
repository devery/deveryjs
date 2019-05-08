import AbstractSmartContract from './AbstractSmartContract';

const deveryERC721Artifact = require('../build/contracts/DeveryERC721Token.json');
const ethers = require('ethers');


/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and list to ownership change related
 * events
 *
 * @version 1
 * @extends AbstractSmartContract
 */
class DeveryERC721 extends AbstractSmartContract {
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
      //console.log('it was not possible to find global web3');
    } catch (e) {
      //console.log('it was not possible to find global web3');
    }

    if (!network) {
      network = options.networkId || 1;
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

  /**
   *
   * Listener for transfer approval events, this event triggers whenever a devery item is transferred in the blockchain
   * please note that ApprovalEventListener do not stack, this means that whenever you set one you are
   * removing the last one. If you want to remove am ApprovalEventListener, just call this function passing undefined
   * as param.
   *
   * ***Usage example:***
   *
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   *
   *
   *
   * deveryErc721Client.setApprovalEventListener((brandAccount,appAccount,active) => {
   *      //whenever an app created we will log it to the console
   *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
   * })
   *
   * //if you want to remove the listener you can simply pass undefined as parameter
   *
   * deveryRegistryClient.setApprovalEventListener(undefined)
   *
   * //or that is equivalent to the above call
   *
   *
   *
   * deveryRegistryClient.setApprovalEventListener()
   *
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever and ProductUpdated event is
   * triggered
   */
  setApprovalEventListener(callback) {
    this.__deveryERC721Contract.onapproval = callback;
  }

  /**
   * This is a callback function that will be invoked in response to  ApprovalEvents
   *
   *
   * @callback ApprovalEventCallback
   * @param {string} productAccount
   * @param {string} brandAccount
   * @param {string} appAccount
   * @param {string} description
   * @param {bools} active
   *
   */

  /**
   *
   * Listener for transfer approval for all events, this event triggers whenever a devery item is transferred in the blockchain
   * please note that ApprovalEventListener do not stack, this means that whenever you set one you are
   * removing the last one. If you want to remove am ApprovalEventListener, just call this function passing undefined
   * as param.
   *
   * ***Usage example:***
   *
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   *
   *
   *
   * deveryErc721Client.setApprovalForAllEventListener((brandAccount,appAccount,active) => {
   *      //whenever an app created we will log it to the console
   *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
   * })
   *
   * //if you want to remove the listener you can simply pass undefined as parameter
   *
   * deveryRegistryClient.setApprovalForAllEventListener(undefined)
   *
   * //or that is equivalent to the above call
   *
   *
   *
   * deveryRegistryClient.setApprovalForAllEventListener()
   *
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever and ProductUpdated event is
   * triggered
   */
  setApprovalForAllEventListener(callback) {
    this.__deveryERC721Contract.onapprovalforall = callback;
  }

  /**
   *
   * Listener for transfer  events, this event triggers whenever a devery item is transfered in the blockchain
   * please note that ApprovalEventListener do not stack, this means that whenever you set one you are
   * removing the last one. If you want to remove am ApprovalEventListener, just call this function passing undefined
   * as param.
   *
   * ***Usage example:***
   *
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   *
   *
   *
   * deveryErc721Client.setTransferEventListener((brandAccount,appAccount,active) => {
   *      //whenever an app created we will log it to the console
   *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
   * })
   *
   * //if you want to remove the listener you can simply pass undefined as parameter
   *
   * deveryRegistryClient.setTransferEventListener(undefined)
   *
   * //or that is equivalent to the above call
   *
   *
   *
   * deveryRegistryClient.setTransferEventListener()
   *
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever and ProductUpdated event is
   * triggered
   */
  setTransferEventListener(callback) {
    this.__deveryERC721Contract.ontransfer = callback;
  }

  /**
   *
   * Sets the maximum mintable quantity of a given token. *** If you don't set the maximum mintable quantity it will be infinite by defaul**
   *
   *  ***Usage example:***
   * ```
   * //first you need to get a {@link DeveryRegistry} instance
   * let deveryRegistryClient = new DeveryRegistry();
   *
   * //passing true as param will add the account as marker
   * deveryRegistryClient.mark("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","0x873306090abaB3A6e1400e9345bC60c78a8BEt87").then(transaction => {
   *      console.log('transaction address',transaction.hash);
   *      //... other stuff
   * }).catch(err => {
   *      if(err.message.indexOf('User denied')){
   *          console.log('The user denied the transaction')
   *          //...
   *      }
   *
   *      ///handle other exceptions here
   *
   * })
   *
   *
   * //or with the async syntax
   *
   * async function(){
   *      try{
   *          //passing false as param will remove the account as marker
   *          let transaction = await deveryRegistryClient.mark("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","0x873306090abaB3A6e1400e9345bC60c78a8BEt87")
   *          console.log('transaction address',transaction.hash);
   *      }
   *      catch(err){
   *          if(err.message.indexOf('User denied')){
   *               console.log('The user denied the transaction')
   *              //...
   *          }
   *
   *      ///handle other exceptions here
   *      }
   *
   * }
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   * @param {string} productAccount The marker account whose permission will be set
   * @param {string} itemHash permission value to the target markes
   * @param {TransactionOptions} [overrideOptions] the account index inside the appAccounts array
   * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
   */
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


  async balanceOf(ownerAddress, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract.balanceOf(ownerAddress, overrideOptions);
    return result.toNumber();
  }

  async tokenOfOwnerByIndex(ownerAddress, index, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .tokenOfOwnerByIndex(ownerAddress, index, overrideOptions);
    return result.toNumber();
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

  async safeTransferFrom(fromAddress, toAddress, tokenId) {
    const result = await this.__deveryERC721Contract.safeTransferFrom(
      fromAddress, toAddress, tokenId );
    return result.valueOf();
  }
}


export default DeveryERC721;
