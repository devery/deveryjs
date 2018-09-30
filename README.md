# Devery.js 
[![npm version](https://badge.fury.io/js/devery.svg)](https://badge.fury.io/js/devery)

Javascript library for the Devery protocol.


You can check the full documentation with examples here [==> Devery.js documentation](https://devery.github.io/deveryjs/).

## Installation:

the instalation process is quite simple you just need to install it from NPM or YARN.

1. Installing devery.
    ```javascript
    npm install --save devery
    ```


That's it now you can start using it inside your app.


## Importing:

you can use require or import like syntax access devery classes

1. require like syntax.
    ```javascript
    const devery = require('devery');
    const DeveryRegistry = devery.DeveryRegistry;

    let deveryRegistryClient = new DeveryRegistry();
    ```
or alternatively you can use this.

2. ES6 import sytax
    ```javascript
    import {DeveryRegistry} from 'devery';

    let deveryRegistryClient = new DeveryRegistry();
    ```

## Simple usage example

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

## Main Classes documentation.

1. [DeveryRegistry](https://devery.github.io/deveryjs/DeveryRegistry.html)
2. [EveToken](https://devery.github.io/deveryjs/EveToken.html)
