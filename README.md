# Devery.js
[![npm version](https://badge.fury.io/js/%40devery%2Fdevery.svg)](https://badge.fury.io/js/%40devery%2Fdevery)
[![Coverage Status](https://coveralls.io/repos/github/devery/deveryjs/badge.svg)](https://coveralls.io/github/devery/deveryjs)
[![Build Status](https://travis-ci.org/devery/deveryjs.svg?branch=master)](https://travis-ci.org/devery/deveryjs)


Javascript library for the Devery protocol.


You can check the full documentation with examples here [==> Devery.js documentation](https://devery.github.io/deveryjs/).

## Installation:

the instalation process is quite simple you just need to install it from NPM or YARN.

1. Installing devery.
    ```javascript
    npm install --save @devery/devery
    ```


That's it now you can start using it inside your app.


## Importing:

you can use require or import like syntax access devery classes

1. require like syntax.
    ```javascript
    const devery = require('@devery/devery');
    const DeveryRegistry = devery.DeveryRegistry;

    let deveryRegistryClient = new DeveryRegistry();
    ```
or alternatively you can use this.

2. ES6 import sytax
    ```javascript
    import {DeveryRegistry} from '@devery/devery';

    let deveryRegistryClient = new DeveryRegistry();
    ```

## Simple usage example

* Important read the permissioning session, to be aware of possible gotchas and pitfalls.

1. Checking if a product has been marked.

    ```javascript
      //first you need to get a {@link DeveryRegistry} instance
      let deveryRegistryClient = new DeveryRegistry();

      //passing true as param will add the account as marker
      deveryRegistryClient.check("0x627306090abaB3A6e1400e9345bC60c78a8BEf57").then(item => {
           console.log('product brand',item.brandAccount);
           //other stuff
      })

      //or with the async syntax

      async function(){
               //passing false as param will remove the account as marker
               let item = await deveryRegistryClient.check("0x627306090abaB3A6e1400e9345bC60c78a8BEf57")
               console.log('product brand',item.brandAccount);
      }
     ```

## Access to the ethereum network

Devery.js will try to automatically get the web3 object instance present in your context(page, app,etc). If this is
not possible then it will fallback to a read only provider poiting to the main network. As the fallback does not contain
a signer you will not be able to perform read operations.

## Permissioning

### web3 permissioning

Metamask requires you to give permission to your app by default. So it's very important to call `web3.currentProvider.enable()` to open metamask window permission. it's  a good idea to safeguard your code in case web3 is not present and possibilities like this. One example of how to request these permissions safely would be

```
// init metamask
try {
  if (web3 && web3.currentProvider && web3.currentProvider.isMetaMask) {
    // TODO: move this to deveryjs
    web3.currentProvider.enable()
  }
} 
catch(e){
//Handle exceptions here
}

```

If you don't do this you will not be able to interact with the contracts using metamask.

### Fee charge permissions

Some operations charge may chage a fee from the message sender, example of these transactions are marking a product and claiming a token for a marked item. The contracts that charge these fees need your permission, you can pre approve these transfers by calling the `approve` [EveToken](https://devery.github.io/deveryjs/EveToken.html).

Here's a full example on how to check the current allowance and try to increase the approval if it's bellow a certain number 

```
export async function checkAndUpdateAllowance (address, minAllowance , total) {
  try {
    //creates a new eve token instance
    let eveTokenClient = new EveToken();
    //get the current connection provider the the ethereum network
    let provider = eveTokenClient.getProvider()
    //check the current allowance for the requested contract
    let currentAllowance = await eveToken.allowance(web3.eth.accounts[0], address);
    //we need to do the division by 10e17 because devery token uses the base 18
    if(parseFloat(currentAllowance.toString()) / 10e17 < minAllowance){
        //here in the approve function we need to add the 17 0s for the same reason
        let txn = await eveTokenClient.approve(address, total + '000000000000000000')
            await provider.provider.waitForTransaction(txn.hash)
    }
   
  } catch (e) {
      //Add your excepption handling here
  }
}

//checks and approves the allowance for the deveryRegistry contract
checkAndUpdateAllowance('0x0364a98148b7031451e79b93449b20090d79702a',40,100);

//checks and approves the allowance for the deveryErc721 contract
checkAndUpdateAllowance('0x032ef0359eb068d3dddd6e91021c02f397afce5a',40,100);

```

this example would check and approve the allowance for both transactions (marking and claiming tokens) in the live network, you can always improve and change the code to fit your needs.


## Main Classes documentation.

1. [DeveryRegistry](https://devery.github.io/deveryjs/DeveryRegistry.html)
2. [DeveryERC721](https://devery.github.io/deveryjs/DeveryERC721.html)
3. [EveToken](https://devery.github.io/deveryjs/EveToken.html)
