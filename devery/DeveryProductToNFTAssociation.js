import AbstractSmartContract from './AbstractSmartContract';

const deveryERC721Artifact = require('../build/contracts/DeveryProductToNFTAssociation.json');
const ethers = require('ethers');



//this class is a wrapper for this smart contract

/**
 * contract DeveryProductToNFTAssociation is Admined {

     //this holds the address of the NFT to which a given product is associated
     mapping(uint256 => address) private deveryErc721IdToExternalNftContractAddress;

     //this holds the id of the NFT to which a given product is associated
     mapping(uint256 => uint256) private deveryERC721IdToExternalNFTTokenId;


     //given an external NFT smart contract, this maps the deveryERC721 tokens associated with a given NFT on that contract
     mapping(address => mapping(uint256 => mapping(uint256 => uint256))) private externalNftProductsAssociationArray;
     //given an external NFT smart contract, this holds the count of products associated with the NFT in that contract
     mapping(address => mapping(uint256 => uint256)) private externalNftProductsAssociationCount;
     //this marks if a give NFT is restricted from depositing here
     mapping(address => bool) private restrictedNFTs;
     //the address to our deveryERC721 instance
     address private deveryERC721Address;

    function setDeveryERC721Address(address _deveryERC721Address) external onlyAdmin {
        deveryERC721Address = _deveryERC721Address;
    }

    function depositProductToNFT(uint256 externalNFTTokenId, address externalNFTContractAddress,uint256 deveryErc721TokenId) public {
        
        require(restrictedNFTs[externalNFTContractAddress] == false,"This NFT was restricted");

        ERC721 deveryERC721 = ERC721(deveryERC721Address);
        //get the address of the derevyERC721TokenId
        address deveryErc721tokenOwner = deveryERC721.ownerOf(deveryErc721TokenId);
        //check if the caller is the owner of the token
        require(deveryErc721tokenOwner == msg.sender,"You are not the owner of this deveryToken token");
        //check if the token is already in the contract
        require(deveryERC721IdToExternalNFTTokenId[externalNFTTokenId] == 0,"This NFT token is already in the contract");

        ERC721 externalNFTT = ERC721(externalNFTContractAddress);
        //now lets check if the current address owns the externalNFTContractAddress
        require(externalNFTT.ownerOf(externalNFTTokenId) == msg.sender,"You are not the owner of this external token");
        
        //save the address of the original token contract so we can revert manipulate it if necessary
        deveryErc721IdToExternalNftContractAddress[deveryErc721TokenId] = externalNFTContractAddress;
        //save the external token id linked to this token
        deveryERC721IdToExternalNFTTokenId[deveryErc721TokenId] = externalNFTTokenId;

        //now lets save the association
        externalNftProductsAssociationArray[externalNFTContractAddress][externalNFTTokenId][getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId)] = deveryErc721TokenId;
        setCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId,getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId) + 1);

        //now lets transfer the token to this contract
        deveryERC721.transferFrom(msg.sender, address(this), deveryErc721TokenId);

    }

    function getCountOfProductsAssociatedWithExternalNFT(address externalNFTContractAddress,uint256 externalNFTTokenId) public view returns (uint256){
        return externalNftProductsAssociationCount[externalNFTContractAddress][externalNFTTokenId];
    }

    function setCountOfProductsAssociatedWithExternalNFT(address externalNFTContractAddress,uint256 externalNFTTokenId,uint256 count) private {
        externalNftProductsAssociationCount[externalNFTContractAddress][externalNFTTokenId] = count;
    }

    function restrictNFT(address nftToRestrict) external onlyAdmin {
        restrictedNFTs[nftToRestrict] = true;
    }

     function unrestrictNFT(address nftToRestrict) external onlyAdmin {
        restrictedNFTs[nftToRestrict] = false;
    }



    
      //This function checks if the msg.sender is the owner of the NFT token, if the token is not restricted, and if the token is associated with this contract
      //this this is the case we transfer all ERC721 tokens associated with a given NFT to the msg.sender
     
     function retrieveAllDeveryErc721ProductsAssociatedWithExternalNft(address externalNFTContractAddress,uint256 externalNFTTokenId) public {
        require(restrictedNFTs[externalNFTContractAddress] == false,"This NFT was restricted");
        require(getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId) > 0,"There are no products associated with this NFT");

        ERC721 deveryERC721 = ERC721(deveryERC721Address);

        ERC721 externalNFTT = ERC721(externalNFTContractAddress);
        //now lets check if the current address owns the externalNFTContractAddress
        require(externalNFTT.ownerOf(externalNFTTokenId) == msg.sender,"You are not the owner of this external token");

        //now let's loop through all the products associated with this external NFT
        for(uint i = 0; i < getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId); i++){
            uint deveryErc721TokenId = externalNftProductsAssociationArray[externalNFTContractAddress][externalNFTTokenId][i];
            //check if deveryErc721TokenId is not 0
            require(deveryErc721TokenId != 0,"This deveryErc721TokenId is not valid");
            //check if this contract owns the deveryErc721TokenId using the deveryERC721Address
            require(deveryERC721.ownerOf(deveryErc721TokenId) == address(this),"This deveryErc721TokenId is not owned by this contract");
            deveryERC721.transferFrom(address(this), msg.sender, deveryErc721TokenId);

            //resets the internal data associated with this token
            deveryErc721IdToExternalNftContractAddress[deveryErc721TokenId] = address(0);
            deveryERC721IdToExternalNFTTokenId[deveryErc721TokenId] = 0;
            externalNftProductsAssociationArray[externalNFTContractAddress][externalNFTTokenId][i] = 0;
        }

        //now we reset the internal data associated with this external NFT
        setCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress, externalNFTTokenId, 0);
        

    }


    //checks if a give deveryERC721 token is associated with an external NFT
    function isDeveryErc721AssociatedWithExternalNFT(uint256 deveryErc721TokenId) public view returns (bool){
        return deveryERC721IdToExternalNFTTokenId[deveryErc721TokenId] != 0;
    }

    //get the id of the token associated with a given devery token
    function getExternalNFTTokenIdAssociatedWithDeveryERC721Token(uint256 deveryERC721TokenId) public view returns (uint256){
        return deveryERC721IdToExternalNFTTokenId[deveryERC721TokenId];
    }

    //get the address of the contract for a given NFT associated with devery erc721
    function getExternalNFTContractAddressAssociatedWithDeveryERC721Token(uint256 deveryERC721TokenId) public view returns (address){
        return deveryErc721IdToExternalNftContractAddress[deveryERC721TokenId];
    }

    //get the ids of the products associated with a given external NFT
    function getDeveryErc721TokenIdsAssociatedWithExternalNFT(address externalNFTContractAddress,uint256 externalNFTTokenId) public view returns (uint256[] memory){
        //we need to declare a new array and loop through the items to copy them to the new array and return
        uint256[] memory result = new uint256[](getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId));
        for(uint i = 0; i < getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress,externalNFTTokenId); i++){
            result[i] = externalNftProductsAssociationArray[externalNFTContractAddress][externalNFTTokenId][i];
        }
        return result;
    }
    
}
 */

/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and listen to ownership change related
 * events.
 *
 * @version 1
 * @extends AbstractSmartContract
 */
class DeveryProductToNFTAssociation extends AbstractSmartContract {
    /**
     *
     * Creates a new instance of DeveryERC721.
     * ```
     * // creates a DeveryERC721Client with the default params
     * let deveryERC721Client = new DeveryERC721();
     *
     * // creates a deveryRegistryClient pointing to a custom address
     * let deveryERC721Client = new DeveryERC721({address:'0xf17f52151EbEF6C7334FAD080c5704DAAA16b732'});
     *
     * ```
     *
     * @param {ClientOptions} options network connection options.
     *
     */
    constructor(options = {
        web3Instance: undefined,
        acc: undefined,
        address: undefined,
        walletPrivateKey: undefined,
        networkId: undefined,
        infuraProjectKey: undefined,
    }) {
        super(...arguments);

        options = Object.assign(
            {
                web3Instance: undefined,
                acc: undefined,
                address: undefined,
                walletPrivateKey: undefined,
                networkId: undefined,
            },
            options,
        );

        let address = options.address;
        let network = options.networkId;

        try {
            if (!options.web3Instance) {
                options.web3Instance = web3;
            }
            network = options.web3Instance.version.network;
            // console.log('it was not possible to find global web3');
        } catch (e) {
            // console.log('it was not possible to find global web3');
        }

        if (!network) {
            try {
                if (!options.web3Instance) {
                    options.web3Instance = web3;
                }
                network = options.web3Instance.currentProvider.networkVersion;
            } catch (e) {
                // console.log('it was not possible to find global web3');
            }
        }

        if (!network) {
            network = options.networkId || 1;
        }

        if (!address) {
            address = deveryERC721Artifact.networks[network].address;
        }

        this.__deveryERC721Contract = new ethers.Contract(
            address,
            deveryERC721Artifact.abi,
            this.__signerOrProvider,
        );

        this.address = address;
        this.abi = deveryERC721Artifact.abi;
    }


    async depositProductToNFT(deveryErc721TokenId, externalNFTContractAddress, externalNFTTokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .depositProductToNFT(deveryErc721TokenId, externalNFTContractAddress, externalNFTTokenId, overrideOptions);
        return result.valueOf();
    }

    async retrieveAllDeveryErc721ProductsAssociatedWithExternalNft(externalNFTContractAddress, externalNFTTokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .retrieveAllDeveryErc721ProductsAssociatedWithExternalNft(externalNFTContractAddress, externalNFTTokenId, overrideOptions);
        return result.valueOf();
    }

    async getExternalNFTTokenIdAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .getExternalNFTTokenIdAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions);
        return result.valueOf();
    }

    async getExternalNFTContractAddressAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .getExternalNFTContractAddressAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions);
        return result.valueOf();
    }

    async getDeveryErc721TokenIdsAssociatedWithExternalNFT(externalNFTContractAddress, externalNFTTokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .getDeveryErc721TokenIdsAssociatedWithExternalNFT(externalNFTContractAddress, externalNFTTokenId, overrideOptions);
        return result.valueOf();
    }

    async isDeveryErc721AssociatedWithExternalNFT(deveryErc721TokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .isDeveryErc721AssociatedWithExternalNFT(deveryErc721TokenId, overrideOptions);
        return result.valueOf();
    }

    async getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress, externalNFTTokenId, overrideOptions = {}) {
        const result =  await this.__deveryERC721Contract
            .getCountOfProductsAssociatedWithExternalNFT(externalNFTContractAddress, externalNFTTokenId, overrideOptions);
        return result.valueOf();
    }

    
}


export default DeveryProductToNFTAssociation;
