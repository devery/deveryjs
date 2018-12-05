pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


import "./ERC721.sol";
import "./DeveryRegistry.sol";
import "./Admined";

contract DeveryERC721Token is ERC721,Admined {

    address[] tokenIdToProduct;
    DeveryRegistry deveryRegistry;
    
    function setDeveryRegistryAddress(address _deveryRegistryAddress) external onlyAdmin {
        deveryRegistry = DeveryRegistry(_deveryRegistryAddress);
    }

    function claimProduct(address _productAddress) external view returns (address,address,string,string,uint,string,bool)  {
        address productBrandAddress;
        (,productBrandAddress,,,,,) = deveryRegistry.products(_productAddress);
        require(productBrandAddress == msg.sender);
        uint nextId = claimedProducts.push(productBrandAddress) - 1;
        _mint(msg.sender,nextId);
    }
}
