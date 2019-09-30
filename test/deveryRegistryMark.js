import { getData } from './helpers/staticData';
import { createDeveryRegistry } from './helpers/staticData';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};


contract('DeveryRegistry - Mark - basic tests', (accounts) => {
  let contractAddress;
  let totalBrands = 0;
  let totalProducts = 0;
  const data = getData(accounts);
  const brandsArr = [];
  const productsArr = [];

  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    let deveryRegistry;
    contractAddress = contract.address;

    let promisseArray = [];
    for (const account of data) {
      deveryRegistry = createDeveryRegistry(web3, null, account.appAccount, contractAddress);
      promisseArray.push(deveryRegistry.addApp(account.appName, account.feeAccount, account.fee, overrideOptions));
    }
    await Promise.all(promisseArray);
    promisseArray = [];
    for (const account of data) {
      deveryRegistry = createDeveryRegistry(web3, null, account.appAccount, contractAddress);
      for (const brand of account.brands) {
        totalBrands++;
        brandsArr.push(brand);
        promisseArray.push(deveryRegistry.addBrand(brand.brandAccount, brand.brandName, overrideOptions));
      }
    }

    await Promise.all(promisseArray);
    promisseArray = [];

    for (const account of data) {
      for (const brand of account.brands) {
        deveryRegistry = createDeveryRegistry(web3, null, brand.brandAccount, contractAddress);
        for (const product of brand.products) {
          totalProducts++;
          productsArr.push(product);
          promisseArray.push(deveryRegistry.addProduct(product.productAccount, product.description, product.details, product.year, product.origin, overrideOptions));
        }
      }
    }

    // TODO: setup token address

    await Promise.all(promisseArray);
  });

  it('should be possible to brand accounts add permission marker accounts', async () => {
    const account = data[0];
    const markerAcc = accounts[3];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    await deveryClient.permissionMarker(markerAcc, true);
    // shall not trow exceptions
  });

  it('should be possible to brand accounts change permission marker accounts', async () => {
    const account = data[0];
    const markerAcc = accounts[3];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    await deveryClient.permissionMarker(markerAcc, false);
    // shall not trow exceptions
    // maybe try to mark an item
  });

  it('should compute the hash of an product address', async () => {
    const account = data[0];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    const hash = await deveryClient.addressHash('0xf17f52151EbEF6C7334FAD080c5704D77216b732');
    // pre calculated hash
    assert.equal(hash, '0xe52111628d5433237c36e91f159620decfa7747d736dee9676f3afc40471618a');
  });

  it('should be possible to a permissioned account mark an existing product', async () => {
    const account = data[0];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    await deveryClient.permissionMarker(account.appAccount, true);
    const hash = await deveryClient.addressHash(account.brands[0].products[0].productAccount);
    await deveryClient.mark(account.brands[0].products[0].productAccount, hash);
    const markedResult = await deveryClient.check(account.brands[0].products[0].productAccount);
    assert.notEqual('0x0000000000000000000000000000000000000000', markedResult.appAccount);
  });

  it('should be possible to a add and mark the products in one go', async () => {
    const account = data[0];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    const customProduct = {
      productAccount: '0xCAF3CEE3557E22c76Afee33246ec64468Cd9362b',
      brandAccount: accounts[1],
      description: 'Another product',
      details: 'Another product 1 details',
      year: 2010,
      origin: 'Another product 1 origin',
      active: true,
    };
    await deveryClient.AddProductAndMark(
      customProduct.productAccount,
      customProduct.description,
      customProduct.details,
      customProduct.year,
      customProduct.origin,
      overrideOptions,
    );
    const markedResult = await deveryClient.check(customProduct.productAccount);
    assert.equal(customProduct.productAccount, markedResult.productAccount);
  });

  it('should not be possible to a permissioned account mark an non existing product', async function () {
    this.timeout(5000);
    return new Promise(async (resolve, reject) => {
      const account = data[0];
      const markerAcc = accounts[3];
      let deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
      await deveryClient.permissionMarker(markerAcc, true);
      const hash = await deveryClient.addressHash('0x78e8d6760c99d1161cf1ff78aa5e67ad3285bf3e');

      deveryClient = createDeveryRegistry(web3, undefined, markerAcc, contractAddress);
      try {
        await deveryClient.mark('0x78e8d6760c99d1161cf1ff78aa5e67ad3285bf3e', hash);
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        resolve('success');
      }
    });
  });

  it('should not be possible to a non permissioned account mark an existing product', async function () {
    this.timeout(5000);
    return new Promise(async (resolve, reject) => {
      const account = data[0];
      const markerAcc = accounts[3];
      let deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
      await deveryClient.permissionMarker(markerAcc, false);
      const hash = await deveryClient.addressHash(account.brands[0].products[0].productAccount);

      deveryClient = createDeveryRegistry(web3, undefined, markerAcc, contractAddress);
      try {
        await deveryClient.mark(account.brands[0].products[0].productAccount, hash);
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        resolve('success');
      }
    });
  });

  it('should be possible to check a marked item', async () => {
    const account = data[0];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    const markedResult = await deveryClient.check(account.brands[0].products[0].productAccount);
    assert.notEqual('0x0000000000000000000000000000000000000000', markedResult.appAccount);
  });

  it('should be possible to check a non marked item', async () => {
    const account = data[3];
    const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);
    const markedResult = await deveryClient.check(account.brands[0].products[0].productAccount);
    assert.equal('0x0000000000000000000000000000000000000000', markedResult.appAccount);
  });

  it('should receive callback when a permission marker account is changed', async function () {
    this.timeout(5000);
    return new Promise(async (resolve, reject) => {
      const account = data[1];
      const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);

      deveryClient.setPermissionedEventListener((marker, brandAccount, permission) => {
        deveryClient.setPermissionedEventListener(null);
        resolve('true');
      });

      await deveryClient.permissionMarker(account.appAccount, true);
    });
  });

  it('should receive callback when a product is marked', async function () {
    this.timeout(5000);
    return new Promise(async (resolve, reject) => {
      const account = data[1];
      const deveryClient = createDeveryRegistry(web3, undefined, account.appAccount, contractAddress);

      deveryClient.setMarkedEventListener((marker, productAccount, appFeeAccount, feeAccount, appFee, fee, itemHash) => {
        // we need to remove the listener otherwise mocha will never exit
        deveryClient.setMarkedEventListener(null);
        resolve('true');
      });

      const hash = await deveryClient.addressHash(account.brands[0].products[0].productAccount);
      await deveryClient.mark(account.brands[0].products[0].productAccount, hash);
      const markedResult = await deveryClient.check(account.brands[0].products[0].productAccount);
      assert.notEqual('0x0000000000000000000000000000000000000000', markedResult.appAccount);
    });
  });
});

