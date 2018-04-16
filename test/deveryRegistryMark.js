var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");
import {getData} from './helpers/staticData'
import {createDeveryRegistry} from './helpers/staticData'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};


contract('DeveryRegistry - Mark - basic tests', function (accounts) {

    let contractAddress;
    let totalBrands = 0;
    let totalProducts = 0
    const data = getData(accounts)
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

        //TODO: setup token address

        await Promise.all(promisseArray)

    })

    it('should be possible to brand accounts add permission marker accounts',async function(){
        let account = data[0]
        let markerAcc = accounts[3];
        let deveryClient = createDeveryRegistry(web3,undefined,account.appAccount,contractAddress);
        await deveryClient.permissionMarker(markerAcc,true);
        //shall not trow exceptions
    })

    it('should be possible to brand accounts change permission marker accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should compute the hash of an product address',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to a permissioned account mark an existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should not be possible to a permissioned account mark an non existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to a non permissioned account mark an existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to a non permissioned account mark an existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to check a marked item',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to check a non marked item',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when a permission marker account is changed',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when a product is marked',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

})

