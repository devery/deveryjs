import 'babel-polyfill';

console.log('heyheyhey',process)

// if ((typeof btoa === 'undefined')) {
//   global.btoa = function (str) {
//     return new Buffer(str, 'binary').toString('base64');
//   };
// }
//
// if ((typeof atob === 'undefined')){
//   global.atob = function (b64Encoded) {
//     return new Buffer(b64Encoded, 'base64').toString('binary');
//   };
// }


import EveTokenLib from './devery/EveToken';
import DeveryRegistryLib from './devery/DeveryRegistry';
import DeveryAdminedLib from './devery/DeveryAdmined';
import DeveryOwnedLib from './devery/DeveryOwned';
import UtilsLib from './devery/Utils';
import DeveryERC721Lib from './devery/DeveryERC721';
import DeveryTrustLib from './devery/DeveryTrust';


export const EveToken = EveTokenLib;
export const DeveryRegistry = DeveryRegistryLib;
export const DeveryAdmined = DeveryAdminedLib;
export const DeveryOwned = DeveryOwnedLib;
export const Utils = UtilsLib;
export const DeveryERC721 = DeveryERC721Lib;
export const DeveryTrust = DeveryTrustLib;
