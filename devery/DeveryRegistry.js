import AbstractDeverySmartContract from './AbstractDeverySmartContract'

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
 *
 * @extends AbstractDeverySmartContract
 */
class DeveryRegistry extends AbstractDeverySmartContract{


    /**
     *
     * Creates a new DeveryRegistry instance.
     *
     * ***Usage example:***
     *```
     * //creates a deveryRegistryClient with the default params
     * let deveryRegistryClient = new DeveryAdmined();
     *
     * //creates a deveryRegistryClient pointing to a custom address
     * let deveryRegistryClient = new DeveryRegistry({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
    constructor(options = {web3Instance:undefined,acc:undefined,address:undefined}){
        super(options)
    }

    /**********************APP RELATED METHOD**************************************/

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
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.addApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5).then(transaction => {
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
     *          let transaction = await deveryRegistryClient.addApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5)
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
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string}  appName your app name
     * @param {string} feeAccount the account that will pay the fees for this app transactions
     * @param {int} fee the fee amount paid per app transaction
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async addApp(appName,feeAccount,fee,overrideOptions = {}){
        let result = await this.__deveryRegistryContract.addApp(appName,feeAccount,fee,overrideOptions);
        return result.valueOf();
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
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.updateApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5,true).then(transaction => {
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
     *          let transaction = await deveryRegistryClient.updateApp("Logistics co. app","0x627306090abaB3A6e1400e9345bC60c78a8BEf57",5,true)
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
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string}  appName your app name
     * @param {string} feeAccount the account that will pay the fees for this app transactions
     * @param {int} fee the fee amount paid per app transaction
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async updateApp(appName,feeAccount,fee,active,overrideOptions = {}){
        let result = await this.__deveryRegistryContract.updateApp(appName,feeAccount,fee,active,overrideOptions);
        return result;
    }


    /**
     *
     * Returns the app with the given address. If the requested app account does not exist
     * then and empty account is returned.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(app => {
     *      if(app.active){
     *          console.log(app.appName);
     *          //... other stuff
     *      }
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      let app = await deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732')
     *      if(app.active){
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
     * @Param {string} appAccount address of the request
     * @returns {Promise.<App>} a promisse that returns an {@link App} if it resolves or an error in case of rejection
     */
    async getApp(appAccount){
        let result = await this.__deveryRegistryContract.apps(appAccount);
        return result.valueOf();

    }



    /**
     *
     * Returns the app data for a  the given address. If the requested app account does not exist
     * then and empty app data is returned.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getAppData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(app => {
     *      if(app.active){
     *          console.log(app._appAccount);
     *          //... other stuff
     *      }
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      let app = await deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732')
     *      if(app.active){
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
     * @Param {string} appAccount address of the request
     * @returns {Promise.<AppData>} a promisse that returns an {@link AppData} if it resolves or an error in case of rejection
     */
    async getAppData(appAccount){

        let result = await this.__deveryRegistryContract.getAppData(appAccount);
        return result.valueOf();

    }

    /**
     *
     * Returns an array of account addresses from the appAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promisse that resolves to an empty array as result
     * the parameters page and pageSize are optional.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsPaginated(0,20).then(addressArr => {
     *     for(let address of addressArr){
     *          console.log(address);
     *     }
     * })
     *
     * //or with the async syntax
     *
     * async function(){
     *
     *      //here we don't pass any param to appAccountsPaginated
     *      //because its parameters are optional
     *      let addressArr = await deveryRegistryClient.appAccountsPaginated();
     *          for(let address of addressArr){
     *              console.log(address);
     *          }
     *
     *          //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} [page=0] the requested page, this parameter is optional the default value to it is 0
     * @param {int} [pageSize=10] the requested page size, this parameter is optional the default value to it is 10
     * @returns {Promise.<string[]>} a promise that returns an array of app address if it resolves or an error in case of rejection
     */
    async appAccountsPaginated(page = 0, pagesize = 10){

        let size = await this.appAccountsLength();
        let appAdressPromisse = []
        for(let i = page*pagesize;i<(page+1)*pagesize && i< size; i++){
            appAdressPromisse.push(this.appAccountsArray(i))
        }

        return await Promise.all(appAdressPromisse)

    }

    /**
     *
     * Returns an account address from the appAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsArray(4).then(address => {
     *     deveryClient.getApp(address).then(app => {
     *          console.log(app.appName)
     *          //... do more stuff
     *     })
     * }).catch(err =>{
     *      console.log('index ot of bounds')
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      try{
     *          let accountAddress = await deveryRegistryClient.appAccountsArray(4);
     *          let app = await deveryRegistryClient.getApp(accountAddress);
     *          if(app.active){
     *              console.log(app.appName);
     *              //... other stuff
     *          }
     *
     *      }
     *      catch(err){
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
     * @returns {Promise.<string>}  a promisse that returns an account app address if it resolves or an error in case of rejection
     */
    async appAccountsArray(index){
        let result = await this.__deveryRegistryContract.appAccounts(index);
        return result.valueOf();
    }


    /**
     *
     * Returns the total count of app accounts registered on the smart contract. This method is particulaly usefull
     * to be used in conjunction with {@link appAccountsArray} because you can verify the array upper bounds.
     *
     * ***Usage example:***
     *
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsLength().then(totalAccounts => {
     *     for(let i = 0;i< totalAccounts;i++){
     *          deveryRegistryClient.appAccountsArray(i).then(address => {
     *              deveryClient.getApp(address).then(app => {
     *                  console.log(app.appName)
     *                   //... do more stuff
     *              })
     *           })
     *      }
     * })
     *
     * //optionaly you can use the async syntax if you prefer
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @returns {Promise.<int>} a promise that returns the total accounts registered in the smart contract if it
     * resolves or an error in case of rejection
     */
    async appAccountsLength(){

        let result = await this.__deveryRegistryContract.appAccountsLength();
        return result.toNumber()

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
     * Listener to AppAdded events, this event triggers whenever a new devery app is created in the blockchain
     * please note that AppAddedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * DeveryRegistryClient.setAppAddedEventListener((appAccount,appName,feeAccount,fee,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * DeveryRegistryClient.setAppAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * DeveryRegistryClient.setAppAddedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {AppEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
    setAppAddedEventListener(callback){
        this.__deveryRegistryContract.onappadded = callback
    }


    /**
     *
     * Listener to AppUpdated events, this event triggers whenever an existing devery app is updated in the blockchain
     * please note that AppAddedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * DeveryRegistryClient.setAppAddedEventListener((appAccount,appName,feeAccount,fee,active) => {
     *      //whenever an app gets updated we will log it to the console
     *      console.log(`an App has been updated ${appAccount} - ${appName} - ${active} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * DeveryRegistryClient.setAppAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * DeveryRegistryClient.setAppAddedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {AppEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
    setAppUpdatedEventListener(callback){
        this.__deveryRegistryContract.onappupdated = callback
    }


    /**********************Brand RELATED METHOD**************************************/


    /**
     *
     * Creates a new brand in the blockchain. Only one brand can exist per account key so keep in mind that
     * if try to create more than one brand in the same brand account you will get an exception.
     *
     * This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     *
     * ***Usage example:***
     *```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.addBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name").then(transaction => {
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
     *          let transaction = await deveryRegistryClient.addBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name")
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
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string}  brandAccount account address
     * @param {string} brandName the name of the new brand
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async addBrand(brandAccount,brandName,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.addBrand(brandAccount,brandName,overrideOptions);
        return result.valueOf();

    }

    /**
     *
     * Updates a existing brand in the blockchain. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     * ***Usage example:***
     *
     *```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.updateBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name",true).then(transaction => {
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
     *          let transaction = await deveryRegistryClient.updateBrand("0x627306090abaB3A6e1400e9345bC60c78a8BEf57","My Brand name",true)
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
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string}  brandAccount account address
     * @param {string} brandName the name of the new brand
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async updateBrand(brandAccount,brandName,active,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.updateBrand(brandAccount,brandName,active,overrideOptions);
        return result.valueOf();

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
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(app => {
     *      if(app.active){
     *          console.log(app.appName);
     *          //... other stuff
     *      }
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      let app = await deveryRegistryClient.getApp('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732')
     *      if(app.active){
     *          console.log(app.appName);
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
     * @Param {string} appAccount address of the request
     * @returns {Promise.<Brand>} a promisse that returns an {@link Brand} if it resolves or an error in case of rejection
     */
    async getBrand(brandAccount){

        let result = await this.__deveryRegistryContract.brands(brandAccount);
        return result.valueOf();

    }

    /**
     *
     * Returns the brand data for a  the given address. If the requested Brand account does not exist
     * then and empty data is returned.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getBrandData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(brandData => {
     *      console.log(brandData.appFeeAccount);
     *      //... other stuff
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      let brandData = await deveryRegistryClient.getBrandData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732')
     *      console.log(brandData.appFeeAccount);
     *      //... other stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * The returned promise if resolved will return a {@link ProductData|ProductData you can click here to check its fields}
     *
     * @Param {string} brand address of the request
     * @returns {Promise.<BrandData>} a promisse that returns an {@link BrandData} if it resolves or an error in case of rejection
     */
    async getBrandData(brandAccount){
        
        let result = await this.__deveryRegistryContract.getBrandData(brandAccount);
        return result.valueOf();

    }

    /**
     *
     * Returns an array of account addresses from the appAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promisse that resolves to an empty array as result
     * the parameters page and pageSize are optional.
     *
     * ***Usage example:***
     *
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.appAccountsPaginated(0,20).then(addressArr => {
     *     for(let address of addressArr){
     *          console.log(address);
     *     }
     * })
     *
     * //or with the async syntax
     *
     * async function(){
     *
     *      //here we don't pass any param to appAccountsPaginated
     *      //because its parameters are optional
     *      let addressArr = await deveryRegistryClient.appAccountsPaginated();
     *          for(let address of addressArr){
     *              console.log(address);
     *          }
     *
     *          //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} [page=0] the requested page, this parameter is optional the default value to it is 0
     * @param {int} [pageSize=10] the requested page size, this parameter is optional the default value to it is 10
     * @returns {Promise.<string[]>} a promise that returns an array of app address if it resolves or an error in case of rejection
     */
    async brandAccountsPaginated(page = 0, pagesize = 10){

        let size = await this.brandAccountsLength();
        let appAdressPromisse = []
        for(let i = page*pagesize;i<(page+1)*pagesize && i< size; i++){
            appAdressPromisse.push(this.brandAccountsArray(i))
        }

        return await Promise.all(appAdressPromisse)

    }

    /**
     *
     * Returns a brand account address from the brandAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.brandAccountsArray(4).then(address => {
     *     deveryClient.getBrand(address).then(brand => {
     *          console.log(brand.brandName)
     *          //... do more stuff
     *     })
     * }).catch(err =>{
     *      console.log('index ot of bounds')
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      try{
     *          let accountAddress = await deveryRegistryClient.brandAccountsArray(4);
     *          let brand = await deveryRegistryClient.getBrand(accountAddress);
     *          console.log(brand.brandName)
     *          //... do more stuff
     *      }
     *      catch(err){
     *          console.log('index ot of bounds');
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {int} index the account index inside the appAccounts array
     * @returns {Promise.<string>}  a promisse that returns an brand app address if it resolves or an error in case of rejection
     */
    async brandAccountsArray(index){
        let result = await this.__deveryRegistryContract.brandAccounts(index);
        return result.valueOf();
    }

    /**
     *
     * Returns the total count of brand accounts registered on the smart contract. This method is particulaly usefull
     * to be used in conjunction with {@link brandAccountsArray} because you can verify the array upper bounds.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.brandAccountsLength().then(totalAccounts => {
     *     for(let i = 0;i< totalAccounts;i++){
     *          deveryRegistryClient.brandAccountsArray(i).then(address => {
     *              deveryClient.getBrand(address).then(brand => {
     *                  console.log(brand.brandName)
     *                   //... do more stuff
     *              })
     *           })
     *      }
     * })
     *
     * //optionaly you can use the async syntax if you prefer
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @returns {Promise.<int>} a promise that returns the total brand accounts registered in the smart contract if it
     * resolves or an error in case of rejection
     */
    async brandAccountsLength(){

        let result = await this.__deveryRegistryContract.brandAccountsLength();
        return result.toNumber();
    }


    /**
     * This is a callback function that will be invoked in response to  BrandEvents
     *
     *
     * @callback BrandEventCallback
     * @param {string} brandAccount
     * @param {string} appAccount
     * @param {string} active
     *
     */


    /**
     *
     * Listener to BrandAdded events, this event triggers whenever a new devery app is created in the blockchain
     * please note that BrandAddedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove am AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * DeveryRegistryClient.setBrandAddedEventListener((brandAccount,appAccount,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`new brand has been added ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * DeveryRegistryClient.setBrandAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * DeveryRegistryClient.setBrandAddedEventListener()
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
    setBrandAddedEventListener(callback){
        this.__deveryRegistryContract.onbrandadded = callback
    }

    /**
     *
     * Listener to BrandUpdated events, this event triggers whenever a existing brand is updated in the blockchain
     * please note that BrandUpdatedListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove am BrandUpdatedListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * deveryRegistryClient.setBrandUpdatedEventListener((brandAccount,appAccount,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setBrandUpdatedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * deveryRegistryClient.setBrandUpdatedEventListener()
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
    setBrandUpdatedEventListener(callback){
        this.__deveryRegistryContract.onbrandupdated = callback
    }


    /**********************PRODUCTS RELATED METHODS**************************************/



    /**
     *
     * Creates a new Product in the blockchain.  This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     *
     * ***Usage example:***
     *
     *```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.addProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product','batch 001',2018,'Unknown place').then(transaction => {
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
     *          let transaction = await deveryRegistryClient.addProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product','batch 001',2018,'Unknown place')
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
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} productAccount product account address
     * @param {string} description your product name and description
     * @param {string} details any extra details about your product
     * @param {int} year product production date
     * @param {string} origin information about the product origin
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async addProduct(productAccount, description, details, year,origin,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.addProduct(productAccount, description, details, year,origin,overrideOptions);
        return result.valueOf();

    }


    /**
     *
     * Updates a existing brand in the blockchain. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object.
     *
     * ***Usage example:***
     *```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     *
     * deveryRegistryClient.updateProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product'
     *      ,'batch 001',2018,'Unknown place',true).then(transaction => {
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
     *          let transaction = await deveryRegistryClient.updateProduct('0x627306090abaB3A6e1400e9345bC60c78a8BEf57','My nice product'
     *                                                          ,'batch 001',2018,'Unknown place',true)
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
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string}  productAccount product account address
     * @param {string} description your product name and description
     * @param {string} details any extra details about your product
     * @param {int} year product production date
     * @param {string} origin information about the product origin
     * @param {bool} active enables or disable the product
     * @param {TransactionOptions} [overrideOptions] gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async updateProduct(productAccount, description, details, year,origin,active,overrideOptions = {}){

        let result = await this.__deveryRegistryContract.updateProduct(productAccount, description, details, year,origin,active,overrideOptions);
        return result.valueOf();

    }

    /**
     *
     * Returns the Product with the given address. If the requested Product account does not exist
     * then you will receive an object with default data.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getProduct('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(product => {
     *      if(product.active){
     *          console.log(product.details);
     *          //... other stuff
     *      }
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      let product = await deveryRegistryClient.getProduct('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732')
     *      if(product.active){
     *          console.log(product.details);
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
     * @Param {string} appAccount address of the request
     * @returns {Promise.<Product>} a promisse that returns an {@link Product} if it resolves or an error in case of rejection
     */
    async getProduct(productAccount){

        let result = await this.__deveryRegistryContract.products(productAccount);
        return result.valueOf();

    }


    /**
     *
     * Returns the Product data for a  the given address. If the requested Product account does not exist
     * then and empty data is returned.
     *
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.getProductData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732').then(productData => {
     *      console.log(productData.brandAccount);
     *      //... other stuff
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      let productData = await deveryRegistryClient.getProductData('0xf17f52151EbEF6C7334FAD080c5704DAAA16b732')
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
     * @Param {string} appAccount address of the request
     * @returns {Promise.<ProductData>} a promisse that returns an {@link ProductData} if it resolves or an error in case of rejection
     */
    async getProductData(productAccount){
        
        let result = await this.__deveryRegistryContract.getProductData(productAccount);
        return result.valueOf();

    }

    /**
     *
     * returns an array of product addresses from the productAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promisse that resolves to an empty array as result
     * the parameters page and pageSize are optional.
     *
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.productAccountsPaginated(0,20).then(addressArr => {
     *     for(let address of addressArr){
     *          console.log(address);
     *     }
     * })
     *
     * //or with the async syntax
     *
     * async function(){
     *
     *      //here we don't pass any param to productAccountsPaginated
     *      //because its parameters are optional
     *      let addressArr = await productAccountsPaginated.productAccountsPaginated();
     *          for(let address of addressArr){
     *              console.log(address);
     *          }
     *
     *          //... do more stuff
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} page the requested page, this parameter is optional the default value to it is 0
     * @param {int} pageSize the requested page size, this parameter is optional the default value to it is 10
     * @returns {Promise.<string[]>} a promise that returns an array of product address if it resolves or an error in case of rejection
     */
    async productAccountsPaginated(page = 0, pagesize = 10){

        let size = await this.productAccountsLength();
        let appAdressPromisse = []
        for(let i = page*pagesize;i<(page+1)*pagesize && i< size; i++){
            appAdressPromisse.push(this.productAccountsArray(i))
        }

        return await Promise.all(appAdressPromisse)

    }


    /**
     *
     * Returns an brand account address from the brandAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     *
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.productAccountsArray(4).then(address => {
     *     deveryClient.getProduct(address).then(product => {
     *          console.log(product.productDescription)
     *          //... do more stuff
     *     })
     * }).catch(err =>{
     *      console.log('index ot of bounds')
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *      try{
     *          let productAddress = await deveryRegistryClient.productAccountsArray(4);
     *          let product = await deveryRegistryClient.getProduct(productAddress);
     *          console.log(product.productDescription)
     *          //... do more stuff
     *      }
     *      catch(err){
     *          console.log('index ot of bounds');
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {int} index the account index inside the appAccounts array
     * @returns {Promise.<string>}  a promisse that returns an product address array if it resolves or an error in case of rejection
     */
    async productAccountsArray(index){
        let result = await this.__deveryRegistryContract.productAccounts(index);
        return result.valueOf();
    }


    /**
     *
     * returns the total count of brand accounts registered on the smart contract. This method is particulaly usefull
     * to be used in conjunction with {@link brandAccountsArray} because you can verify the array upper bounds
     *
     *
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * deveryRegistryClient.productAccountsLength().then(totalProducts => {
     *     for(let i = 0;i< totalProducts;i++){
     *          deveryRegistryClient.productAccountsArray(i).then(address => {
     *              deveryClient.getProduct(address).then(brand => {
     *                  console.log(brand.productDescription)
     *                   //... do more stuff
     *              })
     *           })
     *      }
     * })
     *
     * //optionaly you can use the async syntax if you prefer
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     *
     * @param {int} page the requested page, this parameter is optional the default value to it is 0
     * @param {int} pageSize the requested page size, this parameter is optional the default value to it is 10
     * @returns {Promise.<int>} a promise that returns the total product accounts registered in the smart contract if it
     * resolves or an error in case of rejection
     */
    async productAccountsLength(){
        
        let result = await this.__deveryRegistryContract.productAccountsLength();
        return result.toNumber();

    }


    /**
     * This is a callback function that will be invoked in response to  ProductEvents
     *
     *
     * @callback ProductEventCallback
     * @param {string} productAccount
     * @param {string} brandAccount
     * @param {string} appAccount
     * @param {string} description
     * @param {bools} active
     *
     */


    /**
     *
     * Listener to productAdded events, this event triggers whenever a new product  is created in the blockchain
     * please note that ProductAddedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove am ProductAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * deveryRegistryClient.setProductUpdatedEventListener((brandAccount,appAccount,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setProductAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     *
     *
     * deveryRegistryClient.setProductAddedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {ProductEventCallback} callback the callback that will be executed whenever and ProductAdded event is
     * triggered
     */
    setProductAddedEventListener(callback){
        this.__deveryRegistryContract.onproductadded = callback
    }



    /**
     *
     * Listener to productUpdated events, this event triggers whenever a new devery app is created in the blockchain
     * please note that ProductUpdatedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove am AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ***Usage example:***
     *
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * deveryRegistryClient.setProductUpdatedEventListener((brandAccount,appAccount,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`a brand has been updated ${brandAccount} - ${appAccount} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryRegistryClient.setProductUpdatedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     *
     *
     * deveryRegistryClient.setProductUpdatedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {ProductEventCallback} callback the callback that will be executed whenever and ProductUpdated event is
     * triggered
     */
    setProductUpdatedEventListener(callback){
        this.__deveryRegistryContract.onproductupdated = callback
    }



    /**********************MARKER RELATED METHODS**************************************/


    /**
     *
     * Adds or removes permission from an account to mark items in the blockchain.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * //passing true as param will add the account as marker
     * deveryRegistryClient.permissionMarker("0x627306090abaB3A6e1400e9345bC60c78a8BEf57",true).then(transaction => {
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
     *          let transaction = await deveryRegistryClient.permissionMarker("0x627306090abaB3A6e1400e9345bC60c78a8BEf57",false)
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
     * @param {string} marker The marker account whose permission will be set
     * @param {bool} permission permission value to the target markes
     * @param {TransactionOptions} [overrideOptions] the account index inside the appAccounts array
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     */
    async permissionMarker(marker,permission,overrideOptions = {}){

        let result = await this.__deveryRegistryContract.permissionMarker(marker,permission,overrideOptions);
        return result.valueOf();
    }



    /**
     *
     * Compute item hash from the public key. You will need this hash to mark your products.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * //passing true as param will add the account as marker
     * deveryRegistryClient.addressHash("0x627306090abaB3A6e1400e9345bC60c78a8BEf57").then(hash => {
     *      // use the hash to mark the item
     *      //... other stuff
     * })
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} marker The marker account whose permission will be set
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     */
    async addressHash(item){

        let result = await this.__deveryRegistryContract.addressHash(item);
        return result.valueOf();
    }


    /**
     *
     * Marks an item in the blockchain. *** you need to pre calculate the item hash before calling this method***
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
    async mark(productAccount, itemHash,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.mark(productAccount,itemHash,overrideOptions);
        return result.valueOf();
    }


    /**
     * @typedef {Object} MarkResult
     * This object configures how the client will connect and communicate to the Ethereum network,
     * unless you have good reasons to change the default configurations you don't need to worry with any of these values
     * as the will be automatically resolved
     * contract address in your current network. Under normal circunstances you don't need to pass any of these fields.
     * @property {String} appAccount  the current web3 object, like the one injected my metamask
     * @property {string} brandAccount the accounts' addres that will execute the transactions
     * @property {string} productAccount expects the contract address in your current network, unless you are running your own
     * network you don't need to provide it
     */

    /**
     *
     *
     *
     * Check if a given marked item exists in the blockchain and return a {@link MarkResult} containing information about
     * the product.
     *
     * ***Usage example:***
     * ```
     * //first you need to get a {@link DeveryRegistry} instance
     * let deveryRegistryClient = new DeveryRegistry();
     *
     * //passing true as param will add the account as marker
     * deveryRegistryClient.check("0x627306090abaB3A6e1400e9345bC60c78a8BEf57").then(item => {
     *      console.log('product brand',item.brandAccount);
     *      //... other stuff
     * })
     *
     *
     * //or with the async syntax
     *
     * async function(){
     *          //passing false as param will remove the account as marker
     *          let item = await deveryRegistryClient.check("0x627306090abaB3A6e1400e9345bC60c78a8BEf57")
     *          console.log('product brand',item.brandAccount);
     *
     *
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryRegistry|DeveryRegistry instance click here}.
     *
     * @param {string} productAccount The product account address in the blockchain.
     * @returns {Promise.<MarkResult>} a promise that if resolved returns an transaction or raise an error in case
     */
    async check(item){

        let result = await this.__deveryRegistryContract.check(item);
        return result.valueOf();
    }

}

export default DeveryRegistry