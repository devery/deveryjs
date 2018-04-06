import AbstractDeverySmartContract from './AbstractDeverySmartContract'

export default class DeveryOwned extends AbstractDeverySmartContract {

    constructor(signer = web3, provider, acc, address) {
        super(...arguments)
    }


    async acceptOwnership(){
        let result = await this.__deveryRegistryContract.acceptOwnership();
        return result.valueOf();
    }

    async transferOwnership(newOwnerAddres){
        let result = await this.__deveryRegistryContract.transferOwnership(newOwnerAddres);
        return result.valueOf();
    }

    setOwnershipTransferredListener(callback){
        this.__deveryRegistryContract.onownershiptransferred = callback
    }

    async getOwner(){
        let result = await this.__deveryRegistryContract.owner();
        return result.valueOf();
    }

    async getNewOwner(){
        let result = await this.__deveryRegistryContract.newOwner();
        return result.valueOf();
    }
}