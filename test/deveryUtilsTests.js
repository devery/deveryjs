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
    assert(Utils.isAddress('0xCAFE8AF8FB8FCA7B22541FADD28027F56FE0079D'));
    for(let i =0; i< 50; i++){
      assert(!Utils.isAddress(Utils.getRandomAddress()+'8'));
    }
  });

  it('shall correctly check if an address is a valid checksum address', () => {
    const tests = [
      { addr: '0x52908400098527886E0F7030069857D2E4169EE7', is: true },
      { addr: '0xa54D3c09E34aC96807c1CC397404bF2B98DC4eFb', is: false },
      { addr: '0xa54d3c09E34aC96807c1CC397404bF2B98DC4eFb', is: true },
      { addr: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', is: true },
      { addr: '0XD1220A0CF47C7B9BE7A2E6BA89F429762E7B9ADB', is: false },
      { addr: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', is: false },
      { addr: '0xd115bffabbdd893a6f7cea402e7338643ced44a6', is: false },
      { addr: '0xD115BFFAbbdd893A6f7ceA402e7338643Ced44a6', is: true },
      { addr: '0xa54d3c09E34aC96807c1CC397404bF2B98DC4eFb', is: true },
      { addr: '0xa54D3c09E34aC96807c1CC397404bF2B98DC4eFb', is: false },
    ];

    tests.forEach(test => assert(Utils.isChecksumAddress(test.addr) === test.is));
  });
});
