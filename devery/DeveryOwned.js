import AbstractDeverySmartContract from './AbstractDeverySmartContract';

/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and listen to ownership change related
 * events. Take care when you call right functions on this class, because ***unless you are the
 * contract owner you will get an exception and lose your gas.***
 *
 * @version 2
 *
 * @extends AbstractDeverySmartContract
 */
class DeveryOwned extends AbstractDeverySmartContract {
  /**
     *
     * Creates a new DeveryOwned instance.
     *
     * ***Usage example:***
     *```
     * // creates a deverOwnedClient with the default params
     * let deveryOwnedClient = new DeveryOwned();
     *
     * // creates a deveryOwnedClient pointing to a custom address
     * let deveryOwnedClient = new DeveryOwned({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
  constructor(options = {
    web3Instance: undefined, acc: undefined, address: undefined, walletPrivateKey: undefined, networkId: 1, infuraProjectKey: undefined,
  }) {
    super(...arguments);
  }


  /**
     * If for any reason the current contract owner start an onwnership transfer you can make a call to
     * this method to accept it. ***Beware that if you are are not receiving the contract ownership, you will get an
     * exception and lose your gass.***
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryOwned} instance
     * let deveryOwnedClient = new DeveryOwned();
     *
     * // then you can use it
     * deveryOwnedClient.acceptOwnership().then(function(transaction) {
     *      // congrats you are the new owner
     * }).catch(function(err) {
     *      // sorry mate I told you not to call this function unless you were about to receive the
     *      // ownership
     * })
     *
     * // optionally you can can use the async syntax
     *
     * async function foo() {
     *      try {
     *          let transactionResult = await deveryOwnedClient.acceptOwnership();
     *          // congrats you are the new owner
     *      }
     *      catch(err) {
     *          // sorry mate I told you not to call this function unless you were about to receive the
     *          // ownership
     *      }
     * }
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}
     *
     *
     * @returns {Promise.<transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
  async acceptOwnership() {
    const result = await this.__deveryRegistryContract.acceptOwnership();
    return result.valueOf();
  }


  /**
     * If you are the current contract owner (I bet you are not) you can call this method to transfer it
     * to someone else by passing the new account owner address as param. The ownership transfer will only be
     * concluded once the new contract owner do a call to {@link acceptOwnership}.
     *
     * ***Beware that if you are are not the contract owner you will get an
     * exception and lose your gas***.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryOwned} instance
     * let deveryOwnedClient = new DeveryOwned();
     *
     * // then you can use it
     * deveryOwnedClient.transferOwnership('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(function(transaction) {
     *      // you just started the contract transfer
     * }).catch(function(err) {
     *      // sorry mate I told you not to call this function unless you were the contract onwer
     * })
     *
     * // optionally you can can use the async syntax
     *
     *
     * async function foo() {
     *      try{
     *          let transactionResult = await deveryOwnedClient.transferOwnership('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *          // congrats you are the new owner
     *      }
     *      catch(err) {
     *          // sorry mate I told you not to call this function unless you were the contract owner
     *      }
     * }
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}
     *
     * @param {string} newOwnerAddress The new contract owner address.
     * @returns {Promise.<transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
  async transferOwnership(newOwnerAddress) {
    const result = await this.__deveryRegistryContract.transferOwnership(newOwnerAddress);
    return result.valueOf();
  }

  /**
     * This is a callback function that will be invoked in response to adminEvents
     *
     * @callback OwnershipEventCallback
     * @param {string} fromAddress
     * @param {string} toAddress
     */

  /**
     *
     * Listener to OwnershipTransferred events, this event triggers whenever the smart contract ownership changes.
     * Please note that OwnershipTransferredListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a OwnershipTransferredListener, just call this function passing undefined
     * as param.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryOwned} instance
     * let deveryOwnedClient = new DeveryOwned();
     * // now you can use it
     *
     * deveryOwnedClient.setOwnershipTransferredListener((fromAddress,toAddress) => {
     *      // whenever an admin is removed we will log it to the console
     *      console.log(`the ownership is being transferred from ${fromAddress} to ${toAddress}`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryOwnedClient.setOwnershipTransferredListener(undefined)
     *
     * // or that is equivalent to the above call
     *
     * deveryOwnedClient.setOwnershipTransferredListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}
     *
     * @param {OwnershipEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
  setOwnershipTransferredListener(callback) {
    const eventName = 'OwnershipTransferred';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }

  /**
     * Get the current contract owner's address.
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryOwned} instance
     * let deveryOwnedClient = new DeveryOwned();
     *
     * // then you can use it
     * deveryOwnedClient.getOwner().then(function(contractOwnerAddress) {
     *      console.log(contractOwnerAddress)
     *      //... do stuff
     * })
     *
     * // optionally you can use the async syntax
     *
     *
     * async function foo() {
     *       let contractOwnerAddress = await deveryOwnedClient.getOwner();
     *       console.log(contractOwnerAddress)
     *       //... do stuff
     * }
     * ```
     *
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}
     *
     * @returns {Promise.<string>} a promise that returns the contract owner address or raise an error in case of rejection
     */
  async getOwner() {
    const result = await this.__deveryRegistryContract.owner();
    return result.valueOf();
  }

  /**
     *
     * Get the address of the newOwner account. A value will be returned only if the account transfer is pending
     * otherwise you will get 0x00000000000000...
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryOwned} instance
     * let deveryOwnedClient = new DeveryOwned();
     *
     * // then you can use it
     * deveryOwnedClient.getNewOwner().then(function(newOwnerAddress) {
     *      console.log(newOwnerAddress)
     *      //... do stuff
     * })
     *
     * // optionally you can use the async syntax
     *
     *
     * async function foo() {
     *       let newOwnerAddress = await deveryOwnedClient.getNewOwner();
     *       console.log(newOwnerAddress)
     *       //... do stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}
     *
     * @returns {Promise.<string>} a promise that returns the new owner address or raise an error in case of rejection
     */
  async getNewOwner() {
    const result = await this.__deveryRegistryContract.newOwner();
    return result.valueOf();
  }
}

export default DeveryOwned;
