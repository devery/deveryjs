import AbstractSmartContract from './AbstractSmartContract';

const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const ethers = require('ethers');


/**
 *
 * Abstract class that is base for all the devery registry related smart contracts.
 * There is no reason to directly instantiate it. Here lies some common logic about how to resolve
 * the underlying smart contract address and getting the signer instance. *** you shall not instantiate it directly***.
 *
 * @version 3
 * @extends AbstractSmartContract
 */
class AbstractDeverySmartContract extends AbstractSmartContract {
  /**
     *
     * ***You shall not call this class constructor directly*** if you do so you will get a TypeError
     * as we are explicitly checking against this.
     *
     * ```
     * //excerpt from the constructor
     *
     *if (new.target === AbstractDeverySmartContract) {
     *     throw new TypeError("Cannot construct AbstractDeverySmartContract instances directly");
     * }
     * ```
     *
     *
     * @param {ClientOptions} options
     */
  constructor(options = { web3Instance: undefined, acc: undefined, address: undefined }) {
    super(options);
    if (new.target === AbstractDeverySmartContract) {
      throw new TypeError('Cannot construct AbstractDeverySmartContract instances directly');
    }

    options = Object.assign(
      { web3Instance: undefined, acc: undefined, address: undefined }
      , options,
    );

    try {
      if (!options.web3Instance) {
        options.web3Instance = web3;
      }
    } catch (e) {
      console.log('it was not possible to find global web3');
    }


    let address = options.address;

    if (!address) {
      if (this._network === 'homestead') {
        address = '0x0364a98148b7031451e79b93449b20090d79702a';
      } else {
        address = deveryRegistryArtifact.networks[web3.version.network].address;
      }
    }

    this.__deveryRegistryContract = new ethers.Contract(
      address, deveryRegistryArtifact.abi,
      this.__signerOrProvider,
    );
  }
}

export default AbstractDeverySmartContract;
