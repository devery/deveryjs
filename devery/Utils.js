const CryptoJS = require('crypto-js');
const sha3 = require('crypto-js/sha3');
const ethers = require('ethers');

/**
 *
 * This class contains common utitlies methods, you don't need an instance as all the methods here are
 * static methods
 *
 * @version 1
 *
 */
class Utils {
  /**
     * Checks if the given string is an address
     *
     *
     * @param {String} address the given HEX adress
     * @return {Boolean}
     */
  static isAddress(address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
    }
    // Otherwise 3check each case
    return Utils.isChecksumAddress(address);
  }

  /**
     * Checks if the given string is a checksummed address
     *
     * @param {String} address the given HEX adress
     * @return {Boolean}
     */
  static isChecksumAddress(address) {
    // Check each case
    address = address.replace('0x', '');
    const addressHash = Utils.sha3(address.toLowerCase());
    for (let i = 0; i < 40; i += 1) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i])
          || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
        return false;
      }
    }
    return true;
  }

  /**
     * Generates a random ethereum  address
     *
     * @return {String} a random eth address
     */
  static getRandomAddress() {
    return ethers.Wallet.createRandom().address;
  }


  /**
     *
     * calculates the sha3 of a give value
     *
     * @param value - value to have it's sha3 calculated
     * @param options - calculation options
     */
  static sha3(value, options) {
    if (options && options.encoding === 'hex') {
      if (value.length > 2 && value.substr(0, 2) === '0x') {
        value = value.substr(2);
      }
      value = CryptoJS.enc.Hex.parse(value);
    }

    return sha3(value, {
      outputLength: 256,
    }).toString();
  }
}

export default Utils;
