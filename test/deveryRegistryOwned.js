import DeveryRegistry from './../devery/DeveryRegistry'

//if we change the DeveryRegistry constructor
//we can change only one point
const createDeveryRegistry = (web3, provider, account, contractAddress) => {
    return new DeveryRegistry(web3, provider, account, contractAddress)
}

contract('DeveryRegistry - Owned - basic tests', async function (accounts) {


    it('should not be possible to call owner methods as non owner',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should  be possible to call owner methods as owner',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should read accounts apps from other accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to initiate the ownership transfer',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('accept the ownerships',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when ownership is changed',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


})