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
  constructor(options = {
    web3Instance: undefined,
    acc: undefined,
    address: undefined,
    walletPrivateKey: undefined,
    networkId: undefined,
  }) {
    super(options);
    if (this.constructor === AbstractDeverySmartContract) {
      throw new TypeError('Cannot construct AbstractDeverySmartContract instances directly');
    }


    options = Object.assign(
      {
        web3Instance: undefined, acc: undefined, address: undefined, networkId: undefined,
      }
      , options,
    );

    let network = options.networkId;
    let address = options.address;

    try {
      if (!options.web3Instance) {
        options.web3Instance = web3;
      }
      network = options.web3Instance.version.network;
    } catch (e) {
      //console.log('it was not possible to find global web3');
    }

    if (!network) {
      network = options.networkId || 1;
    }

    if (!address) {
      address = deveryRegistryArtifact.networks[network].address;
    }

    this.__deveryRegistryContract = new ethers.Contract(
      address, deveryRegistryArtifact.abi,
      this.__signerOrProvider,
    );
  }
}

export default AbstractDeverySmartContract;
