import DeveryRegistry from './../devery/DeveryRegistry'
var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");
import {getData} from './helpers/staticData'
import {createDeveryRegistry} from './helpers/staticData'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};


contract('DeveryRegistry - Brand - collection tests', function (accounts) {

    let contractAddress;
    let totalBrands = 0;
    const data = getData(accounts)
    const brandsArr = [];

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        let deveryRegistry;
        contractAddress = contract.address

        let promisseArray = [];
        for(let account of data){
            deveryRegistry = createDeveryRegistry(web3,null,account.appAccount,contractAddress)
            promisseArray.push(deveryRegistry.addApp(account.appName,account.feeAccount,account.fee,overrideOptions))
        }
        await Promise.all(promisseArray)
        promisseArray = []
        for(let account of data){
            deveryRegistry = createDeveryRegistry(web3,null,account.appAccount,contractAddress)
            for(let brand of account.brands){
                totalBrands++;
                brandsArr.push(brand)
                promisseArray.push(deveryRegistry.addBrand(brand.brandAccount,brand.brandName,overrideOptions))
            }
        }
        await Promise.all(promisseArray)

    })


    it('should return the correct number of brand accounts - 15', async function () {
        let deveryRegistry = createDeveryRegistry(web3,null,accounts[0],contractAddress)
        let brandAccountsLenght = await deveryRegistry.brandAccountsLength()
        assert.equal(brandAccountsLenght,totalBrands,'Total brand accounts does not match')
    })

    it('shoulbe be possible to return access brand accounts addresses individually', async function () {
        let randomIndex = Math.floor(Math.random() * brandsArr.length)
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddress = await deveryInstance.brandAccountsArray(randomIndex)
        assert.equal(accAddress.toLowerCase(),brandsArr[randomIndex].appAccount.toLowerCase())
    })

    it('should return paginated data', async function () {
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.brandAccountsPaginated()
        for(let returnedAccIdx in accAddressArray){
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),brandsArr[returnedAccIdx].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

    it('should return data with different page sizes(non default)', async function () {
        const pageSize = 3;
        const currentPage = 1;
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.brandAccountsPaginated(currentPage,pageSize)
        assert.equal(accAddressArray.length,pageSize, 'pageSize does not match')
        for(let returnedAccIdx in accAddressArray){
            returnedAccIdx = parseInt(returnedAccIdx);
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),brandsArr[(currentPage*pageSize+returnedAccIdx)].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

    it('should return data with different page sizes(non default) with last page non full', async function () {
        const pageSize = 5;
        const currentPage = 1;
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.brandAccountsPaginated(currentPage,pageSize)
        assert.notEqual(accAddressArray.length,pageSize, 'this page should not be full, probably the error is in the test case');
        for(let returnedAccIdx in accAddressArray){
            returnedAccIdx = parseInt(returnedAccIdx);
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),brandsArr[(currentPage*pageSize+returnedAccIdx)].appAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

})
