import { getData } from './helpers/staticData';
import { createDeveryRegistry } from './helpers/staticData';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};


contract('DeveryRegistry - Product - basic tests', (accounts) => {
  let contractAddress;
  let totalBrands = 0;
  const data = getData(accounts);
  const brandsArr = [];

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
  });

  it('should create a new Product correctly', async () => {
    const product = data[0].brands[0].products[0];
    const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
    const productsCount = await deveryClient.productAccountsLength();
    await deveryClient.addProduct(product.productAccount, product.description, product.details, product.year, product.origin, overrideOptions);
    const newProductsCount = await deveryClient.productAccountsLength();
    assert.equal(productsCount + 1, newProductsCount, 'the new product has not been included');
    const blockChainProduct = await deveryClient.getProduct(product.productAccount);
    assert.equal(blockChainProduct.productAccount.toLowerCase(), product.productAccount.toLowerCase());
    assert.equal(blockChainProduct.description, product.description);
    assert.equal(blockChainProduct.year.toNumber(), product.year);
    assert.equal(blockChainProduct.origin, product.origin);
  });

  it('should read Products accounts from other accounts', async () => {
    const product = data[0].brands[0].products[0];
    const deveryClient = createDeveryRegistry(web3, undefined, accounts[9], contractAddress);
    const blockChainProduct = await deveryClient.getProduct(product.productAccount);
    assert.equal(blockChainProduct.productAccount.toLowerCase(), product.productAccount.toLowerCase());
    assert.equal(blockChainProduct.description, product.description);
    assert.equal(blockChainProduct.year.toNumber(), product.year);
    assert.equal(blockChainProduct.origin, product.origin);
  });

  it('should return 0x0000000000000000000000000000000000000000 for non existing products', async () => {
    const deveryClient = createDeveryRegistry(web3, undefined, accounts[9], contractAddress);
    const blockChainProduct = await deveryClient.
      getProduct('0xFBFba92F40B1507B7b087885f0d2F4C40aEd6d9F');
    assert.equal(blockChainProduct.productAccount.toLowerCase(), '0x0000000000000000000000000000000000000000');
  });



  it('should not be possible to create more than one Product with the same Product account address', () => new Promise((async (resolve, reject) => {
    try {
      const product = data[0].brands[0].products[0];
      const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
      await deveryClient.addProduct(product.productAccount, product.description, product.details, product.year, product.origin);
    } catch (e) {
      assert(e.message.startsWith("the product that you're trying to mark already exists"), `wrong exception ${e.message}`);
      resolve('success');
    }
  })));

  it('should be possible to update the Product account', async () => {
    const product = data[0].brands[0].products[0];
    const productUpdated = data[1].brands[0].products[0];
    const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
    await deveryClient.updateProduct(
      product.productAccount, productUpdated.description, productUpdated.details
      , productUpdated.year, productUpdated.origin, true,
    );
    const blockChainProduct = await deveryClient.getProduct(product.productAccount);
    assert.equal(blockChainProduct.productAccount.toLowerCase(), product.productAccount.toLowerCase());
    assert.equal(blockChainProduct.description, productUpdated.description);
    assert.equal(blockChainProduct.year.toNumber(), productUpdated.year);
    assert.equal(blockChainProduct.origin, productUpdated.origin);
  });


  it('should receive callback when another product is created', function (done) {
    this.timeout(5000);
    const product = data[3].brands[0].products[0];
    const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
    deveryClient.addProduct(product.productAccount, product.description, product.details, product.year, product.origin);
    deveryClient.setProductAddedEventListener((productAccount, brandAccount, appAccount, description, active) => {
      try {
        assert.equal(productAccount.toLowerCase(), product.productAccount.toLowerCase());
        assert.equal(description, product.description);
        assert.equal(active, true);
        // we need to remove the listener otherwise mocha will never exit
        deveryClient.setProductAddedEventListener(null);
        done();
      } catch (e) {

      }
    });
  });


  it('should receive callback when another Product is updated', function () {
    this.timeout(5000);
    return new Promise((resolve, reject) => {
      const product = data[3].brands[0].products[0];
      const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
      const xxx = deveryClient.updateProduct(
        product.productAccount, product.description, product.details
        , product.year, product.origin, false,
      );
      deveryClient.setProductUpdatedEventListener((productAccount, brandAccount, appAccount, description, active) => {
        try {
          assert.equal(productAccount.toLowerCase(), product.productAccount.toLowerCase());
          assert.equal(description, product.description);
          assert.equal(active, false);
          // we need to remove the listener otherwise mocha will never exit
          deveryClient.setProductUpdatedEventListener(null);
          resolve('success');
        } catch (e) {

        }
      });
    });
  });

  //new test

  import { getData } from './helpers/staticData';
  import { createDeveryRegistry } from './helpers/staticData';

  const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

  const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
  };


  contract('DeveryRegistry - Product - basic tests', (accounts) => {
    let contractAddress;
    let totalBrands = 0;
    const data = getData(accounts);
    const brandsArr = [];

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
    });

    it('should create a new Product correctly', async () => {
      const product = data[0].brands[0].products[0];
      const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
      const productsCount = await deveryClient.productAccountsLength();
      await deveryClient.addProduct(product.productAccount, product.description, product.details, product.year, product.origin, overrideOptions);
      const newProductsCount = await deveryClient.productAccountsLength();
      assert.equal(productsCount + 1, newProductsCount, 'the new product has not been included');
      const blockChainProduct = await deveryClient.getProduct(product.productAccount);
      assert.equal(blockChainProduct.productAccount.toLowerCase(), product.productAccount.toLowerCase());
      assert.equal(blockChainProduct.description, product.description);
      assert.equal(blockChainProduct.year.toNumber(), product.year);
      assert.equal(blockChainProduct.origin, product.origin);
    });

    it('should read Products accounts from other accounts', async () => {
      const product = data[0].brands[0].products[0];
      const deveryClient = createDeveryRegistry(web3, undefined, accounts[9], contractAddress);
      const blockChainProduct = await deveryClient.getProduct(product.productAccount);
      assert.equal(blockChainProduct.productAccount.toLowerCase(), product.productAccount.toLowerCase());
      assert.equal(blockChainProduct.description, product.description);
      assert.equal(blockChainProduct.year.toNumber(), product.year);
      assert.equal(blockChainProduct.origin, product.origin);
    });

    it('should return 0x0000000000000000000000000000000000000000 for non existing products', async () => {
      const deveryClient = createDeveryRegistry(web3, undefined, accounts[9], contractAddress);
      const blockChainProduct = await deveryClient.
        getProduct('0xFBFba92F40B1507B7b087885f0d2F4C40aEd6d9F');
      assert.equal(blockChainProduct.productAccount.toLowerCase(), '0x0000000000000000000000000000000000000000');
    });



    it('should not be possible to create more than one Product with the same Product account address', () => new Promise((async (resolve, reject) => {
      try {
        const product = data[0].brands[0].products[0];
        const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
        await deveryClient.addProduct(product.productAccount, product.description, product.details, product.year, product.origin);
      } catch (e) {
        assert(e.message.startsWith("the product that you're trying to mark already exists"), `wrong exception ${e.message}`);
        resolve('success');
      }
    })));

    it('should be possible to update the Product account', async () => {
      const product = data[0].brands[0].products[0];
      const productUpdated = data[1].brands[0].products[0];
      const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
      await deveryClient.updateProduct(
        product.productAccount, productUpdated.description, productUpdated.details
        , productUpdated.year, productUpdated.origin, true,
      );
      const blockChainProduct = await deveryClient.getProduct(product.productAccount);
      assert.equal(blockChainProduct.productAccount.toLowerCase(), product.productAccount.toLowerCase());
      assert.equal(blockChainProduct.description, productUpdated.description);
      assert.equal(blockChainProduct.year.toNumber(), productUpdated.year);
      assert.equal(blockChainProduct.origin, productUpdated.origin);
    });


    it('should receive callback when another product is created', function (done) {
      this.timeout(5000);
      const product = data[3].brands[0].products[0];
      const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
      deveryClient.addProduct(product.productAccount, product.description, product.details, product.year, product.origin);
      deveryClient.setProductAddedEventListener((productAccount, brandAccount, appAccount, description, active) => {
        try {
          assert.equal(productAccount.toLowerCase(), product.productAccount.toLowerCase());
          assert.equal(description, product.description);
          assert.equal(active, true);
          // we need to remove the listener otherwise mocha will never exit
          deveryClient.setProductAddedEventListener(null);
          done();
        } catch (e) {

        }
      });
    });


    it('should receive callback when another Product is updated', function () {
      this.timeout(5000);
      return new Promise((resolve, reject) => {
        const product = data[3].brands[0].products[0];
        const deveryClient = createDeveryRegistry(web3, undefined, product.productAccount, contractAddress);
        const xxx = deveryClient.updateProduct(
          product.productAccount, product.description, product.details
          , product.year, product.origin, false,
        );
        deveryClient.setProductUpdatedEventListener((productAccount, brandAccount, appAccount, description, active) => {
          try {
            assert.equal(productAccount.toLowerCase(), product.productAccount.toLowerCase());
            assert.equal(description, product.description);
            assert.equal(active, false);
            // we need to remove the listener otherwise mocha will never exit
            deveryClient.setProductUpdatedEventListener(null);
            resolve('success');
          } catch (e) {

          }
        });
      });
    });
  });

});
