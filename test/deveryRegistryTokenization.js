import { createDeveryAdmined, createDeveryRegistry } from './helpers/staticData';
import DeveryRegistry from '../devery/DeveryRegistry';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
  };

contract('DeveryRegistry - Tokens - tokenization tests', (accounts) => {
  let contractAddress;
  let devery;
  let myAccount;
  // const brandOwner = accounts[0];
  
  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    contractAddress = contract.address;
    const brandName = 'Cool brand'
    //we don't need to test app, or brand related stuff here, so we'll just
    //create it here, in the before method
    // let DeveryRegistry;
    
    // ---> App creation
    myAccount = accounts[0]
   devery = createDeveryRegistry(web3, undefined, myAccount, contractAddress);
    const tx = 5;
    await devery.addApp('Test app', myAccount, tx, overrideOptions);
    const app = await devery.getApp(myAccount);

    // --> Brand registry
    await devery.addBrand(myAccount, brandName, overrideOptions);
    const addedBrand = await devery.getBrand(myAccount);
    
  });

  it('Should create a new Product correctly', async () => {
    const productName = 'My test Product'
    const productDetails = 'test details'
    const productYear  = 2019
    const productPlace = 'unknown place'
    const newProduct = await devery.addProduct(myAccount, productName, productDetails, productYear, productPlace);
    console.log('newProduct \n\n\n\n\n', newProduct)
  });

});
