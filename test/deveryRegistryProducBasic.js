var DeveryRegistryContract = artifacts.require("./DeveryRegistry.sol");
import {getData} from './helpers/staticData'
import {createDeveryRegistry} from './helpers/staticData'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};


contract('DeveryRegistry - Product - basic tests', function (accounts) {

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

    it('should create a new Product correctly', async function(){
        let product = data[0].brands[0].products[0]
        let deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
        let productsCount = await deveryClient.productAccountsLength();
        await deveryClient.addProduct(product.productAccount,product.description,product.details,product.year,product.origin,overrideOptions)
        let newProductsCount = await deveryClient.productAccountsLength();
        assert.equal(productsCount+1,newProductsCount,'the new product has not been included');
        let blockChainProduct = await deveryClient.getProduct(product.productAccount)
        assert.equal(blockChainProduct.productAccount.toLowerCase(),product.productAccount.toLowerCase())
        assert.equal(blockChainProduct.description,product.description)
        assert.equal(blockChainProduct.year.toNumber(),product.year)
        assert.equal(blockChainProduct.origin,product.origin)
    })

    it('should read Products accounts from other accounts',async function(){
        let product = data[0].brands[0].products[0]
        let deveryClient = createDeveryRegistry(web3, undefined, accounts[9], contractAddress);
        let blockChainProduct = await deveryClient.getProduct(product.productAccount)
        assert.equal(blockChainProduct.productAccount.toLowerCase(),product.productAccount.toLowerCase())
        assert.equal(blockChainProduct.description,product.description)
        assert.equal(blockChainProduct.year.toNumber(),product.year)
        assert.equal(blockChainProduct.origin,product.origin)
    })

    it('should not be possible to create more than Product with the same Product account address',async function(){
        return new Promise(async function(resolve, reject){
            try{
                let product = data[0].brands[0].products[0]
                let deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
                await deveryClient.addProduct(product.productAccount,product.description,product.details,product.year,product.origin,overrideOptions)

            }
            catch (e){
                assert.equal(e.message,'VM Exception while processing transaction: revert','wrong exception')
                resolve('success');
            }

        })
    })

    it('should be possible to update the Product account',async function(){
        let product = data[0].brands[0].products[0]
        let productUpdated = data[1].brands[0].products[0]
        let deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
        await deveryClient.updateProduct(product.productAccount,productUpdated.description,productUpdated.details
            ,productUpdated.year,productUpdated.origin,true,overrideOptions)
        let blockChainProduct = await deveryClient.getProduct(product.productAccount)
        assert.equal(blockChainProduct.productAccount.toLowerCase(),product.productAccount.toLowerCase())
        assert.equal(blockChainProduct.description,productUpdated.description)
        assert.equal(blockChainProduct.year.toNumber(),productUpdated.year)
        assert.equal(blockChainProduct.origin,productUpdated.origin)
    })


    it('should receive callback when another brad is created',function(done){
        this.timeout(5000);
        let product = data[3].brands[0].products[0]
        let deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
        deveryClient.addProduct(product.productAccount,product.description,product.details,product.year,product.origin,overrideOptions);
        deveryClient.setProductAddedEventListener((productAccount,brandAccount,appAccount,description,active)=>{
            try{
                assert.equal(productAccount.toLowerCase(),product.productAccount.toLowerCase())
                assert.equal(description,product.description)
                assert.equal(active,true)
                done();
            }
            catch (e){

            }
        })
    })


    it('should receive callback when another Product is updated',async function(){
        this.timeout(5000);
        let product = data[3].brands[0].products[0]
        let deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
        deveryClient.updateApp(product.productAccount,product.description,product.details,product.year,product.origin,false,overrideOptions);
        deveryClient.setProductAddedEventListener((productAccount,brandAccount,appAccount,description,active)=>{
            try{
                assert.equal(productAccount.toLowerCase(),product.productAccount.toLowerCase())
                assert.equal(description,product.description)
                assert.equal(active,false)
                done();
            }
            catch (e){

            }
        })
    })
})
