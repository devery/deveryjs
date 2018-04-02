import simpleWeb3Promisifier from  './../utils/simpleWeb3Promisifier'
const eveTokenArtifact = require('../build/contracts/TestEVEToken.json');
const contract = require('truffle-contract')
const EveTokenContract = contract(eveTokenArtifact);

export default class EveToken{
    constructor(web3Param = web3){
        if(!web3Param){
            throw new Error("It was not possible to fallbacl the the default web3 object, web3 provider must be provided");
        }
        this.web3 = web3Param;
        this.asyncWeb3 = simpleWeb3Promisifier(web3Param)
        EveTokenContract.setProvider(this.web3.currentProvider)
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async totalSupply(){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let eveTokenInstance = await EveTokenContract.deployed();
        let result = await eveTokenInstance.totalSupply({from:coinbase});
        return result.valueOf();

    }

    /**
     *
     * Checks the balance of a given account
     *
     * @param account  account whose balance is being inquired
     * @returns {Promise.<*>} a promisse that resolves to the current balance of
     * the inquired account
     */
    async balanceOf(account){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let eveTokenInstance = await EveTokenContract.deployed();
        let result = await eveTokenInstance.balanceOf(account,{from:coinbase});
        return result.valueOf();
    }

    //TODO: explain document this function return
    /**
     *
     *  gives the 3rd party the right to facilitate a transaction with the owners token.
     *  please note that alowance will not transfer tokens to the 3rd party but instead give him
     *  permission to facilitate transactions on your behalf
     *
     * @param account  account whose balance is being inquired
     * @returns {Promise.<*>}
     */
    async allowance(tokenOwner, spender){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let eveTokenInstance = await EveTokenContract.deployed();
        let result = await eveTokenInstance.allowance(tokenOwner,spender,{from:coinbase});
        return result.valueOf();
    }

    /**
     *
     * Transfer tokens from the current account to any other account
     *
     * @param toAdress  address that will receive the tokens
     * @param total quantity of tokens being sent
     * @returns {Promise.<*>} a promisse that resolves to the transaction receipt
     */
    async transfer(toAdress, total){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let eveTokenInstance = await EveTokenContract.deployed();
        let result = await eveTokenInstance.transfer(toAdress,total,{from:coinbase});
        return result.valueOf();
    }

    /**
     *
     * Transfer tokens from a specific account to any other account
     *
     * @param toAdress  address that will receive the tokens
     * @param total quantity of tokens being sent
     * @returns {Promise.<*>} a promisse that resolves to the transaction receipt
     */
    async transferFrom(from, to,tokens){
        let coinbase = await this.asyncWeb3.eth.getCoinbase();
        let eveTokenInstance = await EveTokenContract.deployed();
        let result = await eveTokenInstance.transferFrom(from, to,tokens,{from:coinbase});
        return result.valueOf();
    }
}