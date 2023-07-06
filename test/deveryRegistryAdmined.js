import { createDeveryAdmined } from './helpers/staticData';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};


contract('DeveryRegistry - Admined - basic tests', (accounts) => {
  let contractAddress;
  const contractOwner = accounts[0];
  const adminToBeAddedAndRemoved = accounts[1];
  const accountFromNonAdmin = accounts[5];


  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    contractAddress = contract.address;
  });

  it('should be possible to check if someone is admin', async () => {
    const deveryAdmined = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
    let isAdmin = await deveryAdmined.isAdmin(contractOwner);
    assert.isTrue(isAdmin, 'someshow the contract owner is not admin');
    isAdmin = await deveryAdmined.isAdmin(accountFromNonAdmin);
    assert.isNotTrue(isAdmin, 'this account should not be admin');
  });

  it('should be possible to owners to add admins', async () => {
    const deveryAdmined = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
    let isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved);
    assert.isNotTrue(isAdmin, 'this account should not be admin');
    await deveryAdmined.addAdmin(adminToBeAddedAndRemoved);
    isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved);
    assert.isTrue(isAdmin, 'this account should be admin now');
  });

  it('should be possible to owners to remove admins', async () => {
    const deveryAdmined = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
    let isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved);
    assert.isTrue(isAdmin, 'this account should be admin now');
    await deveryAdmined.removeAdmin(adminToBeAddedAndRemoved);
    isAdmin = await deveryAdmined.isAdmin(adminToBeAddedAndRemoved);
    assert.isNotTrue(isAdmin, 'this account should not be admin');
  });

  it('should not be possible to add admins if you are not owner', (done) => {
    (async function () {
      const deveryAdmined = createDeveryAdmined(web3, undefined, accountFromNonAdmin, contractAddress);
      try {
        await deveryAdmined.addAdmin(accounts[6]);
        done('Fail no exception raised');
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        done();
      }
    }());
  });

  it('should not be possible to remove admins if you are not owner', (done) => {
    (async function () {
      const deveryAdmined = createDeveryAdmined(web3, undefined, accountFromNonAdmin, contractAddress);
      try {
        await deveryAdmined.addAdmin(accounts[6]);
        done('Fail no exception raised');
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        done();
      }
    }());
  });

  it('should receive callback when an admin is added', function () {
    this.timeout(8000);
    return new Promise((async (resolve, reject) => {
      const deveryAdminedNonAdmin = createDeveryAdmined(web3, undefined, accountFromNonAdmin, contractAddress);
      const deveryAdminedAdmin = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
      deveryAdminedNonAdmin.setAdminAddedEventListener((address) => {
        assert.equal(adminToBeAddedAndRemoved.toLowerCase(), address.toLowerCase());
        // we need to remove the listener otherwise mocha will never exit
        deveryAdminedNonAdmin.setAdminAddedEventListener(null);
        resolve();
      });
      deveryAdminedAdmin.addAdmin(adminToBeAddedAndRemoved);
    }));
  });

  it('should receive callback when an admin is removed', function () {
    this.timeout(8000);
    return new Promise((async (resolve, reject) => {
      const deveryAdminedNonAdmin = createDeveryAdmined(web3, undefined, accountFromNonAdmin, contractAddress);
      const deveryAdminedAdmin = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
      deveryAdminedNonAdmin.setAdminRemovedEventListener((address) => {
        assert.equal(adminToBeAddedAndRemoved.toLowerCase(), address.toLowerCase());
        // we need to remove the listener otherwise mocha will never exit
        deveryAdminedNonAdmin.setAdminRemovedEventListener(null);
        resolve();
      });
      deveryAdminedAdmin.removeAdmin(adminToBeAddedAndRemoved);
    }));
  });


  //novos

  it('should always make the owner an admin', async () => {
    const deveryAdmined = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
    let isAdmin = await deveryAdmined.isAdmin(contractOwner);
    assert.isTrue(isAdmin, 'the contract owner should always be an admin');
  });


  it('should not allow non-admin accounts to perform admin tasks', async () => {
    const deveryAdmined = createDeveryAdmined(web3, undefined, accountFromNonAdmin, contractAddress);
    let isAdmin = await deveryAdmined.isAdmin(accountFromNonAdmin);
    assert.isNotTrue(isAdmin, 'this account should not be an admin');
    await deveryAdmined.addAdmin(accounts[2]).catch(error => {
      assert(error.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${error.message}`);
    });
  });


  it('should fire an event when admin role is given', function () {
    this.timeout(8000);
    return new Promise((async (resolve, reject) => {
      const deveryAdmined = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
      deveryAdmined.setAdminAddedEventListener((address) => {
        assert.equal(adminToBeAddedAndRemoved.toLowerCase(), address.toLowerCase());
        deveryAdmined.setAdminAddedEventListener(null);
        resolve();
      });
      deveryAdmined.addAdmin(adminToBeAddedAndRemoved);
    }));
  });

  it('should fire an event when admin role is given', function () {
    this.timeout(8000);
    return new Promise((async (resolve, reject) => {
      const deveryAdmined = createDeveryAdmined(web3, undefined, contractOwner, contractAddress);
      deveryAdmined.setAdminAddedEventListener((address) => {
        assert.equal(adminToBeAddedAndRemoved.toLowerCase(), address.toLowerCase());
        deveryAdmined.setAdminAddedEventListener(null);
        resolve();
      });
      deveryAdmined.addAdmin(adminToBeAddedAndRemoved);
    }));
  });


  //new tests
  it('should be possible to change the active state of an app', async () => {
    const myAcc = accounts[1];
    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);

    // First check that the app is active
    let app = await devery.getApp(myAcc);
    assert.equal(true, app.active, 'App is not initially active');

    // Update the app to be inactive
    await devery.updateApp(app.appName, app.feeAccount, app.fee, false, overrideOptions);

    // Check that the app is now inactive
    app = await devery.getApp(myAcc);
    assert.equal(false, app.active, 'App did not change to inactive');
  });

  it('should be possible to update the fee account', async () => {
    const appName = 'My nice account';
    const myAcc = accounts[1];
    const newFeeAcc = accounts[3];
    const fee = 5;

    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
    await devery.updateApp(appName, newFeeAcc, fee, true, overrideOptions);
    const app = await devery.getApp(myAcc);
    assert.equal(newFeeAcc.toLowerCase(), app.feeAccount.toLowerCase(), 'Fee account was not updated');
  });

  it('should be possible to update the fee account', async () => {
    const appName = 'My nice account';
    const myAcc = accounts[1];
    const newFeeAcc = accounts[3];
    const fee = 5;

    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
    await devery.updateApp(appName, newFeeAcc, fee, true, overrideOptions);
    const app = await devery.getApp(myAcc);
    assert.equal(newFeeAcc.toLowerCase(), app.feeAccount.toLowerCase(), 'Fee account was not updated');
  });






});
