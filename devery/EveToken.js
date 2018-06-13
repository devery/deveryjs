import AbstractSmartContract from './AbstractSmartContract';

const eveTokenArtifact = require('../build/contracts/TestEVEToken.json');
const ethers = require('ethers');


/**
 *
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
     * Creates a new instansce of EveToken.
     *```
     * //creates a eveTokenClient with the default params
     * let deveryRegistryClient = new EveToken();
     *
     * //creates a deveryRegistryClient pointing to a custom address
     * let deveryRegistryClient = new EveToken({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options
     *
     */
  constructor(options = { web3Instance: undefined, acc: undefined, address: undefined ,walletPrivateKey: undefined, networkId: undefined}) {
    super(...arguments);

    options = Object.assign(
      { web3Instance: undefined, acc: undefined, address: undefined ,walletPrivateKey: undefined,networkId: undefined}
      , options,
    );

    let address = options.address;
    let network = options.networkId;

    try {
      if (!options.web3Instance) {
        options.web3Instance = web3;
      }
      network = options.web3Instance.version.network;
      console.log('it was not possible to find global web3');
    }
    catch (e) {
        console.log('it was not possible to find global web3');
    }

    if(!network){
      network = 1
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
     *
     * @returns {Promise.<BigNumener>} a promisse that resolves to a bigNumber containing the total circulating supply
     * of the current token
     */
  async totalSupply() {
    const result = await this.__eveTokenContract.totalSupply();
    return result;
  }

  /**
     *
     * Checks the EVE balance of a given account.
     *
     * @param account  account whose balance is being inquired
     * @returns {Promise.<*>} a promisse that resolves to the current balance of
     * the inquired account
     */
  async balanceOf(account) {
    const result = await this.__eveTokenContract.balanceOf(account);
    return result;
  }

  /**
     *
     *  gives the 3rd party the right to facilitate a transaction with the owners token.
     *  please note that alowance will not transfer tokens to the 3rd party but instead give him
     *  permission to facilitate transactions on your behalf.
     *
     * @param account  account whose balance is being inquired
     * @returns {Promise.<*>}
     */
  async allowance(tokenOwner, spender, overrideOptions = {}) {
    const result = await this.__eveTokenContract.allowance(tokenOwner, spender, overrideOptions);
    return result.valueOf();
  }

  /**
     *
     * Transfer EVE tokens from the current account to any other account
     *
     * @param toAdress  address that will receive the tokens
     * @param total quantity of tokens being sent
     * @returns {Promise.<*>} a promisse that resolves to the transaction receipt
     */
  async transfer(toAdress, total, overrideOptions = {}) {
    const result = await this.__eveTokenContract.transfer(toAdress, total, overrideOptions);
    return result.valueOf();
  }

  /**
     *
     * Transfer EVE tokens from a specific account to any other account, you need to have an allowance permission
     * to be able to do this transaction.
     *
     * @param toAdress  address that will receive the tokens
     * @param total quantity of tokens being sent
     * @returns {Promise.<*>} a promisse that resolves to the transaction receipt
     */
  async transferFrom(from, to, tokens, overrideOptions = {}) {
    const result = await this.__eveTokenContract.transferFrom(from, to, tokens, overrideOptions);
    return result.valueOf();
  }

  /**
     * This is a callback function that will be invoked in response to appEvents.
     *
     *
     * @callback AppEventCallback
     * @param {string} appAccount
     * @param {string} appName
     * @param {string} feeAccount
     * @param {int} fee
     * @param {bool} active
     *
     */

  /**
     *
     * Listener to AppAdded events, this event triggers whenever a new devery app is created in the blockchain
     * please note that AppAddedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ```
     * //first you need to get a {@link DeveryOwned} instance
     * let deveryRegistryClient = new DeveryRegistry();
     * //now you can use it
     *
     *
     *
     * deveryOwnedClient.setApprovalListener((appAccount,appName,feeAccount,fee,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * deveryOwnedClient.setApprovalListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * deveryOwnedClient.setApprovalListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * @param {OwnershipEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
  setApprovalListener(callback) {
    this.__eveTokenContract.onapproval = callback;
  }

  /**
     * This is a callback function that will be invoked in response to appEvents
     *
     *
     * @callback AppEventCallback
     * @param {string} appAccount
     * @param {string} appName
     * @param {string} feeAccount
     * @param {int} fee
     * @param {bool} active
     *
     */

  /**
     *
     * Listener to AppAdded events, this event triggers whenever a new devery app is created in the blockchain
     * please note that AppAddedEventListener do not stack, this means that whenever you set one you are
     * removing the last one. If you want to remove a AppAddedEventListener, just call this function passing undefined
     * as param.
     *
     * ```
     * //first you need to get a {@link EveToken} instance
     * let eveTokenClient = new EveToken();
     * //now you can use it
     *
     *
     *
     * eveTokenClient.setTransferListener((appAccount,appName,feeAccount,fee,active) => {
     *      //whenever an app created we will log it to the console
     *      console.log(`new app created ${appAccount} - ${appName} ...`);
     * })
     *
     * //if you want to remove the listener you can simply pass undefined as parameter
     *
     * eveTokenClient.setTransferListener(undefined)
     *
     * //or that is equivalent to the above call
     *
     * eveTokenClient.setTransferListener()
     *
     *
     *
     * ```
     *
     * for more info about how to get a {@link DeveryOwned|DeveryOwned instance click here}.
     *
     * @param {OwnershipEventCallback} callback the callback that will be executed whenever and OwnershipTransferred event is
     * triggered
     */
  setTransferListener(callback) {
    this.__eveTokenContract.ontransfer = callback;
  }
}

export default EveToken;
