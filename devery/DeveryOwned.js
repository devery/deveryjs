import AbstractDeverySmartContract from './AbstractDeverySmartContract'

export default class DeveryOwned extends AbstractDeverySmartContract {

    constructor(signer = web3, provider, acc, address) {
        super(...arguments)
    }

}