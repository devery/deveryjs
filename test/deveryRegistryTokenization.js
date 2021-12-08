import { createDeveryERC721, createDeveryRegistry } from './helpers/staticData';
import Utils from '../devery/Utils';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');
const DeveryERC721Contract = artifacts.require('./DeveryERC721MetadataToken.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};

contract('DeveryRegistry - ERC721 - tokenization tests', (accounts) => {
  let deveryRegistry;
  const myAccount = accounts[0];
  let deveryERC721Contract;

  const [productName, productDetails, productYear, productPlace] = ['My test Product', 'test details', 2019, 'unknown place'];
  const brandName = 'Cool brand';

  before(async () => {
    const { address: deveryRegistryContractAddress } = await DeveryRegistryContract.deployed();
    deveryERC721Contract = await DeveryERC721Contract.deployed();
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    await deveryERC721Instance.setDeveryRegistryAddress(deveryRegistryContractAddress, overrideOptions);
    // we don't need to test app, or brand related stuff here, so we'll just
    // create it here, in the before method
    deveryRegistry = createDeveryRegistry(web3, undefined, myAccount, deveryRegistryContractAddress);
    const { provider } = deveryRegistry.getProvider();
    // ---> App creation
    const { hash } = await deveryRegistry.addApp('Test app', myAccount, 0, overrideOptions);
    await provider.waitForTransaction(hash);
    // --> Brand registry
    const { hash: hash2 } = await deveryRegistry.addBrand(myAccount, brandName, overrideOptions);
    await provider.waitForTransaction(hash2);
    // --> Product creation
    const { hash: hash3 } = await deveryRegistry.addProduct(myAccount, productName, productDetails, productYear, productPlace, overrideOptions);
    await provider.waitForTransaction(hash3);
  });

  it('should be able to claim a token', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const productsBeforeTransaction = await deveryERC721Instance.getProductsByOwner(myAccount);
    const { hash } = await deveryERC721Instance.claimProduct(myAccount, 6);
    await deveryERC721Instance.getProvider().provider.waitForTransaction(hash);
    const productsAfterTransaction = await deveryERC721Instance.getProductsByOwner(myAccount);
    assert.equal(productsBeforeTransaction.length, productsAfterTransaction.length - 6, 'The product token was not claimed');
  });

  it('should be able to estimate gas for a claim operation', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();

    const [gasLimit, gasPrice] = await Promise.all([
      deveryERC721Instance.estimateClaimProduct(myAccount, 1),
      provider.getGasPrice(),
    ]);
    const weiEstimated = gasPrice.mul(gasLimit);

    const balanceBeforeClaim = await provider.getBalance(myAccount);

    const { hash } = await deveryERC721Instance.claimProduct(myAccount, 1);
    await provider.waitForTransaction(hash);

    const balanceAfterClaim = await provider.getBalance(myAccount);
    const weiConsumed = balanceBeforeClaim.sub(balanceAfterClaim);
    assert.isTrue(weiConsumed.toNumber() > 0, 'claim operation should consume some gas');
    assert.approximately(
      weiConsumed.toNumber(),
      weiEstimated.toNumber(),
      weiEstimated.div(3).toNumber(), // within 33% precision
      'estimate for the claim operation was not precise',
    );
  });

  it('should be able to transfer a token', async () => {
    // should use two accounts
    // should transfer a product between the two of them
    // should verify if the product sent from account number 1 matches product on account number 2
    // should check if account one is empty
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const fromAccount = myAccount;
    const toAccount = accounts[1];

    const productsOwnedByFromAccount = await deveryERC721Instance.getProductsByOwner(fromAccount);
    assert.isAtLeast(productsOwnedByFromAccount.length, 1, 'The from-account does not have any product');

    const productsOwnedByToAccount = await deveryERC721Instance.getProductsByOwner(toAccount);
    assert.equal(productsOwnedByToAccount.length, 0, 'the to-account has products (expected to have none)');

    // we already know the from account has at least one product, so we can get its token using
    const productTokenId = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 0);
    const productAddress = await deveryERC721Instance.tokenIdToProduct(productTokenId);
    assert.equal(productsOwnedByFromAccount[0], productAddress, 'The token does not correspond to the expected product');

    const { hash } = await deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, productTokenId);
    await deveryERC721Instance.getProvider().provider.waitForTransaction(hash);

    const productsOwnedByToAccountAfterTransfer = await deveryERC721Instance.getProductsByOwner(toAccount);
    assert.equal(productsOwnedByToAccount.length, productsOwnedByToAccountAfterTransfer.length - 1, 'The product was not transferred correctly');
    assert.equal(productsOwnedByFromAccount[0], productsOwnedByToAccountAfterTransfer[0], 'The product transferred from the original account is not the same product in the destination account');
  });

  it('should be able to listen to the transfer events', function () {
    this.timeout(5000);
    return new Promise((async (resolve, reject) => {
      const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

      const fromAccount = myAccount;
      const toAccount = accounts[1];

      const productsOwnedByFromAccount = await deveryERC721Instance.getProductsByOwner(fromAccount);
      assert.isAtLeast(productsOwnedByFromAccount.length, 1, 'The from-account does not have any product');
      // we already know the from account has at least one product, so we can get its token using
      const productTokenId = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 0);

      //@todo: we have to create a new devery ERC721 instance here because of the event listener issue
      // when triggering for past events here
      // https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts#L757
      const deveryERC721Instance2 = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
      deveryERC721Instance2.setTransferEventListener((from, to, tokenId) => {
        try {
          assert.equal(from, fromAccount, 'from-account does not match');
          assert.equal(to, toAccount, 'to-account does not match');
          assert.equal(tokenId.toString(), productTokenId, 'tokenId does not match');
          resolve();
        } finally {
          deveryERC721Instance2.setTransferEventListener();
        }
      });

      deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, productTokenId);
    }));
  });

  it('should receive only expected transfer callbacks', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();

    const fromAccount = myAccount;
    const toAccount = accounts[1];

    const productsOwnedByFromAccount = await deveryERC721Instance.getProductsByOwner(fromAccount);
    assert.isAtLeast(productsOwnedByFromAccount.length, 1, 'The from-account does not have enough tokens');
    // we already know the from account has enough tokens, so we can get a token using
    const tokenId1 = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 0);
    const tokenId2 = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 1);
    const tokenId3 = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 2);
    // the callback should not be called here
    const tx1 = await deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, tokenId1);
    await provider.waitForTransaction(tx1.hash);

    //@todo: we have to create a new devery ERC721 instance here because of the event listener issue
    // when triggering for past events here
    // https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts#L757
    const deveryERC721Instance2 = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    deveryERC721Instance2.setTransferEventListener((from, to, tokenId) => {
      try {
        assert.equal(from, fromAccount, 'from-account does not match');
        assert.equal(to, toAccount, 'to-account does not match');
        assert.equal(tokenId.toString(), tokenId2, 'tokenId does not match');
      } finally {
        deveryERC721Instance2.setTransferEventListener();
      }
    });

    // the callback should be called here
    const tx2 = await deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, tokenId2);
    await provider.waitForTransaction(tx2.hash);
    // the callback should not be called here
    const tx3 = await deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, tokenId3);
    await provider.waitForTransaction(tx3.hash);
  });

  it('should be able to estimate gas for a transfer operation', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();

    const fromAccount = myAccount;
    const toAccount = accounts[1];

    const productsOwnedByFromAccount = await deveryERC721Instance.getProductsByOwner(fromAccount);
    assert.isAtLeast(productsOwnedByFromAccount.length, 1, 'The from-account does not have any product');
    const productTokenId = await deveryERC721Instance.tokenOfOwnerByIndex(fromAccount, 0);
    const productsOwnedByToAccount = await deveryERC721Instance.getProductsByOwner(toAccount);

    const [gasLimit, gasPrice] = await Promise.all([
      deveryERC721Instance.estimateSafeTransferFrom(fromAccount, toAccount, productTokenId),
      provider.getGasPrice(),
    ]);
    const weiEstimated = gasPrice.mul(gasLimit);
    const balanceBeforeTransfer = await provider.getBalance(myAccount);

    const { hash } = await deveryERC721Instance.safeTransferFrom(fromAccount, toAccount, productTokenId);
    await provider.waitForTransaction(hash);
    // check that the transfer actually occurred
    const productsOwnedByToAccountAfterTransfer = await deveryERC721Instance.getProductsByOwner(toAccount);
    assert.equal(productsOwnedByToAccount.length, productsOwnedByToAccountAfterTransfer.length - 1, 'The product was not transferred correctly');

    const balanceAfterTransfer = await provider.getBalance(myAccount);
    const weiConsumed = balanceBeforeTransfer.sub(balanceAfterTransfer);
    assert.isTrue(weiConsumed.toNumber() > 0, 'transfer operation should consume some gas');
    assert.approximately(
      weiConsumed.toNumber(),
      weiEstimated.toNumber(),
      weiEstimated.div(3).toNumber(), // within 33% precision
      'estimate for the transfer was not precise',
    );
  });

  it('should test if the method balanceOf returns the number of tokens correctly', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();

    const accountWithProducts = myAccount;
    const originalOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const originalOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(originalOwnedProductsArray.length, originalOwnedProductsQuantity, 'The length of the owned products array (at the first comparison) does not equal to the number returned by the balanceOf method');

    // creating a new product to be claimed by the account so we can verify how the methods react to this
    const productAddress = accounts[2];
    const { hash } = await deveryRegistry.addProduct(productAddress, 'productName', 'productDetails', 2019, 'brazil');
    await deveryRegistry.getProvider().provider.waitForTransaction(hash);
    const { hash: hash2 } = await deveryERC721Instance.claimProduct(productAddress, 1);
    await provider.waitForTransaction(hash2);

    const afterAddOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterAddOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterAddOwnedProductsArray.length, afterAddOwnedProductsQuantity, 'The length of the owned products array (after product add) does not equal to the number returned by the balanceOf method');
    assert.equal(afterAddOwnedProductsQuantity, (originalOwnedProductsQuantity + 1), 'The value returned by balanceOf is not changing after the use of claimProduct');

    // transferring the product so the length of the account goes back to zero
    const accountToTransfer = accounts[2];
    const productToken = await deveryERC721Instance.tokenOfOwnerByIndex(accountWithProducts, 0);
    const { hash: hash3 } = await deveryERC721Instance.safeTransferFrom(accountWithProducts, accountToTransfer, productToken);
    await provider.waitForTransaction(hash3);

    const afterTransferOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterTransferOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterTransferOwnedProductsArray.length, afterTransferOwnedProductsQuantity, 'the length of the owned products array (after transfer) does not equals the number returned by the balanceOf method');
    assert.equal(afterTransferOwnedProductsQuantity, afterAddOwnedProductsQuantity - 1, 'The value returned by balanceOf is not changing after the use of safeTransferFrom');
  });

  it('should correctly transfer a token if we pass a product address as an argument', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();

    const accountWithProducts = myAccount;
    const originalOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const originalOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(originalOwnedProductsArray.length, originalOwnedProductsQuantity, 'The length of the owned products array (at first comparison) does not equal to the number returned by the balanceOf method');

    // creating a new product to be claimed by the account so we can check how the methods react to this
    const productAddress = Utils.getRandomAddress();
    const { hash } = await deveryRegistry.addProduct(productAddress, 'productName', 'productDetails', 2019, 'brazil');
    await deveryRegistry.getProvider().provider.waitForTransaction(hash);
    const { hash: hash2 } = await deveryERC721Instance.claimProduct(productAddress, 1);
    await provider.waitForTransaction(hash2);

    const afterAddOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterAddOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterAddOwnedProductsArray.length, afterAddOwnedProductsQuantity, 'The length of the owned products array (after product add) does not equals the number returned by the balanceOf method');
    assert.equal(afterAddOwnedProductsQuantity, (originalOwnedProductsQuantity + 1), 'The value returned by balanceOf is not changing after the use of claimProduct');

    // transferring the product so the length of the account goes back
    const accountToTransfer = accounts[2];
    const { hash: hash3 } = await deveryERC721Instance.safeTransferFrom(accountWithProducts, accountToTransfer, productAddress);
    await provider.waitForTransaction(hash3);

    const afterTransferOwnedProductsArray = await deveryERC721Instance.getProductsByOwner(accountWithProducts);
    const afterTransferOwnedProductsQuantity = await deveryERC721Instance.balanceOf(accountWithProducts);

    assert.equal(afterTransferOwnedProductsArray.length, afterTransferOwnedProductsQuantity, 'the length of the owned products array (after transfer) does not equals the number returned by the balanceOf method');
    assert.equal(afterTransferOwnedProductsQuantity, afterAddOwnedProductsQuantity - 1, 'The value returned by balanceOf is not changing after the use of safeTransferFrom');
  });

  it('should return the correct total of allowed products', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const productAddress = accounts[4];
    const { hash } = await deveryRegistry.addProduct(productAddress, 'newProduct', 'productDetails', 2019, 'brazil');
    await deveryRegistry.getProvider().provider.waitForTransaction(hash);
    const originalAllowedProductsNumber = await deveryERC721Instance.totalAllowedProducts(productAddress);

    const allowedProducts = originalAllowedProductsNumber + 5;
    const { hash: hash2 } = await deveryERC721Instance.setMaximumMintableQuantity(productAddress, allowedProducts);
    await deveryERC721Instance.getProvider().provider.waitForTransaction(hash2);

    const afterSetMintableAllowerProductsNumber = await deveryERC721Instance.totalAllowedProducts(productAddress);
    assert.equal(afterSetMintableAllowerProductsNumber, allowedProducts, 'The number of allowed products does not equals the number defined by setMaximumMintableQuantity');
  });

  it('should correctly return the minted products', async () => {
    const productAddress = accounts[3];
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();

    const { hash } = await deveryRegistry.addProduct(productAddress, 'newProduct', 'productDetails', 2019, 'brazil');
    await deveryRegistry.getProvider().provider.waitForTransaction(hash);
    const originalMintedProducts = await deveryERC721Instance.totalMintedProducts(productAddress);

    const claimedProductsQuantity = 1;
    const { hash: hash2 } = await deveryERC721Instance.claimProduct(productAddress, claimedProductsQuantity);
    await provider.waitForTransaction(hash2);

    const afterAddMintedProducts = await deveryERC721Instance.totalMintedProducts(productAddress);
    assert.equal(afterAddMintedProducts, originalMintedProducts + claimedProductsQuantity, 'The number of minted products is not updating after a product being claimed');

    const secondClaimProductsQuantity = 10;
    const { hash: hash3 } = await deveryERC721Instance.claimProduct(productAddress, secondClaimProductsQuantity);
    await provider.waitForTransaction(hash3);

    const afterSecondMintProducts = await deveryERC721Instance.totalMintedProducts(productAddress);
    assert.equal(afterSecondMintProducts, afterAddMintedProducts + secondClaimProductsQuantity, 'The number of minted products is not updating after the second product claim');
  });

  it('should set the maximum mintable quantity of a product and respect it', async () => {
    // should set the maximum mintable quantity as one
    // should try to claim two products and fail
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();
    // we already know that there is a product associated with the account const (associated previously)
    // So we will just use it's address
    const alreadyMinted = await deveryERC721Instance.totalMintedProducts(myAccount);
    const { hash: hashM } = await deveryERC721Instance.setMaximumMintableQuantity(myAccount, alreadyMinted + 1);
    await provider.waitForTransaction(hashM);
    // should not fail
    try {
      const { hash } = await deveryERC721Instance.claimProduct(myAccount, 1, overrideOptions);
      await provider.waitForTransaction(hash);
    } catch (e) {
      assert.fail('something went wrong with mintable quantity control');
    }
    // should fail
    try {
      const { hash } = await deveryERC721Instance.claimProduct(myAccount, 1, overrideOptions);
      await provider.waitForTransaction(hash);
      assert.fail('The transaction didn\'t fail, something went wrong when setting the maximum mintable quantity');
    } catch (e) {
    }
  });

  it('should be possible to transfer multiple items that come from the same address', async () => {
    const TRANSFERS = 5;
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const { provider } = deveryERC721Instance.getProvider();
    const productAddress = Utils.getRandomAddress();
    const { hash } = await deveryRegistry.addProduct(productAddress, 'productName', 'productDetails', 2019, 'brazil');
    await deveryRegistry.getProvider().provider.waitForTransaction(hash);
    const { hash: hash2 } = await deveryERC721Instance.claimProduct(productAddress, TRANSFERS);
    await provider.waitForTransaction(hash2);

    const withoutProductsAccount = accounts[6];
    const totalBeforeTransfer = await deveryERC721Instance.getProductsByOwner(withoutProductsAccount);

    for (let i = 1; i <= TRANSFERS; i++) {
      const { hash: hashT } = await deveryERC721Instance.safeTransferFrom(myAccount, withoutProductsAccount, productAddress);
      await provider.waitForTransaction(hashT);
    }
    const totalAfterTransfer = await deveryERC721Instance.getProductsByOwner(withoutProductsAccount);
    assert.equal(totalAfterTransfer.length, totalBeforeTransfer.length + TRANSFERS, 'it seems that the transfers are not happening');
  });

  it('should check if an account has a specific product', async () => {
    // Will use two accounts, one of them will have the specific product
    // The other won't
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);

    const withProductAccount = myAccount;
    const withoutProductsAccount = accounts[3];

    const withProductsAccountOwned = await deveryERC721Instance.getProductsByOwner(withProductAccount);
    assert.isAbove(withProductsAccountOwned.length, 0, 'The account should have owned products');

    const productlessAccountOwned = await deveryERC721Instance.getProductsByOwner(withoutProductsAccount);
    assert.equal(productlessAccountOwned.length, 0, 'The product should not have pre-owned products');

    const transferredProductAddress = withProductsAccountOwned[0];
    const transferredProductToken = await deveryERC721Instance.tokenOfOwnerByIndex(withProductAccount, 0);

    const { hash } = await deveryERC721Instance.safeTransferFrom(withProductAccount, withoutProductsAccount, transferredProductToken);
    await deveryERC721Instance.getProvider().provider.waitForTransaction(hash);

    const accountOwnProduct = await deveryERC721Instance.hasAccountClaimedProduct(withoutProductsAccount, transferredProductAddress);
    assert.isTrue(accountOwnProduct, 'The account should have the tested product, hence it was recently transferred');
  });

  it('should be able to set and retrieve metadata URI for a token', async () => {
    const deveryERC721Instance = createDeveryERC721(web3, undefined, myAccount, deveryERC721Contract.address);
    const productsOwned = await deveryERC721Instance.getProductsByOwner(myAccount);
    assert.isAtLeast(productsOwned.length, 1, 'The account does not have any tokens');
  
    const productTokenId = await deveryERC721Instance.tokenOfOwnerByIndex(myAccount, 0);
    try {
      await deveryERC721Instance.setTokenURI(productTokenId, 'http://my-json-server.typicode.com/abcoathup/samplenft/tokens/0');
    }
    catch (e) {
      console.log('error!');
      console.log(e);
    }
    const uri = await deveryERC721Instance.tokenURI(productTokenId);
    assert.equal(uri, 'http://my-json-server.typicode.com/abcoathup/samplenft/tokens/0');
  });
});
