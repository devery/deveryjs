import DeveryRegistry from './../devery/DeveryRegistry'

const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 9000000000,
};

//if we change the DeveryRegistry constructor
//we can change only one point
const createDeveryRegistry = (web3, provider, account, contractAddress) => {
    return new DeveryRegistry(web3, provider, account, contractAddress)
}

contract('EveToken', async function (accounts) {


    it('should return the total supply',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be able to transfer tokens',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return the token quantity that a given account owns',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should not be able to transfer more tokens than owns',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive a callback when a transfer is done',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


})
