import DeveryRegistry from './../devery/DeveryRegistry';
import { getData } from './helpers/staticData';
import { createDeveryRegistry } from './helpers/staticData';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};


contract('DeveryRegistry - Brand - basic tests', (accounts) => {
  let contractAddress;
  const data = getData(accounts);

  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    contractAddress = contract.address;
    // We don't need to test app related stuff here  so we will pre create it
    let deveryRegistry;

    const promisseArray = [];
    for (const account of data) {
      deveryRegistry = createDeveryRegistry(web3, null, account.appAccount, contractAddress);
      promisseArray.push(deveryRegistry.addApp(account.appName, account.feeAccount, account.fee, overrideOptions));
    }
    await Promise.all(promisseArray);
  });


  it('should create a new Brand correctly', async () => {
    const accData = data[0];
    const brand = accData.brands[0];

    const devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
    const brandsLength = await devery.brandAccountsLength();
    await devery.addBrand(brand.brandAccount, brand.brandName, overrideOptions);
    const brandsLengthAfterAddition = await devery.brandAccountsLength();
    assert.equal(brandsLength + 1, brandsLengthAfterAddition, 'the number of brands was not increased by 1');
    const addedBrand = await devery.getBrand(brand.brandAccount);
    assert.equal(addedBrand.brandName, brand.brandName);
    assert.equal(addedBrand.brandAccount.toLowerCase(), brand.brandAccount.toLowerCase());
    assert.equal(addedBrand.appAccount.toLowerCase(), brand.appAccount.toLowerCase());
    assert.equal(addedBrand.active, brand.active);
  });

  it('should read brands accounts from other accounts', async () => {
    const accData = data[0];
    const brand = accData.brands[0];
    const readAcc = data[1].appAccount;
    const devery = createDeveryRegistry(web3, undefined, readAcc, contractAddress);
    const retrievedAcc = await devery.getBrand(brand.brandAccount);
    assert.equal(retrievedAcc.brandName, brand.brandName);
    assert.equal(retrievedAcc.brandAccount.toLowerCase(), brand.brandAccount.toLowerCase());
    assert.equal(retrievedAcc.appAccount.toLowerCase(), brand.appAccount.toLowerCase());
    assert.equal(retrievedAcc.active, brand.active);
  });

  it('should not be possible to create more than brand with the same brand account address', async function () {
    this.timeout(5000);
    return new Promise((async (resolve, reject) => {
      const accData = data[0];
      const brand = accData.brands[0];

      const devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
      try {
        await devery.addBrand(brand.brandAccount, brand.brandName, overrideOptions);
        reject('This account has alread been added');
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        resolve();
      }
    }));
  });

  it('should be possible to update the brand account', async () => {
    const accData = data[0];
    const brand = accData.brands[0];
    const updatedName = 'updated Brand name';
    const active = false;

    const devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
    const brandsLength = await devery.brandAccountsLength();
    await devery.updateBrand(brand.brandAccount, updatedName, active, overrideOptions);
    const brandsLengthAfterAddition = await devery.brandAccountsLength();
    assert.equal(brandsLength, brandsLengthAfterAddition, 'the number of brands should stay the same');
    const addedBrand = await devery.getBrand(brand.brandAccount);
    assert.equal(addedBrand.brandName, updatedName);
    assert.equal(addedBrand.brandAccount.toLowerCase(), brand.brandAccount.toLowerCase());
    assert.equal(addedBrand.appAccount.toLowerCase(), brand.appAccount.toLowerCase());
    assert.equal(addedBrand.active, active);
  });


  it('should receive callback when another brand is created', async function () {
    this.timeout(5000);
    return new Promise(((resolve, reject) => {
      const accData = data[3];
      const brand = accData.brands[0];
      const devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
      devery.setBrandAddedEventListener((brandAccount, appAccount, brandName, active) => {
        try {
          assert.equal(brandAccount.toLowerCase(), brand.brandAccount.toLowerCase());
          assert.equal(appAccount.toLowerCase(), brand.appAccount.toLowerCase());
          assert.equal(brandName, brand.brandName);
          assert.equal(active, brand.active);
          // we need to remove the listener otherwise mocha will never exit
          devery.setBrandAddedEventListener(null);
          resolve();
        } catch (e) {
          // as might receive multiple callbacks we will look only for the right one
        }
      });
      devery.addBrand(brand.brandAccount, brand.brandName, overrideOptions);
    }));
  });


  it('should receive callback when another brand is updated', async function () {
    this.timeout(5000);
    return new Promise(((resolve, reject) => {
      const accData = data[3];
      const brand = accData.brands[0];
      const updatedName = 'updated name';
      const active = false;
      const devery = createDeveryRegistry(web3, undefined, accData.appAccount, contractAddress);
      devery.setBrandUpdatedEventListener((brandAccount, appAccount, brandName, active) => {
        assert.equal(brandAccount.toLowerCase(), brand.brandAccount.toLowerCase());
        try {
          assert.equal(appAccount.toLowerCase(), brand.appAccount.toLowerCase());
          assert.equal(brandName, updatedName);
          assert.equal(active, active);
          // we need to remove the listener otherwise mocha will never exit
          devery.setBrandUpdatedEventListener(null);
          resolve();
        } catch (e) {
          // as might receive multiple callbacks we will look only for the right one
        }
      });
      devery.updateBrand(brand.brandAccount, updatedName, active, overrideOptions);
    }));
  });
});
