import AbstractSmartContract from './AbstractSmartContract';

const deveryTrustArtifact = require('../build/contracts/DeveryTrust');
const ethers = require('ethers');


/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and listen to ownership change related
 * events
 *
 * @version 1
 * @extends AbstractSmartContract
 */
class DeveryTrust extends AbstractSmartContract {/**
  *
  * Creates a new DeveryTrust instance.
  *
  * ***Usage example:***
  *```
  * // creates a DeveryTrust with the default params
  * let trustClient = new DeveryTrust();
  *
  * // creates a trustClient pointing to a custom address
  * let trustClient = new DeveryTrust({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
  *
  * ```
  *
  * @param {ClientOptions} options network connection options
  *
  */
  constructor(options = {
    web3Instance: undefined,
    acc: undefined,
    address: undefined,
    walletPrivateKey: undefined,
    networkId: undefined,
  }) {
    super(...arguments);

    options = Object.assign(
      {
        web3Instance: undefined,
        acc: undefined,
        address: undefined,
        walletPrivateKey: undefined,
        networkId: undefined,
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
      network = options.networkId || 1;
    }

    if (!address) {
      address = deveryTrustArtifact.networks[network].address;
    }

    this.__deveryTrustContract = new ethers.Contract(
      address, deveryTrustArtifact.abi,
      this.__signerOrProvider,
    );
  }

  /**
     *
     * Approve a brand's veracity. when you approve a brand you are "confirming" its veracity and
     * indicating that you trust that the brand is trustworthy.
     *
     * ***Usage example:***
     * ```
     *  // import devery and DeveryTrust
     *  import devery from '@devery/devery';
     *
     *  const { DeveryTrust } = devery;
     *  // create new instance of deveryTrust
     *  const deveryTrustClient = new DeveryTrust();
     *  // approve the transaction
     *  const exampleBrandKey = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
     *  deveryTrustClient.approve(exampleBrandKey).then(res => console.log({res}))
     * ```
     * @param brandKey Key of the approved brand
     * @param {TransactionOptions} overrideOptions
     * @returns {Promise.<*>} a promise, that resolves to the blockchain's transaction data
     */
  async approve(brandKey, overrideOptions = {}) {
    const result = await this.__deveryTrustContract.approve(brandKey, overrideOptions);
    return result.valueOf();
  }


  /**
     *
     * Revoke the approval of a brand. This function is meant to be used when you approve a brand and for some reason
     * regreted that decision. Using it will nullify the previous approved status gaved by your address to a specific brand
     *
     * ***Usage example:***
     * ```
     *  // import devery and DeveryTrust
z     *  import devery from '@devery/devery';
     *
     *  const { DeveryTrust } = devery;
     *  // create new instance of deveryTrust
     *  const deveryTrustClient = new DeveryTrust();
     *  // revoke a transaction's approval
     *  const exampleBrandKey = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
     *  deveryTrustClient.revoke(exampleBrandKey).then(res => console.log({res}))
     * ```
     * @param brandKey Key of the approved brand
     * @param {TransactionOptions} overrideOptions
     * @returns {Promise.<*>} a promise, that resolves to the blockchain's transaction data
     */
  async revoke(brandKey, overrideOptions = {}) {
    const result = await this.__deveryTrustContract.revoke(brandKey, overrideOptions);
    return result.valueOf();
  }

  /**
   *
   * Deprecated method that shall not be called
   *
   */
  async check(approver, brandKey, overrideOptions = {}) {
    throw new Error('Deprecated method');
  }

  /**
   * Deprecated method that shall not be called
   *
   */
  async checkBrand(brandKey, overrideOptions = {}) {
    throw new Error('Deprecated method');
  }

  /**
   * Deprecated method that shall not be called
   *
   */
  async isApprover(addr, overrideOptions = {}) {
    throw new Error('Deprecated method');
  }

  /**
     *
     * Returns an array containing all the brand addresses approved by a specific address
     *
     * ***Usage example:***
     * ```
     *  // import devery and DeveryTrust
     *  import devery from '@devery/devery';
     *
     *  const { DeveryTrust } = devery;
     *  // create new instance of deveryTrust
     *  const deveryTrustClient = new DeveryTrust();
     *  // revoke a transaction's approval
     *  const exampleAddr = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
     *  deveryTrustClient.getAddressApprovals(exampleAddr).then(res => {
     *  // what the response is going to look like -> ["0xdC28C4268bd7433b70Dd76B2E11d7D72eb4eC6c3", "0xEEF8c9E628A27574e82D53E77301998C7146096e"]
     *   console.log({res})
     *    })
     * ```
     * @param addr The evaluated brand address
     * @returns {Promise.<String[]>} a promise, that resolves to an array, containing the approved brands addresses
     */
  async getAddressApprovals(addr) {
    const result = await this.__deveryTrustContract.getAddressApprovals(addr);
    return result;
  }

  /**
     *
     * Returns an array containing all the addresses that supported a specific brand
     *
     * ***Usage example:***
     * ```
     *  // import devery and DeveryTrust
     *  import devery from '@devery/devery';
     *
     *  const { DeveryTrust } = devery;
     *  // create new instance of deveryTrust
     *  const deveryTrustClient = new DeveryTrust();
     *  // revoke a transaction's approval
     *  const exampleAddr = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
     *  deveryTrustClient.getAddressApprovals(exampleAddr).then(res => {
     *  // what the response is going to look like -> ["0xC59c7ED1cf318c5C441Fb95a28a66b7E9Db09CbC", "0xC38e73FF84Cd24bE3c74Ee8e7AA191E29C025bd4"]
     *   console.log({res})
     *    })
     * ```
     * @param addr The evaluated brand address
     * @returns {Promise.<String[]>} a promise, that resolves to an array, containing the approved brands addresses
     */
  async getBrandApprovals(addr) {
    const result = await this.__deveryTrustContract.getBrandApprovals(addr);
    return result;
  }
}

export default DeveryTrust;
