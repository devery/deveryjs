import AbstractSmartContract from './AbstractSmartContract';

const eveTokenArtifact = require('../build/contracts/BTTSToken.json');
const ethers = require('ethers');


/**
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and list to ownership change related
 * events
 *
 * @version 2
 * @extends AbstractDeverySmartContract
 */
class EveToken extends AbstractSmartContract {
  /**
     *
     * Creates a new instance of EveToken.
     * ```
     * // creates an eveTokenClient with the default params
     * let eveTokenClient = new EveToken();
     *
     * // creates an eveTokenClient pointing to a custom address
     * let eveTokenClient = new EveToken({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
  constructor(options = {
    web3Instance: undefined, acc: undefined, address: undefined, walletPrivateKey: undefined, networkId: undefined, infuraProjectKey: undefined,
  }) {
    super(...arguments);

    options = Object.assign(
      {
        web3Instance: undefined, acc: undefined, address: undefined, walletPrivateKey: undefined, networkId: undefined,
      }
      , options,
    );

    let address = options.address;
    let network = options.networkId;

    try {
      if (!options.web3Instance) {
        options.web3Instance = web3;
      }
      network = options.web3Instance.version.network;
      // console.log('it was not possible to find global web3');
    } catch (e) {
      // console.log('it was not possible to find global web3');
    }

    if (!network) {
      try {
        if (!options.web3Instance) {
          options.web3Instance = web3;
        }
        network = options.web3Instance.currentProvider.networkVersion;
      } catch (e) {
        // console.log('it was not possible to find global web3');
      }
    }

    if (!network) {
      network = 1;
    }

    if (!address) {
      address = eveTokenArtifact.networks[network].address;
    }

    this.__eveTokenContract = new ethers.Contract(
      address, eveTokenArtifact.abi,
      this.__signerOrProvider,
    );
  }

  /**
     *
     * Checks the total existing EVE supply.
     *
     * @returns {Promise.<BigNumber>} a promise that resolves to a BigNumber containing the total circulating supply
     * of the current token
     */
  async totalSupply() {
    return await this.__eveTokenContract.totalSupply();
  }

  /**
     *
     * Checks the EVE balance of a given account.
     *
     * @param account account whose balance is being inquired
     * @returns {Promise.<*>} a promise, that resolves to the current balance of
     * the inquired account
     */
  async balanceOf(account) {
    return await this.__eveTokenContract.balanceOf(account);
  }

  /**
     *
     *  Checks how many tokens a 3rd party can use to facilitate a transaction with the owners token.
     *  Please note that `allowance` will not transfer tokens to the 3rd party, but instead give him
     *  permission to facilitate transactions on your behalf.
     *
     * @param tokenOwner token owner
     * @param spender ethereum address
     * @param {TransactionOptions} overrideOptions
     * @returns {Promise.<*>}
     */
  async allowance(tokenOwner, spender, overrideOptions = {}) {
    const result = await this.__eveTokenContract.allowance(tokenOwner, spender, overrideOptions);
    return result.valueOf();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link EveToken#allowance|EveToken.allowance}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link EveToken#allowance|EveToken.allowance}.
   * the return of this method will be the total gas used to call {@link EveToken#allowance|EveToken.allowance} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link EveToken#allowance|EveToken.allowance} would be
   * a valid call
   *
     * @param tokenOwner token owner
     * @param spender ethereum address
     * @param {TransactionOptions} overrideOptions
     * @param {TransactionOptions} overrideOptions
   *
   * @returns total gas used to call {@link EveToken#allowance|EveToken.allowance} with the given parameters
   */
  async estimateAllowance(tokenOwner, spender, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.allowance(tokenOwner, spender, overrideOptions);
    return result.toNumber();
  }

  /**
   *
   *  Gives the 3rd party the right to facilitate a transaction with the owners token.
   *  Please note that `approve` will not transfer tokens to the 3rd party, but instead give him
   *  permission to facilitate transactions on your behalf.
   *
   * @param spender ethereum address, that has right to spend the approved tokens, this can be a contract address
   * or any other address
   * @param quantity that the 3rd party is allowed to spend
   * @param {TransactionOptions} overrideOptions
   * @returns {Promise.<*>}
   */
  async approve(spender, quantity, overrideOptions = {}) {
    const result = await this.__eveTokenContract.approve(spender, quantity, overrideOptions);
    return result.valueOf();
  }

  async estimateApprove(spender, quantity, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.approve(spender, quantity, overrideOptions);
    return result.toNumber();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link EveToken#approve|EveToken.approve}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link EveToken#approve|EveToken.approve}.
   * the return of this method will be the total gas used to call {@link EveToken#approve|EveToken.approve} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link EveToken#approve|EveToken.approve} would be
   * a valid call
   *
   * @param spender ethereum address, that has right to spend the approved tokens, this can be a contract address
   * or any other address
   * @param quantity that the 3rd party is allowed to spend
   * @param {TransactionOptions} overrideOptions
   *
   * @returns total gas used to call {@link EveToken#approve|EveToken.approve} with the given parameters
   */
  async estimateApprove(spender, quantity, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.approve(spender, quantity, overrideOptions);
    return result.toNumber();
  }

  /**
     *
     * Transfer EVE tokens from the current account to any other account
     *
     * @param toAddress address, that will receive the tokens
     * @param total quantity of tokens being sent
     * @param {TransactionOptions} overrideOptions
     * @returns {Promise.<*>} a promise, that resolves to the transaction receipt
     */
  async transfer(toAddress, total, overrideOptions = {}) {
    const result = await this.__eveTokenContract.transfer(toAddress, total, overrideOptions);
    return result.valueOf();
  }

  async estimateTransfer(toAddress, total, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.transfer(toAddress, total, overrideOptions);
    return result.toNumber();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link EveToken#transfer|EveToken.transfer}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link EveToken#transfer|EveToken.transfer}.
   * the return of this method will be the total gas used to call {@link EveToken#transfer|EveToken.transfer} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link EveToken#transfer|EveToken.transfer} would be
   * a valid call
   *
    * @param toAddress address, that will receive the tokens
     * @param total quantity of tokens being sent
     * @param {TransactionOptions} overrideOptions
   *
   * @returns total gas used to call {@link EveToken#transfer|EveToken.transfer} with the given parameters
   */
  async estimateTransfer(toAddress, total, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.transfer(toAddress, total, overrideOptions);
    return result.toNumber();
  }

  /**
     *
     * Transfer EVE tokens from a specific account to any other account. You need to have an allowance permission
     * to be able to do this transaction.
     *
     * @param from the address, that EVE tokens will be sent from
     * @param to the address, that will receive the tokens
     * @param tokens quantity of tokens being sent
     * @param {TransactionOptions} overrideOptions
     * @returns {Promise.<*>} a promisse that resolves to the transaction receipt
     */
  async transferFrom(from, to, tokens, overrideOptions = {}) {
    const result = await this.__eveTokenContract.transferFrom(from, to, tokens, overrideOptions);
    return result.valueOf();
  }

  async estimateTransferFrom(from, to, tokens, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.transferFrom(from, to, tokens, overrideOptions);
    return result.toNumber();
  }

  /**
   * This method gives an estimation of how much gas will be used for the method {@link EveToken#transferFrom|EveToken.transferFrom}
   * the params that you pass to this method shall be exactly the same ones that you would pass to {@link EveToken#transferFrom|EveToken.transferFrom}.
   * the return of this method will be the total gas used to call {@link EveToken#transferFrom|EveToken.transferFrom} with the given parameters.
   * It's important to note that a call to this method will only be successful if the call to {@link EveToken#transferFrom|EveToken.transferFrom} would be
   * a valid call
   *
    * @param from the address, that EVE tokens will be sent from
     * @param to the address, that will receive the tokens
     * @param tokens quantity of tokens being sent
     * @param {TransactionOptions} overrideOptions
   *
   * @returns total gas used to call {@link EveToken#transferFrom|EveToken.transferFrom} with the given parameters
   */
  async estimateTransferFrom(from, to, tokens, overrideOptions = {}) {
    const result = await this.__eveTokenContract.estimate.transferFrom(from, to, tokens, overrideOptions);
    return result.toNumber();
  }

  /**
     * This is a callback function that will be invoked in response to the Approval event.
     *
     * @callback AprovalEventCallback
     * @param tokenOwner token owner
     * @param spender ethereum address, that has right to spend the approved tokens, this can be a contract address
     * or any other address
     * @param tokens quantity of tokens
     */

  /**
     *
     * Listener to the Approval events, this event triggers whenever a new devery app is created in the blockchain.
     * Please note, that ApprovalEventListeners do not stack, this means that whenever you set one - you are
     * removing the last one. If you want to remove an ApprovalEventListener, just call this function passing undefined
     * as param.
     *
     * ```
     * // first you need to get a {@link EveToken} instance
     * let eveTokenClient = new EveToken();
     * // now you can use it
     *
     *
     *
     * eveTokenClient.setApprovalListener((appAccount,appName,feeAccount,fee,active) => {
     *      // whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * eveTokenClient.setApprovalListener(undefined)
     *
     * // or that is equivalent to the above call
     *
     * eveTokenClient.setApprovalListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link EveToken|EveToken instance click here}.
     *
     * @param {AprovalEventCallback} callback the callback that will be executed whenever the Transfer event is
     * triggered
     */
  setApprovalListener(callback) {
    const eventName = 'Approval';
    this.__eveTokenContract.removeAllListeners(eventName);
    if (callback) {
      this.__eveTokenContract.on(eventName, callback);
    }
  }

  /**
     * This is a callback function that will be invoked in response to the OwnershipTransferred event
     *
     * @callback TransferEventCallback
     * @param from the address the transfer goes from
     * @param to the address the transfer goes to
     * @param tokens amount transferred
     */

  /**
     *
     * Listener to the Transfer events, this event triggers whenever a new devery app is created in the blockchain.
     * Please note that TransferEventListeners do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a TransferEventListener, just call this function passing undefined
     * as param.
     *
     * ```
     * // first you need to get a {@link EveToken} instance
     * let eveTokenClient = new EveToken();
     * // now you can use it
     *
     *
     *
     * eveTokenClient.setTransferListener((appAccount,appName,feeAccount,fee,active) => {
     *      // whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * // if you want to remove the listener you can simply pass undefined as parameter
     *
     * eveTokenClient.setTransferListener(undefined)
     *
     * // or that is equivalent to the above call
     *
     * eveTokenClient.setTransferListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link EveToken|EveToken instance click here}.
     *
     * @param {TransferEventCallback} callback the callback that will be executed whenever the OwnershipTransferred event is
     * triggered
     */
  setTransferListener(callback) {
    const eventName = 'Transfer';
    this.__eveTokenContract.removeAllListeners(eventName);
    if (callback) {
      this.__eveTokenContract.on(eventName, callback);
    }
  }
}

export default EveToken;
