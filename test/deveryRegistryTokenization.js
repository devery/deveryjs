import { createDeveryERC721, createDeveryRegistry } from './helpers/staticData';
import Utils from '../devery/Utils';

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
  let deveryERC721Contract

  const [productName, productDetails, productYear, productPlace] = ['My test Product', 'test details', 2019, 'unknown place'];


  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    contractAddress = contract.address;
    myAccount = accounts[0]
    deveryERC721Contract = await DeveryERC721Contract.deployed();
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
    assert.equal(productsBeforeTransaction.length, productsAfterTransaction.length - 1, "The product wasn't trasnfered to the account")
  });

  it('Should be able to transfer a token', async () => {
    // should use two accounts
    // should transfer a product between the two of them
    // should verify if the product sent from account number 1 matches product on account number 2
    // should check if account one is empty
    const deveryERC721Contract = await DeveryERC721Contract.deployed();
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const fromAccount = myAccount;
    const toAccount = accounts[1];

    let productsOwnedByFromAccount = await deveryERC721Instance.getProductsByOwner(fromAccount);
    assert.equal(productsOwnedByFromAccount.length, 1, "The from account doesn't have any product" );

    let producstOwnedByToAccount = await deveryERC721Instance.getProductsByOwner(toAccount);
    assert.equal(producstOwnedByToAccount.length, 0, "the to account has products (expected to have none)");

    // we already know the from account has one product, so we can get it's token using
    const productTokenId = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 0);
    const productAddres = await deveryERC721Instance.tokenIdToProduct(productTokenId);


    // refactor this message
    assert.equal(productsOwnedByFromAccount[0], productAddres,"The token doesn't correspond to the product you desire");
    await deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, productTokenId);
    const productsOwnedByToAccountAfterTransfer = await deveryERC721Instance.getProductsByOwner(toAccount)
    assert.equal(producstOwnedByToAccount.length, productsOwnedByToAccountAfterTransfer.length - 1, "The product wasn't transferred correctly");
    assert.equal(productsOwnedByFromAccount[0], productsOwnedByToAccountAfterTransfer[0], 'The product transferred from the original account is not the same product in the destination account');
  })

  it('Should test if the method balanceOf returns the number of tokens correctly', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const accountWithProducts = myAccount
    const originalOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const originalOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(originalOwnedProductsArray.length, originalOwnedProductsQuantity, 'The length of the owned products array (at first comparison) does not equals the number returned by the balanceOf method');

    //creating a new product to be claimed by the account so we can how the methods react to this

    const productAddress = accounts[2]
    await deveryRegistry.addProduct(productAddress, 'productName', 'productDetails', 2019, 'brazil');
    await deveryERC721Instance.claimProduct(productAddress, 1);

    const afterAddOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterAddOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterAddOwnedProductsArray.length, afterAddOwnedProductsQuantity, 'The length of the owned products array (after product add) does not equals the number returned by the balanceOf method');
    assert.equal(afterAddOwnedProductsQuantity, (originalOwnedProductsQuantity + 1), 'The value returned by balanceOf is not changing after the use of claimProduct');

    //transfering the product so the length of the account goes back to zero
    const accountToTransfer = accounts[2]
    const productToken = await deveryERC721Instance.tokenOfOwnerByIndex(accountWithProducts, 0);
    await deveryERC721Instance.safeTransferFrom(accountWithProducts, accountToTransfer,  productToken);

    const afterTransferOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterTransferOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterTransferOwnedProductsArray.length, afterTransferOwnedProductsQuantity, 'the length of the owned products array (after transfer) does not equals the number returned by the balanceOf method')
    assert.equal(afterTransferOwnedProductsQuantity, afterAddOwnedProductsQuantity - 1, 'The value returned by balanceOf is not changing after the use of safeTransferFrom')
  })

  it('Should correctly transfer a token if we pass the address as argument',async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const accountWithProducts = myAccount
    const originalOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const originalOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(originalOwnedProductsArray.length, originalOwnedProductsQuantity, 'The length of the owned products array (at first comparison) does not equals the number returned by the balanceOf method');

    //creating a new product to be claimed by the account so we can how the methods react to this

    const productAddress = Utils.getRandomAddress();
    await deveryRegistry.addProduct(productAddress, 'productName', 'productDetails', 2019, 'brazil');
    await deveryERC721Instance.claimProduct(productAddress, 1);

    const afterAddOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterAddOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterAddOwnedProductsArray.length, afterAddOwnedProductsQuantity, 'The length of the owned products array (after product add) does not equals the number returned by the balanceOf method');
    assert.equal(afterAddOwnedProductsQuantity, (originalOwnedProductsQuantity + 1), 'The value returned by balanceOf is not changing after the use of claimProduct');

    //transfering the product so the length of the account goes back to zero
    const accountToTransfer = accounts[2]
    await deveryERC721Instance.safeTransferFrom(accountWithProducts, accountToTransfer,  productAddress);

    const afterTransferOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterTransferOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterTransferOwnedProductsArray.length, afterTransferOwnedProductsQuantity, 'the length of the owned products array (after transfer) does not equals the number returned by the balanceOf method')
    assert.equal(afterTransferOwnedProductsQuantity, afterAddOwnedProductsQuantity - 1, 'The value returned by balanceOf is not changing after the use of safeTransferFrom')

  });

  it('Should return the correct total of allowed products', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const deveryInstance = createDeveryRegistry(web3, undefined, myAccount, deveryERC721Contract.address);
    
    const productAdrress = accounts[4]
    await deveryRegistry.addProduct(productAdrress, 'newProduct', 'productDetails', 2019, 'brazil');
    const originalAllowedProductsNumber = await deveryERC721Instance.totalAllowedProducts(productAdrress);

    const allowedProducts = 5
    await deveryERC721Instance.setMaximumMintableQuantity(productAdrress, allowedProducts);
    const afterSetMintableAllowerProductsNumber = await deveryERC721Instance.totalAllowedProducts(productAdrress);

    assert.equal(afterSetMintableAllowerProductsNumber, allowedProducts, 'The number of allowed products does not equals the number defined by setMaximumMintableQuantity')
  })

  it('Should correctly return the minted products', async () => {
    const productAddrress = accounts[3]
    const account = myAccount;
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const devery = createDeveryRegistry(web3, undefined, myAccount, deveryERC721Contract.address);

    await deveryRegistry.addProduct(productAddrress, 'newProduct', 'productDetails', 2019, 'brazil');
    const originalMintedProducts = await deveryERC721Instance.totalMintedProducts(productAddrress)

    const claimedProductsQuantity = 1
    await deveryERC721Instance.claimProduct(productAddrress, claimedProductsQuantity);

    const afterAddMintedProducts = await deveryERC721Instance.totalMintedProducts(productAddrress)
    assert.equal(afterAddMintedProducts, originalMintedProducts + claimedProductsQuantity, 'The number of minted products is not updating after product being clamed');

    const secondClaimProductsQuantity = 10;
    await deveryERC721Instance.claimProduct(productAddrress, secondClaimProductsQuantity);

    const afterSecondMintProducts = await deveryERC721Instance.totalMintedProducts(productAddrress);
    assert.equal(afterSecondMintProducts, afterAddMintedProducts + secondClaimProductsQuantity, 'The number of minted producst is not updating after second product claim');

  })

  it('Should set the maximum mintable quantity of a product and respect it', async () => {
    //Should use two accounts
    //should set the maximum mintable quantity as one
    //should try to claim two products and fail
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const account = myAccount;
    //we already know that there is a product associated with the account const (associated previously)
    //So we will just use it's address
    await deveryERC721Instance.setMaximumMintableQuantity(account, 1);
    let hasTransactionFailed = false
    const FailedTransaction = deveryERC721Instance.claimProduct(account, 2, overrideOptions).then(transaction  => {
      console.log('the transasction was a success (which means things went wrong)');
    }).catch(err => {
      hasTransactionFailed = true
    });
    assert.equal(hasTransactionFailed, false, "The transaction didn't failed, something went wrong when setting the maximum mintable quantity");
  });

  it('should check if an account has a specific product', async () => {
    //Will use two accounts, one of them will have the specific product
    //The other won't

    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    
    const withProductAccount = myAccount;
    const withoutProductsAccount = accounts[3];
    
    const withProductsAccountOwned = await deveryERC721Instance.getProductsByOwner(withProductAccount);
    assert.isAbove(withProductsAccountOwned.length, 0, 'The account should have owned products');
    
    const productlessAccountOwned = await deveryERC721Instance.getProductsByOwner(withoutProductsAccount);
    assert.equal(productlessAccountOwned.length, 0, 'The product should not have pre-owned produts');

    const transferedProductAddress = withProductsAccountOwned[0]
    const transferedProductToken = await deveryERC721Instance.tokenOfOwnerByIndex(withProductAccount, 0);
    
    await deveryERC721Instance.safeTransferFrom(withProductAccount, withoutProductsAccount, transferedProductToken);

    const accountOwnProduct = await deveryERC721Instance.hasAccountClaimendProduct(withoutProductsAccount, transferedProductAddress);
    assert.equal(accountOwnProduct, true, 'The account should have the tested product, hence it was recently transfered');
  })
});
