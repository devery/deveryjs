import AbstractSmartContract from './AbstractSmartContract';
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const ethers = require('ethers');
const network = { name: 'http://127.0.0.1:8545', chainId: 5777 }


export default class AbstractDeverySmartContract extends  AbstractSmartContract{
    constructor(signer = web3, provider,acc,address){
        super(...arguments)

        if(!address){
            address = deveryRegistryArtifact.networks[network.chainId].address
        }

        this.__deveryRegistryContract = new ethers.Contract(address, deveryRegistryArtifact.abi,
            this.__signerOrProvider);
    }
}