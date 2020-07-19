
# DeveryJS: Full flow guide

## Introduction

This guide shows a simple example on how to create your first app, brand, products and claim their ownerships. for more info on the data structures you can check the ***getting-started** guide, it's highly recomended to only move forward onde you have finish reading it.

Here follows the example:

```javascript
import { DeveryRegistry, Utils, DeveryERC721, EveToken } from "@devery/devery";

function flow(log) {
  return async () => {
    //here we are getting the address of the current account  
    const myAddress = web3.eth.accounts[0];

    //then we need to get instance to the devery clients
    const deveryRegistryClient = new DeveryRegistry();
    const deveryErc721Client = new DeveryERC721();
    //we also need and instence of the underlying provider to watch for blockchain events
    const provider = deveryRegistryClient.getProvider();
    

    log("creating your APP.");
    //here we create an app, you need apps to be able to create brands and products
    //this step will fail if an app has already been created for the give address
    let txn = await deveryRegistryClient.addApp(
      "Logistics co. app",
      myAddress,
      0
    );

    //once we started the transaction we need to listen the network and wait for its completion
    await provider.provider.waitForTransaction(txn.hash);
    log("App created, creating your brand");
    
    //now we need to create a brand in order to add products
    //this step will fail if a brand has already been created for the give address
    txn = await deveryRegistryClient.addBrand(myAddress, "my brand");
    await provider.provider.waitForTransaction(txn.hash);
    log("Brand created, permissioning your address to mark products");

    // checks and approves the allowance for the deveryRegistry contract
    await checkAndUpdateAllowance(
      "0x0364a98148b7031451e79b93449b20090d79702a",
      40,
      100
    );

    // checks and approves the allowance for the deveryErc721 contract
    await checkAndUpdateAllowance(
      "0x032ef0359eb068d3dddd6e91021c02f397afce5a",
      40,
      100
    );
    //this step will fail if the function is not invoked by the brand address, only the brand owner
    //can give this permission
    txn = await deveryRegistryClient.permissionMarker(myAddress, true);
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.provider.waitForTransaction(txn.hash);
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
    await provider.provider.waitForTransaction(txn.hash);
    log("product created, calculating its hash to mark it");
    const hash = await deveryRegistryClient.addressHash(productAddress);
    log("hash calculated, marking the product");
    //this step will fail if you don't have permissionMaker to mark the product
    txn = await deveryRegistryClient.mark(productAddress, hash);
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.provider.waitForTransaction(txn.hash);
    log("product marked claiming 5 units");
    //this step will fail if the product address does not exist
    //this step will fail if the caller is not the brand that created the product
    txn = await deveryErc721Client.claimProduct(productAddress, 5);
    //this ensures we will await this transaction to finish before moving to the next step
    await provider.provider.waitForTransaction(txn.hash);
    log("Flow successfuly completed");
  };

  flow(console.log);

  ```