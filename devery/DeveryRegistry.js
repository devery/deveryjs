import AbstractDeverySmartContract from './AbstractDeverySmartContract'

/**
 *
 * DeveryRegistry client interface with it you can interact with the devery protocol
 *
 * DeveryRegistry Smart Contract Design
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
     * Creates a new instansce of DeveryRegistry
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
    constructor(options = {web3Instance:web3,acc:undefined,address:undefined}){
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
     *
     * creates a new app in the blockchain, each account can have only one account so if your account already
     * have an app you must call {@link updateApp} to change its details. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object
     *
     *```
     * //first you need to get a {@link DeveryOwned} instance
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
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * @param {string}  appName your app name
     * @param {string} feeAccount the account that will pay the fees for this app transactions
     * @param {int} fee the fee amount paid per app transaction
     * @param {TransactionOptions} overrideOptions gas options to override the default ones
     * @returns {Promise.<Transaction>} a promise that if resolved returns an transaction or raise an error in case
     * of rejection
     */
    async addApp(appName,feeAccount,fee,overrideOptions = {}){
        let result = await this.__deveryRegistryContract.addApp(appName,feeAccount,fee,overrideOptions);
        return result.valueOf();
    }



    /**
     *
     * updates an existing app in the blockchain. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object
     *
     *```
     * //first you need to get a {@link DeveryOwned} instance
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
     * ```
     * //first you need to get a {@link DeveryOwned} instance
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
     * ```
     * //first you need to get a {@link DeveryOwned} instance
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
     * returns an array of account addresses from the appAccounts array contained in the smart contract.
     * If you try to access a page that does not exist you will get a promisse that resolves to an empty array as result
     * the parameters page and pageSize are optional.
     *
     * ```
     * //first you need to get a {@link DeveryOwned} instance
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
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     *
     * @param {int} page the requested page, this parameter is optional the default value to it is 0
     * @param {int} pageSize the requested page size, this parameter is optional the default value to it is 10
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
     * returns an account address from the appAccounts array. If you try to access an index that is out of the array
     * bounds the promise will be rejected.
     *
     *
     *
     * Returns the app data for a  the given address. If the requested app account does not exist
     * then and empty app data is returned.
     *
     * ```
     * //first you need to get a {@link DeveryOwned} instance
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
     *          console.log(app.appName)
     *          //... do more stuff
     *      }
     *      catch(err){
     *          console.log('index ot of bounds');
     *      }
     *      let app = await deveryRegistryClient.appAccountsArray(5)
     *      if(app.active){
     *          console.log(app._appAccount);
     *          //... other stuff
     *      }
     * }
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * The returned promise if resolved will return a {@link AppData|AppData you can click here to check its fields}
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
     * returns the total count of app accounts registered on the smart contract. This method is particulaly usefull
     * to be used in conjunction with {@link appAccountsArray} because you can verify the array upper bounds
     *
     *
     * ```
     * //first you need to get a {@link DeveryOwned} instance
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
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     *
     * @param {int} page the requested page, this parameter is optional the default value to it is 0
     * @param {int} pageSize the requested page size, this parameter is optional the default value to it is 10
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
     * as param
     *
     * ```
     * //first you need to get a {@link DeveryOwned} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * deveryOwnedClient.setAppAddedEventListener((appAccount,appName,feeAccount,fee,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryOwnedClient.setAppAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * deveryOwnedClient.setAppAddedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * @param {OwnershipEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
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
     * ```
     * //first you need to get a {@link DeveryOwned} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * deveryOwnedClient.setAppAddedEventListener((appAccount,appName,feeAccount,fee,active) => {
     *      //whenever an app gets updated we will log it to the console
     *      console.log(`an App has been updated ${appAccount} - ${appName} - ${active} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryOwnedClient.setAppAddedEventListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * deveryOwnedClient.setAppAddedEventListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * @param {OwnershipEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
    setAppUpdatedEventListener(callback){
        this.__deveryRegistryContract.onappupdated = callback
    }


    /**********************Brand RELATED METHOD**************************************/


    /**
     *
     * creates a new brand in the blockchain. This is a write method so you will need to
     * provide some gas to run it, plus keep in mind that your environment need to have access to an signer so
     * make sure that your user have access to metamask or other web3 object
     *
     *```
     * //first you need to get a {@link DeveryOwned} instance
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
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * @param {string}  appName your app name
     * @param {string} feeAccount the account that will pay the fees for this app transactions
     * @param {int} fee the fee amount paid per app transaction
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
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async updateBrand(brandAccount,brandName,active,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.updateBrand(brandAccount,brandName,active,overrideOptions);
        return result.valueOf();

    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getBrandAddresses(){

        let result = await this.__deveryRegistryContract.brandAccounts()
        return result;

    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getBrand(brandAccount){

        let result = await this.__deveryRegistryContract.brands(brandAccount);
        return result.valueOf();

    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getBrandData(brandAccount){
        
        let result = await this.__deveryRegistryContract.getBrandData(brandAccount);
        return result.valueOf();

    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async brandAccountsPaginated(page = 0, pagesize = 10){

        let size = await this.brandAccountsLength();
        let appAdressPromisse = []
        for(let i = page*pagesize;i<(page+1)*pagesize && i< size; i++){
            appAdressPromisse.push(this.brandAccountsArray(i))
        }

        return await Promise.all(appAdressPromisse)

    }

    async brandAccountsArray(index){
        let result = await this.__deveryRegistryContract.brandAccounts(index);
        return result.valueOf();
    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async brandAccountsLength(){

        let result = await this.__deveryRegistryContract.brandAccountsLength();
        return result.toNumber();
    }

    setBrandAddedEventListener(callback){
        this.__deveryRegistryContract.onbrandadded = callback
    }

    setBrandUpdatedEventListener(callback){
        this.__deveryRegistryContract.onbrandupdated = callback
    }


    /**********************PRODUCTS RELATED METHODS**************************************/



    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async addProduct(productAccount, description, details, year,origin,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.addProduct(productAccount, description, details, year,origin,overrideOptions);
        return result.valueOf();

    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getProduct(productAccount){

        let result = await this.__deveryRegistryContract.products(productAccount);
        return result.valueOf();

    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getProductData(productAccount){
        
        let result = await this.__deveryRegistryContract.getProductData(productAccount);
        return result.valueOf();

    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async productAccountsPaginated(page = 0, pagesize = 10){

        let size = await this.productAccountsLength();
        let appAdressPromisse = []
        for(let i = page*pagesize;i<(page+1)*pagesize && i< size; i++){
            appAdressPromisse.push(this.productAccountsArray(i))
        }

        return await Promise.all(appAdressPromisse)

    }

    async productAccountsArray(index){
        let result = await this.__deveryRegistryContract.productAccounts(index);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async productAccountsLength(){
        
        let result = await this.__deveryRegistryContract.productAccountsLength();
        return result.toNumber();

    }

    setProductAddedEventListener(callback){
        this.__deveryRegistryContract.onproductadded = callback
    }

    setProductUpdatedEventListener(callback){
        this.__deveryRegistryContract.onproductupdated = callback
    }



    /**********************MARKER RELATED METHODS**************************************/


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async permissionMarker(marker,permission,overrideOptions = {}){

        let result = await this.__deveryRegistryContract.permissionMarker(marker,permission,overrideOptions);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async addressHash(item,permission){

        let result = await this.__deveryRegistryContract.addressHash(item);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async mark(productAccount, itemHash,overrideOptions = {}){
        
        let result = await this.__deveryRegistryContract.mark(productAccount,itemHash,overrideOptions);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async check(item){

        let result = await this.__deveryRegistryContract.check(item);
        return result.valueOf();
    }

}

export default DeveryRegistry