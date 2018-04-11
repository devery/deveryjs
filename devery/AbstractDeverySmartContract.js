import AbstractSmartContract from './AbstractSmartContract';
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const ethers = require('ethers');





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