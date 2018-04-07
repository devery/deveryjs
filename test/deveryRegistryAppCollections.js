import DeveryRegistry from './../devery/DeveryRegistry'
import generateData from './helpers/staticData'
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
    const data = generateData(accounts);

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        let deveryInstance;
        let promisseArray = [];
        contractAddress = contract.address;

        for(let currentApp of data){
            deveryInstance = createDeveryRegistry(web3,undefined,currentApp.appAccount,contractAddress);
            promisseArray.push(deveryInstance.addApp(currentApp.appName,currentApp.feeAccount, currentApp.fee,overrideOptions))
        }

        await Promise.all(promisseArray);

    })

    it('should return the correct number of accounts - 8', async function () {
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let appAccountsLenght = await deveryInstance.appAccountsLength()
        assert.equal(data.length,appAccountsLenght, 'total accounts does not match expect accounts length')
    })

    it('shoulbe be possible to return access account addresses individually', async function () {
        let randomIndex = Math.floor(Math.random() * data.length)
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddress = await deveryInstance.appAccountsArray(randomIndex)
        assert.equal(accAddress.toLowerCase(),data[randomIndex].appAccount.toLowerCase())

    })

    it('should return paginated data', async function () {
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.appAccountsPaginated()
        for(let returnedAccIdx in accAddressArray){
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),data[returnedAccIdx].appAccount.toLowerCase(),
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
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),data[(currentPage*pageSize+returnedAccIdx)].appAccount.toLowerCase(),
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
                assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),data[currentPage*pageSize+returnedAccIdx].appAccount.toLowerCase(),
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
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),data[returnedAccIdx].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })


})
