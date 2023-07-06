import DeveryRegistry from './../devery/DeveryRegistry';
import { createDeveryRegistry } from './helpers/staticData';

const DeveryRegistryContract = artifacts.require('./DeveryRegistry.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};


contract('DeveryRegistry - App - basic tests', (accounts) => {
  let contractAddress;

  before(async () => {
    const contract = await DeveryRegistryContract.deployed();
    contractAddress = contract.address;
  });

  it.skip('should create a new contract instance without throwing exception', async () => {
    new DeveryRegistry();
  });

  it('should be able to connect to the contract address', async () => {
    const devery = createDeveryRegistry(web3, undefined, accounts[0], contractAddress);
    const appsLength = await devery.appAccountsLength();
    assert.equal(0, appsLength, 'probably the contract address is wrong');
  });

  it('should create a new app correctly', async () => {
    const appName = 'My nice account';
    const myAcc = accounts[1];
    const feeAcc = accounts[2];
    const tx = 5;

    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
    await devery.addApp(appName, feeAcc, tx, overrideOptions);
    const appsLength = await devery.appAccountsLength();
    assert.equal(1, appsLength, 'new account was not created');
    const app = await devery.getApp(myAcc);
    assert.equal(appName, app.appName, 'App name does not match');
  });

  it('should read accounts apps from other accounts', async () => {
    const acc1 = accounts[1];
    const acc2 = accounts[2];

    const deveryAcc1 = createDeveryRegistry(web3, undefined, acc1, contractAddress);
    const deveryAcc2 = createDeveryRegistry(web3, undefined, acc2, contractAddress);

    const appAddress = await deveryAcc1.appAccountsArray(0);

    const appAcc1 = await deveryAcc1.getApp(appAddress);
    const appAcc2 = await deveryAcc2.getApp(appAddress);

    assert.equal(appAcc1.appName, appAcc2.appName, 'different apps returned');
    assert.isTrue(appAcc1.appName.length > 0, 'the app name was empty');
  });

  it('should not be possible to create more than one app per account', (done) => {
    (async function () {
      const appName = 'My nice account';
      const myAcc = accounts[1];
      const feeAcc = accounts[2];
      const tx = 5;

      const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);

      try {
        const transaction = await devery.addApp(appName, feeAcc, tx, overrideOptions);
        done('No exception raised');
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        done();
      }
    }());
  });

  it('should be possible to update the account', async () => {
    const appName = 'My nice account updated';
    const myAcc = accounts[1];
    const feeAcc = accounts[2];
    const active = false;
    const fee = 5;

    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
    await devery.updateApp(appName, feeAcc, fee, active, overrideOptions);
    const appsLength = await devery.appAccountsLength();
    assert.equal(1, appsLength, 'new account was not created');
    const app = await devery.getApp(myAcc);
    assert.equal(appName, app.appName, 'App name does not match');
    assert.equal(feeAcc.toLowerCase(), app.feeAccount.toLowerCase(), 'Fee account does not match');
    assert.equal(fee, app.fee, 'Fees does not match');
    assert.equal(active, app.active, 'active status does not match');
    assert.equal(myAcc.toLowerCase(), app.appAccount.toLowerCase(), 'App account does not match');
  });


  it('should receive callback when another app is created', function (done) {
    const appName = 'My newly created app';
    const senderAccount = accounts[7];
    const listenerAccount = accounts[2];
    const feeAccount = accounts[3];
    const fee = 5;
    this.timeout(5000);

    const deveryTrigger = createDeveryRegistry(web3, undefined, senderAccount, contractAddress);
    const deveryListener = createDeveryRegistry(web3, undefined, listenerAccount, contractAddress);
    deveryListener.setAppAddedEventListener((callbackAppAcc, callbackAppName, callbackFeeAccount, callbackFee) => {
      try {
        assert.equal(callbackAppAcc.toLowerCase(), senderAccount.toLowerCase(), 'appAccount is not the same');
        assert.equal(callbackAppName, appName, 'appName is not the same');
        assert.equal(callbackFeeAccount.toLowerCase(), feeAccount.toLowerCase(), 'feeAccount is not the same');
        assert.equal(callbackFee, fee, 'app fee is not the same');
        // we need to remove the listener otherwise mocha will never exit
        deveryListener.setAppAddedEventListener(null);
        done();
      } catch (e) {
        // as might receive multiple callbacks we will look only for the right one
      }
    });

    deveryTrigger.addApp(appName, feeAccount, fee, overrideOptions);
  });


  it('should receive callback when another app is changed', function (done) {
    const appName = 'My nice account updated';
    const senderAccount = accounts[1];
    const listenerAccount = accounts[2];
    const feeAccount = accounts[3];
    const fee = 5;
    const active = false;
    this.timeout(5000);

    const deveryTrigger = createDeveryRegistry(web3, undefined, senderAccount, contractAddress);
    const deveryListener = createDeveryRegistry(web3, undefined, listenerAccount, contractAddress);
    deveryListener.setAppUpdatedEventListener((
      callbackAppAcc, callbackAppName, callbackFeeAccount, callbackFee
      , callbackActive,
    ) => {
      try {
        assert.equal(callbackAppAcc.toLowerCase(), senderAccount.toLowerCase(), 'appAccount is not the same');
        assert.equal(callbackAppName, appName, 'appName is not the same');
        assert.equal(callbackFeeAccount.toLowerCase(), feeAccount.toLowerCase(), 'feeAccount is not the same');
        assert.equal(callbackFee, fee, 'app fee is not the same');
        assert.equal(callbackActive, active, 'appStatus is not the same');
        // we need to remove the listener otherwise mocha will never exit
        deveryListener.setAppUpdatedEventListener(null);
        done();
      } catch (e) {
        // as might receive multiple callbacks we will look only for the right one
      }
    });

    deveryTrigger.updateApp(appName, feeAccount, fee, active, overrideOptions);
  });

  //new test

  it('should be able to delete an account', async () => {
    const myAcc = accounts[1];
    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);

    await devery.deleteApp(myAcc, overrideOptions);
    const appsLength = await devery.appAccountsLength();
    assert.equal(0, appsLength, 'account was not deleted');
  });

  it('should be able to deactivate an account', async () => {
    const appName = 'My nice account';
    const myAcc = accounts[1];
    const feeAcc = accounts[2];
    const fee = 5;
    const active = false;

    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
    await devery.updateApp(appName, feeAcc, fee, active, overrideOptions);

    const app = await devery.getApp(myAcc);
    assert.equal(active, app.active, 'active status does not match');
  });

  it('should be able to reactivate an account after deactivation', async () => {
    const appName = 'My nice account';
    const myAcc = accounts[1];
    const feeAcc = accounts[2];
    const fee = 5;
    const active = true;

    const devery = createDeveryRegistry(web3, undefined, myAcc, contractAddress);
    await devery.updateApp(appName, feeAcc, fee, active, overrideOptions);

    const app = await devery.getApp(myAcc);
    assert.equal(active, app.active, 'active status does not match');
  });


});
