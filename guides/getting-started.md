# DeveryJS: Getting Started Guide

## Introduction
DeveryJS is a JavaScript library that allows developers to easily integrate the Devery Protocol into their business applications to enable products to be individually identified, tracked and verified. The Devery Protocol enables anyone to record and read product information on the Ethereum public ledger, effectively enabling a decentralized digital product passport.
This guide describes basic DeveryJS API calls and use cases.

## Devery Data Model
Devery Protocol assumes the following data model:  
> Application --(1:N)--> Brand --(1:N)--> Product --(1:N)--> Item

**Application** - represents a blockchain Devery application account. One blockchain account could own only a single application. The main attributes are:

| Attribute   |      Description      |
|----------|-------------|
| name |  Name of the application |
| feeAccount |  Ethereum blockchain account address that should be used to transfer all fees collected for the Devery application transactions   |
| fee | The amount paid per application transaction in EVE |

**Brand** - represents some group of products united under one brand or grouped by some other attribute. Each Application account could have many associated Brand accounts. Brand has just one attribute - its name.

**Product** - represents product (or product model) produced under the Brand. Each Brand account could have many associated Product accounts. The main attributes of the Product are:

| Attribute   | Description                                                         |
|-------------|---------------------------------------------------------------------|
| description | Product name and description                                        |
| year        | Product's year of production                                        |
| origin      | Information about the product origin, like country it’s produced in |
| details     | Any additional information about the product                        |

**Item** - particular instance of the Product that was produced and sold/transferred to some owner.

For example:
- The shoes maker called “Super Shoes” decided to protect his unique products and provide buyers of the shoes with the possibility to verify the identity of bought products. And thus decided to register an Application called “Super Shoes App” on the blockchain using DeveryJS API.
- Using created instance of the Application the company registered on blockchain their brands: “Athletic” for sport shoes line and “Cowboy” for their cowboy boot line of shoes.
- And for each brand there were registered several products:
    - For the “Athletic” brand: “Run-2020”, “Marathon”
    - For the “Cowboy” brand: “Western-2000”, “Montana”
- Now clients who buy these shoes at some store could verify the identity of their product and register online their bought product Item using the “Super Shoes App” application.

Thus objects Application, Brand, Product and set of related API calls could be considered as API for user-”goods producer” and Item and related calls - as API for user-”consumer”.

## DeveryJS API for user-”goods producer”
This kind of API for registering products information on blockchain is implemented through the [class DeveryRegistry and its methods](https://devery.github.io/deveryjs/DeveryRegistry.html).

### Initialization of DeveryRegistry class instance
In order to initialize an instance of DeveryRegistry class it needs to be provided with an instance of blockchain connection provider or web3 object instance. Thus depending on the environment where the JavaScript code runs there are two possible ways to do it:
1. The code runs in a browser with installed [MetaMask](https://metamask.io/) plugin. In this case Devery.js will automatically get the web3 object instance presented in your context. And you could initialize your DeveryRegistry instance as simple as: 
    ```javascript
    // init metamask
    try {
        if (web3 && web3.currentProvider && web3.currentProvider.isMetaMask) {
            web3.currentProvider.enable();
        }
    } catch (e) {
        // Handle exceptions here
    }
    
    const deveryRegistry = new DeveryRegistry()
    ```

2. In other cases (you do not have MetaMask plugin in browser or run your code in node.js on server-side) you should provide DeveryRegistry constructor with parameters required to initiate such a provider:
    ```javascript
    const deveryRegistry = new DeveryRegistry({
       walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
       networkId, // 1-mainnet, 3-ropsten test network, etc.
    })
    ```
    I.e. you should provide as minimum:
    - Wallet private key for the blockchain account from that operations should be performed
    - Blockchain network ID or chain ID - the full list is available at https://chainid.network

Please reference [the documentation](https://devery.github.io/deveryjs/DeveryRegistry.html#DeveryRegistry) on more details.

### Getting EVE on testnet

Some operations like marking items might require EVE in the wallet that is performing the operation, 
to get EVE you can use the getAirdrop method from the EveToken Class

```javascript
import {EveToken } from '@devery/devery'

const eveTokenClient = new EveToken()
const tx = await eveTokenClient.getAirdrop()
const { provider } = eveTokenClient.getProvider()

await provider.waitForTransaction(tx.hash)
console.log('You just got 100 EVE to your wallet')
```
Every call to getAirdrop will give you 100 EVE, this method will work only in the testnets. For live net you need to get EVE through the normal ways.

### Registering Application on blockchain
In order to register application on blockchain the following steps need to be done:
1. Initialize DeveryRegistry instance with account that should be the application owner
2. Call the [addApp()](https://devery.github.io/deveryjs/DeveryRegistry.html#addApp) method

Also it’s a good practice to check whether application already exists prior to creating it:
```javascript
import { DeveryRegistry, Utils, EveToken } from '@devery/devery'

const deveryRegistry = new DeveryRegistry({
    walletPrivateKey: process.env.APPOWNER_WALLET_PRIVATE_KEY,
    networkId: 3,
})

const app = await deveryRegistry.getApp(appAddress)
if (!app.active) {
    const tx = await deveryRegistry.addApp(
        'My App', 
        '0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 
        0,
    )
    const { provider } = deveryRegistry.getProvider()
    await provider.waitForTransaction(tx.hash)
    console.log('the app was successfully registered on blockchain')
}
```

**Important!**
- each account could have only one application registered on blockchain
- method addApp() (as most other blockchain calls in Devery.js) returns a Promise that resolves to the [Transaction Response](https://docs.ethers.io/ethers.js/html/api-providers.html?#transaction-response) for the sent on the blockchain network transaction. I.e. in order to get the result of this transaction you need to wait for its completion using [waitForTransaction()](https://docs.ethers.io/ethers.js/html/api-providers.html?#waiting-for-transactions) call
- there is a known issue for the Ropsten network related to the fee param - you could not specify a value other than 0. 

### Adding Brand
According to the Devery data model Brand could be registered on blockchain from the Application account (i.e. using DeveryRegistry instance initialized with the Application credentials) using method [addBrand()](https://devery.github.io/deveryjs/DeveryRegistry.html#addBrand).
```javascript
import { DeveryRegistry } from '@devery/devery'

const deveryRegistry = new DeveryRegistry({
 walletPrivateKey: process.env.APP_WALLET_PRIVATE_KEY,
 networkId: 3,
})

const tx = await deveryRegistry.addBrand(
   '0x627306090abaB3A6e1400e9345bC60c78a8BEf58',
   'My Brand',
)

const { provider } = deveryRegistry.getProvider()
await provider.waitForTransaction(tx.hash)
console.log('the brand was successfully registered on blockchain')
```
Please note that one Application could have many associated brands.

### Adding and marking Product
Registering Product on blockchain happens in a very similar fashion using [addProduct()](https://devery.github.io/deveryjs/DeveryRegistry.html#addProduct) method.
```javascript
import { DeveryRegistry } from '@devery/devery'

const deveryRegistry = new DeveryRegistry({
 walletPrivateKey: process.env.BRAND_WALLET_PRIVATE_KEY,
 networkId: 3,
})

const tx = await deveryRegistryClient.addProduct(
   '0x627306090abaB3A6e1400e9345bC60c78a8BEf59',
   'My product',
   'Some details',
   2020,
   'Australia',
)

const { provider } = deveryRegistry.getProvider()
await provider.waitForTransaction(tx.hash)
console.log('the product was successfully registered on blockchain')
```

Please note that each Brand account could have associated an unlimited number of products.

In order to allow consumers/clients to claim product ownership on blockchain this Product record needs to be verified and marked by an account having appropriate rights that are set by the [permissionMarker()](https://devery.github.io/deveryjs/DeveryRegistry.html#permissionMarker) call. After that this account would be allowed to make markings of the Product records using [mark()](https://devery.github.io/deveryjs/DeveryRegistry.html#mark) or [hashAndMark()](https://devery.github.io/deveryjs/DeveryRegistry.html#hashAndMark) calls.
```javascript
const permissionTx = await deveryRegistry.permissionMarker(
    process.env.BRAND_ADDRESS, 
    true,
)
await provider.waitForTransaction(permissionTx.hash)
console.log('Mark permission set')

const markTx = await deveryRegistry.hashAndMark(
    '0x627306090abaB3A6e1400e9345bC60c78a8BEf59'
)
await provider.waitForTransaction(markTx.hash)
console.log('The product was marked')
```

Actually in most typical scenarios and cases marking account could be the same as a related Brand account, thus in this case the call [AddProductAndMark()](https://devery.github.io/deveryjs/DeveryRegistry.html#AddProductAndMark) could be used to simplify the things.

## DeveryJS API for user-”consumer”
DeveryJS API for user-”consumer” is based on the [ERC-721](http://erc721.org/) standard and is accessible via methods of the [DeveryERC721](https://devery.github.io/deveryjs/DeveryERC721.html) class.

### Claiming ownership of Product Items
In order to claim some user’s ownership of some amount of product items (for example, boots that user bought in a shop) the following actions need to be taken:
1. Init instance of the [DeveryERC721](https://devery.github.io/deveryjs/DeveryERC721.html) class with the product’s Brand account
2. Call [DeveryERC721.claimProduct()](https://devery.github.io/deveryjs/DeveryERC721.html#claimProduct) method (in fact claim the Brand account as a Product Item owner) - for security reasons only a Brand account is allowed to make the [claimProduct()](https://devery.github.io/deveryjs/DeveryERC721.html#claimProduct) call.
3. Transfer ownership to the account of the real owner, i.e user-”consumer” who owns this Product Item.

The code sample could looks like the following:
```javascript
const networkId = 3 // ropsten
const productAddr = '0x627306090abaB3A6e1400e9345bC60c78a8BEf60' // product to claim
const userAddr = '0x627306090abaB3A6e1400e9345bC60c78a8BEf60' // address of the user (product owner) account
 
const deveryRegistry = new DeveryRegistry({
    walletPrivateKey: process.env.BRAND_PRIVATE_KEY,
    networkId,
})
const { provider } = deveryRegistry.getProvider()
const deveryERC721 = new DeveryERC721({
    web3Instance: provider,
    networkId,
})

const claimTx = await deveryERC721Client.claimProduct(productAddr)
await provider.waitForTransaction(claimTx.hash)

const tokenId = await getTokenIdByAddress(
    productAddr,
    process.env.BRAND_ADDRESS,
    deveryERC721Client,
)

const transferTx = await deveryERC721.safeTransferFrom(process.env.BRAND_ADDRESS, userAddr, tokenId)
await provider.waitForTransaction(transferTx.hash)
console.log('The product claimed')

const getTokenIdByAddress = async (address, wallet, client) => {
    const balance = await client.balanceOf(wallet)
    address = address.toLocaleLowerCase()
    for (let i = 0; i < balance; i++) {
        const tokenId = await client.tokenOfOwnerByIndex(wallet, i)
        const prodAddress = await client.tokenIdToProduct(tokenId)
        if (prodAddress.toLocaleLowerCase() === address) {
            return tokenId
        }
    }
    throw new Error('token id for the address is not found')
}
```

### Transferring Product Item ownership
In case if a Product Item changes its owner and should be transferred from one user account to another then it could be implemented in a very similar way as it was done during the claiming process.
```javascript
const deveryERC721Client4Sender = new DeveryERC721({
    walletPrivateKey: sender.privateKey,
    networkId: 3,
})

const tokenId = await getTokenIdByAddress(
    productAddr,
    sender.accountAddress,
    deveryERC721Client4Sender,
)

const tx = await deveryERC721Client4Sender.safeTransferFrom(
    sender.accountAddress,
    receiver.accountAddress,
    tokenId,
)
```

## Some important practical moments
During implementation of business applications with usage of the Devery.js module it is recommended to pay attention to the following typical issues and follow these practices:

### Do not forget to manage allowance
Prior to making any Devery calls you need to make sure that operations are allowed and check [allowance](https://devery.github.io/deveryjs/EveToken.html#allowance). In your source code it may looks like:
```javascript
import { EveToken } from '@devery/devery'
// Devery contract addresses
const erc721ContractAddress = '0x032EF0359EB068d3DddD6E91021c02F397AfcE5a'
const registryContractAddress = '0x0364a98148b7031451e79b93449b20090d79702a'

const eveTokenClient = new EveToken()
const {provider} = eveTokenClient.getProvider()

async function checkAllowance() {
    // allowance seems working on mainnet only
    if (networkId === 1) {
        const deveryTokenCount = await eveTokenClient.allowance(
            process.env.WALLET,
            registryContractAddress,
        )
        if (deveryTokenCount.toString() / 10e17 < 10) {
            const tx = await eveTokenClient.approve(
                registryContractAddress, 
                '50' + '000000000000000000',
            )
            await provider.waitForTransaction(tx.hash)
        }

        const ERC721TokenCount = await eveTokenClient.allowance(
            process.env.WALLET,
            erc721ContractAddress,
        )
        if (ERC721TokenCount.toString() / 10e17 < 10) {
            const tx = await eveTokenClient.approve(
                erc721ContractAddress, 
                '50' + '000000000000000000',
            )
            await provider.waitForTransaction(tx.hash)
        }
    }
}
```

### Share the same provider to have nonce consistent
It is a good practice to share the same provider instance for all Devery.js objects to have nonce consistent across all your calls. Otherwise you would be forced to manage blockchain transactions’ nonce manually to avoid nonce conflicts. I.e. it is recommended to initialize Devery.js object in the following fashion:
```javascript
const deveryRegistry = new DeveryRegistry({
    walletPrivateKey: process.env.BRAND_PRIVATE_KEY,
    networkId,
})
const { provider } = deveryRegistry.getProvider()
const deveryERC721 = new DeveryERC721({
    web3Instance: provider,
    networkId,
})
```

### Sponsor blockchain operations for different accounts
Each blockchain operation needs some gas to be processed on Ethereum. Thus each account that was used to initialize Devery.js object should have some ETHs prior to making any blockchain calls. In most cases business applications as a rule have one central wallet (general static application account) and thus ETHs from it need to be transferred to other accounts (that in most cases are created dynamically) prior to making any blockchain calls. I.e. “to sponsor” such operations. For example, such mechanism could be implemented with usage of ethers.js and ethereumjs-tx modules:
```javascript
const sendEthereum = async ({
    to,
    from,
    fromPrivateKey,
    value,
    gasPrice = ethers.utils.parseUnits('10', 'gwei').toHexString(),
    gasLimit = ethers.utils.hexlify(21000),
}) => {
    const txCount = await provider.getTransactionCount(from)
    // build the transaction
    const tx = new Tx({
        nonce: ethers.utils.hexlify(txCount),
        to,
        value: ethers.utils.parseEther(value).toHexString(),
        gasLimit,
        gasPrice,
    })
    // sign the transaction
    tx.sign(Buffer.from(fromPrivateKey, 'hex'))
    // send the transaction
    try {
        const { hash } = await provider.sendTransaction('0x' + tx.serialize().toString('hex'))
        await provider.waitForTransaction(hash)
    } catch (e) {
        console.error('Error while sending ethers', e)
    }
}
```