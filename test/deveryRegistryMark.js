import DeveryRegistry from './../devery/DeveryRegistry'

//if we change the DeveryRegistry constructor
//we can change only one point
const createDeveryRegistry = (web3, provider, account, contractAddress) => {
    return new DeveryRegistry(web3, provider, account, contractAddress)
}

contract('DeveryRegistry - Mark - basic tests', function (accounts) {


    it('should be possible to brand accounts add permission marker accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to brand accounts change permission marker accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should compute the hash of an product address',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to a permissioned account mark an existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should not be possible to a permissioned account mark an non existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to a non permissioned account mark an existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to a non permissioned account mark an existing product',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to check a marked item',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to check a non marked item',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when a permission marker account is changed',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when a product is marked',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

})

