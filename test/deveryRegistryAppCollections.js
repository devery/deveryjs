import { getData } from './helpers/staticData';
import { createDeveryRegistry } from './helpers/staticData';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};


contract('DeveryRegistry - App - collection tests', (accounts) => {
  let contractAddress;
  const data = getData(accounts);

  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    let deveryInstance;
    const promisseArray = [];
    contractAddress = contract.address;

    for (const currentApp of data) {
      deveryInstance = createDeveryRegistry(web3, undefined, currentApp.appAccount, contractAddress);
      promisseArray.push(deveryInstance.addApp(currentApp.appName, currentApp.feeAccount, currentApp.fee, overrideOptions));
    }

    await Promise.all(promisseArray);
  });

  it('should return the correct number of accounts - 8', async () => {
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const appAccountsLenght = await deveryInstance.appAccountsLength();
    assert.equal(data.length, appAccountsLenght, 'total number of accounts does not match expected accounts length');
  });

  it('should be possible to return access account addresses individually', async () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const accAddress = await deveryInstance.appAccountsArray(randomIndex);
    assert.equal(accAddress.toLowerCase(), data[randomIndex].appAccount.toLowerCase());
  });

  it('should return paginated data', async () => {
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const accAddressArray = await deveryInstance.appAccountsPaginated();
    for (const returnedAccIdx in accAddressArray) {
      assert.equal(
        accAddressArray[returnedAccIdx].toLowerCase(), data[returnedAccIdx].appAccount.toLowerCase(),
        `accounts at index ${returnedAccIdx} does not match`,
      );
    }
  });

  it('should return with different more than one page', async () => {
    const pageSize = 3;
    const currentPage = 1;
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const accAddressArray = await deveryInstance.appAccountsPaginated(currentPage, pageSize);
    assert.equal(accAddressArray.length, pageSize, 'pageSize does not match');
    for (let returnedAccIdx in accAddressArray) {
      returnedAccIdx = parseInt(returnedAccIdx);
      assert.equal(
        accAddressArray[returnedAccIdx].toLowerCase(), data[(currentPage * pageSize + returnedAccIdx)].appAccount.toLowerCase(),
        `accounts at index ${returnedAccIdx} does not match`,
      );
    }
  });

  it('should return with different more than one page and the last page not complete', async () => {
    it('should return with different more than one page', async () => {
      const pageSize = 5;
      const currentPage = 1;
      const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
      const accAddressArray = await deveryInstance.appAccountsPaginated(currentPage, pageSize);
      assert.notEqual(accAddressArray.length, pageSize, 'the page should not be full');
      for (let returnedAccIdx in accAddressArray) {
        returnedAccIdx = parseInt(returnedAccIdx);
        assert.equal(
          accAddressArray[returnedAccIdx].toLowerCase(), data[currentPage * pageSize + returnedAccIdx].appAccount.toLowerCase(),
          `accounts at index ${returnedAccIdx} does not match`,
        );
      }
    });
  });

  it('should return with different page sizes', async () => {
    const pageSize = 3;
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const accAddressArray = await deveryInstance.appAccountsPaginated(0, 3);
    assert.equal(accAddressArray.length, pageSize, 'pageSize does not match');
    for (const returnedAccIdx in accAddressArray) {
      assert.equal(
        accAddressArray[returnedAccIdx].toLowerCase(), data[returnedAccIdx].appAccount.toLowerCase(),
        `accounts at index ${returnedAccIdx} does not match`,
      );
    }
  });

  //new tests
  it('should return the correct app name for a given index', async () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const appData = await deveryInstance.getAppByIndex(randomIndex);
    assert.equal(appData.appName, data[randomIndex].appName, 'app name does not match with expected app name');
  });

  it('should return the correct fee account for a given index', async () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const appData = await deveryInstance.getAppByIndex(randomIndex);
    assert.equal(appData.feeAccount, data[randomIndex].feeAccount, 'fee account does not match with expected fee account');
  });

  it('should return the correct fee for a given index', async () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const deveryInstance = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const appData = await deveryInstance.getAppByIndex(randomIndex);
    assert.equal(appData.fee, data[randomIndex].fee, 'fee does not match with expected fee');
  });




});
