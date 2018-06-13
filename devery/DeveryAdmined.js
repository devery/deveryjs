import AbstractDeverySmartContract from './AbstractDeverySmartContract';


/**
 *
 * Main class to deal with contract administration related operations,
 * you can use it to check the current admins and listen to admin related
 * events.
 *
 * @version 2
 * @extends AbstractDeverySmartContract
 */
class DeveryAdmined extends AbstractDeverySmartContract {
  /**
     *
     * Creates a new DeveryAdmined instance.
     *
     ****Usage example:***
     *```
     * //creates a deveryAdminedClient with the default params
     * let deveryAdminedClient = new DeveryAdmined();
     *
     * //creates a deveryAdminedClient pointing to a custom address
     * let deveryAdminedCustomAddress = new DeveryAdmined({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
  constructor(options = { web3Instance: undefined, acc: undefined, address: undefined ,walletPrivateKey: undefined, networkId: undefined}) {
    super(options);
  }

  /**
     *
     * Checks if a given account is admin of the contract.
     *
     ****Usage example:***
     * ```
     * //first you need to get a {@link DeveryAdmined} instance
     * let deveryAdminedClient = new DeveryAdmined();
     * //now you can use it
     * deveryAdminedClient.isAdmin('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then( (isAdmin) =>{
     *          if(isAdmin){
     *              //continue your code here ...
     *          }
     * })
     *
     * //if your function is async you can use the await syntax too
     *
     *
     *async function(){
     *      let deveryAdminedClient = new DeveryAdmined();
     *      let isAdmin = await deveryAdminedClient.isAdmin('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      if(isAdmin){
     *          //continue your code here ...
     *      }
     *}
     *
     * ```
     *
     * for more info about how to get a {@link DeveryAdmined|DeveryAdmined instance click here}
     *
     *
     * @param addr target account address
     * @returns {Promise.<bool>} A promise that resolves to a bool indicating if the requested account
     * is admin of the contract or an Error if the promise is rejected
     */
  async isAdmin(addr) {
    const result = await this.__deveryRegistryContract.isAdmin(addr);
    return result.valueOf();
  }


  /**
     * Makes an account admin of the contract by adding it to the admin array.
     *
     * ***One important point to observe
     * is that unless you are the owner of the devery contract (what is a very unlikely condition) you will
     * get an exception and lose you gas if you do a call to this function.***
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryAdmined} instance
     * let deveryAdminedClient = new DeveryAdmined();
     * //now you can use it
     * deveryAdminedClient.addAdmin('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then( (transaction) =>{
     *          //continue your code here ...
     * });
     *
     * //if your function is async you can use the await syntax too
     *
     *
     *async function(){
     *      let deveryAdminedClient = new DeveryAdmined();
     *      let transaction = await deveryAdminedClient.addAdmin('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      //continue your code here ...
     *
     *}
     *
     * ```
     *
     * for more info about how to get a {@link DeveryAdmined|DeveryAdmined instance click here}
     *
     * @param {string} addr target account address
     * @returns {Promise.<Transaction>} A promise that resolves to a transaction or an Error if the promise is rejected
     */
  async addAdmin(addr) {
    const result = await this.__deveryRegistryContract.addAdmin(addr);
    return result.valueOf();
  }

  /**
     * Removes admin role from a given account.
     *
     * ***One important point to observe
     * is that unless you are the owner of the devery contract (what is a very unlikely condition) you will
     * get an exception and lose you gas if you do a call to this function.***
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryAdmined} instance
     * let deveryAdminedClient = new DeveryAdmined();
     * //now you can use it
     * deveryAdminedClient.removeAdmin('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then( (transaction) =>{
     *          //continue your code here ...
     * })
     *
     * //if your function is async you can use the await syntax too
     *
     *
     *async function(){
     *      let deveryAdminedClient = new DeveryAdmined();
     *      let transaction = await deveryAdminedClient.removeAdmin('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      //continue your code here ...
     *
     *
     *}
     *
     * for more info about how to get a {@link DeveryAdmined|DeveryAdmined instance click here}
     *
     * ```
     *
     * @param {string} addr target account address
     * @param {TransactionOptions} [overrideOptions] transaction options like gas price for example
     * @returns {Promise.<Transaction,Error>} A promise that resolves to a transaction or an Error if the promisse is rejected
     */
  async removeAdmin(addr, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.removeAdmin(addr, overrideOptions);
    return result.valueOf();
  }


  /**
     * This is a callback function that will be invoked in response to adminEvents
     *
     * @callback adminEventCallback
     * @param {string} address the address that was added or removed from the admin list
     * (this depends on the type of event that you are listening)
     */

  /**
     *
     * Listener to AdminAdded events, this event triggers whenever a new address is added as admin.
     * Please note that the AdminAddedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove an AdminAddedEventListeners, just call this function passing undefined
     * as param.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryAdmined} instance
     * let deveryAdminedClient = new DeveryAdmined();
     *
     *  //now you can use it
     * deveryAdminedClient.setAdminAddedEventListener((newAdminAddress) => {
     *      //whenever a new admin is added we will log it to the console
     *      console.log(newAdminAddress);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     * deveryAdminedClient.setAdminAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     * deveryAdminedClient.setAdminAddedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryAdmined|DeveryAdmined instance click here}
     *
     * @param {adminEventCallback} callback the callback that will be executed whenever and AdminAdded event is
     * triggered
     */
  setAdminAddedEventListener(callback) {
    this.__deveryRegistryContract.onadminadded = callback;
  }

  /**
     *
     * Listener to AdminRemoved events, this event triggers whenever a new address is removed from the admin list.
     * please note that the AdminRemovedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AdminRemovedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryAdmined} instance
     * let deveryAdminedClient = new DeveryAdmined();
     *
     *  //now you can use it
     * deveryAdminedClient.setAdminAddedEventListener((newAdminAddress) => {
     *      //whenever an admin is removed we will log it to the console
     *      console.log(newAdminAddress);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     * deveryAdminedClient.setAdminRemovedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     * deveryAdminedClient.setAdminRemovedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryAdmined|DeveryAdmined instance click here}
     *
     * @param {adminEventCallback} callback the callback that will be executed whenever and AdminRemoved event is
     * triggered
     */
  setAdminRemovedEventListener(callback) {
    this.__deveryRegistryContract.onadminremoved = callback;
  }
}

export default DeveryAdmined;
