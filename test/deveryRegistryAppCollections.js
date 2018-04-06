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

contract('DeveryRegistry - App - collection tests', async function (accounts) {

    let contractAddress;
    const apps = [
        {appAccount:accounts[1], appName:"first app",   feeAccount:accounts[1], fee:1,active:true },
        {appAccount:accounts[2], appName:"second app",  feeAccount:accounts[2], fee:2,active:true },
        {appAccount:accounts[3], appName:"third app",   feeAccount:accounts[3], fee:3,active:true },
        {appAccount:accounts[4], appName:"fourth app",  feeAccount:accounts[4], fee:4,active:true },
        {appAccount:accounts[5], appName:"fifth app",   feeAccount:accounts[5], fee:5,active:true },
        {appAccount:accounts[6], appName:"sixth app",   feeAccount:accounts[6], fee:6,active:true },
        {appAccount:accounts[7], appName:"seventh app", feeAccount:accounts[7], fee:7,active:true },
        {appAccount:accounts[8], appName:"eight app",   feeAccount:accounts[8], fee:8,active:true },
    ]

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        let deveryInstance;
        let promisseArray = [];
        contractAddress = contract.address;

        for(let currentApp of apps){
            deveryInstance = createDeveryRegistry(web3,undefined,currentApp.appAccount,contractAddress);
            promisseArray.push(deveryInstance.addApp(currentApp.appName,currentApp.feeAccount, currentApp.fee,overrideOptions))
        }

        await Promise.all(promisseArray);

    })

    it('should return the correct number of accounts - 8', async function () {
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let appAccountsLenght = await deveryInstance.appAccountsLength()
        assert.equal(apps.length,appAccountsLenght, 'total accounts does not match expect accounts length')
    })

    it('shoulbe be possible to return access account addresses individually', async function () {
        let randomIndex = Math.floor(Math.random() * apps.length)
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddress = await deveryInstance.appAccountsArray(randomIndex)
        assert.equal(accAddress.toLowerCase(),apps[randomIndex].appAccount.toLowerCase())

    })

    it('should return paginated data', async function () {
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.appAccountsPaginated()
        for(let returnedAccIdx in accAddressArray){
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),apps[returnedAccIdx].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

    it('should return with different more than one page', async function () {
        const pageSize = 3;
        const currentPage = 1;
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.appAccountsPaginated(currentPage,pageSize)
        assert.equal(accAddressArray.length,pageSize, 'pageSize does not match')
        for(let returnedAccIdx in accAddressArray){
            returnedAccIdx = parseInt(returnedAccIdx);
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),apps[(currentPage*pageSize+returnedAccIdx)].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

    it('should return with different more than one page and the last page not complete', async function () {
        it('should return with different more than one page', async function () {
            const pageSize = 5;
            const currentPage = 1;
            let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
            let accAddressArray = await deveryInstance.appAccountsPaginated(currentPage,pageSize)
            assert.notEqual(accAddressArray.length,pageSize, 'the page should not be full')
            for(let returnedAccIdx in accAddressArray){
                returnedAccIdx = parseInt(returnedAccIdx);
                assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),apps[currentPage*pageSize+returnedAccIdx].appAccount.toLowerCase(),
                    `accounts at index ${returnedAccIdx} does not match`)
            }
        })
    })

    it('should return with different page sizes', async function () {
        const pageSize = 3;
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.appAccountsPaginated(0,3)
        assert.equal(accAddressArray.length,pageSize, 'pageSize does not match')
        for(let returnedAccIdx in accAddressArray){
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),apps[returnedAccIdx].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })


})
