// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Franchise.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is Ownable{
    struct Item {
        address seller;
        address buyer;
        uint tokenId;
        uint price;
        uint amount;
        uint timestamp;
        bool sold;
    }

    Franchise NftContract;
    
    mapping(uint => Item) listingItems;
    uint[] listingIds;
    uint[] soldIds;

    uint listingCount = 0;

    constructor(address contractAddress) Ownable(msg.sender) {
        NftContract = Franchise(contractAddress);
    }

    function changeContractAddress(address contractAddress) public onlyOwner{
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
        require(NftContract.isOwner(msg.sender, _tokenId), "Caller is not token owner.");
        require(_price > 0 && _amount > 0, "Price and amount is zero.");
        require(NftContract.isApprovedForAll(msg.sender, address(this)), "Token owner did not approve token.");

        uint listingAmount = getListingAmount(_tokenId, msg.sender);
        require(listingAmount + _amount <= NftContract.balanceOf(msg.sender, _tokenId), "This token is already on sale.");
 
        listingCount++;
        listingIds.push(listingCount);
        listingItems[listingCount] = Item(msg.sender, address(0), _tokenId, _price, _amount, block.timestamp, false);
    }

    

    function getListingIds() public view returns (uint[] memory) {
        return listingIds;
    }

    function getListingItem(uint _listingId) public view returns (Item memory) {
        return listingItems[_listingId];
    } 

    

    function getTokenPrice(uint _listingId) public view returns(uint) {
        return listingItems[_listingId].price;
    }

    function getTokenPriceAll(uint[] memory _listingIds) public view returns(uint) {
        uint tokenPrice = 0;
        for(uint i = 0; i < _listingIds.length; i++)
            tokenPrice += getTokenPrice(_listingIds[i]);
        return tokenPrice;
    }

    function removeListing(uint _listingId) private {       
        for(uint i = 0; i < listingIds.length; i++) {
            if(listingIds[i] == _listingId) {
                listingIds[i] = listingIds[listingIds.length - 1];
                listingIds.pop();
                break;
            }
        }
    }

    function purchase(uint _listingId, bool refund) public payable {
        require(msg.sender != listingItems[_listingId].seller , "Caller is seller.");
        require(msg.value >= listingItems[_listingId].price, "Caller sent lower than price.");
        require(listingItems[_listingId].price > 0 && listingItems[_listingId].sold == false, "Token is not sale.");

        payable(listingItems[_listingId].seller).transfer(listingItems[_listingId].price);
        if(msg.value > listingItems[_listingId].price && refund)
            payable(msg.sender).transfer(msg.value - listingItems[_listingId].price);
        NftContract.safeTransferFrom(listingItems[_listingId].seller, msg.sender, listingItems[_listingId].tokenId, listingItems[_listingId].amount, "");

        listingItems[_listingId].sold = true;
        listingItems[_listingId].buyer = msg.sender;
        soldIds.push(_listingId);
        removeListing(_listingId);
    }

    function multiPurchase(uint[] memory _listingIds) public payable {
        uint tokensPrice = getTokenPriceAll(_listingIds);
        require(tokensPrice >= msg.value, "Caller sent lower than price...");
        for(uint i = 0; i < _listingIds.length; i++)
            purchase(_listingIds[i], false);
        if(msg.value > tokensPrice)
            payable(msg.sender).transfer(msg.value - tokensPrice);
    }

    function getSoldIds() public view returns(uint[] memory){
        return soldIds;
    }
}
