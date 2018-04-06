import DeveryRegistry from './../devery/DeveryRegistry'
var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};

//if we change the DeveryRegistry constructor
//we can change only one point
const createDeveryRegistry = (web3, provider, account, contractAddress) => {
    return new DeveryRegistry(web3, provider, account, contractAddress)
}

contract('DeveryRegistry - App - basic tests', async function (accounts) {

    let contractAddress;

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        contractAddress = contract.address
    })

    it('should create a new contract instance without throwing exception', async function () {
        new DeveryRegistry();
    })

    it('should be able to connect to the contract address', async function() {
        let devery = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
        let appsLength = await devery.appAccountsLength();
        assert.equal(0,appsLength,'probably the contract address is wrong')

    });

    it('should create a new app correctly', async function(){

        const appName = "My nice account"
        const myAcc = accounts[1];
        const feeAcc = accounts[2];
        const tx = 5;

        let devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
        await devery.addApp(appName, feeAcc, tx, overrideOptions);
        let appsLength = await devery.appAccountsLength();
        assert.equal(1, appsLength, "new account was not created");
        let app = await devery.getApp(myAcc)
        assert.equal(appName,app.appName,'App name does not match')

    })

    it('should read accounts apps from other accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should not be possible to create more than one app per account',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to update the account',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should read accounts apps from other accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should read accounts apps from other accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when another app is created',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


    it('should receive callback when another ap is changed',function(done){
        const appName = "My nice account updated"
        const senderAccount = accounts[1];
        const listenerAccount = accounts[2];
        const feeAccount = accounts[3];
        const fee = 5;
        const active = false;
        this.timeout(5000);

        let deveryTrigger = createDeveryRegistry(web3, undefined, senderAccount, contractAddress);
        let deveryListener = createDeveryRegistry(web3, undefined, listenerAccount, contractAddress);
        deveryListener.setAppUpdatedEventListener((callbackAppAcc,callbackAppName,callbackFeeAccount,callbackFee
                                                   ,callbackActive)=>{

            assert.equal(callbackAppAcc.toLowerCase(),senderAccount.toLowerCase(),'appAcount is not same');
            assert.equal(callbackAppName,appName,'appName is not same');
            assert.equal(callbackFeeAccount.toLowerCase(),feeAccount.toLowerCase(),'feeAccount is not same');
            assert.equal(callbackFee,fee,'app fee is not same');
            assert.equal(callbackActive,active,'appStatus is not same');

           done();

        });

        deveryTrigger.updateApp(appName, feeAccount, fee, active, overrideOptions);

    })
})

contract('DeveryRegistry - App - collection tests', async function (accounts) {

    let contractAddress;

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        contractAddress = contract.address

        //setup a lot of accounts
    })

    it('should return the correct number of accounts - 8', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('shoulbe be possible to return access account addresses individually', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return paginated data', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return with different more than one page', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return with different more than one page and the last page not complete', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return with different page sizes', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })


})

// let devery = new DeveryRegistryCls(web3, undefined, accounts[1], contractAddress);
// let trasaction = await devery.addApp("My nice account 2", accounts[0], 0, overrideOptions)
//
//
// let acc = await devery.appAccountsArray(0)
// console.log(acc)
// let totalAcc = await devery.appAccountsLength()
// let acc2 = await devery.getApp(acc)
// console.log(acc2.appName)
// assert.equal(1, totalAcc)
// //console.log(accounts[0])