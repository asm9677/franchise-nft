// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";


contract Franchise is ERC1155, Ownable, ERC1155Supply{
    mapping(uint => address[]) ownerList;

    constructor(uint8 count) ERC1155("") Ownable(_msgSender()){
        for(uint8 i = 1; i <= count; i++) 
            _mint(_msgSender(), i, 100, "");     
    }

    function isOwner( address _owner, uint _tokenId) public view returns(bool) {
        return balanceOf(_owner, _tokenId) > 0;        
    }

    function getOwnerList(uint _tokenId) public view returns(address[] memory) {
        return ownerList[_tokenId];
    }

    function mintBatch(uint[] memory ids, uint[] memory values ) public onlyOwner {
        _mintBatch(owner(), ids, values, "");
    }

    function removeOwner(uint _tokenId, address _owner) private {
        for(uint i = 0; i < ownerList[_tokenId].length; i++) {
            if(_owner == ownerList[_tokenId][i]) {
                ownerList[_tokenId][i] = ownerList[_tokenId][ownerList[_tokenId].length - 1];
                ownerList[_tokenId].pop();
                break;
            }
        }
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal  override(ERC1155, ERC1155Supply){
        for(uint i = 0; i < ids.length; i++) {            
            if(balanceOf(from, ids[i]) == values[i])
                removeOwner(ids[i], from);

            if(balanceOf(to, ids[i]) == 0)
                ownerList[ids[i]].push(to);
        }

        super._update(from, to, ids, values);
    }
}
