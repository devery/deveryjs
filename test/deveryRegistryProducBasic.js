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

contract('DeveryRegistry - Product - basic tests', function (accounts) {



    it('should create a new Product correctly', async function(){
        assert.fail("actual", "expected", "test not implemented");

    })

    it('should read Products accounts from other accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should not be possible to create more than Product with the same Product account address',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to update the Product account',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


    it('should receive callback when another brad is created',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


    it('should receive callback when another Product is updated',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })
})
