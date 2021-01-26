import AbstractDeverySmartContract from './AbstractDeverySmartContract';

if ((typeof process !== 'undefined') && (process.release) && (process.release.name === 'node')) {
  // eslint-disable-next-line global-require
  global.fetch = require('cross-fetch');
}

/**
 *
 * DeveryRegistry is the main class to interact with the devery registry. With it you have all the tools
 * that you need to create aps, brands and products. You can use it to mark and check your products and to listen and
 * respond to our protocol events.
 *
 *
 *
 *
 * DeveryRegistry Smart Contract Design:
 *
 *
 * ```
 * # Devery Protocol Contracts
 *
 *
 * Mainnet Address: {@link https://etherscan.io/address/0x0364a98148b7031451e79b93449b20090d79702a|0x0364a98148b7031451e79b93449b20090d79702a}
 *
 * ## DeveryRegistry Smart Contract Design ##
 * mapping(appAccount => App[address appAccount, string appName, address feeAccount, uint fee, bool active]) apps`
 * mapping(brandAccount => Brand[address brandAccount, address appAccount, string brandName, bool active]) brands`
 * mapping(productAccount => Product[address productAccount, address brandAccount, string description, string details, uint year, string origin, bool active]) products`
 * mapping(sha3(itemPublicKey) => productAccount) markings`
 * mapping(markerAccount => (brandAccount => permission)) permissions`
 *
 *
 * ## Functions
 *
 * ## App Accounts
 *
 * An account can add itself as an ***App*** account using `addApp(string appName, address feeAccount)`
 * An account can update it's ***App*** account data using `updateApp(string appName, address feeAccount, bool active)`
 *
 *
 *
 * ### Brand Accounts
 *
 * An ***App*** account can add ***Brand*** accounts using `addBrand(address brandAccount, string brandName)`
 * An ***App*** account can update it's ***Brand*** account data using `updateBrand(address brandAccount, string brandName, bool active)`
 *
 *
 *
 * ### Product Accounts
 *
 * A ***Brand*** account can add ***Product*** accounts using `addProduct(address productAccount, string description, string details, uint year, string origin)`
 * A ***Brand*** account can update it's ***Product*** account data using `updateProduct(address productAccount, string description, string details, uint year, string origin, bool active)`
 *
 *
 *
 * ### Permissions
 *
 * A ***Brand*** account can add ***Marker*** accounts using `permissionMarker(address marker, bool permission)`
 *
 *
 *
 * ### Marking
 *
 * A ***Marker*** account can add the hash of an ***Item***'s public key using `mark(address productAccount, bytes32 itemHash)`. The `productAccount` is the
 *type of ***Product*** the ***Item*** is.
 *
 *
 *
 * ## Checking
 *
 * Anyone can check the validity of an ***Item***'s public key using `check(address item)`
 *
 *
 * ```
 * @version 1
 * @extends AbstractDeverySmartContract
 */
class DeveryRegistry extends AbstractDeverySmartContract {
  /**
     *
     * Creates a new DeveryRegistry instance.
     *
     * ***Usage example:***
     *```
     * // creates a deveryRegistryClient with the default params
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * // creates a deveryRegistryClient pointing to a custom address
     * let deveryRegistryClient = new DeveryRegistry({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
  constructor(options = {
    web3Instance: undefined, acc: undefined, address: undefined, walletPrivateKey: undefined, networkId: undefined, walletPrivateKey: undefined,
  }) {
    super(options);
    try {
      fetch('https://us-central1-devery-mobile.cloudfunctions.net/incrementCount');
    } catch (e) {
      console.error('it was not possible to call fetch and increase the counter');
    }
  }

  /** ********************APP RELATED METHOD************************************* */

  /**
     * @typedef {Object} App
     * Holds app related data
     * @property {bool} active
     * @property {string} appAccount
     * @property {string} appName
     * @property {BigNumber} fee
     * @property {string} feeAccount
     */

  /**
     * @typedef {Object} AppData
     * Holds app related data
     * @property {bool} active
     * @property {BigNumber} _fee
     * @property {string} _feeAccount
     */


  /**
     * @typedef {Object} Brand
     * Holds app related data
     * @property {string} brandAccount
     * @property {string} appAccount
     * @property {string} brandName
     * @property {bool} active
     */

  /**
     * @typedef {Object} BrandData
     * Holds Brand related data
     * @property {string} appAccount
     * @property {string} appFeeAccount
     * @property {bool} active
     */

  /**
     * @typedef {Object} Product
     * Holds Product related data
     * @property {string} productAccount
     * @property {string} brandAccount
     * @property {string} description
     * @property {string} details
     * @property {BigNumber} year
     * @property {string} origin
     * @property {bool} active
     */

  /**
     * @typedef {Object} ProductData
     * Holds Product related data
     * @property {String} brandAccount
     * @property {string} appAccount
     * @property {string} appFeeAccount
     * @property {bool} active
     */

  /**
     *
     * Creates a new app in the blockchain, each account can have only one account so if your account already
     * have an app you must call {@link updateApp} to change its details. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     *
     * ***Usage example:***
     *```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.addApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5).then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')) {
     *          console.log('The user denied the transaction');
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try{
     *          let transaction = await deveryRegistryClient.addApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5);
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *          // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} appName your app name
     * @param {string} feeAccount the account that will pay the fees for this app transactions
     * @param {int} fee the fee amount paid per app transaction
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
  async addApp(appName, feeAccount, fee, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .addApp(appName, feeAccount, fee, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#addApp|DeveryRegistry.addApp}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#addApp|DeveryRegistry.addApp}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#addApp|DeveryRegistry.addApp} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#addApp|DeveryRegistry.addApp} would be
   * a valid call
   *   @param {string} appName your app name
   * @param {string} feeAccount the account that will pay the fees for this app transactions
   * @param {int} fee the fee amount paid per app transaction
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#addApp|DeveryRegistry.addApp} with the given parameters
   */
  async estimateAddApp(appName, feeAccount, fee, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .addApp(appName, feeAccount, fee, overrideOptions);
    return result.toNumber();
  }


  /**
     *
     * Updates an existing app in the blockchain. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     *
     * ***Usage example:***
     *```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.updateApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5,true).then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')) {
     *          console.log('The user denied the transaction')
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let transaction = await deveryRegistryClient.updateApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5,true);
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *          // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string}  appName your app name
     * @param {string} feeAccount the account that will pay the fees for this app transactions
     * @param {int} fee the fee amount paid per app transaction
     * @param {boolean} active
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
  async updateApp(appName, feeAccount, fee, active, overrideOptions = {}) {
    return await this.__deveryRegistryContract
      .updateApp(appName, feeAccount, fee, active, overrideOptions);
  }


  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#updateApp|DeveryRegistry.updateApp}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#updateApp|DeveryRegistry.updateApp}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#updateApp|DeveryRegistry.updateApp} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#updateApp|DeveryRegistry.updateApp} would be
   * a valid call
   *
   * @param {string}  appName your app name
   * @param {string} feeAccount the account that will pay the fees for this app transactions
   * @param {int} fee the fee amount paid per app transaction
   * @param {boolean} active
   * @param {TransactionOptions} overrideOptions gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#updateApp|DeveryRegistry.updateApp} with the given parameters
   */
  async estimateUpdateApp(appName, feeAccount, fee, active, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .estimate.updateApp(appName, feeAccount, fee, active, overrideOptions);
    return result.toNumber();
  }


  /**
     *
     * Returns the app with the given address. If the requested app account does not exist
     * then and empty account is returned.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(app => {
     *      if(app.active) {
     *          console.log(app.appName);
     *          //... other stuff
     *      }
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      let app = await deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      if(app.active) {
     *          console.log(app.appName);
     *          //... other stuff
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link App|App you can click here to check its fields}
     *
     * @param {string} appAccount address of the request
     * @returns {Promise.<App>} a promisse that returns an {@link App} if it resolves or an error in case of rejection
     */
  async getApp(appAccount) {
    const result = await this.__deveryRegistryContract.apps(appAccount);
    return result.valueOf();
  }


  /**
     *
     * Returns the app data for the given address. If the requested app account does not exist
     * then an empty app data is returned.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getAppData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(app => {
     *      if(app.active) {
     *          console.log(app._appAccount);
     *          //... other stuff
     *      }
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      let app = await deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      if(app.active) {
     *          console.log(app._appAccount);
     *          //... other stuff
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link AppData|AppData you can click here to check its fields}
     *
     * @param {string} appAccount address of the request
     * @returns {Promise.<AppData>} a promise that returns an {@link AppData} if it resolves or an error in case of rejection
     */
  async getAppData(appAccount) {
    const result = await this.__deveryRegistryContract.getAppData(appAccount);
    return result.valueOf();
  }

  /**
     *
     * Returns an array of account addresses from the appAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promise that resolves to an empty array as result.
     * Parameters `page` and `pageSize` are optional.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsPaginated(0,20).then(addressArr => {
     *     for(let address of addressArr){
     *          console.log(address);
     *     }
     * })
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      // here we don't pass any param to appAccountsPaginated
     *      // because these parameters are optional
     *      let addressArr = await deveryRegistryClient.appAccountsPaginated();
     *      for(let address of addressArr) {
     *          console.log(address);
     *      }
     *
     *      //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} [page=0] the requested page. This parameter is optional, the default value to it is 0.
     * @param {int} [pagesize=10] the requested page size. This parameter is optional, the default value to it is 10.
     * @returns {Promise.<string[]>} a promise that returns an array of app addresses if it resolves or an error in case of rejection
     */
  async appAccountsPaginated(page = 0, pagesize = 10) {
    const size = await this.appAccountsLength();
    const appAdressPromisse = [];
    for (let i = page * pagesize; i < (page + 1) * pagesize && i < size; i += 1) {
      appAdressPromisse.push(this.appAccountsArray(i));
    }

    return Promise.all(appAdressPromisse);
  }

  /**
     *
     * Returns an account address from the appAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsArray(4).then(address => {
     *     deveryClient.getApp(address).then(app => {
     *          console.log(app.appName);
     *          //... do more stuff
     *     })
     * }).catch(err => {
     *      console.log('index ot of bounds');
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let accountAddress = await deveryRegistryClient.appAccountsArray(4);
     *          let app = await deveryRegistryClient.getApp(accountAddress);
     *          if(app.active) {
     *              console.log(app.appName);
     *              //... other stuff
     *          }
     *
     *      }
     *      catch(err) {
     *          console.log('index ot of bounds');
     *      }
     *
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} index the account index inside the appAccounts array
     * @returns {Promise.<string>} a promise that returns an account app address if it resolves or an error in case of rejection
     */
  async appAccountsArray(index) {
    const result = await this.__deveryRegistryContract.appAccounts(index);
    return result.valueOf();
  }


  /**
     *
     * Returns the total count of app accounts registered on the smart contract. This method is particularly useful
     * to be used in conjunction with {@link appAccountsArray} because you can verify the array upper bounds.
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsLength().then(totalAccounts => {
     *     for(let i = 0;i< totalAccounts;i++) {
     *          deveryRegistryClient.appAccountsArray(i).then(address => {
     *              deveryClient.getApp(address).then(app => {
     *                  console.log(app.appName);
     *                  //... do more stuff
     *              })
     *           })
     *      }
     * })
     *
     * // optionally you can use the async syntax if you prefer
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @returns {Promise.<int>} a promise that returns the total accounts registered in the smart contract if it
     * resolves or an error in case of rejection
     */
  async appAccountsLength() {
    const result = await this.__deveryRegistryContract.appAccountsLength();
    return result.toNumber();
  }


  /**
     * This is a callback function that will be invoked in response to appEvents
     *
     *
     * @callback AppEventCallback
     * @param {string} appAccount
     * @param {string} appName
     * @param {string} feeAccount
     * @param {int} fee
     * @param {bool} active
     *
     */

  /**
     *
     * Listener to AppAdded events, this event triggers whenever a new devery app is created in the blockchain.
     * Please note, that AppAddedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove an AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     *
     * DeveryRegistryClient.setAppAddedEventListener((appAccount,appName,feeAccount,fee,active) => {
     *      // whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * DeveryRegistryClient.setAppAddedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * DeveryRegistryClient.setAppAddedEventListener();
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {AppEventCallback} callback the callback that will be executed whenever and AppAdded event is
     * triggered
     */
  setAppAddedEventListener(callback) {
    const eventName = 'AppAdded';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }


  /**
     *
     * Listener to AppUpdated events, this event triggers whenever an existing devery app is updated in the blockchain.
     * Please note, that AppUpdatedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove an AppUpdatedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     *
     *
     * DeveryRegistryClient.setUpdatedEventListener((appAccount,appName,feeAccount,fee,active) => {
     *      // whenever an app gets updated we will log it to the console
     *      console.log(`an App has been updated ${appAccount} - ${appName} - ${active} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * DeveryRegistryClient.setAppUpdatedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * DeveryRegistryClient.setAppUpdatedEventListener();
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {AppEventCallback} callback the callback that will be executed whenever and AppUpdated event is
     * triggered
     */
  setAppUpdatedEventListener(callback) {
    const eventName = 'AppUpdated';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }


  /** ********************Brand RELATED METHOD************************************* */


  /**
     *
     * Creates a new brand in the blockchain. Only one brand can exist per account key so keep in mind that.
     * If you try to create more than one brand in the same brand account then you will get an exception.
     *
     * This is a write method, so you will need to
     * provide some gas to run it. Plus keep in mind that your environment needs to have access to a signer, so
     * make sure that your user have access to Metamask or other web3 object.
     *
     *
     * ***Usage example:***
     *```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.addBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name").then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')){
     *          console.log('The user denied the transaction');
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let transaction = await deveryRegistryClient.addBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name");
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *          // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} brandAccount brand account address
     * @param {string} brandName the name of the new brand
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
  async addBrand(brandAccount, brandName, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .addBrand(brandAccount, brandName, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#addBrand|DeveryRegistry.addBrand}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#addBrand|DeveryRegistry.addBrand}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#addBrand|DeveryRegistry.addBrand} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#addBrand|DeveryRegistry.addBrand} would be
   * a valid call
   *
   * @param {string} brandAccount brand account address
   * @param {string} brandName the name of the new brand
   * @param {TransactionOptions} overrideOptions gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#addBrand|DeveryRegistry.addBrand} with the given parameters
   */
  async estimateAddBrand(brandAccount, brandName, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .addBrand(brandAccount, brandName, overrideOptions);
    return result.toNumber();
  }

  /**
     *
     * Updates an existing brand in the blockchain. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     * ***Usage example:***
     *
     *```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.updateBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name",true).then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')) {
     *          console.log('The user denied the transaction');
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let transaction = await deveryRegistryClient.updateBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name",true);
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *          // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} brandAccount brand account address
     * @param {string} brandName the name of the new brand
     * @param {boolean} active
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
  async updateBrand(brandAccount, brandName, active, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .updateBrand(brandAccount, brandName, active, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#updateBrand|DeveryRegistry.updateBrand}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#updateBrand|DeveryRegistry.updateBrand}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#updateBrand|DeveryRegistry.updateBrand} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#updateBrand|DeveryRegistry.updateBrand} would be
   * a valid call
   *
   * @param {string} brandAccount brand account address
   * @param {string} brandName the name of the new brand
   * @param {boolean} active
   * @param {TransactionOptions} overrideOptions gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#updateBrand|DeveryRegistry.updateBrand} with the given parameters
   */
  async estimateUpdateBrand(brandAccount, brandName, active, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .updateBrand(brandAccount, brandName, active, overrideOptions);
    return result.toNumber();
  }


  /**
     *
     * Returns the app with the given address. If the requested app account does not exist
     * then and empty account is returned.
     *
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getBrand('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(brand => {
     *      if(brand.active) {
     *          console.log(brand);
     *          //... other stuff
     *      }
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      let brand = await deveryRegistryClient.getBrand('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      if(brand.active) {
     *          console.log(brand);
     *          //... other stuff
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link Brand|Brand you can click here to check its fields}
     *
     * @param {string} brandAccount address of the brand account
     * @returns {Promise.<Brand>} a promise that returns a {@link Brand} if it resolves or an error in case of rejection
     */
  async getBrand(brandAccount) {
    const result = await this.__deveryRegistryContract.brands(brandAccount);
    return result.valueOf();
  }

  /**
     *
     * Returns the brand data for the given address. If the requested Brand account does not exist
     * then and empty data is returned.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getBrandData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(brandData => {
     *      console.log(brandData.appFeeAccount);
     *      //... other stuff
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      let brandData = await deveryRegistryClient.getBrandData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      console.log(brandData.appFeeAccount);
     *      //... other stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link BrandData|BrandData you can click here to check its fields}
     *
     * @param {string} brandAccount address of the brand account.
     * @returns {Promise.<BrandData>} a promise that returns an {@link BrandData} if it resolves or an error in case of rejection
     */
  async getBrandData(brandAccount) {
    const result = await this.__deveryRegistryContract.getBrandData(brandAccount);
    return result.valueOf();
  }

  /**
     *
     * Returns an array of brand account addresses from the brandAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promise that resolves to an empty array as result.
     * These parameters `page` and `pagesize` are optional.
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.brandAccountsPaginated(0,20).then(addressArr => {
     *     for(let address of addressArr) {
     *          console.log(address);
     *     }
     * })
     *
     * // or with the async syntax
     *
     * async function foo() {
     *
     *      // here we don't pass any param to brandAccountsPaginated
     *      // because its parameters are optional
     *      let addressArr = await deveryRegistryClient.brandAccountsPaginated();
     *      for(let address of addressArr) {
     *          console.log(address);
     *      }
     *
     *      //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} [page=0] the requested page. This parameter is optional, the default value to it is 0.
     * @param {int} [pagesize=10] the requested page size. This parameter is optional, the default value to it is 10.
     * @returns {Promise.<string[]>} a promise that returns an array of brand addresses if it resolves or an error in case of rejection
     */
  async brandAccountsPaginated(page = 0, pagesize = 10) {
    const size = await this.brandAccountsLength();
    const appAdressPromisse = [];
    for (let i = page * pagesize; i < (page + 1) * pagesize && i < size; i += 1) {
      appAdressPromisse.push(this.brandAccountsArray(i));
    }

    return Promise.all(appAdressPromisse);
  }

  /**
     *
     * Returns a brand account address from the brandAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.brandAccountsArray(4).then(address => {
     *     deveryClient.getBrand(address).then(brand => {
     *          console.log(brand.brandName);
     *          //... do more stuff
     *     })
     * }).catch(err => {
     *      console.log('index ot of bounds');
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let accountAddress = await deveryRegistryClient.brandAccountsArray(4);
     *          let brand = await deveryRegistryClient.getBrand(accountAddress);
     *          console.log(brand.brandName);
     *          //... do more stuff
     *      }
     *      catch(err) {
     *          console.log('index ot of bounds');
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {int} index the account index inside the appAccounts array.
     * @returns {Promise.<string>} a promise that returns a brand app address if it resolves or an error in case of rejection.
     */
  async brandAccountsArray(index) {
    const result = await this.__deveryRegistryContract.brandAccounts(index);
    return result.valueOf();
  }

  /**
     *
     * Returns the total count of brand accounts registered on the smart contract. This method is particularly useful
     * in conjunction with {@link brandAccountsArray} because you can verify the array upper bounds.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.brandAccountsLength().then(totalAccounts => {
     *     for(let i = 0;i< totalAccounts;i++) {
     *          deveryRegistryClient.brandAccountsArray(i).then(address => {
     *              deveryRegistryClient.getBrand(address).then(brand => {
     *                  console.log(brand.brandName);
     *                   //... do more stuff
     *              })
     *           })
     *      }
     * })
     *
     * // optionally you can use the async syntax if you prefer
     * const totalAccounts = await deveryRegistryClient.brandAccountsLength();
     * for(let i = 0; i < totalAccounts; i++) {
     *     const address = await deveryRegistryClient.brandAccountsArray(i);
     *     const brand = await deveryRegistryClient.getBrand(address);
     *     console.log(brand.brandName);
     *     //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @returns {Promise.<int>} a promise that returns the total brand accounts registered in the smart contract if it
     * resolves or an error in case of rejection
     */
  async brandAccountsLength() {
    const result = await this.__deveryRegistryContract.brandAccountsLength();
    return result.toNumber();
  }


  /**
     * This is a callback function that will be invoked in response to BrandEvents
     *
     * @callback BrandEventCallback
     * @param {string} brandAccount brand account address.
     * @param {string} appAccount application account address.
     * @param {string} active
     *
     */


  /**
     *
     * Listener to BrandAdded events. This event triggers whenever a new devery brand is added on blockchain.
     * Please note that BrandAddedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a BrandAddedEventListener, just call this function passing undefined
     * as param.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     *
     * DeveryRegistryClient.setBrandAddedEventListener((brandAccount,appAccount,active) => {
     *      // whenever a brand added we will log it to the console
     *      console.log(`new brand has been added ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * DeveryRegistryClient.setBrandAddedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * DeveryRegistryClient.setBrandAddedEventListener();
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {BrandEventCallback} callback the callback that will be executed whenever and BrandAdded event is
     * triggered
     */
  setBrandAddedEventListener(callback) {
    const eventName = 'BrandAdded';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }

  /**
     *
     * Listener to BrandUpdated events. This event triggers whenever an existing brand is updated in the blockchain.
     * Please note that BrandUpdatedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a BrandUpdatedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     *
     * deveryRegistryClient.setBrandUpdatedEventListener((brandAccount,appAccount,active) => {
     *      // whenever a brand updated we will log it to the console
     *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setBrandUpdatedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * deveryRegistryClient.setBrandUpdatedEventListener();
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {BrandEventCallback} callback the callback that will be executed whenever a BrandUpdated event is
     * triggered
     */
  setBrandUpdatedEventListener(callback) {
    const eventName = 'BrandUpdated';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }


  /** ********************PRODUCTS RELATED METHODS************************************* */


  /**
     *
     * Creates a new Product in the blockchain. This is a write method, so you will need to
     * provide some gas to run it. Plus keep in mind that your environment needs to have access to a signer, so
     * make sure that you user have access to Metamask or other web3 object.
     *
     *
     * ***Usage example:***
     *
     *```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.addProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product','batch 001',2018,'Unknown place').then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')) {
     *          console.log('The user denied the transaction');
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let transaction = await deveryRegistryClient.addProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product','batch 001',2018,'Unknown place');
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *      // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} productAccount product account address
     * @param {string} description your product name and description
     * @param {string} details any extra details about your product
     * @param {int} year product's year of production
     * @param {string} origin information about the product origin
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns a transaction or raise an error in case
     * of rejection
     */
  async addProduct(productAccount, description, details, year, origin, overrideOptions = {}) {
    const productCheck = await this.getProduct(productAccount);
    if (productCheck.productAccount.toLowerCase() != '0x0000000000000000000000000000000000000000') {
      throw new Error(`the product that you're trying to mark already exists ${productCheck}`);
    }
    const result = await this.__deveryRegistryContract
      .addProduct(productAccount, description, details, year, origin, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#addProduct|DeveryRegistry.addProduct}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#addProduct|DeveryRegistry.addProduct}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#addProduct|DeveryRegistry.addProduct} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#addProduct|DeveryRegistry.addProduct} would be
   * a valid call
   *
   * @param {string} productAccount product account address
   * @param {string} description your product name and description
   * @param {string} details any extra details about your product
   * @param {int} year product's year of production
   * @param {string} origin information about the product origin
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#addProduct|DeveryRegistry.addProduct} with the given parameters
   */
  async estimateAddProduct(productAccount, description, details, year, origin, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .addProduct(productAccount, description, details, year, origin, overrideOptions);
    return result.toNumber();
  }


  /**
     *
     * Updates an existing Product in the blockchain. This is a write method, so you will need to
     * provide some gas to run it. Plus keep in mind that your environment needs to have access to a signer, so
     * make sure that your user have access to Metamask or other web3 object.
     *
     * ***Usage example:***
     *```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.updateProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product'
     *      ,'batch 001',2018,'Unknown place',true).then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')) {
     *          console.log('The user denied the transaction');
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let transaction = await deveryRegistryClient.updateProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product'
     *                                                          ,'batch 001',2018,'Unknown place',true);
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *      // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} productAccount product account address
     * @param {string} description your product name and description
     * @param {string} details any extra details about your product
     * @param {int} year product's year of production
     * @param {string} origin information about the product origin
     * @param {boolean} active enables or disable the product
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns a transaction or raise an error in case
     * of rejection
     */
  async updateProduct(productAccount, description, details, year, origin, active, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .updateProduct(productAccount, description, details, year, origin, active, overrideOptions);
    return result.valueOf();
  }


  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#updateProduct|DeveryRegistry.updateProduct}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#updateProduct|DeveryRegistry.updateProduct}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#updateProduct|DeveryRegistry.updateProduct} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#updateProduct|DeveryRegistry.updateProduct} would be
   * a valid call
   *
   * @param {string} productAccount product account address
   * @param {string} description your product name and description
   * @param {string} details any extra details about your product
   * @param {int} year product's year of production
   * @param {string} origin information about the product origin
   * @param {boolean} active enables or disable the product
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#updateProduct|DeveryRegistry.updateProduct} with the given parameters
   */
  async estimateUpdateProduct(productAccount, description, details, year, origin, active, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .updateProduct(productAccount, description, details, year, origin, active, overrideOptions);
    return result.toNumber();
  }

  /**
     *
     * Returns the Product with the given address. If the requested Product account does not exist
     * then you will receive an object with default data.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getProduct('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(product => {
     *      if(product.active) {
     *          console.log(product.details);
     *          //... other stuff
     *      }
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      let product = await deveryRegistryClient.getProduct('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      if(product.active) {
     *          console.log(product.details);
     *          //... other stuff
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link Product|Product you can click here to check its fields}
     *
     * @param {string} productAccount address of the product account.
     * @returns {Promise.<Product>} a promise that returns a {@link Product} if it resolves or an error in case of rejection
     */
  async getProduct(productAccount) {
    const result = await this.__deveryRegistryContract.products(productAccount);
    return result.valueOf();
  }


  /**
     *
     * Returns the Product data for the given address. If the requested Product account does not exist
     * then and empty data is returned.
     *
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getProductData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(productData => {
     *      console.log(productData.brandAccount);
     *      //... other stuff
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      let productData = await deveryRegistryClient.getProductData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732');
     *      console.log(productData.brandAccount);
     *      //... other stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link ProductData|ProductData you can click here to check its fields}
     *
     * @param {string} productAccount address of the product account.
     * @returns {Promise.<ProductData>} a promise that returns an {@link ProductData} if it resolves or an error in case of rejection
     */
  async getProductData(productAccount) {
    const result = await this.__deveryRegistryContract.getProductData(productAccount);
    return result.valueOf();
  }

  /**
     *
     * Returns an array of product addresses from the productAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promise that resolves to an empty array as result.
     * The parameters `page` and `pagesize` are optional.
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.productAccountsPaginated(0,20).then(addressArr => {
     *     for(let address of addressArr) {
     *          console.log(address);
     *     }
     * })
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      // here we don't pass any param to productAccountsPaginated
     *      // because its parameters are optional
     *      let addressArr = await deveryRegistryClient.productAccountsPaginated();
     *      for(let address of addressArr) {
     *          console.log(address);
     *      }
     *
     *      //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} page the requested page. This parameter is optional, the default value to it is 0.
     * @param {int} pagesize the requested page size. This parameter is optional, the default value to it is 10.
     * @returns {Promise.<string[]>} a promise that returns an array of product addresses if it resolves or an error in case of rejection
     */
  async productAccountsPaginated(page = 0, pagesize = 10) {
    const size = await this.productAccountsLength();
    const appAdressPromisse = [];
    for (let i = page * pagesize; i < (page + 1) * pagesize && i < size; i += 1) {
      appAdressPromisse.push(this.productAccountsArray(i));
    }

    return Promise.all(appAdressPromisse);
  }


  /**
     *
     * Returns a Product account address from the productAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.productAccountsArray(4).then(address => {
     *     deveryClient.getProduct(address).then(product => {
     *          console.log(product.productDescription);
     *          //... do more stuff
     *     })
     * }).catch(err => {
     *      console.log('index ot of bounds');
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          let productAddress = await deveryRegistryClient.productAccountsArray(4);
     *          let product = await deveryRegistryClient.getProduct(productAddress);
     *          console.log(product.productDescription);
     *          //... do more stuff
     *      }
     *      catch(err) {
     *          console.log('index ot of bounds');
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {int} index the account index inside the productAccounts array.
     * @returns {Promise.<string>} a promise that returns a product address if it resolves or an error in case of rejection.
     */
  async productAccountsArray(index) {
    const result = await this.__deveryRegistryContract.productAccounts(index);
    return result.valueOf();
  }


  /**
     *
     * Returns the total count of product accounts registered on the smart contract. This method is particularly useful
     * to be used in conjunction with {@link productAccountsArray} because you can verify the array upper bounds.
     *
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.productAccountsLength().then(totalProducts => {
     *     for(let i = 0;i< totalProducts;i++) {
     *          deveryRegistryClient.productAccountsArray(i).then(address => {
     *              deveryRegistryClient.getProduct(address).then(product => {
     *                  console.log(product.productDescription);
     *                   //... do more stuff
     *              })
     *           })
     *      }
     * })
     *
     * // optionally you can use the async syntax if you prefer
     * const totalProducts = await deveryRegistryClient.productAccountsLength();
     * for(let i = 0; i < totalProducts; i++) {
     *     const address = await deveryRegistryClient.productAccountsArray(i);
     *     const product = await deveryRegistryClient.getProduct(address);
     *     console.log(product.productDescription);
     *     //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @returns {Promise.<int>} a promise that returns the total count of product accounts registered in the smart contract if it
     * resolves or an error in case of rejection
     */
  async productAccountsLength() {
    const result = await this.__deveryRegistryContract.productAccountsLength();
    return result.toNumber();
  }


  /**
     * This is a callback function that will be invoked in response to ProductEvents
     *
     * @callback ProductEventCallback
     * @param {string} productAccount product account address.
     * @param {string} brandAccount brand account address.
     * @param {string} appAccount application account address.
     * @param {string} description description.
     * @param {boolean} active
     *
     */


  /**
     *
     * Listener to productAdded events. This event triggers whenever a new product is created in the blockchain.
     * Please note that ProductAddedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a ProductAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     *
     * deveryRegistryClient.setProductAddedEventListener((productAccount,brandAccount,appAccount,description,active) => {
     *      // whenever a product created we will log it to the console
     *      console.log(`a product has been added ${productAccount} - ${brandAccount} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     * deveryRegistryClient.setProductAddedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     * deveryRegistryClient.setProductAddedEventListener();
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {ProductEventCallback} callback the callback that will be executed whenever a ProductAdded event is
     * triggered
     */
  setProductAddedEventListener(callback) {
    const eventName = 'ProductAdded';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }


  /**
     *
     * Listener to productUpdated events. This event triggers whenever a product is updated in the blockchain.
     * Please note that ProductUpdatedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a ProductUpdatedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     * deveryRegistryClient.setProductUpdatedEventListener((productAccount,brandAccount,appAccount,description,active) => {
     *      //whenever a product updated we will log it to the console
     *      console.log(`a product has been updated ${productAccount} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setProductUpdatedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * deveryRegistryClient.setProductUpdatedEventListener();
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {ProductEventCallback} callback the callback that will be executed whenever a ProductUpdated event is
     * triggered
     */
  setProductUpdatedEventListener(callback) {
    const eventName = 'ProductUpdated';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }


  /** ********************MARKER RELATED METHODS************************************* */


  /**
     *
     * Adds or removes permission from an account to mark items in the blockchain.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * // passing true as param will add the account as marker
     * deveryRegistryClient.permissionMarker('0x627306090abaB3A6e1400e9345bC60c78a8BEf57',true).then(transaction => {
     *      console.log('transaction address',transaction.hash);
     *      //... other stuff
     * }).catch(err => {
     *      if(err.message.indexOf('User denied')) {
     *          console.log('The user denied the transaction');
     *          //...
     *      }
     *
     *      // handle other exceptions here
     *
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          // passing false as param will remove the account as marker
     *          let transaction = await deveryRegistryClient.permissionMarker('0x627306090abaB3A6e1400e9345bC60c78a8BEf57',false);
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')) {
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *          // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} marker The marker account whose permission will be set
     * @param {boolean} permission add or remove permission flag
     * @param {TransactionOptions} [overrideOptions] transaction gas options to override.
     * @returns {Promise.<Transaction>} a promise that if resolved returns a transaction or raise an error in case of rejection.
     */
  async permissionMarker(marker, permission, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .permissionMarker(marker, permission, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#permissionMarker|DeveryRegistry.permissionMarker}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#permissionMarker|DeveryRegistry.permissionMarker}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#permissionMarker|DeveryRegistry.permissionMarker} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#permissionMarker|DeveryRegistry.permissionMarker} would be
   * a valid call
   *
   * @param {string} marker The marker account whose permission will be set
   * @param {boolean} permission add or remove permission flag
   * @param {TransactionOptions} [overrideOptions] transaction gas options to override.
   *
   * @returns total gas used to call {@link DeveryRegistry#permissionMarker|DeveryRegistry.permissionMarker} with the given parameters
   */
  async estimatePermissionMarker(marker, permission, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .permissionMarker(marker, permission, overrideOptions);
    return result.toNumber();
  }


  /**
     *
     * Compute item hash from the public key. You will need this hash to mark your products.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.addressHash('0x627306090abaB3A6e1400e9345bC60c78a8BEf57').then(hash => {
     *      // use the hash to mark the item
     *      //... other stuff
     * })
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} item address to compute hash.
     * @returns {Promise.<Transaction>} a promise that if resolved returns a transaction or raise an error in case of rejection.
     */
  async addressHash(item) {
    const result = await this.__deveryRegistryContract.addressHash(item);
    return result.valueOf();
  }


  /**
     *
     * Marks an item in the blockchain. ***you need to pre calculate the item hash before calling this method***
     *
     *  ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * const address = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
     * deveryRegistryClient.addressHash(address).then(hash => {
     *     deveryRegistryClient.mark(address,hash).then(transaction => {
     *         console.log('transaction address',transaction.hash);
     *         //... other stuff
     *     }).catch(err => {
     *         if(err.message.indexOf('User denied')) {
     *             console.log('The user denied the transaction');
     *             //...
     *         }
     *         // handle other exceptions here
     *     }
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *      try {
     *          const address = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
     *          const hash = await deveryRegistryClient.addressHash(address);
     *          let transaction = await deveryRegistryClient.mark(address,hash);
     *          console.log('transaction address',transaction.hash);
     *      }
     *      catch(err) {
     *          if(err.message.indexOf('User denied')){
     *               console.log('The user denied the transaction');
     *              //...
     *          }
     *
     *      // handle other exceptions here
     *      }
     *
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} productAccount product account address.
     * @param {string} itemHash item hash
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case of rejection.
     */
  async mark(productAccount, itemHash, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract
      .mark(productAccount, itemHash, overrideOptions);
    return result.valueOf();
  }


  /**
   * This method gives an estimation of how much gas will be used for the method {@link DeveryRegistry#mark|DeveryRegistry.mark}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link DeveryRegistry#mark|DeveryRegistry.mark}.
   * the return of this method will be the total gas used to call {@link DeveryRegistry#mark|DeveryRegistry.mark} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link DeveryRegistry#mark|DeveryRegistry.mark} would be
   * a valid call
   *
   * @param {string} productAccount product account address.
   * @param {string} itemHash item hash
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   *
   * @returns total gas used to call {@link DeveryRegistry#mark|DeveryRegistry.mark} with the given parameters
   */
  async estimateMark(productAccount, itemHash, overrideOptions = {}) {
    const result = await this.__deveryRegistryContract.estimate
      .mark(productAccount, itemHash, overrideOptions);
    return result.toNumber();
  }


  /**
   *
   * Creates a new Product in the blockchain and automatically mark it.
   * Calling `addProduct` and `mark` separately will have the same result, this is just a wrapper that does both calls on your behalf,
   * that means that once you call this method you will see 2 transactions (1 for add product and 1 for mark).
   * This is a write method so you will need to
   * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
   * make sure that your user have access to metamask or other web3 object.
   *
   *
   * ***Usage example:***
   *
   *```
   * // first you need to get a {@link DeveryRegistry} instance
   * let deveryRegistryClient = new DeveryRegistry();
   *
   *
   * deveryRegistryClient.AddProductAndMark('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product','batch 001',2018,'Unknown place').then(transaction => {
   *      console.log('transaction address',transaction.hash);
   *      //... other stuff
   * }).catch(err => {
   *      if(err.message.indexOf('User denied')) {
   *          console.log('The user denied the transaction');
   *          //...
   *      }
   *
   *      // handle other exceptions here
   *
   * })
   *
   *
   * // or with the async syntax
   *
   * async function foo() {
   *      try {
   *          let transaction = await deveryRegistryClient.AddProductAndMark('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product','batch 001',2018,'Unknown place');
   *          console.log('transaction address',transaction.hash);
   *      }
   *      catch(err) {
   *          if(err.message.indexOf('User denied')){
   *               console.log('The user denied the transaction');
   *              //...
   *          }
   *
   *          // handle other exceptions here
   *      }
   *
   * }
   *
   * ```
   *
   *
   * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
   *
   * @param {string} productAccount product account address
   * @param {string} description your product name and description
   * @param {string} details any extra details about your product
   * @param {int} year year of the product production
   * @param {string} origin information about the product origin
   * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
   * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
   * of rejection
   */
  async AddProductAndMark(productAccount, description, details, year, origin, overrideOptions = {}) {
    await this.addProduct(productAccount, description, details, year, origin, overrideOptions);
    const hash = await this.addressHash(productAccount);
    return this.mark(productAccount, hash, overrideOptions);
  }


  /** *
   *
   * @param productAccount
   * @param overrideOptions
   * @returns {Promise<Transaction>}
   */

  async hashAndMark(productAccount, overrideOptions) {
    const hash = await this.addressHash(productAccount);
    return this.mark(productAccount, hash, overrideOptions);
  }

  /**
     * @typedef {Object} MarkResult
     * @property {String} appAccount application account address.
     * @property {string} brandAccount brand account address.
     * @property {string} productAccount product account address.
     */

  /**
     *
     * Check if a given marked item exists in the blockchain and returns a {@link MarkResult} containing information about
     * the product.
     *
     * ***Usage example:***
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.check('0x627306090abaB3A6e1400e9345bC60c78a8BEf57').then(item => {
     *      console.log('product brand',item.brandAccount);
     *      //... other stuff
     * })
     *
     *
     * // or with the async syntax
     *
     * async function foo() {
     *          let item = await deveryRegistryClient.check('0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
     *          console.log('product brand',item.brandAccount);
     *
     *
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} item The product account address in the blockchain to check.
     * @returns {Promise.<MarkResult>} a promise that if resolved returns a {@link MarkResult} object or raise an error in case of rejection.
     */
  async check(item) {
    const result = await this.__deveryRegistryContract.check(item);
    return result.valueOf();
  }
  // @todo: to check
  /**
   * This is a callback function that will be invoked in response to Permissioned event.
   *
   * @callback PermissionedEventCallback
   * @param {string} marker
   * @param {string} brandAccount brand account address.
   * @param permission
   *
   */

  /**
     *
     * Listener to Permissioned events. This event triggers whenever a new permission is set in the blockchain.
     * Please note that PermissionedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a PermissionedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     * deveryRegistryClient.setPermissionedEventListener((marker,brandAccount,permission) => {
     *      console.log(`a brand has been updated ${brandAccount} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setPermissionedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * deveryRegistryClient.setPermissionedEventListener();
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {PermissionedEventCallback} callback the callback that will be executed whenever a Permissioned event is
     * triggered
     */
  setPermissionedEventListener(callback) {
    const eventName = 'Permissioned';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }

  // @todo: to check
  /**
   * This is a callback function that will be invoked in response to Marked event.
   *
   * @callback MarkedEventCallback
   * @param {string} marker
   * @param {string} productAccount product account address.
   * @param appFeeAccount
   * @param feeAccount
   * @param appFee
   * @param fee
   * @param itemHash
   *
   */

  /**
     *
     * Listener to Marked events. This event triggers whenever a new account is marked in the blockchain.
     * Please note that MarkedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a MarkedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     *
     * ```
     * // first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * // now you can use it
     *
     * deveryRegistryClient.setMarkedEventListener((brandAccount,appAccount,active) => {
     *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setMarkedEventListener(undefined);
     *
     * // or that is equivalent to the above call
     *
     * deveryRegistryClient.setMarkedEventListener();
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {MarkedEventCallback} callback the callback that will be executed whenever a Marked event is
     * triggered
     */
  setMarkedEventListener(callback) {
    const eventName = 'Marked';
    this.__deveryRegistryContract.removeAllListeners(eventName);
    if (callback) {
      this.__deveryRegistryContract.on(eventName, callback);
    }
  }
}

export default DeveryRegistry;
