import DeveryAdmined from './../../devery/DeveryAdmined';
import DeveryRegistry from './../../devery/DeveryRegistry';
import EveToken from './../../devery/EveToken';
import DeveryOwned from './../../devery/DeveryOwned';
import DeveryERC721 from '../../devery/DeveryERC721';

export function getData(accounts) {
  return [
    {
      appAccount: accounts[1],
      appName: 'first app',
      feeAccount: accounts[1],
      fee: 0,
      active: true,
      brands: [
        {
          brandAccount: accounts[1],
          appAccount: accounts[1],
          brandName: 'brand 1',
          active: true,
          products: [
            {
              productAccount: accounts[1],
              brandAccount: accounts[1],
              description: 'product 1 description',
              details: 'product 1 details',
              year: 2010,
              origin: 'product 1 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[2],
      appName: 'first app',
      feeAccount: accounts[2],
      fee: 0,
      active: true,
      brands: [
        {
          brandAccount: accounts[2],
          appAccount: accounts[2],
          brandName: 'brand 2',
          active: true,
          products: [
            {
              productAccount: accounts[2],
              brandAccount: accounts[2],
              description: 'product 2 description',
              details: 'product 2 details',
              year: 2010,
              origin: 'product 2 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[3],
      appName: 'first app',
      feeAccount: accounts[3],
      fee: 3,
      active: true,
      brands: [
        {
          brandAccount: accounts[3],
          appAccount: accounts[3],
          brandName: 'brand 3',
          active: true,
          products: [
            {
              productAccount: accounts[3],
              brandAccount: accounts[3],
              description: 'product 3 description',
              details: 'product 3 details',
              year: 2010,
              origin: 'product 3 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[4],
      appName: 'first app',
      feeAccount: accounts[4],
      fee: 4,
      active: true,
      brands: [
        {
          brandAccount: accounts[4],
          appAccount: accounts[4],
          brandName: 'brand 4',
          active: true,
          products: [
            {
              productAccount: accounts[4],
              brandAccount: accounts[4],
              description: 'product 4 description',
              details: 'product 4 details',
              year: 2010,
              origin: 'product 4 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[5],
      appName: 'first app',
      feeAccount: accounts[5],
      fee: 5,
      active: true,
      brands: [
        {
          brandAccount: accounts[5],
          appAccount: accounts[5],
          brandName: 'brand 5',
          active: true,
          products: [
            {
              productAccount: accounts[5],
              brandAccount: accounts[5],
              description: 'product 5 description',
              details: 'product 5 details',
              year: 2010,
              origin: 'product 5 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[6],
      appName: 'first app',
      feeAccount: accounts[6],
      fee: 6,
      active: true,
      brands: [
        {
          brandAccount: accounts[6],
          appAccount: accounts[6],
          brandName: 'brand 6',
          active: true,
          products: [
            {
              productAccount: accounts[6],
              brandAccount: accounts[6],
              description: 'product 6 description',
              details: 'product 6 details',
              year: 2010,
              origin: 'product 6 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[7],
      appName: 'first app',
      feeAccount: accounts[7],
      fee: 7,
      active: true,
      brands: [
        {
          brandAccount: accounts[7],
          appAccount: accounts[7],
          brandName: 'brand 7',
          active: true,
          products: [
            {
              productAccount: accounts[7],
              brandAccount: accounts[7],
              description: 'product 7 description',
              details: 'product 7 details',
              year: 2010,
              origin: 'product 7 origin',
              active: true,
            },
          ],
        },
      ],
    },
    {
      appAccount: accounts[8],
      appName: 'first app',
      feeAccount: accounts[8],
      fee: 1,
      active: true,
      brands: [
        {
          brandAccount: accounts[8],
          appAccount: accounts[8],
          brandName: 'brand 8',
          active: true,
          products: [
            {
              productAccount: accounts[8],
              brandAccount: accounts[8],
              description: 'product 8 description',
              details: 'product 8 details',
              year: 2010,
              origin: 'product 8 origin',
              active: true,
            },
          ],
        },
      ],
    },
  ];
}

export function createDeveryAdmined(web3, provider, account, contractAddress) {
  return new DeveryAdmined({
    web3Instance: web3, provider, acc: account, address: contractAddress,
  });
}


export function createDeveryRegistry(web3, provider, account, contractAddress) {
  return new DeveryRegistry({
    web3Instance: web3, provider, acc: account, address: contractAddress,
  });
}

export function createDeveryOwned(web3, provider, account, contractAddress) {
  return new DeveryOwned({
    web3Instance: web3, provider, acc: account, address: contractAddress,
  });
}


export function createEveToken(web3, provider, account, contractAddress) {
  return new EveToken({
    web3Instance: web3, provider, acc: account, address: contractAddress,
  });
}

export function createDeveryERC721(web3, provider, account, contractAddress) {
  return new DeveryERC721({
    web3Instance: web3, provider, acc: account, address: contractAddress,
  });
}

