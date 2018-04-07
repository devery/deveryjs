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

contract('DeveryRegistry - Brand - basic tests', async function (accounts) {

    let contractAddress;
    const data = generateData(accounts);

    before(async function () {
        let contract = await DeveryRegistryContract.deployed();
        contractAddress = contract.address
        //We don't need to test app related stuff here  so we will pre create it
        let deveryRegistry;

        let promisseArray = [];
        for(let account of data){
            deveryRegistry = createDeveryRegistry(web3,null,account.appAccount,contractAddress)
            promisseArray.push(deveryRegistry.addApp(account.appName,account.feeAccount,account.fee,overrideOptions))
        }
        await Promise.all(promisseArray)

    })


    it('should create a new Brand correctly', async function(){

        const accData = data[0];
        const brand = accData.brands[0]

        let devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
        let brandsLength = await devery.brandAccountsLength();
        await devery.addBrand(brand.brandAccount,brand.brandName,overrideOptions);
        let brandsLengthAfterAddition = await devery.brandAccountsLength();
        assert.equal(brandsLength+1,brandsLengthAfterAddition,'the number of brands was not increased by 1')
        let addedBrand = await devery.getBrand(brand.brandAccount);
        assert.equal(addedBrand.brandName,brand.brandName);
        assert.equal(addedBrand.brandAccount.toLowerCase(),brand.brandAccount.toLowerCase());
        assert.equal(addedBrand.appAccount.toLowerCase(),brand.appAccount.toLowerCase());
        assert.equal(addedBrand.active,brand.active);

    })

    it('should read brands accounts from other accounts',async function(){
        const accData = data[0];
        const brand = accData.brands[0];
        const readAcc = data[1].appAccount
        let devery = createDeveryRegistry(web3, undefined, readAcc, contractAddress);
        let retrievedAcc = await devery.getBrand(brand.brandAccount);
        assert.equal(retrievedAcc.brandName,brand.brandName);
        assert.equal(retrievedAcc.brandAccount.toLowerCase(),brand.brandAccount.toLowerCase());
        assert.equal(retrievedAcc.appAccount.toLowerCase(),brand.appAccount.toLowerCase());
        assert.equal(retrievedAcc.active,brand.active);


    })

    it('should not be possible to create more than brand with the same brand account address',async function(){
        this.timeout(5000)
        return new Promise(async function(resolve,reject){
            const accData = data[0];
            const brand = accData.brands[0]

            let devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
            try{
                await devery.addBrand(brand.brandAccount,brand.brandName,overrideOptions);
                reject('This account has alread been added')
            }
            catch (e){
                assert.equal(e.message,'VM Exception while processing transaction: revert','wrong exception');
                resolve();
            }

        })
    })

    it('should be possible to update the brand account',async function(){
        const accData = data[0];
        const brand = accData.brands[0]
        const updatedName = "updated Brand name"
        const active = false;

        let devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
        let brandsLength = await devery.brandAccountsLength();
        await devery.updateBrand(brand.brandAccount,updatedName,active,overrideOptions);
        let brandsLengthAfterAddition = await devery.brandAccountsLength();
        assert.equal(brandsLength,brandsLengthAfterAddition,'the number of brands should stay the same')
        let addedBrand = await devery.getBrand(brand.brandAccount);
        assert.equal(addedBrand.brandName,updatedName);
        assert.equal(addedBrand.brandAccount.toLowerCase(),brand.brandAccount.toLowerCase());
        assert.equal(addedBrand.appAccount.toLowerCase(),brand.appAccount.toLowerCase());
        assert.equal(addedBrand.active,active);
    })


    it('should receive callback when another brand is created',async function(){
        this.timeout(5000)
        return new Promise(function(resolve,reject){
            const accData = data[3];
            const brand = accData.brands[0]
            let devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
            devery.setBrandAddedEventListener((brandAccount,appAccount,brandName,active)=>{

                assert.equal(brandAccount.toLowerCase(),brand.brandAccount.toLowerCase())
                assert.equal(appAccount.toLowerCase(),brand.appAccount.toLowerCase())
                assert.equal(brandName,brand.brandName)
                assert.equal(active,brand.active)
                resolve();
            })
            devery.addBrand(brand.brandAccount,brand.brandName,overrideOptions)
        })

    })


    it('should receive callback when another brand is updated',async function(){
        this.timeout(5000)
        return new Promise(function(resolve,reject){
            const accData = data[3];
            const brand = accData.brands[0];
            const updatedName = "updated name";
            const active = false;
            let devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
            devery.setBrandUpdatedEventListener((brandAccount,appAccount,brandName,active)=>{assert.equal(brandAccount.toLowerCase(),brand.brandAccount.toLowerCase())
                assert.equal(appAccount.toLowerCase(),brand.appAccount.toLowerCase())
                assert.equal(brandName,updatedName)
                assert.equal(active,active)
                resolve();
            })
            devery.updateBrand(brand.brandAccount,updatedName,active,overrideOptions)
        })
    })
})
