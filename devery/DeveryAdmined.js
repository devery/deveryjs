import AbstractDeverySmartContract from './AbstractDeverySmartContract'


/**
 *
 * Main class to deal with contract administration related operations,
 * you can use it to check the current admins and listen to admin related
 * events
 *
 * @extends AbstractDeverySmartContract
 */
class DeveryAdmined extends AbstractDeverySmartContract {

    /**
     *
     * Creates a new instansce of DeveryAdmined
     *
     * @param options
     */
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

export default DeveryAdmined