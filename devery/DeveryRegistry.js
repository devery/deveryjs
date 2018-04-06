const ethers = require('ethers');
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');

const network = { name: 'http://127.0.0.1:8545', chainId: 5777 }

export default class DeveryRegistry{


    constructor(signer = web3, provider,acc,address){
        //TODO: if no web provider is available create a read only one pointing to etherscan API
        // if(!signer){
        //     throw new Error("It was not possible to fallbacl the the default web3 object, web3 provider must be provided");
        // }
        if(!provider){
            this._ethersProvider = new ethers.providers.Web3Provider(signer.currentProvider,network );
        }
        else{
            this._ethersProvider = provider
        }



        let signerOrProvider = this._ethersProvider.getSigner?this._ethersProvider.getSigner():this._ethersProvider;

        if(acc){
            signerOrProvider =
                this._ethersProvider.getSigner(acc)
        }


        if(!address){
            address = deveryRegistryArtifact.networks[network.chainId].address
        }

        this.__deveryRegistryContract = new ethers.Contract(address, deveryRegistryArtifact.abi,
            signerOrProvider);


    }

    /**********************APP RELATED METHOD**************************************/



    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //addApp(string appName, address _feeAccount, uint _fee)
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
    //updateApp(string appName, address _feeAccount, uint _fee, bool active)
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
    //getApp(address appAccount) public constant returns (App app)
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
    //getAppData(address appAccount) public constant returns (address _feeAccount, uint _fee, bool active)
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
    //getAppData(address appAccount) public constant returns (address _feeAccount, uint _fee, bool active)
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

    //appAccountsLength()
    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //appAccountsLength()
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
    async addBrand(brandAccount,brandName){
        
        let result = await this.__deveryRegistryContract.addBrand(brandAccount,brandName);
        return result.valueOf();

    }

    //updateBrand(address brandAccount, string brandName, bool active) public
    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //updateBrand(address brandAccount, string brandName, bool active) public
    async updateBrand(brandAccount,brandName,active){
        
        let result = await this.__deveryRegistryContract.updateBrand(brandAccount,brandName,active);
        return result.valueOf();

    }

    //updateBrand(address brandAccount, string brandName, bool active) public
    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //updateBrand(address brandAccount, string brandName, bool active) public
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
    //getBrand(address brandAccount) public constant returns (Brand brand)
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
    //getBrand(address brandAccount) public constant returns (Brand brand)
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
    //getAppData(address appAccount) public constant returns (address _feeAccount, uint _fee, bool active)
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
    //brandAccountsLength()
    async brandAccountsLength(){

        let result = await this.__deveryRegistryContract.brandAccountsLength();
        return result.valueOf();
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
    //addProduct(address productAccount, string description, string details, uint year, string origin)
    async addProduct(productAccount, description, details, year,origin){
        
        let result = await this.__deveryRegistryContract.addProduct(productAccount, description, details, year,origin);
        return result.valueOf();

    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //getProduct(address productAccount) public constant returns (Product product)
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
    //getProductData(address productAccount) public constant returns (address brandAccount, address appAccount, address appFeeAccount, bool active)
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
    //getAppData(address appAccount) public constant returns (address _feeAccount, uint _fee, bool active)
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
    //getProductData(address productAccount) public constant returns (address brandAccount, address appAccount, address appFeeAccount, bool active)
    async productAccountsLength(){
        
        let result = await this.__deveryRegistryContract.productAccountsLength();
        return result.valueOf();

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
    //permissionMarker(address marker, bool permission)
    async permissionMarker(marker,permission){

        let result = await this.__deveryRegistryContract.permissionMarker(marker,permission);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //addressHash(address item) public pure returns (bytes32 hash)
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
    //mark(address productAccount, bytes32 itemHash)
    async mark(productAccount, itemHash){
        
        let result = await this.__deveryRegistryContract.mark(productAccount,itemHash);
        return result.valueOf();
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //check(address item) public constant returns (address productAccount, address brandAccount, address appAccount)
    async check(item){

        let result = await this.__deveryRegistryContract.check(item);
        return result.valueOf();
    }

}