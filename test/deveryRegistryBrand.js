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

contract('DeveryRegistry - Brand - basic tests', async function (accounts) {



    it('should create a new Brand correctly', async function(){
        assert.fail("actual", "expected", "test not implemented");

    })

    it('should read brands accounts from other accounts',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should not be possible to create more than brand with the same brand account address',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should be possible to update the brand account',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


    it('should receive callback when another brad is created',async function(){
        assert.fail("actual", "expected", "test not implemented");
    })


    it('should receive callback when another brand is updated',function(done){
        assert.fail("actual", "expected", "test not implemented");
    })
})

contract('DeveryRegistry - Brand - collection tests', async function (accounts) {


    it('should return the correct number of brand accounts - 15', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('shoulbe be possible to return access brand accounts addresses individually', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return paginated data', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return paginated data with different page size and more than one page', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return with different page size more than one page and the last page not complete', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })

    it('should return with different page sizes', async function () {
        assert.fail("actual", "expected", "test not implemented");
    })


})
