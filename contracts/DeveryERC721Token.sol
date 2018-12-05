pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;


import "./ERC721.sol";
import "./DeveryRegistry.sol";

/**
 * @title DeveryERC721Token
 * @author victor eloy
 * @dev links the products with our ERC721Token
 */
contract DeveryERC721Token is ERC721,Admined {


    address[] public tokenIdToProduct;
    DeveryRegistry deveryRegistry;

    function setDeveryRegistryAddress(address _deveryRegistryAddress) external onlyAdmin {
        deveryRegistry = DeveryRegistry(_deveryRegistryAddress);
    }

    function claimProduct(address _productAddress) external payable  {
        address productBrandAddress;
        (,productBrandAddress,,,,,) = deveryRegistry.products(_productAddress);
        require(productBrandAddress == msg.sender);
        uint nextId = tokenIdToProduct.push(_productAddress) - 1;
        _mint(msg.sender,nextId);
    }

    function getProductsByOwner(address _owner) external view returns (address[]){
        address[] memory products = new address[](balanceOf(_owner));
        uint counter = 0;
        for(uint i = 0; i < tokenIdToProduct.length;i++){
            if(ownerOf(i) == _owner){
                products[counter] = tokenIdToProduct[i];
                counter++;
            }
        }
        return products;
    }
}
