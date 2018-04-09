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
     *
     * @param {ClientOptions} options network connection options
     *
     */
    constructor(options = {web3Instance:web3,acc:undefined,address:undefined}) {
        super(options)
    }

    /**
     *
     * checks if a given account is admin of the contract
     *
     * @param addr target account address
     * @returns {Promise.<bool,Error>} A promise that resolves to a bool indicating if the requested account
     * is admin of the contract or an Error if the promisse is rejected
     */
    async isAdmin(addr){
        let result = await this.__deveryRegistryContract.isAdmin(addr);
        return result.valueOf();
    }


    /**
     * makes an account admin of the contract by adding it to the admin array
     *
     * @param addr target account address
     * @returns {Promise.<Transaction,Error>} A promise that resolves to a transaction or an Error if the promisse is rejected
     */
    async addAdmin(addr){
        let result = await this.__deveryRegistryContract.addAdmin(addr);
        return result.valueOf();
    }

    /**
     * removes admin role from an account
     *
     * @param addr target account address
     * @returns {Promise.<Transaction,Error>} A promise that resolves to a transaction or an Error if the promisse is rejected
     */
    async removeAdmin(addr){
        let result = await this.__deveryRegistryContract.removeAdmin(addr);
        return result.valueOf();
    }


    /**
     * This is a callback function that will be invoked in response to adminEvents
     *
     * @callback adminEventCallback
     * @param {string} address the address that was added or removed from the admin list
     * (this depends on the type of event that you are listening)
     */

    /**
     *
     * Listener to AdminAdded events, this event triggers whenever a new address is added as admin.
     * please note that the AdminAddedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AdminAddedEventListeners, just call this function passing undefined
     * as param
     *
     * @param {adminEventCallback} callback the callback that will be executed whenever and AdminAdded event is
     * triggered
     */
    setAdminAddedEventListener(callback){
        this.__deveryRegistryContract.onadminadded = callback
    }

    /**
     *
     * Listener to AdminRemoved events, this event triggers whenever a new address is removed from the admin list.
     * please note that the AdminRemovedEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AdminRemovedEventListener, just call this function passing undefined
     * as param
     *
     * @param {adminEventCallback} callback the callback that will be executed whenever and AdminRemoved event is
     * triggered
     */
    setAdminRemovedEventListener(callback){
        this.__deveryRegistryContract.onadminremoved = callback
    }

    
}

export default DeveryAdmined