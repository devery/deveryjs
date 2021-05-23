const sha3 = require('crypto-js/sha3');
const ethers = require('ethers');

/**
 *
 * This class contains common utility methods, you don't need to create an instance as all the methods here are
 * static
 *
 * @version 1
 *
 */
class Utils {
  /**
     * Checks if the given string is an address
     *
     * @param {String} address the given HEX address
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
     * @param {String} address the given HEX address
     * @return {Boolean}
     */
  static isChecksumAddress(address) {
    // Check each case
    address = address.replace('0x', '');
    const addressHash = sha3(address.toLowerCase(), { outputLength: 256 }).toString();

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
     * Generates a random ethereum address
     *
     * @return {String} a random eth address
     */
  static getRandomAddress() {
    return ethers.Wallet.createRandom().address;
  }
}

export default Utils;
