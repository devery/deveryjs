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
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async addApp(appName,feeAccount,fee,overrideOptions = {}){
        let result = await this.__deveryRegistryContract.addApp(appName,feeAccount,fee,overrideOptions);
        return result.valueOf();
    }



    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async updateApp(appName,feeAccount,fee,active,overrideOptions = {}){
        let result = await this.__deveryRegistryContract.updateApp(appName,feeAccount,fee,active,overrideOptions);
        return result;
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getApp(appAccount){
        //TODO: wrap the result in a more redable object
        // let result = await this.__deveryRegistryContract.apps(appAccount);
        // return result
        let result = await this.__deveryRegistryContract.apps(appAccount);
        return result.valueOf();

    }



    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async getAppData(appAccount){

        let result = await this.__deveryRegistryContract.getAppData(appAccount);
        return result.valueOf();

    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async appAccountsPaginated(page = 0, pagesize = 10){

        let size = await this.appAccountsLength();
        let appAdressPromisse = []
        for(let i = page*pagesize;i<(page+1)*pagesize && i< size; i++){
            appAdressPromisse.push(this.appAccountsArray(i))
        }

        return await Promise.all(appAdressPromisse)

    }

    async appAccountsArray(index){
        let result = await this.__deveryRegistryContract.appAccounts(index);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async appAccountsLength(){

        let result = await this.__deveryRegistryContract.appAccountsLength();
        return result.toNumber()

    }

    setAppAddedEventListener(callback){
        this.__deveryRegistryContract.onappadded = callback
    }

    setAppUpdatedEventListener(callback){
        this.__deveryRegistryContract.onappupdated = callback
    }


    /**********************Brand RELATED METHOD**************************************/


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //addBrand(address brandAccount, string brandName)
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