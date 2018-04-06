import AbstractDeverySmartContract from './AbstractDeverySmartContract'

export default class DeveryAdmined extends AbstractDeverySmartContract {

    constructor(signer = web3, provider, acc, address) {
        super(...arguments)
    }

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




//     mapping (address => bool) public admins;
//
//     event AdminAdded(address addr);
//     event AdminRemoved(address addr);
//
//     modifier onlyAdmin() {
//         require(isAdmin(msg.sender));
//         _;
//     }
//
//     function isAdmin(address addr) public constant returns (bool) {
//         return (admins[addr] || owner == addr);
//     }
//     function addAdmin(address addr) public onlyOwner {
//     require(!admins[addr] && addr != owner);
//     admins[addr] = true;
//     AdminAdded(addr);
// }
// function removeAdmin(address addr) public onlyOwner {
//     require(admins[addr]);
//     delete admins[addr];
//     AdminRemoved(addr);
// }
}