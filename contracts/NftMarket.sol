// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Franchise.sol";

contract NftMarket {
    struct Item {
        address seller;
        uint tokenId;
        uint price;
        uint amount;
        uint timestamp;
    }

    Franchise NftContract;
    
    mapping(uint => Item) listingItems;
    uint[] listingIds;
    Item[] soldItems;

    uint listingId = 0;

    constructor(address contractAddress)  {
        NftContract = Franchise(contractAddress);
    }

    function getListingAmount(uint _tokenId, address _seller) public view returns(uint) {
        uint totalAmount = 0;
        for(uint i = 0; i < listingIds.length; i++) {
            uint _id = listingIds[i];
            if(listingItems[_id].seller == _seller && listingItems[_id].tokenId == _tokenId)
                totalAmount += listingItems[_id].amount;
        }
        return totalAmount;
    }

    function listing(uint _tokenId, uint _price, uint _amount) public {
        require(NftContract.isOwner(_tokenId,msg.sender), "Caller is not token owner.");
        require(_price > 0 && _amount > 0, "Price and amount is zero.");
        require(NftContract.isApprovedForAll(msg.sender, address(this)), "Token owner did not approve token.");

        uint listingAmount = getListingAmount(_tokenId, msg.sender);
        require(listingAmount + _amount <= NftContract.totalSupply(_tokenId, msg.sender), "This token is already on sale.");
 
        listingId++;
        listingIds.push(listingId);
        listingItems[listingId] = Item(msg.sender, _tokenId, _price, _amount, block.timestamp);
        
    }

    function removeListing(uint _listingId) public {
        require(msg.sender == listingItems[_listingId].seller, "Caller is not seller");
        
        listingItems[_listingId] = Item(address(0),0,0,0,0);

        for(uint i = 0; i < listingIds.length; i++) {
            if(listingIds[i] == _listingId) {
                listingIds[i] = listingIds[listingIds.length - 1];
                listingIds.pop();
                break;
            }
        }
    }

    function getListingIds() public view returns (uint[] memory) {
        return listingIds;
    }

    function getListingItem(uint _listingId) public view returns (Item memory) {
        return listingItems[_listingId];
    } 

    function purchase(uint _listingId) public payable {
        require(msg.sender != listingItems[_listingId].seller , "Caller is seller.");
        require(msg.value >= listingItems[_listingId].price, "Caller sent lower than price.");
        require(listingItems[_listingId].price > 0, "Token is not sale.");

        payable(listingItems[_listingId].seller).transfer(listingItems[_listingId].price);
        if(msg.value > listingItems[_listingId].price)
            payable(msg.sender).transfer(msg.value - listingItems[_listingId].price);
            NftContract.safeTransferFrom(listingItems[_listingId].seller, msg.sender, listingItems[_listingId].tokenId, listingItems[_listingId].amount, "");

        soldItems.push(listingItems[_listingId]);
        removeListing(_listingId);
    }

    function getSoldItems() public view returns(Item[] memory){
        return soldItems;
    }
}
