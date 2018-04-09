import AbstractSmartContract from './AbstractSmartContract';
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const ethers = require('ethers');
const network = { name: 'http://127.0.0.1:8545', chainId: 5777 }

/** Abstract class that is base for all the devery registry related smart contracts
 * There is no reason to directly instantiate it
 *
 * @extends AbstractSmartContract
 */

class AbstractDeverySmartContract extends  AbstractSmartContract{

    constructor(options = {signer:web3,provider:undefined,acc:undefined,address:undefined}){
        super(options)

        let address = options.address;

        if(!address){
            address = deveryRegistryArtifact.networks[network.chainId].address
        }

        this.__deveryRegistryContract = new ethers.Contract(address, deveryRegistryArtifact.abi,
            this.__signerOrProvider);
    }
}

export default AbstractDeverySmartContract