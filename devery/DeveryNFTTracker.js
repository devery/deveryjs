import AbstractSmartContract from './AbstractSmartContract';

const deveryERC721Artifact = require('../build/contracts/DeveryNFTTracker.json');
const ethers = require('ethers');



//this class is a wrapper for this smart contract

/*
contract DeveryNFTTracker is Admined {

     //holds the address of the contract that is used to track the products
     mapping(uint256 => address) private deveryErc721IdToOriginalTokenContractAddress;
     //this holds the address of the person who originally sent the external nft to this contract
     mapping(uint256 => address) private deveryErc721IdToriginalTokenOwnerMapping; 
     //this holds the id of the external token that is mapped to a given deveryERC721
     mapping(uint256 => uint256) private deveryERC721IdToExternalTokenId;
     //this holds a way to access the DeveryErc721Token from a External NFT address and id
     mapping(address => mapping(uint256 => uint256)) private externalNFTIdToDeveryERC721Token;
     //this marks if a give NFT is restricted from depositing here
     mapping(address => bool) private restrictedNFTs;
     //the address to our deveryERC721 instance
     address private deveryERC721Address;

    function setDeveryERC721Address(address _deveryERC721Address) external onlyAdmin {
        deveryERC721Address = _deveryERC721Address;
    }

    function depositToken(uint256 externalTokenId, address contractAddress,uint256 derevyERC721TokenId) public {
        
        require(restrictedNFTs[contractAddress] == false,"This NFT was restricted");

        ERC721 deveryERC721 = ERC721(deveryERC721Address);
        //get the address of the derevyERC721TokenId
        address deveryErc721tokenOwner = deveryERC721.ownerOf(derevyERC721TokenId);
        //check if the caller is the owner of the token
        require(deveryErc721tokenOwner == msg.sender,"You are not the owner of this deveryToken token");
        //check if the token is already in the contract
        require(deveryERC721IdToExternalTokenId[externalTokenId] == 0,"This NFT token is already in the contract");

        ERC721 externalNFTToken = ERC721(contractAddress);
        //now lets check if the current address owns the externalTokenId
        require(externalNFTToken.ownerOf(externalTokenId) == msg.sender,"You are not the owner of this external token");
        //now lets check if the given NFT transfer is approved to transfer to this contract
        
        //save the address of the original token contract so we can revert manipulate it if necessary
        deveryErc721IdToOriginalTokenContractAddress[derevyERC721TokenId] = contractAddress;
        //save the address of the original person who used to own and deposited this external NFT token
        deveryErc721IdToriginalTokenOwnerMapping[derevyERC721TokenId] = msg.sender;
        //save the external token id linked to this token
        deveryERC721IdToExternalTokenId[derevyERC721TokenId] = externalTokenId;

        externalNFTIdToDeveryERC721Token[contractAddress][externalTokenId] = derevyERC721TokenId;
        //now lets transfer the token to this contract
        externalNFTToken.transferFrom(msg.sender, address(this), externalTokenId);

    }

    function restrictNFT(address nftToRestrict) external onlyAdmin {
        restrictedNFTs[nftToRestrict] = true;
    }

     function unrestrictNFT(address nftToRestrict) external onlyAdmin {
        restrictedNFTs[nftToRestrict] = false;
    }




function retrieveNFTFromDeveryERC721(uint256 deveryERC721TokenId) public{
        ERC721 deveryERC721 = ERC721(deveryERC721Address);
    //check if the caller is the owner of the token
    require(deveryERC721.ownerOf(deveryERC721TokenId) == msg.sender, "You are not the owner of this deveryToken token");
    //check if the token is already in the contract
    require(deveryERC721IdToExternalTokenId[deveryERC721TokenId] != 0, "This NFT token is not in the contract");
        //sends the token to the sender
        ERC721 externalNFTToken = ERC721(deveryErc721IdToOriginalTokenContractAddress[deveryERC721TokenId]);
    externalNFTToken.transferFrom(address(this), msg.sender, deveryERC721IdToExternalTokenId[deveryERC721TokenId]);

    //clears the mappings so we leave the data related to it empty
    externalNFTIdToDeveryERC721Token[deveryErc721IdToOriginalTokenContractAddress[deveryERC721TokenId]][deveryERC721IdToExternalTokenId[deveryERC721TokenId]] = 0;
    deveryErc721IdToOriginalTokenContractAddress[deveryERC721TokenId] = address(0);
    deveryErc721IdToriginalTokenOwnerMapping[deveryERC721TokenId] = address(0);
    deveryERC721IdToExternalTokenId[deveryERC721TokenId] = 0;

}

//checks if there's an external NFT associated with this devery token
function isThereExternalNFTTokenAssociatedWithDeveryERC721Token(uint256 deveryERC721TokenId) public view returns(bool) {
    return deveryERC721IdToExternalTokenId[deveryERC721TokenId] != 0;
}

//get the id of the token associated with a given devery token
function getExternalNFTTokenIdAssociatedWithDeveryERC721Token(uint256 deveryERC721TokenId) public view returns(uint256){
    return deveryERC721IdToExternalTokenId[deveryERC721TokenId];
}

//get the address of the contract for a given NFT associated with devery
function getOriginalTokenContractAddressAssociatedWithDeveryERC721Token(uint256 deveryERC721TokenId) public view returns(address){
    return deveryErc721IdToOriginalTokenContractAddress[deveryERC721TokenId];
}

function getDeveryERC721TokenAssociatedWithExternalToken(address externalTokenAddress, uint256 externalTokenId) public view returns(uint256){
    return externalNFTIdToDeveryERC721Token[externalTokenAddress][externalTokenId];
}

}
* /

/**
 *
 * Main class to deal with the owned smart contract interface and related operations,
 * you can use it to check the current contract owner and listen to ownership change related
 * events.
 *
 * @version 1
 * @extends AbstractSmartContract
 */
class DeveryNFTTracker extends AbstractSmartContract {
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


    async depositToken(externalTokenId, contractAddress, deveryERC721TokenId, overrideOptions = {}) {
        const result = await this.__deveryERC721Contract.depositToken(
            externalTokenId,
            contractAddress,
            deveryERC721TokenId,
        );
        return result.valueOf();
    }

    async retrieveNFTFromDeveryERC721(deveryERC721Address, overrideOptions = {}) {
        const result = await this.__deveryERC721Contract.retrieveNFTFromDeveryERC721(
            deveryERC721Address
        );
        return result.valueOf();
    }

    async isThereExternalNFTTokenAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions = {}) {
        const result = await this.__deveryERC721Contract.isThereExternalNFTTokenAssociatedWithDeveryERC721Token(
            deveryERC721TokenId,
            overrideOptions,
        );
        return result.valueOf();
    }

    async getExternalNFTTokenIdAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions = {}) {
        const result = await this.__deveryERC721Contract.getExternalNFTTokenIdAssociatedWithDeveryERC721Token(
            deveryERC721TokenId,
            overrideOptions,
        );
        return result.valueOf();
    }

    async getOriginalTokenContractAddressAssociatedWithDeveryERC721Token(deveryERC721TokenId, overrideOptions = {}) {
        const result = await this.__deveryERC721Contract.getOriginalTokenContractAddressAssociatedWithDeveryERC721Token(
            deveryERC721TokenId,
            overrideOptions,
        );
        return result.valueOf();
    }

    async getDeveryERC721TokenAssociatedWithExternalToken(externalTokenAddress, externalTokenId, overrideOptions = {}) {
        const result = await this.__deveryERC721Contract.getDeveryERC721TokenAssociatedWithExternalToken(
            externalTokenAddress,
            externalTokenId,
            overrideOptions,
        );
        return result.valueOf();
    }

}


export default DeveryNFTTracker;
