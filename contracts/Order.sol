// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Franchise.sol";
import "./Pizza.sol";


contract Order is Ownable {
    struct Menu {
        string name;
        uint price;
    }

    AggregatorV3Interface internal ethPriceFeed;

    IUniswapV2Router02 public uniswapV2Router;

    Franchise public franchise;
    Pizza public pizza;
    address franchiseContractAddress;
    address PizzaContractAddress;

    mapping(uint => address) public storeOwnerAddress;
    mapping(uint => uint) public reward;
    mapping(uint => uint) public latestTimestamp;

    mapping(uint8 => Menu) public menu;
    uint8 totalMenu;
    uint8 usdDecimal = 8;



    constructor() Ownable(_msgSender()) {
        ethPriceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); //sepolia address
        uniswapV2Router = IUniswapV2Router02(0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98); //sepolia address

        addMenu("potato", 20 * (10 ** 8));
        addMenu("pepperoni", 20 * (10 ** 8));
        addMenu("combination", 20 * (10 ** 8));

    }

    modifier checkMenu(uint8 _menuId) {
        require(menu[_menuId].price != 0, "Invalid menu");
        _;
    }

    function getETHPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int ethPrice,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = ethPriceFeed.latestRoundData();


        return ethPrice;
    }

    function updateFranchiseContractAddress(address _address) public onlyOwner {
        require(franchiseContractAddress != _address, "Cannot same value.");
        franchiseContractAddress = _address;
        franchise = Franchise(_address);
    }

    function updatePizzaContractAddress(address _address) public onlyOwner {
        require(PizzaContractAddress != _address, "Cannot same value.");
        PizzaContractAddress = _address;
        pizza = Pizza(_address);
    }

    function addMenu(string memory _name, uint _price) public onlyOwner {
        totalMenu += 1;
        require(totalMenu < 256, "Unable to add menu");
        menu[totalMenu] = Menu(_name, _price);
    }

    function removeMenu(uint8 _menuId) public onlyOwner() {
        menu[_menuId] = Menu("", 0);
    }

    function getMenu(uint8 _menuId) public view returns(Menu memory) {
        return menu[_menuId];
    }

    function getMenus() public view returns(Menu[256] memory) {
        Menu[256] memory _menu; 
        for(uint8 i = 1; i < totalMenu; i++) {
            if(menu[i].price != 0)
                _menu[i] = menu[i];
        }
        return _menu;
    }

    function getPizzaPrice(uint8 _menuId) public view checkMenu(_menuId) returns(uint) {
        uint ethPrice = uint(getETHPrice());
        uint usdPrice = 10**18 / (ethPrice / 10**8);
        
        uint amountOut = usdPrice * (menu[_menuId].price / 10 ** usdDecimal); 

        address[] memory path = new address[](2);
        path[0] = PizzaContractAddress;
        path[1] = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
        uint[] memory amounts = uniswapV2Router.getAmountsIn(amountOut, path);
    
        return amounts[0];
    }

    function getStoreOwnerAddress(uint _tokenId) public view returns(address ) {
        if(storeOwnerAddress[_tokenId] == address(0))
            return owner();
        else 
            return storeOwnerAddress[_tokenId];
    }

    function checkDistributionReward(uint _tokenId) public view returns(bool) {
        return latestTimestamp[_tokenId] + 30 days < block.timestamp;
    }

    function distribute(uint _tokenId) private {
        address[] memory ownerList = franchise.getOwnerList(_tokenId);
        for(uint i = 0; i < ownerList.length; i++) {
            pizza.transfer(ownerList[i], reward[_tokenId] * franchise.totalSupply(_tokenId, ownerList[i]) / 100);
        }
        reward[_tokenId] = 0;
        latestTimestamp[_tokenId] = block.timestamp;

    }

    function order(uint8 _menuId, uint8 _tokenId) public checkMenu(_menuId) {
        require(franchise.exists(_tokenId), "Invalid nft");
        uint price = getPizzaPrice(_menuId);

        if(checkDistributionReward(_tokenId)) {
            distribute(_tokenId);
        }


        require(pizza.allowance(_msgSender(), address(this)) >= price);
        pizza.transferFrom(_msgSender(), address(this), price);
        pizza.transferFrom(_msgSender(), address(this), price);
        
        pizza.transferFrom(_msgSender(), getStoreOwnerAddress(_tokenId), price * 900 / 1000);
        pizza.transferFrom(_msgSender(), owner(), price * 25 / 1000);

        pizza.burnFrom(_msgSender(), price * 25 / 1000);
        pizza.transferFrom(_msgSender(), address(0), price * 25 / 1000);
        reward[_tokenId] += price * 50 / 1000;
    }
}