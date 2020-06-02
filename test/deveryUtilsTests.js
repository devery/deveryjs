import Utils from './../devery/Utils';


contract('Utils tests', (accounts) => {
  it('shall not generate repeated random addresses', () => {
    const addressArr = [];
    for (let i = 0; i < 50; i++) {
      addressArr.push(Utils.getRandomAddress());
    }
    assert(new Set(addressArr).size === addressArr.length, 'The resulting set and the original array does not have the same length, this means that there are duplicated items');
  });

  it('shall correctly check if an address is valid', () => {
    for(let i =0; i< 50; i++){
      assert(Utils.isAddress(Utils.getRandomAddress()));
    }
    assert(!Utils.isAddress(123));
    assert(!Utils.isAddress('OX23232323'));
    assert(Utils.isAddress('0xcafe8af8fb8fca7b22541fadd28027f56fe0079d'));
    assert(Utils.isAddress('0XCAFE8AF8FB8FCA7B22541FADD28027F56FE0079D'));
    for(let i =0; i< 50; i++){
      assert(!Utils.isAddress(Utils.getRandomAddress()+'8'));
    }
  })
});
