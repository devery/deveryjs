# Devery Decentralized Trust

The decentralized trust contract provides a way to enable any address to vouch trust to any other address. 
This allows a programatic and decentralized way to check if an address is legitimate or not.

## Usage Examples

Here follows some use cases for the trust library

### Getting a trust client instance


Getting a read only instance is simple as

```javascript
const devery = require('@devery/devery');
const DeveryTrust = devery.DeveryTrust;

const deveryTrustClient = new DeveryTrust()
```

On this case you don't need any provider or web3 client present, so this can be used in any context.

If you want a read/write instance and have an implicit web 3 object you can call the same method, or alternatively
you can refer to https://devery.github.io/deveryjs/index.html, to check what custom params all contract constructors receive.



### Checking trusts vouched for an address

To check who vouched trust for a given address, first you need to get a client instance and then you can call the getBrandApprovals method,

the code will look like

```javascript
// import devery and DeveryTrust
import devery from '@devery/devery';
     
const { DeveryTrust } = devery;
// create new instance of deveryTrust
const deveryTrustClient = new DeveryTrust();
// address being checked
const exampleAddr = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
deveryTrustClient.getAddressApprovals(exampleAddr).then(res => {
    // what the response is going to look like -> ["0xC59c7ED1cf318c5C441Fb95a28a66b7E9Db09CbC", "0xC38e73FF84Cd24bE3c74Ee8e7AA191E29C025bd4"]
    console.log({res})
})
```

### vouching trust for an address

Only a wallet can vouch trust and it can do it only on its own behalf, this means that it's not possible to vouch trust on behalf of other addresses
and that is exactly what make the process reliable. The code to vouch trust shall look like this

the code will look like


```javascript
// import devery and DeveryTrust
import devery from '@devery/devery';

const { DeveryTrust } = devery;
// create new instance of deveryTrust
const deveryTrustClient = new DeveryTrust();
// approve the transaction
const exampleBrandKey = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
deveryTrustClient.approve(exampleBrandKey).then(res => console.log({res}))
```

### Remove trust

Finally if you want to remove the trust from a brand you can do the following

```javascript
// import devery and DeveryTrust
import devery from '@devery/devery';

const { DeveryTrust } = devery;
// create new instance of deveryTrust
const deveryTrustClient = new DeveryTrust();
// address to revoke the approval
const exampleBrandKey = "0xB3f64e7c2475227d98790a945B64309f6e75a37F"
deveryTrustClient.revoke(exampleBrandKey).then(res => console.log({res}))
```