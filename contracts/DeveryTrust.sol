pragma solidity ^0.4.18;


contract DeveryTrust {
    mapping(address => address[]) brandApprovals;
    mapping(address => address[]) publicVouches;
    event Approve(address approver, address brandKey);
    event Revoke(address revoker, address brandKey);

    function approve(address brandKey) public {
        uint alreadyExists = 0;
        for(uint i=0;i<brandApprovals[brandKey].length;i++){
            if(brandApprovals[brandKey][i] == msg.sender){
                alreadyExists = 1;
            }
        }
        if(alreadyExists == 0){
            brandApprovals[brandKey].push(msg.sender);
            publicVouches[msg.sender].push(brandKey);
            Approve(msg.sender, brandKey);
        }
    }

    function revoke(address brandKey) public {
        for(uint i=0;i<brandApprovals[brandKey].length;i++){
            if(brandApprovals[brandKey][i] == msg.sender){
                delete brandApprovals[brandKey][i];
            }
        }

        for(i=0;i<publicVouches[msg.sender].length;i++){
            if(publicVouches[msg.sender][i] == brandKey){
                delete publicVouches[msg.sender][i];
            }
        }

        Revoke(msg.sender, brandKey);
    }

    function getAddressApprovals(address addr) external view returns (address[]){
        address[] memory approvals =  new address[](publicVouches[addr].length);
        for(uint i=0;i<publicVouches[addr].length;i++){
            approvals[i] = publicVouches[addr][i];
        }
        return approvals;
    }

    function getBrandApprovals(address addr) external view returns (address[]){
        address[] memory approvals =  new address[](brandApprovals[addr].length);
        for(uint i=0;i<brandApprovals[addr].length;i++){
            approvals[i] = brandApprovals[addr][i];
        }
        return approvals;
    }


}
