```javascript
function flow(log) {
  return async () => {
    const myAddress = web3.eth.accounts[0];
    const deveryRegistryClient = new DeveryRegistry();
    const provider = deveryRegistryClient.getProvider();
    const deveryErc721Client = new DeveryERC721();
    log("creating your APP.");
    //this step will fail if an app has already been created for the give address
    let txn = await deveryRegistryClient.addApp(
      "Logistics co. app",
      myAddress,
      0
    );
    await provider.provider.waitForTransaction(txn.hash);
    log("App created, creating your brand");
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
  ```