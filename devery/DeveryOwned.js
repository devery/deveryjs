import AbstractDeverySmartContract from './AbstractDeverySmartContract'

/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and list to ownership change related
 * events
 *
 * @extends AbstractDeverySmartContract
 */
class DeveryOwned extends AbstractDeverySmartContract {

    /**
     *
     * Creates a new instansce of DeveryOwned
     *
     *
     * @param {ClientOptions} options network connection options
     */
    constructor(options = {web3Instance:web3,acc:undefined,address:undefined}) {
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

    /**
     * This is a callback function that will be invoked in response to adminEvents
     *
     * @callback OwnershipEventCallback
     * @param {string} fromAddress
     * @param {string} toAddress
     */

    /**
     *
     * Listener to OwnershipTransferred events, this event triggers whenever the smart contract ownership changes
     * (what is a very unlikely event).
     * please note that OwnershipTransferredEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a OwnershipTransferredEventListeners, just call this function passing undefined
     * as param
     *
     * @param {OwnershipEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
    setOwnershipTransferredListener(callback){
        this.__deveryRegistryContract.onownershiptransferred = callback
    }

    /**
     *
     * @returns {Promise.<*>}
     */
    async getOwner(){
        let result = await this.__deveryRegistryContract.owner();
        return result.valueOf();
    }

    async getNewOwner(){
        let result = await this.__deveryRegistryContract.newOwner();
        return result.valueOf();
    }
}

export default DeveryOwned