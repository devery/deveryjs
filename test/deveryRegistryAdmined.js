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
});
