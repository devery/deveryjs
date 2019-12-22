# Devery.js
[![npm version](https://badge.fury.io/js/%40devery%2Fdevery.svg)](https://badge.fury.io/js/%40devery%2Fdevery)
[![Coverage Status](https://coveralls.io/repos/github/devery/deveryjs/badge.svg)](https://coveralls.io/github/devery/deveryjs)
[![Build Status](https://travis-ci.org/devery/deveryjs.svg?branch=master)](https://travis-ci.org/devery/deveryjs)


Javascript library for the Devery protocol.


You can check the full documentation with examples here [==> Devery.js documentation](https://devery.github.io/deveryjs/).

## Installation:

The installation process is quite simple - you just need to install it using NPM or YARN.
```
npm install --save @devery/devery
```

That's it - now you can start using devery.js inside your app.


## Importing:

You can use `require` or `import` like syntax to access devery classes

1. `require` like syntax:
    ```javascript
    const devery = require('@devery/devery');
    const DeveryRegistry = devery.DeveryRegistry;

    let deveryRegistryClient = new DeveryRegistry();
    ```
or alternatively you can use this.

2. ES6 import syntax:
    ```javascript
    import {DeveryRegistry} from '@devery/devery';

    let deveryRegistryClient = new DeveryRegistry();
    ```

## Simple usage example

**Important** Read the permissioning session, to be aware of possible gotchas and pitfalls.

1. Checking if a product has been marked.

    ```javascript
      // first you need to get a {@link DeveryRegistry} instance
      let deveryRegistryClient = new DeveryRegistry();

      // check product by specified address
      deveryRegistryClient.check("0x627306090abaB3A6e1400e9345bC60c78a8BEf57").then(item => {
           console.log('product brand',item.brandAccount);
           // other stuff
      });

      // or with the async syntax

      async function foo() {
               let item = await deveryRegistryClient.check("0x627306090abaB3A6e1400e9345bC60c78a8BEf57")
               console.log('product brand',item.brandAccount);
      }
     ```

## Access to the ethereum network

Devery.js will try to automatically get the web3 object instance presented in your context(page, app etc). If this is
not possible then it will fallback to a read only provider pointing to the main network. As the fallback does not contain
a signer you will not be able to perform write operations.

## Permissioning

### web3 permissioning

Metamask requires you to give permission to your app by default. So it's very important to call `web3.currentProvider.enable()` to open Metamask permission window. It's a good idea to safeguard your code for the case when web3 is not presented. One example of how to request these permissions safely would be:

```javascript
// init metamask
try {
  if (web3 && web3.currentProvider && web3.currentProvider.isMetaMask) {
    // TODO: move this to deveryjs
    web3.currentProvider.enable();
  }
} 
catch(e) {
    // Handle exceptions here
}

```

If you don't do this you will not be able to interact with the contracts using Metamask.

### Fee charge permissions

Some operations may charge a fee from the message sender. Example of these transactions is marking a product and claiming a token for a marked item. The contracts that charge these fees need your permission, you can pre approve these transfers by calling the `approve` [EveToken](https://devery.github.io/deveryjs/EveToken.html).

Here's a full example on how to check the current allowance and try to increase the approval if it's bellow a certain number 

```javascript
export async function checkAndUpdateAllowance (address, minAllowance , total) {
  try {
    // creates a new eve token instance
    let eveTokenClient = new EveToken();
    // get the current ethereum network connection provider
    let provider = eveTokenClient.getProvider();
    // check the current allowance for the requested contract
    let currentAllowance = await eveToken.allowance(web3.eth.accounts[0], address);
    // we need to do the division by 10e17 because devery token uses the base 18
    if(parseFloat(currentAllowance.toString()) / 10e17 < minAllowance) {
        // here in the approve function we need to add the 17 0s for the same reason
        let txn = await eveTokenClient.approve(address, total + '000000000000000000');
        await provider.provider.waitForTransaction(txn.hash);
    }
   
  } catch (e) {
      // Add your exception handling here
  }
}

// checks and approves the allowance for the deveryRegistry contract
checkAndUpdateAllowance('0x0364a98148b7031451e79b93449b20090d79702a',40,100);

// checks and approves the allowance for the deveryErc721 contract
checkAndUpdateAllowance('0x032ef0359eb068d3dddd6e91021c02f397afce5a',40,100);

```

This example would check and approve the allowance for both transactions (marking and claiming tokens) in the live network, you can always improve and change the code to fit your needs.


## Main Classes documentation.

1. [DeveryRegistry](https://devery.github.io/deveryjs/DeveryRegistry.html)
2. [DeveryERC721](https://devery.github.io/deveryjs/DeveryERC721.html)
3. [EveToken](https://devery.github.io/deveryjs/EveToken.html)
