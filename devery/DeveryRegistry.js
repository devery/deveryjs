import simpleWeb3Promisifier from  './../utils/simpleWeb3Promisifier'
const deveryRegistryArtifact = require('../build/contracts/DeveryRegistry.json');
const contract = require('truffle-contract')
const DeveryRegistryContract = contract(deveryRegistryArtifact);

export default class DeveryRegistry{

}