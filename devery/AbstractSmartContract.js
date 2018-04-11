const ethers = require('ethers')


/**
 * @typedef {Object} ClientOptions
 * This object configures how the client will connect and communicate to the Ethereum network,
 * unless you have good reasons to change the default configurations you don't need to worry with any of these values
 * as the will be automatically resolved
 * contract address in your current network. Under normal circunstances you don't need to pass any of these fields.
 * @property {Object} web3Instance  the current web3 object, like the one injected my metamask
 * @property {string} acc the accounts' addres that will execute the transactions
 * @property {string} address expects the contract address in your current network, unless you are running your own
 * network you don't need to provide it
 */

/**
 *
 * @typedef {Object} TransactionOptions
 *
 */


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