import {createDeveryRegistry} from './helpers/staticData'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};

contract('DeveryRegistry - Read only', function (accounts) {

    it('should resolve the network and read from it', async function(){
        let tmpWeb3 = web3;
        web3 = null;
        //doing this to simulate an environment without web3
        let deveryClient = createDeveryRegistry();
        web3 = tmpWeb3;
        let totalAccounts = await deveryClient.appAccountsLength();
        assert.isAbove(totalAccounts, 0 ,'It was not able to read the accounts from devery contract');
    });

});