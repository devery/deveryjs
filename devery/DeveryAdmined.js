import AbstractDeverySmartContract from './AbstractDeverySmartContract'
/**
 * Foo fooing bars
 */
export default class DeveryAdmined extends AbstractDeverySmartContract {

    constructor(options = {singer:web3,provider:undefined,acc:undefined,address:undefined}) {
        super(options)

    }

    /**
     * hello
     * @param addr
     * @returns {Promise.<*>}
     */
    async isAdmin(addr){
        let result = await this.__deveryRegistryContract.isAdmin(addr);
        return result.valueOf();
    }


    async addAdmin(addr){
        let result = await this.__deveryRegistryContract.addAdmin(addr);
        return result.valueOf();
    }

    async removeAdmin(addr){
        let result = await this.__deveryRegistryContract.removeAdmin(addr);
        return result.valueOf();
    }


    setAdminAddedEventListener(callback){
        this.__deveryRegistryContract.onadminadded = callback
    }

    setAdminRemovedEventListener(callback){
        this.__deveryRegistryContract.onadminremoved = callback
    }

    
}