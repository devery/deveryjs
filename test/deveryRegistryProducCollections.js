import DeveryRegistry from './../devery/DeveryRegistry'
var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");
import generateData from './helpers/staticData'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};

//if we change the DeveryRegistry constructor
//we can change only one point
const createDeveryRegistry = (web3, provider, account, contractAddress) => {
    return new DeveryRegistry(web3, provider, account, contractAddress)
}


contract('DeveryRegistry - Product - collection tests', async function (accounts) {


    let contractAddress;
    let totalBrands = 0;
    let totalProducts = 0
    const data = generateData(accounts)
    const brandsArr = [];
    const productsArr = []

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
        promisseArray = []

        for(let account of data){
            for(let brand of account.brands){
                deveryRegistry = createDeveryRegistry(web3,null,brand.brandAccount,contractAddress)
                for (let product of brand.products){
                    totalProducts++;
                    productsArr.push(product)
                    promisseArray.push(deveryRegistry.addProduct(product.productAccount,product.description,product.details,product.year,product.origin, overrideOptions))
                }
            }
        }


        await Promise.all(promisseArray)

    })

    it('should return the correct number of Product accounts', async function () {
        let deveryRegistry = createDeveryRegistry(web3,null,accounts[0],contractAddress)
        let productsAccountsLenght = await deveryRegistry.productAccountsLength()
        assert.equal(productsAccountsLenght,totalProducts,'Total brand accounts does not match')
    })

    it('shoulbe be possible to return access Product accounts addresses individually', async function () {
        let randomIndex = Math.floor(Math.random() * productsArr.length)
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddress = await deveryInstance.productAccountsArray(randomIndex)
        assert.equal(accAddress.toLowerCase(),productsArr[randomIndex].productAccount.toLowerCase())
    })

    it('should return paginated data', async function () {
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.productAccountsPaginated()
        for(let returnedAccIdx in accAddressArray){
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),productsArr[returnedAccIdx].productAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

    it('should return data with different page sizes(non default)', async function () {
        const pageSize = 3;
        const currentPage = 1;
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.productAccountsPaginated(currentPage,pageSize)
        assert.equal(accAddressArray.length,pageSize, 'pageSize does not match')
        for(let returnedAccIdx in accAddressArray){
            returnedAccIdx = parseInt(returnedAccIdx);
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),productsArr[(currentPage*pageSize+returnedAccIdx)].productAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

    it('should return data with different page sizes(non default) with last page non full', async function () {
        const pageSize = 5;
        const currentPage = 1;
        let deveryInstance = createDeveryRegistry(web3,undefined,accounts[0],contractAddress);
        let accAddressArray = await deveryInstance.productAccountsPaginated(currentPage,pageSize)
        assert.notEqual(accAddressArray.length,pageSize, 'this page should not be full, probably the error is in the test case');
        for(let returnedAccIdx in accAddressArray){
            returnedAccIdx = parseInt(returnedAccIdx);
            assert.equal(accAddressArray[returnedAccIdx].toLowerCase(),productsArr[(currentPage*pageSize+returnedAccIdx)].productAccount.toLowerCase(),
                `accounts at index ${returnedAccIdx} does not match`)
        }
    })

})
