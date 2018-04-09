import AbstractSmartContract from './AbstractSmartContract';
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const ethers = require('ethers');
const network = { name: 'http://127.0.0.1:8545', chainId: 5777 }

/** Class representing a point. */
export default class AbstractDeverySmartContract extends  AbstractSmartContract{
    /**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
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