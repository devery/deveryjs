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
  *    *  //first you need to get a {@link DeveryERC721} instance
  *  let deveryErc721Client = new DeveryERC721();
  *  //now you can use it
  *
  * //Let's log the simplest case of use in the console
  *
  * deveryErc721Client.claimProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 1).then(response => 
  *    console.log('response').catch(err => {
  *  //treat you error
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
  * @param {TransactionOptions} [overrideOptions]
  */
  async claimProduct(productAddress, quantity = 1, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .claimProduct(productAddress, quantity, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.getApproved
  /**
   * This method returns you the total amount of approved transactions of the inspected producted (referenced by it's token)
   *
   * ***Usage example:***
   *
   * ```
   *  //first you need to get a {@link DeveryERC721} instance
   *  let deveryErc721Client = new DeveryERC721();
   *  //now you can use it
   *
   * //Let's log the simplest case of use in the console
   *
   * deveryErc721Client.getApproved(address).then(response => console.log(`Number of approved transactions ${response}`))
   *
   * //response is going to be an hexadecimal number representing the amount of approved transactions made with it
   *
   * ```
   *
   *  for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   *
   * @param {string} address tokenAddres to be inspected
   * @param {TransactionOptions} [overrideOptions]
   */
  async getApproved(address, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract.getApproved(address, overrideOptions);
    return result;
  }

  // x.__deveryERC721Contract.getProductsByOwner
  /**
   * Each brand has and devery user blockchain address. This method returns the address of all the products
   * of all the products linked to the account passed as a parameter
   *
   *
   *
   * ***usage example:***
   *
   * ```
   *  //first you need to get a {@link DeveryERC721} instance
   *  let deveryErc721Client = new DeveryERC721();
   *  //now you can use it
   *
   *  //Let's log the simplest case of use in the console.
   *
   *  deveryErc721Client.getProductsByOwner(addresOwner).then(response => console.log('these are the products owneds by this address', response))
   *
   *  //Since this is a promise function you will need a .then statement to display the result
   *
   *  //This function you return you an array with all the product addresses owned by the address passed as a parameter
   *
   *
   * ```
   * for more info about how to get a {@link DeveryERC721|DeveryERC721 instance click here}.
   *
   * DeveryERC721Client.getProductsByOwner()
   * @param {string} addressOwner the blockchain addres of whom we want to know the owned tokens
   * @param {TransactionOptions} [overrideOptions]
   */
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
    const eventName = 'ApprovalForAll';
    this.__deveryERC721Contract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryERC721Contract.on(eventName, callback);
    }
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
   *
   * @param {ApprovalEventCallback} callback the callback that will be executed whenever and ProductUpdated event is
   * triggered
   */
  setApprovalForAllEventListener(callback) {
    const eventName = 'Approval';
    this.__deveryERC721Contract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryERC721Contract.on(eventName, callback);
    }
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
   *  ***Usage example:***
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   *
   * //passing true as param will add the account as marker
   * deveryRegistryClient.mark('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 1).then(transaction => {
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
   *for more info about how to get let deveryErc721Client = new DeveryERC721();a {@link DeveryRegistry|DeveryRegistry instance click here}.
   * async function(){
   *      try{
   *          //passing false as param will remove the account as marker
   *          let transaction = await deveryRegistryClient.mark('0x627306090abaB3A6e1400e9345bC60c78a8BEf57',1)
   *          console.log('transaction address',transaction.hash);
   *      }
   *      catch(err){
   *          if(err.message.indexOf('User denied')){
   *               console.log('The user denied the transaction')
   *              //...
   *          }
   *
   *      ///handle other exceptions here
   *      }x1'
   *
   * }
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   * @param {string} productAddress The product address of the product which the mintable quantity will be set
   * @param {string} quantity the allowed quantity of mintable products
   * @param {TransactionOptions} [overrideOptions] the account index inside the appAccounts array
   * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
   */
  async setMaximumMintableQuantity(productAddress, quantity, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .setMaximumMintableQuantity(productAddress, quantity, overrideOptions);
    return result.valueOf();
  }

  // x.__deveryERC721Contract.tokenIdToProduct
  /**
   * This method returns the blockchain addres of a product, using it's token as a parameter
   *
   * ***Usage Example:***
   *
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * //now you can use it
   *
   * //to use this function you need to have a token, which can be get through a function like tokenOfOwnerByIndex
   * //The token is a hexadecimal number
   *
   * deveryRegistryClient.tokenIdToProduct('token').then(response => console.log('this is your product address', response))
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   *  DeveryERC721Client.tokenIdToProduct()
   * @param {string} token The token of the product you wish to get the address from
   * @param {TransactionOptions} [overrideOptions]
   *
   */
  async tokenIdToProduct(tokenId) {
    const result = await this.__deveryERC721Contract.tokenIdToProduct(tokenId);
    return result.valueOf();
  }


  /**
   * This method returns the (hexadecimal) number of products owned by the account address passed as parameter to the function
   *
   * ***Usage Example:***
   *
   *  ```
   * //first you need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * //now you can use it
   *
   * //this method requires a owner addres, which can be obtained on the metamask extension by clicking on your account name
   *
   *
   * deveryRegistryClient.__deveryERC721Contract.balanceOf('ownerAddress').then(response => console.log('this is account owns this many products', response))
   *
   * ```
   *
   * @param {string} ownerAddress Blockchain address of the inspected account
   * @param {TransactionOptions} [overrideOptions]
   */
  async balanceOf(ownerAddress, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract.balanceOf(ownerAddress, overrideOptions);
    return result.toNumber();
  }
  /**
   * This Method returns the token of a product using the by it's index (it's position in an array containing all the products owned by the owner address).
   *
   * ***Usage Example:***
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   *
   * let deveryErc721Client = new DeveryERC721();
   *
   * //now you can use it
   *
   *
   * deveryRegistryClient.__deveryERC721Contract.tokenOfOwnerByIndex(ownerAddress, index).then(response => ( console.log('product token', response)))
   *
   * //the product order is the same as the array returned by getProductByOwner() . Wherefore the index 0 it's the first addres returned by the getProductByOwner method,
   * //the index 1 is the  second address and so on.
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   * @param {string} ownerAddress blockchain addres of whom we want to know the owned tokens
   * @param {number} index position of the product in the array of all the products owned by the account correspondant to the address
   * @param {TransactionOptions} [overrideOptions]
   */
  async tokenOfOwnerByIndex(ownerAddress, index, overrideOptions = {}) {
    const result = await this.__deveryERC721Contract
      .tokenOfOwnerByIndex(ownerAddress, index, overrideOptions);
    return result.toNumber();
  }

  // x.__deveryERC721Contract.totalAllowedProducts
  /**
   * This method allows you to query the number of tokens linked to the product addres,
   * representing the amount of that product generated.
   *  The response is returnet as a hexadecimal number
   *
   * ***Usage example:***
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   *
   * deveryRegistryClient.totalAllowedProducts(productAddress).then(response => {
   * console.log(`this is the total amount of products Allowed ${productAddress}`)
   * }).catch(err => {
   *  //handle exceptions here
   * })
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   * @param {string} productAddress Blockchain addres of the consulted product
   */
  async totalAllowedProducts(productAddress) {
    const result = await this.__deveryERC721Contract.totalAllowedProducts(productAddress);
    return result.toNumber();
  }

  /**
   * You can generate a limited amount of products for each product address.
   * If you try to generated more products than you are allowed this product
   * is going to be minted.
   * This method returns you the minted products for a specific product address
   *
   * ***Usage Example:***
   *
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   *
   * deveryRegistryClient.totalMintedProducts('productAdrres').then(response =>
   *  (console.log('you have this many minted products for this addres')))
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   *
   *
   * @param {string} productAddress inspected product addres
   */
  async totalMintedProducts(productAddress) {
    const result = await this.__deveryERC721Contract.totalMintedProducts(productAddress);
    return result.toNumber();
  }

  /**
   * This method transfers the ownership of a product from one account to another.
   * The transfer must be made logged in the account referenced in the 'fromAddres' parameter,
   * otherwise the transfer will be denied
   *
   * *** Usage Example: ***
   * ```
   * //first you need to get a {@link DeveryERC721} instance
   * let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   *
   * deveryRegistryClient.safeTransferFrom(fromAddress, toAddress, tokenId).then(transaction => {
   *    console.log('your transaction was a success');
   *    //other stuff
   * }).catch(err => {
   *  if(err.message.indexOf('gas required exceeds allowance or always failing transaction'){
   *    console.log('You do not own the product you are trying to transfer')}
   * })
   *
   *
   *
   *
   * ```
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   *
   * @param {string} fromAddress blockchain address which the transfer is coming from
   * @param {string} toAddress blockchain address which the transfer is goingo to
   * @param {string} tokenId Token of  the product being transfered
   */
  async safeTransferFrom(fromAddress, toAddress, tokenId) {
    const result = await this.__deveryERC721Contract
      .safeTransferFrom(fromAddress, toAddress, tokenId);
    return result.valueOf();
  }

  /**
   *  This method creates a devery registry address for the desired contract,
   *  so the user is able to properly use the devery ERC 721 methods
   *  
   * 
   *  ***Usage example:***
   * 
   *  ```
   *  //first you need to get a {@link DeveryERC721} instance
   *  let deveryErc721Client = new DeveryERC721();
   * //now you can use it
   * 
   *  //then you have to pass the devery contract method passing the contract as a parameter
   *  deveryErc721Client.setDeveryRegistryAddress(transaction => {
   *    console.log(transaction) }).catch(err => {
   *      //treat your errors here
   *    })
   *  ```
   * @param {string} deveryRegistryContractAddres address of an deployed contract
   * @param {TransactionOptions} [overrideOptions]
   */
  async setDeveryRegistryAddress(deveryRegistryContractAddres, overrideOptions = {}){
    const result = await this.__deveryERC721Contract
      .setDeveryRegistryAddress(deveryRegistryContractAddres, overrideOptions);
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
   * deveryErc721Client.accountOwnsProduct(ownerAddres, productAddres)
   *  .then(hasProduct => console.log(hasProduct))
   *  .catch(err => {
   *    //treat errors  
   *  })
   * ```
   * 
   * @param {string} ownerAddres Blockchain address of the inspect account
   * @param {string} productAddres Blockchain addres of the checked product
   */
  async accountOwnsProduct(ownerAddres, productAddress){
    const ownedProducts = await this.__deveryERC721Contract
      .getProductsByOwner(ownerAddres);
    
    return ownedProducts.includes(productAddress)
  }
}


export default DeveryERC721;
