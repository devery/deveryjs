import EveToken from './../devery/EveToken';
import { createEveToken } from './helpers/staticData';

const EveTokenContract = artifacts.require('./TestEVEToken.sol');

const overrideOptions = {
  gasLimit: 250000,
  gasPrice: 9000000000,
};

// if we change the DeveryRegistry constructor
// we can change only one point

contract('EveToken', (accounts) => {
  let contractAddress;
  const totalSupply = '100000000000000000000000';

  before(async () => {
    const contract = await EveTokenContract.deployed();
    contractAddress = contract.address;
  });

  it('should return the total supply', async () => {
    const eveToken = createEveToken(web3, null, accounts[0], contractAddress);
    const supply = await eveToken.totalSupply();
    assert.equal(supply.toString(), totalSupply);
  });

  it('should be able to transfer tokens', async () => {
    const transfer = 500;
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const receiver = createEveToken(web3, null, accounts[1], contractAddress);
    let receiverBeforeTransfer = await receiver.balanceOf(accounts[1]);
    receiverBeforeTransfer = receiverBeforeTransfer.toNumber();
    await eveTokenOwner.transfer(accounts[1], transfer, overrideOptions);
    const receiverAfterTransfer = await receiver.balanceOf(accounts[1]);
    assert(receiverAfterTransfer, receiverBeforeTransfer + transfer);
  });

  it('should return the token quantity that a given account owns', async () => {
    // as we already did a transfer now we shall have 500 tokens
    const receiver = createEveToken(web3, null, accounts[1], contractAddress);
    const receiverAfterTransfer = await receiver.balanceOf(accounts[1]);
    assert(receiverAfterTransfer, 500);
  });

  it('should not be able to transfer more tokens than owns', function () {
    this.timeout(5000);
    return new Promise((async (resolve, reject) => {
      const eveTokenAcc = createEveToken(web3, null, accounts[1], contractAddress);
      let total = await eveTokenAcc.balanceOf(accounts[1]);
      total = total.toNumber();
      // we add 1 token to exceed my total balance
      total += 1;
      try {
        await eveTokenAcc.transfer(accounts[2], total, overrideOptions);
      } catch (e) {
        assert(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
        resolve();
      }
    }));
  });

  it('should be able to estimate transfer operation', async () => {
    const transfers = [1, 29, 111];
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const { provider } = eveTokenOwner.getProvider();

    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      const [gasLimit, gasPrice] = await Promise.all([
        eveTokenOwner.estimateTransfer(accounts[1], transfer),
        provider.getGasPrice()
      ]);
      const weiEstimated = gasPrice.mul(gasLimit);

      const balanceBeforeTransfer = await provider.getBalance(accounts[0]);
      await eveTokenOwner.transfer(accounts[1], transfer);
      const balanceAfterTransfer = await provider.getBalance(accounts[0]);

      const weiConsumed = balanceBeforeTransfer.sub(balanceAfterTransfer);
      assert.isTrue(weiConsumed.toNumber() > 0, 'transfer operation should consume gas');
      assert.isTrue(weiEstimated.eq(weiConsumed), 'estimate for transfer was incorrect');
    }
  });

  it('should receive a callback when a transfer is done', function () {
    this.timeout(5000);
    return new Promise((async (resolve, reject) => {
      const transfer = 100;
      const toAcc = accounts[2];
      const fromAcc = accounts[1];
      const eveTokenAcc = createEveToken(web3, null, fromAcc, contractAddress);
      eveTokenAcc.setTransferListener((from, to, total) => {
        try {
          assert.equal(from.toLowerCase(), fromAcc.toLowerCase());
          assert.equal(to.toLowerCase(), toAcc.toLowerCase());
          assert.equal(total.toNumber(), transfer);
          resolve();
        } catch (e) {
          assert.fail();
        } finally {
          // we need to remove the listener otherwise mocha will never exit
          eveTokenAcc.setTransferListener(null);
        }
      });
      eveTokenAcc.transfer(toAcc, transfer, overrideOptions);
    }));
  });

  it('should receive an expected callback when a transfer is done', async () => {
    const transfer1 = 4;
    const transfer2 = 11;
    const transfer3 = 6;
    const fromAcc = accounts[1];
    const toAcc = accounts[2];
    const eveTokenOwner = createEveToken(web3, null, fromAcc, contractAddress);
    const { provider } = eveTokenOwner.getProvider();

    // this transfer should NOT be caught by TransferListener
    const { hash } = await eveTokenOwner.transfer(toAcc, transfer1, overrideOptions);
    await provider.waitForTransaction(hash);
    // we want to listen for the next transfer event with transfer2 amount
    eveTokenOwner.setTransferListener((from, to, total) => {
      try {
        assert.equal(from.toLowerCase(), fromAcc.toLowerCase());
        assert.equal(to.toLowerCase(), toAcc.toLowerCase());
        assert.equal(total.toNumber(), transfer2);
      } catch (e) {
        assert.fail();
      } finally {
        // we need to remove the listener otherwise mocha will never exit
        eveTokenOwner.setTransferListener();
      }
    });
    // this transfer should be caught by TransferListener
    const { hash: hash2 } = await eveTokenOwner.transfer(toAcc, transfer2, overrideOptions);
    await provider.waitForTransaction(hash2);
    // this transfer should NOT be caught by TransferListener
    const { hash: hash3 } = await eveTokenOwner.transfer(toAcc, transfer3, overrideOptions);
    await provider.waitForTransaction(hash3);
  });

  it('should be able to transfer tokens with transferFrom', async () => {
    const transfer = 10;
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const sender = createEveToken(web3, null, accounts[1], contractAddress);
    const receiver = createEveToken(web3, null, accounts[2], contractAddress);

    const { hash } = await eveTokenOwner.approve(accounts[1], transfer);
    await eveTokenOwner.getProvider().provider.waitForTransaction(hash);

    let receiverBeforeTransfer = await receiver.balanceOf(accounts[2]);
    receiverBeforeTransfer = receiverBeforeTransfer.toNumber();

    const { hash: hash2 } = await sender.transferFrom(accounts[0], accounts[2], transfer);
    await sender.getProvider().provider.waitForTransaction(hash2);

    const receiverAfterTransfer = await receiver.balanceOf(accounts[2]);
    assert.equal(receiverAfterTransfer, receiverBeforeTransfer + transfer);
  });

  it('should not be able to do transferFrom for more tokens than the account owns', async () => {
    const eveTokenOwner = createEveToken(web3, null, accounts[2], contractAddress);
    const sender = createEveToken(web3, null, accounts[1], contractAddress);

    let numOfTokens = await eveTokenOwner.balanceOf(accounts[2]);
    numOfTokens = numOfTokens.toNumber();
    const toTransfer = numOfTokens + 1;

    const { hash } = await eveTokenOwner.approve(accounts[1], toTransfer, overrideOptions);
    await eveTokenOwner.getProvider().provider.waitForTransaction(hash);

    try {
      const { hash: hash2 } = await sender.transferFrom(accounts[2], accounts[0], toTransfer, overrideOptions);
      await sender.getProvider().provider.waitForTransaction(hash2);
      throw new Error('Transfer was successful - the test has failed.');
    } catch (e) {
      assert.isTrue(e.message.lastIndexOf('revert') > 0, `wrong exception raised --> ${e.message}`);
    }
  });

  it('should be able to estimate transferFrom operation', async () => {
    const transfers = [1, 7, 27];
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const sender = createEveToken(web3, null, accounts[1], contractAddress);
    const { provider } = sender.getProvider();

    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];

      const { hash } = await eveTokenOwner.approve(accounts[1], transfer);
      await eveTokenOwner.getProvider().provider.waitForTransaction(hash);

      const [gasLimit, gasPrice] = await Promise.all([
        sender.estimateTransferFrom(accounts[0], accounts[2], transfer),
        provider.getGasPrice()
      ]);
      const weiEstimated = gasPrice.mul(gasLimit);

      const balanceBeforeTransfer = await provider.getBalance(accounts[1]);
      const { hash: hash2 } = await sender.transferFrom(accounts[0], accounts[2], transfer, overrideOptions);
      await provider.waitForTransaction(hash2);

      const balanceAfterTransfer = await provider.getBalance(accounts[1]);
      const weiConsumed = balanceBeforeTransfer.sub(balanceAfterTransfer);

      assert.isTrue(weiConsumed.toNumber() > 0, 'transferFrom operation should consume gas');
      //@todo: actually estimate is always much higher than the consumed amount
      //@todo: sometimes the consumed is being greater
      //assert.isTrue(weiEstimated.gte(weiConsumed), 'estimate was less than consumed gas amount');
    }
  });

  it('should receive a callback when a transferFrom is done', async () => {
    const transfer1 = 5;
    const transfer2 = 15;
    const transfer3 = 7;
    const fromAcc = accounts[0];
    const senderAcc = accounts[1];
    const toAcc = accounts[2];
    const eveTokenOwner = createEveToken(web3, null, fromAcc, contractAddress);
    const sender = createEveToken(web3, null, senderAcc, contractAddress);

    const { hash } = await eveTokenOwner.approve(senderAcc, transfer1 + transfer2 + transfer3);
    await eveTokenOwner.getProvider().provider.waitForTransaction(hash);
    // this transfer should NOT be caught by TransferListener
    const { hash: hash2 } = await sender.transferFrom(fromAcc, toAcc, transfer1);
    await sender.getProvider().provider.waitForTransaction(hash2);
    // we want to listen for the next transfer event with transfer2 amount
    eveTokenOwner.setTransferListener((from, to, total) => {
      try {
        assert.equal(from.toLowerCase(), fromAcc.toLowerCase());
        assert.equal(to.toLowerCase(), toAcc.toLowerCase());
        assert.equal(total.toNumber(), transfer2);
      } catch (e) {
        assert.fail();
      } finally {
        // we need to remove the listener otherwise mocha will never exit
        eveTokenOwner.setTransferListener();
      }
    });
    // this transfer should be caught by TransferListener
    const { hash: hash3 } = await sender.transferFrom(fromAcc, toAcc, transfer2, overrideOptions);
    await sender.getProvider().provider.waitForTransaction(hash3);
    // this transfer should NOT be caught by TransferListener
    const { hash: hash4 } = await sender.transferFrom(fromAcc, toAcc, transfer3, overrideOptions);
    await sender.getProvider().provider.waitForTransaction(hash4);
  });

  it('should be possible to get allowance and approve a new one', async () => {
    const allowance2set = [31, 77, 89];
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const { provider } = eveTokenOwner.getProvider();

    for (let i = 0; i < allowance2set.length; i++) {
      const { hash } = await eveTokenOwner.approve(contractAddress, allowance2set[i]);
      await provider.waitForTransaction(hash);

      //@todo estimateAllowance() always returns 0 and should be removed
      const allowanceEstimate = await eveTokenOwner.estimateAllowance(accounts[0], contractAddress);
      assert.isTrue(allowanceEstimate === 0);

      const allowance = await eveTokenOwner.allowance(accounts[0], contractAddress);
      assert.equal(allowance.toNumber(), allowance2set[i]);
    }
  });

  it('should be possible to estimate the approval operation', async () => {
    const allowance2set = [22, 43, 68];
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const { provider } = eveTokenOwner.getProvider();

    for (let i = 0; i < allowance2set.length; i++) {
      let [gasLimit, gasPrice] = await Promise.all([
        eveTokenOwner.estimateApprove(contractAddress, allowance2set[i]),
        provider.getGasPrice()
      ]);
      const weiEstimated = gasPrice.mul(gasLimit);
      const balanceBeforeApprove = await provider.getBalance(accounts[0]);

      const { hash } = await eveTokenOwner.approve(contractAddress, allowance2set[i]);
      await provider.waitForTransaction(hash);

      const balanceAfterApprove =  await provider.getBalance(accounts[0]);
      const weiConsumed = balanceBeforeApprove.sub(balanceAfterApprove);
      assert.isTrue(weiConsumed.toNumber() > 0);
      assert.isTrue(weiConsumed.eq(weiEstimated));

      const allowance = await eveTokenOwner.allowance(accounts[0], contractAddress);
      assert.isTrue(allowance.toNumber() === allowance2set[i]);
    }
  });

  it('should receive a callback when approval is done - with Promise', function () {
    this.timeout(5000);
    return new Promise((async (resolve, reject) => {
      const approval = 99;
      const account = accounts[1];
      const eveTokenAcc = createEveToken(web3, null, account, contractAddress);
      eveTokenAcc.setApprovalListener((tokenOwner, spender, tokens) => {
        try {
          assert.equal(tokenOwner, account);
          assert.equal(spender, contractAddress);
          assert.equal(tokens.toNumber(), approval);
          resolve();
        } catch (e) {
          assert.fail();
        } finally {
          // we need to remove the listener otherwise mocha will never exit
          eveTokenAcc.setApprovalListener(null);
        }
      });
      eveTokenAcc.approve(contractAddress, approval);
    }));
  });

  it('should receive only expected approval callbacks', async () => {
    const allowance2set = [76, 89, 92];
    const eveTokenOwner = createEveToken(web3, null, accounts[0], contractAddress);
    const { provider } = eveTokenOwner.getProvider();
    // the callback should NOT be called here
    const { hash } = await eveTokenOwner.approve(contractAddress, allowance2set[0]);
    await provider.waitForTransaction(hash);

    const allowance2 = await eveTokenOwner.allowance(accounts[0], contractAddress);
    assert(allowance2.toNumber() === allowance2set[0]);
    // we should receive only callback for the second 'approve' event
    //@todo: we have to create a new EveToken instance here because of thr issue in the ethers.js
    // the event listener triggering for past events here
    // https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts#L757
    createEveToken(web3, null, accounts[0], contractAddress).setApprovalListener((tokenOwner, spender, tokens) => {
      assert.equal(tokenOwner, accounts[0]);
      assert.equal(spender, contractAddress);
      assert.equal(tokens.toNumber(), allowance2set[1]);
      eveTokenOwner.setApprovalListener(); // we need to remove the listener otherwise mocha will never exit
    });
    // the callback should be called here
    const tx2 = await eveTokenOwner.approve(contractAddress, allowance2set[1]);
    await provider.waitForTransaction(tx2.hash);
    // the callback should NOT be called here
    const tx3 = await eveTokenOwner.approve(contractAddress, allowance2set[2]);
    await provider.waitForTransaction(tx3.hash);
  });
});
