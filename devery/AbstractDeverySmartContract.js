import AbstractSmartContract from './AbstractSmartContract';
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const ethers = require('ethers');




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

/** Abstract class that is base for all the devery registry related smart contracts
 * There is no reason to directly instantiate it. Here lies some common logic about how to resolve
 * the underlying smart contract address and getting the signer instance. *** you shall not instantiate it directly***
 *
 * @extends AbstractSmartContract
 */

class AbstractDeverySmartContract extends  AbstractSmartContract{

    /**
     *
     * ***You shall not call this class constructor directly*** if you do so you will get an TypeError
     * as we are explicitly checking against this
     *
     * ```
     * //excerpt from the constructor
     *
     * if (new.target === AbstractDeverySmartContract) {
            throw new TypeError("Cannot construct AbstractDeverySmartContract instances directly");
        }

     * ```
     *
     *
     * @param options
     */
    constructor(options = {web3Instance:web3,acc:undefined,address:undefined}){
        super(options)
        if (new.target === AbstractDeverySmartContract) {
            throw new TypeError("Cannot construct AbstractDeverySmartContract instances directly");
        }

        let address = options.address;

        if(!address){
            address = deveryRegistryArtifact.networks[web3.version.network].address
        }

        this.__deveryRegistryContract = new ethers.Contract(address, deveryRegistryArtifact.abi,
            this.__signerOrProvider);
    }
}

export default AbstractDeverySmartContract