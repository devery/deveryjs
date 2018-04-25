var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");
import {createDeveryOwned} from './helpers/staticData'


const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};


contract('DeveryRegistry - Owned - basic tests', function (accounts) {

    let contractAddress;
    const ownerAccount = accounts[0]
    const newOwnerAccount = accounts[1]

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        contractAddress = contract.address
    })


    it('should get owner address',async function(){
        let devery = createDeveryOwned(web3,undefined,ownerAccount,contractAddress)
        let owner = await devery.getOwner()
        assert.equal(owner.toLowerCase(),ownerAccount.toLowerCase(),'Wrong owner account')
    })

    it('should be possible to initiate the ownership transfer',async function(){
        let devery = createDeveryOwned(web3,undefined,ownerAccount,contractAddress)
        await devery.transferOwnership(newOwnerAccount)
    })

    it('should get new owner address',async function(){
        let devery = createDeveryOwned(web3,undefined,ownerAccount,contractAddress)
        let newOwner = await devery.getNewOwner()
        assert.equal(newOwner.toLowerCase(),newOwnerAccount.toLowerCase(),'Wrong owner account')
    })

    it('accept the ownerships',async function(){
        let devery = createDeveryOwned(web3,undefined,newOwnerAccount,contractAddress)
        await devery.acceptOwnership()
        let owner = await devery.getOwner()
        assert.equal(owner.toLowerCase(),newOwnerAccount.toLowerCase(),'Wrong owner account')
    })

    it('should receive callback when ownership is changed',async function(){
        this.timeout(5000)
        return new Promise(async function(resolve,reject){
            let devery = createDeveryOwned(web3,undefined,newOwnerAccount,contractAddress)
            devery.setOwnershipTransferredListener((fromAcc,toAcc) =>{
                assert.equal(fromAcc.toLowerCase(),newOwnerAccount.toLowerCase())
                assert.equal(toAcc.toLowerCase(),ownerAccount.toLowerCase())
                //we need to remove the listener otherwise mocha will never exit
                devery.setOwnershipTransferredListener(null);
                resolve()
            })
            await devery.transferOwnership(ownerAccount)
            let devery2 = createDeveryOwned(web3,undefined,ownerAccount,contractAddress)
            await devery2.acceptOwnership()

        })
    })


})