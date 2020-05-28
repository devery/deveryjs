import AbstractSmartContract from './AbstractSmartContract';

const deveryERC721Artifact = require('../build/contracts/DeveryERC721Token.json');
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
class DeveryERC721 extends AbstractSmartContract {
  /**
     *
     * Creates a new instansce of DeveryERC721.
     * ```
     * // creates a DeveryERC721Client with the default params
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
      // console.log('it was not possible to find global web3');
    } catch (e) {
      // console.log('it was not possible to find global web3');
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

  /**
  *   This method is used for claiming a product. The method returns you the transaction address of the claim.
  *   If the product have a maximum mintable quantity set and you try to claim a number of product bigger than the mintable products number set
  *   the method will not work
  *
  *   ***Usage example:***
  *
  *   ```
  *  // first you need to get a {@link DeveryERC721} instance
  *  let deveryErc721Client = new DeveryERC721();
  *  // now you can use it
  *
  * // Let's log the simplest case of use in the console
  *
  * deveryErc721Client.claimProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 1).then(response =>
  *    console.log('response').catch(err => {
  *  // treat you error
  *  })
  * )
  *
  *   ```
  *
  *  for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
  *
  *
  * @param {string} productAddress address of the claimed product
  * @param {number} quantity quantity of claimed products
  * @param {TransactionOptions} [overrideOptions] gas options to override the default ones.
  */
  async claimProduct(productAddress, quantity = 1, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .claimProduct(productAddress, quantity, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.getApproved
  /**
   * This method returns you the total amount of approved transactions of the inspected product (referenced by it's token).
   *
   * ***Usage example:***
   *
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   * // Let's log the simplest case of use in the console
   *
   * deveryErc721Client.getApproved(address).then(response => console.log(`Number of approved transactions ${response}`))
   *
   * //response is going to be an hexadecimal number representing the amount of approved transactions made with it
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   *
   * @param {string} address token address to be inspected.
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones.
   */
  async getApproved(address, overrideOptions = {}) {
    return await this.__deveryERC721Contract.getApproved(address, overrideOptions);
  }

  // x.__deveryERC721Contract.getProductsByOwner
  /**
   * Each brand has a blockchain address.
   * This function returns an array with all the product addresses owned by the address passed as a parameter.
   *
   * ***Usage example:***
   *
   * ```
   *  // first you need to get a {@link DeveryERC721} instance
   *  let deveryErc721Client = new DeveryERC721();
   *  // now you can use it
   *
   *  // Let's log the simplest case of use in the console.
   *
   *  deveryErc721Client.getProductsByOwner(addressOwner).then(response => console.log('these are the products owned by this address', response))
   *
   *  // Since this is a promise function you will need a .then statement to display the result
   *
   * ```
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {string} addressOwner the blockchain address of whom we want to know the owned tokens
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   */
  async getProductsByOwner(addressOwner, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .getProductsByOwner(addressOwner, overrideOptions);
    return result.valueOf();
  }

  /**
   *
   * Listener for transfer approval events, this event triggers whenever a devery item is transferred in the blockchain.
   * Please note that ApprovalEventListeners do not stack, this means that whenever you set one you are
   * removing the last one. If you want to remove an ApprovalEventListener, just call this function passing undefined
   * as param.
   *
   * ***Usage example:***
   *
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   *
   *
   * deveryErc721Client.setApprovalEventListener((brandAccount,appAccount,active) => {
   *      // whenever an app created we will log it to the console
   *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
   * })
   *
   * // if you want to remove the listener you can simply pass undefined as parameter
   *
   * deveryErc721Client.setApprovalEventListener(undefined)
   *
   * // or that is equivalent to the above call
   *
   *
   *
   * deveryErc721Client.setApprovalEventListener()
   *
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever an ApprovalForAll event is
   * triggered
   */
  setApprovalEventListener(callback) {
    const eventName = 'ApprovalForAll'; //@todo: check - may be it should be 'Approval'??
    this.__deveryERC721Contract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryERC721Contract.on(eventName, callback);
    }
  }

  /**
   * This is a callback function that will be invoked in response to ApprovalEvents
   *
   *
   * @callback ApprovalEventCallback
   * @param {string} productAccount product account address.
   * @param {string} brandAccount brand account address.
   * @param {string} appAccount application account address.
   * @param {string} description description
   * @param {boolean} active
   *
   */

  /**
   *
   * Listener for transfer approval for all events, this event triggers whenever a devery item is transferred in the blockchain.
   * Please note that ApprovalForAllEventListeners do not stack, this means that whenever you set one you are
   * removing the last one. If you want to remove an ApprovalForAllEventListener, just call this function passing undefined
   * as param.
   *
   * ***Usage example:***
   *
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   *
   *
   * deveryErc721Client.setApprovalForAllEventListener((brandAccount,appAccount,active) => {
   *      // whenever an app created we will log it to the console
   *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
   * })
   *
   * // if you want to remove the listener you can simply pass undefined as parameter
   *
   * deveryRegistryClient.setApprovalForAllEventListener(undefined)
   *
   * // or that is equivalent to the above call
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
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever a Approval event is
   * triggered
   */
  setApprovalForAllEventListener(callback) {
    const eventName = 'Approval'; //@todo: check - may be it should be 'ApprovalAll'??
    this.__deveryERC721Contract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryERC721Contract.on(eventName, callback);
    }
  }
//@todo: re-check callback description
  /**
   *
   * Listener for transfer events, this event triggers whenever a devery item is transferred in the blockchain.
   * Please note that TransferEventListeners do not stack, this means that whenever you set one you are
   * removing the last one. If you want to remove a TransferEventListener, just call this function passing undefined
   * as param.
   *
   * ***Usage example:***
   *
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   *
   *
   * deveryErc721Client.setTransferEventListener((brandAccount,appAccount,active) => {
   *      // whenever an app created we will log it to the console
   *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
   * })
   *
   * // if you want to remove the listener you can simply pass undefined as parameter
   *
   * deveryErc721Client.setTransferEventListener(undefined)
   *
   * // or that is equivalent to the above call
   *
   *
   *
   * deveryErc721Client.setTransferEventListener()
   *
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever a Transfer event is
   * triggered
   */
  setTransferEventListener(callback) {
    const eventName = 'Transfer';
    this.__deveryERC721Contract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryERC721Contract.on(eventName, callback);
    }
  }

  /**
   *
   * Sets the maximum mintable quantity of a given token. *** If you don't set the maximum mintable quantity it will be infinite by default**
   *
   * @param {string} productAddress The address of the product which the mintable quantity will be set.
   * @param {string} quantity the allowed quantity of mintable products.
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case of rejection.
   */
  async setMaximumMintableQuantity(productAddress, quantity, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .setMaximumMintableQuantity(productAddress, quantity, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.tokenIdToProduct
  /**
   * This method returns the blockchain address of a product, using its token as a parameter.
   *
   * ***Usage Example:***
   *
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * // now you can use it
   *
   * // to use this function you need to have a token, which can be get through a function like tokenOfOwnerByIndex
   * // The token is a hexadecimal number
   *
   * deveryErc721Client.tokenIdToProduct(tokenId).then(response => console.log('this is your product address', response))
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {string} tokenId The token of the product you wish to get the address of.
   * @return {Promise.<String>} a promise that if resolved returns a blockchain product address or raise an error in case of rejection.
   *
   */
  async tokenIdToProduct(tokenId) {
    const result = await this.__deveryERC721Contract.tokenIdToProduct(tokenId);
    return result.valueOf();
  }


  /**
   * This method returns the (hexadecimal) number of products owned by the account address passed as parameter to the function.
   *
   * ***Usage Example:***
   *
   *  ```
   * // first you need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * // now you can use it
   *
   * // this method requires an owner address, which can be obtained on the metamask extension by clicking on your account name
   *
   *
   * deveryErc721Client.__deveryERC721Contract.balanceOf(ownerAddress).then(response => console.log('this account owns number of products: ', response))
   *
   * ```
   *
   * @param {string} ownerAddress Blockchain address of the inspected account.
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones.
   * @return {Promise.<*>} a promise that if resolved returns a hexadecimal number of products or raise an error in case of rejection.
   */
  async balanceOf(ownerAddress, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract.balanceOf(ownerAddress, overrideOptions);
    return result.toNumber();
  }

  /**
   * This method returns the token of a product by its index (it's a position in an array containing all the products owned by the owner address).
   *
   * ***Usage Example:***
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * // now you can use it
   *
   * deveryErc721Client.__deveryERC721Contract.tokenOfOwnerByIndex(ownerAddress, index).then(response => ( console.log('product token', response)))
   *
   * // the product order is the same as the array returned by getProductByOwner() . Wherefore the index 0 it's the first address returned by the getProductByOwner method,
   * // the index 1 is the second address and so on.
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {string} ownerAddress blockchain address of that we want to know the owned tokens.
   * @param {number} index position of the product in the array of all products owned by the account corresponding to the address.
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   * @return {Promise.<*>} a promise that if resolved returns a token or raise an error in case of rejection.
   */
  async tokenOfOwnerByIndex(ownerAddress, index, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .tokenOfOwnerByIndex(ownerAddress, index, overrideOptions);
    return result.toNumber();
  }

  // x.__deveryERC721Contract.totalAllowedProducts
  /**
   * This method allows you to query the number of tokens linked to the product address,
   * representing the amount of that product generated.
   * The response is returned as a hexadecimal number.
   *
   * ***Usage example:***
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   * deveryErc721Client.totalAllowedProducts(productAddress).then(response => {
   *     console.log(`this is the total amount of products Allowed ${response}`)
   * }).catch(err => {
   *  // handle exceptions here
   * })
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * @param {string} productAddress Blockchain address of the product.
   * @return {Promise.<Number>} a promise that if resolved returns number of tokens or raise an error in case of rejection.
   */
  async totalAllowedProducts(productAddress) {
    const result = await this.__deveryERC721Contract.totalAllowedProducts(productAddress);
    return result.toNumber();
  }

  /**
   * You can generate a limited amount of products for each product address.
   * If you try to generated more products than you are allowed, this product
   * is going to be minted.
   * This method returns you the number of minted products for a specific product address.
   *
   * ***Usage Example:***
   *
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   * deveryErc721Client.totalMintedProducts(productAddress).then(response =>
   *  (console.log('you have the following number of minted products for this address ', response)))
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   *
   * @param {string} productAddress inspected product address.
   * @return {Promise.<Number>} a promise that if resolved returns number of minted products or raise an error in case of rejection.
   */
  async totalMintedProducts(productAddress) {
    const result = await this.__deveryERC721Contract.totalMintedProducts(productAddress);
    return result.toNumber();
  }

  /**
   * This method transfers the ownership of a product from one account to another.
   * The transfer must be made logged in the account referenced in the 'fromAddress' parameter,
   * otherwise the transfer will be denied.
   *
   * *** Usage Example: ***
   * ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * // now you can use it
   *
   * deveryErc721Client.safeTransferFrom(fromAddress, toAddress, tokenId).then(transaction => {
   *    console.log('your transaction was successful');
   *    // other stuff
   * }).catch(err => {
   *  if(err.message.indexOf('gas required exceeds allowance or always failing transaction') {
   *    console.log('You do not own the product you are trying to transfer')}
   * })
   *
   * ```
   *
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   *
   * @param {string} fromAddress blockchain address which the transfer is coming from
   * @param {string} toAddress blockchain address which the transfer is going to
   * @param {string} tokenId Token of the product being transferred
   */
  async safeTransferFrom(fromAddress, toAddress, tokenId) {
    if (!/^\d*$/.test(`${tokenId}`)){
      tokenId = await this.getTokenIdByAddress(fromAddress,tokenId)
    }
    const result = await this.__deveryERC721Contract['safeTransferFrom(address,address,uint256)'](fromAddress, toAddress, tokenId);
    return result.valueOf();
  }


   async getTokenIdByAddress(address, wallet) {
    const balance = await client.balanceOf(wallet)
    address = address.toLocaleLowerCase()
    for (let i = 0; i < balance; i++) {
      //TODO: optimize
      const tokenId = await this.tokenOfOwnerByIndex(wallet, i)
      const prodAddress = await this.tokenIdToProduct(tokenId)
      if (prodAddress.toLocaleLowerCase() === address) {
        return tokenId;
      }
    }
    throw new Error('token id not found');
  }

  /**
   *  This method creates a devery registry address for the desired contract,
   *  so the user is able to properly use the devery ERC721 methods.
   *
   *
   *  ***Usage example:***
   *
   *  ```
   * // first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //n ow you can use it
   *
   * // then you have to pass the devery contract method passing the contract as a parameter
   * deveryErc721Client.setDeveryRegistryAddress(address).then(transaction => {
   *    console.log(transaction) }).catch(err => {
   *        // treat your errors here
   *    })
   *  ```
   * @param {string} deveryRegistryContractAddress address of the deployed contract.
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones.
   */
  async setDeveryRegistryAddress(deveryRegistryContractAddress, overrideOptions = {}){
    const result = await this.__deveryERC721Contract
      .setDeveryRegistryAddress(deveryRegistryContractAddress, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method return you wether a account owns tokens of a determined product or not
   * the return of this function is a boolean value
   *
   * ***Usage Example***
   * ```
   * //First you'll need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * //Then you will need to pass an account address and a product address as parameters
   * deveryErc721Client.hasAccountClaimendProduct(ownerAddres, productAddres)
   *  .then(hasProduct => console.log(hasProduct))
   *  .catch(err => {
   *    //treat errors
   *  })
   * ```
   *
   * @param {string} ownerAddres Blockchain address of the inspect account
   * @param {string} productAddres Blockchain addres of the checked product
   */
  async hasAccountClaimendProduct(ownerAddres, productAddress){
    const ownedProducts = await this.getProductsByOwner(ownerAddres);
    return ownedProducts.includes(productAddress)
  }
}


export default DeveryERC721;
