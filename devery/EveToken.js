
const eveTokenArtifact = require('../build/contracts/TestEVEToken.json');
const contract = require('truffle-contract')
const EveTokenContract = contract(eveTokenArtifact);
import AbstractSmartContract from './AbstractSmartContract';
const ethers = require('ethers')
const network = { name: 'http://127.0.0.1:8545', chainId: 5777 }

export default class EveToken extends AbstractSmartContract{
    constructor(web3Param = web3){
        super(...arguments)

        if(!address){
            address = eveTokenArtifact.networks[network.chainId].address
        }

        this.__eveTokenContract = new ethers.Contract(address, eveTokenArtifact.abi,
            this.__signerOrProvider);
    }


    /**
     *
     * Checks the total existing supply for the given token
     *
     * @returns {Promise.<*>} a promisse that resolves to the total circulating supply
     * of the current token
     */
    async totalSupply(){
        let result = await this.__eveTokenContract.totalSupply();
        return result.toNumber();

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
        let result = await this.__eveTokenContract.balanceOf(account);
        return result.toNumber();
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
    async allowance(tokenOwner, spender,overrideOptions = {}){
        let result = await this.__eveTokenContract.allowance(tokenOwner,spender,overrideOptions);
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
    async transfer(toAdress, total,overrideOptions = {}){
        let result = await this.__eveTokenContract.transfer(toAdress,total,overrideOptions);
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
    async transferFrom(from, to,tokens,overrideOptions = {}){
        let result = await this.__eveTokenContract.transferFrom(from, to,tokens,overrideOptions);
        return result.valueOf();
    }
}