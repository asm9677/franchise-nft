// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";


contract Franchise is ERC1155, Ownable, ERC1155Supply{
    mapping(uint => mapping(address => uint)) public tokenAmount; 

    mapping(uint => address[]) ownerList;

    function isOwner(uint _tokenId, address _owner) public view returns(bool) {
        return tokenAmount[_tokenId][_owner] > 0;
    }

    function getOwnerList(uint _tokenId) public view returns(address[] memory) {
        return ownerList[_tokenId];
    }

    constructor(string memory _uri) ERC1155(_uri) Ownable(_msgSender()){
        // _mint(_msgSender(), 1, 10, "");
    }

    function mintBatch(uint[] memory ids, uint[] memory values ) public onlyOwner {
        _mintBatch(owner(), ids, values, "");
    }

    function totalSupply(uint _tokenId, address owner) public view returns(uint) {
        return tokenAmount[_tokenId][owner];
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
            tokenAmount[ids[i]][from] -= values[i];

            if(tokenAmount[ids[i]][from] == 0)
                removeOwner(ids[i], from);

            if(tokenAmount[ids[i]][to] == 0)
                ownerList[ids[i]].push(to);

            tokenAmount[ids[i]][from] += values[i];
        }

        super._update(from, to, ids, values);
    }
}
