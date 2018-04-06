const ethers = require('ethers')
const network = { name: 'http://127.0.0.1:8545', chainId: 5777 }

export default class AbstractSmartContract{
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

        this.__signerOrProvider = this._ethersProvider.getSigner?this._ethersProvider.getSigner():this._ethersProvider;

        if(acc){
            this.__signerOrProvider =
                this._ethersProvider.getSigner(acc)
        }

    }
}