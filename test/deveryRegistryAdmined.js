var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");
import {createDeveryAdmined} from './helpers/staticData'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};


contract('DeveryRegistry - Admined - basic tests', function (accounts) {

    let contractAddress;
    const contractOwner = accounts[0];
    const adminToBeAddedAndRemoved = accounts[1];
    const accountFromNonAdmin = accounts[5];


    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        contractAddress = contract.address
    })

    it('should be possible check if someone is admin', async function () {

        let deveryAdmined = createDeveryAdmined(web3,undefined,contractOwner,contractAddress)
        let isAdmin = await deveryAdmined.isAdmin(contractOwner)
        assert.isTrue(isAdmin,'someshow the contract owner is not admin')
        isAdmin = await deveryAdmined.isAdmin(accountFromNonAdmin)
        assert.isNotTrue(isAdmin,'this account should not be admin')
    })

    it('should be possible to owners add admins',async function () {
        let deveryAdmined = createDeveryAdmined(web3,undefined,contractOwner,contractAddress)
        let isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved)
        assert.isNotTrue(isAdmin,'this account should not be admin')
        await deveryAdmined.addAdmin(adminToBeAddedAndRemoved)
        isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved)
        assert.isTrue(isAdmin,'this account should be admin now')

    });

    it('should be possible to owners remove admins', async function () {
        let deveryAdmined = createDeveryAdmined(web3,undefined,contractOwner,contractAddress)
        let isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved)
        assert.isTrue(isAdmin,'this account should be admin now')
        await deveryAdmined.removeAdmin(adminToBeAddedAndRemoved)
        isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved)
        assert.isNotTrue(isAdmin,'this account should not be admin')

    });

    it('should not be possible add admins if you are not owner', function (done) {
        (async function(){
            let deveryAdmined = createDeveryAdmined(web3,undefined,accountFromNonAdmin,contractAddress)
            try{
                await deveryAdmined.addAdmin(accounts[6])
                done('Fail no exception raised')
            }
            catch(e){
                assert.equal(e.message,'VM Exception while processing transaction: revert','wrong exception')
                done();
            }
        })()
    });

    it('should not be possible remove admins if you are not owner', function (done) {
        (async function(){
            let deveryAdmined = createDeveryAdmined(web3,undefined,accountFromNonAdmin,contractAddress)
            try{
                await deveryAdmined.addAdmin(accounts[6])
                done('Fail no exception raised')
            }
            catch(e){
                assert.equal(e.message,'VM Exception while processing transaction: revert','wrong exception')
                done();
            }
        })()
    });

    it('should receive callback when an admin is added',function(){
        this.timeout(8000);
        return new Promise(async function(resolve,reject){
            let deveryAdminedNonAdmin = createDeveryAdmined(web3,undefined,accountFromNonAdmin,contractAddress)
            let deveryAdminedAdmin = createDeveryAdmined(web3,undefined,contractOwner,contractAddress)
            deveryAdminedNonAdmin.setAdminAddedEventListener((address)=>{
                assert.equal(adminToBeAddedAndRemoved.toLowerCase(),address.toLowerCase())
                resolve();
            })
            deveryAdminedAdmin.addAdmin(adminToBeAddedAndRemoved)
        })
    });

    it('should receive callback when an admin is removed', function(){
        this.timeout(8000);
        return new Promise(async function(resolve,reject) {
            let deveryAdminedNonAdmin = createDeveryAdmined(web3, undefined, accountFromNonAdmin, contractAddress)
            let deveryAdminedAdmin = createDeveryAdmined(web3, undefined, contractOwner, contractAddress)
            deveryAdminedNonAdmin.setAdminRemovedEventListener((address) => {
                assert.equal(adminToBeAddedAndRemoved.toLowerCase(), address.toLowerCase())
                resolve()
            })
            deveryAdminedAdmin.removeAdmin(adminToBeAddedAndRemoved)
        })
    })
});