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
        assert.equal(appName,app.appName,'App name does not match');

    })

    it('should read accounts apps from other accounts',async function(){
        const acc1 = accounts[1];
        const acc2 = accounts[2];

        let deveryAcc1 = createDeveryRegistry(web3, undefined, acc1, contractAddress);
        let deveryAcc2 = createDeveryRegistry(web3, undefined, acc2, contractAddress);

        let appAddress = await deveryAcc1.appAccountsArray(0);

        let appAcc1 = await deveryAcc1.getApp(appAddress)
        let appAcc2 = await deveryAcc2.getApp(appAddress)

        assert.equal(appAcc1.appName,appAcc2.appName,'different apps returned')
        assert.isTrue(appAcc1.appName.length>0,'the app name was empty')
    })

    it('should not be possible to create more than one app per account',function(done){
        (async function(){
            const appName = "My nice account"
            const myAcc = accounts[1];
            const feeAcc = accounts[2];
            const tx = 5;

            let devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);

            try{
                let transaction = await devery.addApp(appName, feeAcc, tx, overrideOptions);
                done('No exception raised')
            }
            catch (e){
                assert.equal(e.message,'VM Exception while processing transaction: revert','wrong exception')
                done();
            }
        })()
    })

    it('should be possible to update the account',async function(){
        const appName = "My nice account updated"
        const myAcc = accounts[1];
        const feeAcc = accounts[2];
        const active = false;
        const fee = 5;

        let devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
        await devery.updateApp(appName, feeAcc, fee,active, overrideOptions);
        let appsLength = await devery.appAccountsLength();
        assert.equal(1, appsLength, "new account was not created");
        let app = await devery.getApp(myAcc)
        assert.equal(appName,app.appName,'App name does not match');
        assert.equal(feeAcc.toLowerCase(),app.feeAccount.toLowerCase(),'Fee accountsdoes not match');
        assert.equal(fee,app.fee,'Fees does not match');
        assert.equal(active,app.active,'active status does not match');
        assert.equal(myAcc.toLowerCase(),app.appAccount.toLowerCase(),'App account does not match');
    })


    it('should receive callback when another app is created',function(done){
        const appName = "My newly created app"
        const senderAccount = accounts[7];
        const listenerAccount = accounts[2];
        const feeAccount = accounts[3];
        const fee = 5;
        this.timeout(5000);

        let deveryTrigger = createDeveryRegistry(web3, undefined, senderAccount, contractAddress);
        let deveryListener = createDeveryRegistry(web3, undefined, listenerAccount, contractAddress);
        deveryListener.setAppAddedEventListener((callbackAppAcc,callbackAppName,callbackFeeAccount,callbackFee
            )=>{

            assert.equal(callbackAppAcc.toLowerCase(),senderAccount.toLowerCase(),'appAcount is not same');
            assert.equal(callbackAppName,appName,'appName is not same');
            assert.equal(callbackFeeAccount.toLowerCase(),feeAccount.toLowerCase(),'feeAccount is not same');
            assert.equal(callbackFee,fee,'app fee is not same');
            done();

        });

        deveryTrigger.addApp(appName, feeAccount, fee, overrideOptions);
    })


    it('should receive callback when another app is changed',function(done){
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
});