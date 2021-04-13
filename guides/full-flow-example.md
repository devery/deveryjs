# DeveryJS: Full flow guide

## Introduction

This guide shows a simple example on how to create your first app, brand, products and claim their ownerships. for more info on the data structures you can check the **\*getting-started** guide, it's highly recomended to only move forward onde you have finish reading it.

Here follows the example:

```javascript
const devery = require("@devery/devery");
const { DeveryRegistry, Utils, DeveryERC721, EveToken } = devery;
const { ethers } = require("ethers");

const checkAndUpdateAllowance = async (
  eveTokenClient,
  provider,
  account,
  contractAddress,
  minAllowance = 40,
  total = 100
) => {
  try {
    const currentAllowance = await eveTokenClient.allowance(
      account,
      contractAddress
    );
    if (parseFloat(currentAllowance.toString()) / 10e17 >= minAllowance) return;

    const { hash } = await eveTokenClient.approve(
      contractAddress,
      `${total}000000000000000000`
    );
    await provider.waitForTransaction(hash);
  } catch (e) {
    console.error(e);
  }
};

function flow(log) {
  return async () => {
    log("starting");

    const walletPrivateKey = "ENTER YOUR KEY HERE";
    const myAddress = "ENTER YOUR ADDRESS HERE";
    networkId = 3;
    const provider = new ethers.getDefaultProvider("ropsten");

    const wallet = new ethers.Wallet(walletPrivateKey, provider);
    log(wallet);

    //here we are getting the address of the current account

    //then we need to get instance to the devery clients
    const deveryRegistryClient = new DeveryRegistry({
      web3Instance: wallet,
      networkId,
    });
    const deveryErc721Client = new DeveryERC721({
      web3Instance: wallet,
      networkId,
    });
    const eveTokenClient = new EveToken({
      web3Instance: wallet,
      networkId,
    });
    //we also need and instence of the underlying provider to watch for blockchain events
    // const provider = deveryRegistryClient.getProvider();

    log("creating your APP.");
    //here we create an app, you need apps to be able to create brands and products
    //this step will fail if an app has already been created for the give address
    let txn = await deveryRegistryClient.addApp(
      "Logistics co. app",
      myAddress,
      "1000000000000000000"
    );

    //once we started the transaction we need to listen the network and wait for its completion
    await provider.waitForTransaction(txn.hash);
    log("App created, creating your brand");

    //now we need to create a brand in order to add products
    //this step will fail if a brand has already been created for the give address
    txn = await deveryRegistryClient.addBrand(myAddress, "my brand");
    await provider.waitForTransaction(txn.hash);
    log("Brand created, permissioning your address to mark products");

    // checks and approves the allowance for the deveryRegistry contract
    await checkAndUpdateAllowance(
      eveTokenClient,
      provider,
      myAddress,
      deveryRegistryClient.__deveryRegistryContract.address,
      40,
      100
    );

    // checks and approves the allowance for the deveryErc721 contract
    await checkAndUpdateAllowance(
      eveTokenClient,
      provider,
      myAddress,
      deveryErc721Client.__deveryERC721Contract.address,
      40,
      100
    );
    //this step will fail if the function is not invoked by the brand address, only the brand owner
    //can give this permission
    txn = await deveryRegistryClient.permissionMarker(myAddress, true);
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.waitForTransaction(txn.hash);
    //important, generate a random address for the product
    const productAddress = Utils.getRandomAddress();
    //this strep will fail if you try to create it with a repeated address
    log("address permissioned, creating product with adress " + productAddress);
    txn = await deveryRegistryClient.addProduct(
      productAddress,
      "My nice product",
      "batch 001",
      2018,
      "Unknown place"
    );
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.waitForTransaction(txn.hash);
    log("product created, calculating its hash to mark it");
    const hash = await deveryRegistryClient.addressHash(productAddress);
    log("hash calculated, marking the product");
    //this step will fail if you don't have permissionMaker to mark the product
    txn = await deveryRegistryClient.mark(productAddress, hash);
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.waitForTransaction(txn.hash);
    log("product marked claiming 5 units");
    //this step will fail if the product address does not exist
    //this step will fail if the caller is not the brand that created the product
    txn = await deveryErc721Client.claimProduct(productAddress, 5);
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.waitForTransaction(txn.hash);

    //get my new token id
    tokenId = await deveryErc721Client.tokenOfOwnerByIndex(address, 0);
    log("setting token URI)
    //set my token URI, the URI is just a dummy one for demo purposes
    tokenId = await deveryErc721Client.setTokenURI(tokenId, "http://non-existent.com/1/metadata.json");
    log("Flow successfuly completed");
  };
}

flow(console.log)();
```
