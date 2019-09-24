import { createDeveryERC721, createDeveryRegistry } from './helpers/staticData';
import DeveryRegistry from '../devery/DeveryRegistry';
import DeveryERC721 from '../devery/DeveryERC721';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');
const DeveryERC721Contract = artifacts.require('./DeveryERC721Token.sol');

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
  };

contract('DeveryRegistry - ERC721 - tokenization tests', (accounts) => {
  let contractAddress;
  let deveryRegistry;
  let myAccount;
  let app;
  let product;

  const [productName, productDetails, productYear, productPlace] = ['My test Product', 'test details', 2019, 'unknown place'];

  
  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    contractAddress = contract.address;
    myAccount = accounts[0]
    const deveryERC721Contract = await DeveryERC721Contract.deployed();
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    await deveryERC721Instance.setDeveryRegistryAddress(contractAddress, overrideOptions);
    const brandName = 'Cool brand'
    //we don't need to test app, or brand related stuff here, so we'll just
    //create it here, in the before method
    // let DeveryRegistry;
    
    // ---> App creation
    deveryRegistry = createDeveryRegistry(web3, undefined, myAccount, contractAddress);
    const tx = 0;
    await deveryRegistry.addApp('Test app', myAccount, tx, overrideOptions);
    app = await deveryRegistry.getApp(myAccount);
    

    // --> Brand registry
    await deveryRegistry.addBrand(myAccount, brandName, overrideOptions);
    const addedBrand = await deveryRegistry.getBrand(myAccount);

    // --> Product creation
    const newProduct = await deveryRegistry.addProduct(myAccount, productName, productDetails, productYear, productPlace, overrideOptions);
    product = await deveryRegistry.getProduct(myAccount)
  });

  it('Should be able to claim a token', async () => {
    const deveryERC721Contract = await DeveryERC721Contract.deployed();
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const productsBeforeTransaction = await deveryERC721Instance.getProductsByOwner(myAccount)
    await deveryERC721Instance.claimProduct(myAccount, 1, overrideOptions);
    const productsAfterTransaction = await deveryERC721Instance.getProductsByOwner(myAccount)
    assert.equal(productsBeforeTransaction.length, productsAfterTransaction.length -1, "The product wasn't trasnfered to the account")
  });




});
