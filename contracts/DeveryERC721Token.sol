pragma solidity ^0.4.24;

import "./ERC721.sol";
import "./DeveryRegistry.sol";

contract DeverERC721Token is ERC721 {
     DeveryRegistry deveryRegistry;

      //TODO: add admin only
     function setDeveryRegistryAddress(address _deveryRegistryAddress) {
        deveryRegistry = DeveryRegistry(_deveryRegistryAddress);
     }

    function claimProduct(address _productAddress) external returns (Product) {
        Product product = deveryRegistry.products(_productAddress);
        return product;

    }
}
