
//if we change the DeveryRegistry constructor
//we can change only one point
const createDeveryRegistry = (web3, provider, account, contractAddress) => {
    return new DeveryRegistry(web3, provider, account, contractAddress)
}

contract('DeveryRegistry - Admined - basic tests', async function (accounts) {


    it('should be possible check if someone is admin', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible only to owners add admins', async function () {
        assert.fail("actual", "expected", "test not implemented");
    });

    it('should be possible only to owners remove admins', async function () {
        assert.fail("actual", "expected", "test not implemented");
    });

    it('should not be possible add admins if you are not owner', async function () {
        assert.fail("actual", "expected", "test not implemented");
    });

    it('should not be possible remove admins if you are not owner', async function () {
        assert.fail("actual", "expected", "test not implemented");
    });

    it('should receive callback when an admin is added',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should receive callback when an admin is removed',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })
});