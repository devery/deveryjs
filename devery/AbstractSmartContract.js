const ethers = require('ethers')


class AbstractSmartContract{
    constructor(options = {web3Instance:web3,acc:undefined,address:undefined}){

        if (new.target === AbstractSmartContract) {
            throw new TypeError("Cannot construct AbstractSmartContract instances directly");
        }

        let signer = options.web3Instance;
        let acc = options.acc;
        //TODO: if no web provider is available create a read only one pointing to etherscan API


        this._ethersProvider = new ethers.providers.Web3Provider(signer.currentProvider);


        this.__signerOrProvider = this._ethersProvider.getSigner?this._ethersProvider.getSigner():this._ethersProvider;

        if(acc){
            this.__signerOrProvider =
                this._ethersProvider.getSigner(acc)
        }

    }
}

export default AbstractSmartContract