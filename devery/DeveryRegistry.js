import simpleWeb3Promisifier from  './../utils/simpleWeb3Promisifier'
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const contract = require('truffle-contract')
const DeveryRegistryContract = contract(deveryRegistryArtifact);

export default class DeveryRegistry{
    constructor(web3Param = web3){
        if(!web3Param){
            throw new Error("It was not possible to fallbacl the the default web3 object, web3 provider must be provided");
        }
        this.web3 = web3Param;
        this.asyncWeb3 = simpleWeb3Promisifier(web3Param)
        DeveryRegistryContract.setProvider(this.web3.currentProvider)
    }

    /**********************APP RELATED METHOD**************************************/

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async totalSupply(){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        return deveryRegistryInstace;
        // return deveryRegistryInstace
        // let result = await eveTokenInstance.totalSupply({from:coinbase});
        // return result.valueOf();

    }

    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //addApp(string appName, address _feeAccount, uint _fee)
    async addApp(appName,feeAccount,fee,active){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.addApp(appName,feeAccount,fee,active ,{from:coinbase});
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
    async updateApp(appName,feeAccount,fee,active){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.updateApp(appName,feeAccount,fee,active ,{from:coinbase});
        return result.valueOf();

    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //getApp(address appAccount) public constant returns (App app)
    async getApp(appName,feeAccount,fee,active){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.getApp(appAccount,{from:coinbase});
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
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.getAppData(appAccount,{from:coinbase});
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
    async getAppData(appAccount){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.getAppData({from:coinbase});
        return result.valueOf();

    }

    /**********************APP RELATED METHOD**************************************/


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    //addBrand(address brandAccount, string brandName)
    async addBrand(brandAccount,brandName){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.addBrand(brandAccount,brandName,{from:coinbase});
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
    async updateBrand(brandAccount,brandName){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.updateBrand(brandAccount,brandName,{from:coinbase});
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
    async getBrand(brandAccount){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let deveryRegistryInstace = await DeveryRegistryContract.deployed();
        let result = await deveryRegistryInstace.getBrand(brandAccount,{from:coinbase});
        return result.valueOf();

    }

    //getBrandData(address brandAccount) public constant returns (address appAccount, address appFeeAccount, bool active)
    //brandAccountsLength()
    //addProduct(address productAccount, string description, string details, uint year, string origin)
    //updateProduct(address productAccount, string description, string details, uint year, string origin, bool active)
    //getProduct(address productAccount) public constant returns (Product product)
    //getProductData(address productAccount) public constant returns (address brandAccount, address appAccount, address appFeeAccount, bool active)
    //productAccountsLength() public constant returns (uint)
    //permissionMarker(address marker, bool permission)
    //addressHash(address item) public pure returns (bytes32 hash)
    //mark(address productAccount, bytes32 itemHash)
    //check(address item) public constant returns (address productAccount, address brandAccount, address appAccount)

}