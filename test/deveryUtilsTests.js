import Utils from './../devery/Utils';


contract('Utils tests', (accounts) => {
  it('shall not generate repeated random addresses', () => {
    const addressArr = [];
    for (let i = 0; i < 50; i++) {
      addressArr.push(Utils.getRandomAddress());
    }
    assert(new Set(addressArr).size === addressArr.length, 'The resulting set and the original array does not have the same length, this means that there are duplicated items');
  });
});
