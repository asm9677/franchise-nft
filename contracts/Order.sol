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

    struct Reward {
        uint price;
        uint timestamp;
    }

    AggregatorV3Interface internal ethPriceFeed;

    IUniswapV2Router02 public uniswapV2Router;

    Franchise public franchise;
    Pizza public pizza;
    address franchiseContractAddress;
    address PizzaContractAddress;

    mapping(uint => address) public storeOwnerAddress;
    mapping(uint => uint) public reward;
    mapping(uint => Reward[]) public rewardHistory;
    mapping(uint => uint) public latestTimestamp;

    mapping(uint => Menu) public menu;
    uint totalMenu = 0;
    uint usdDecimal = 8;



    constructor(address _nftAddress, address _tokenAddress) Ownable(_msgSender()) {
        ethPriceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); //sepolia address
        uniswapV2Router = IUniswapV2Router02(0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008); //sepolia address

        updateFranchiseContractAddress(_nftAddress);
        updatePizzaContractAddress(_tokenAddress);
    }

    modifier checkMenu(uint _menuId) {
        require(menu[_menuId].price != 0, "Invalid menu");
        _;
    }

    function setStoreOwnerAddress(uint _tokenId, address _owner) public {
        if(storeOwnerAddress[_tokenId] == address(0))
            require(msg.sender == owner(), "Caller is not Owner");
        else
            require(storeOwnerAddress[_tokenId] == msg.sender, "Caller is not Owner");
        
        storeOwnerAddress[_tokenId] = _owner;
    }

    function getETHPrice() public view returns (int) {
        (
            /* uint0 roundID */,
            int ethPrice,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint0 answeredInRound */
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

    function addMenus(string[] memory _names, uint[] memory _prices) external  onlyOwner {
        require(_names.length == _prices.length, "Array length does not match");

        for(uint i = 0; i < _names.length; i++)
            addMenu(_names[i], _prices[i]);
    }

    function removeMenu(uint _menuId) public onlyOwner() {
        menu[_menuId] = Menu("", 0);
    }

    function getMenu(uint _menuId) public view returns(Menu memory) {
        return menu[_menuId];
    }

    function getMenus() public view returns(Menu[256] memory) {
        Menu[256] memory _menu; 
        for(uint i = 1; i < totalMenu; i++) {
            if(menu[i].price != 0)
                _menu[i] = menu[i];
        }
        return _menu;
    }

    function getStoreOwnerAddress(uint _tokenId) public view returns(address ) {
        if(storeOwnerAddress[_tokenId] == address(0))
            return owner();
        else 
            return storeOwnerAddress[_tokenId];
    }

    function checkDistributionReward(uint _tokenId) public view returns(bool) {
        return latestTimestamp[_tokenId] + 30 days < block.timestamp &&  pizza.balanceOf(address(this)) != 0;
    }

    function distribute(uint _tokenId) private {
        address[] memory ownerList = franchise.getOwnerList(_tokenId);
        for(uint i = 0; i < ownerList.length; i++) {
            pizza.transfer(ownerList[i], reward[_tokenId] * franchise.balanceOf(ownerList[i],_tokenId) / 100);
        }
        rewardHistory[_tokenId].push(getReward(reward[_tokenId]));
        reward[_tokenId] = 0;
        latestTimestamp[_tokenId] = block.timestamp;
    }

    function getPizzaUSDPrice(uint _menuId) public view checkMenu(_menuId) returns(uint) {
        return getMenu(_menuId).price;
    }

    function getPizzasUSDPrice(uint[] memory _menuIds, uint[] memory _amounts) public view returns(uint) {
        require(_menuIds.length == _amounts.length, "Array lengths are different.");

        uint totalPrice = 0;
        for(uint i = 0; i < _menuIds.length; i++) {
            totalPrice += getPizzaUSDPrice(_menuIds[i]) * _amounts[i];
        }

        return totalPrice;
    }

    function getPizzaPrice(uint _menuId) public view checkMenu(_menuId) returns(uint) {
        uint ethPrice = uint(getETHPrice());
        uint usdPrice = 10**18 / (ethPrice / 10**8);
        
        uint amountOut = usdPrice * menu[_menuId].price / 10 ** usdDecimal; 

        address[] memory path = new address[](2);
        path[0] = PizzaContractAddress;
        path[1] = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
        uint[] memory amounts = uniswapV2Router.getAmountsIn(amountOut, path);
    
        return amounts[0];
    }

    function getPizzasPrice(uint[] memory _menuIds, uint[] memory _amounts) public view returns(uint) {
        require(_menuIds.length == _amounts.length, "Array lengths are different.");

        uint totalPrice = 0;
        for(uint i = 0; i < _menuIds.length; i++) {
            totalPrice += getPizzaPrice(_menuIds[i]) * _amounts[i];
        }

        return totalPrice;
    }

    function getReward(uint amount) public view returns(Reward memory) {
        address[] memory path = new address[](2);
        path[0] = PizzaContractAddress;
        path[1] = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
        uint[] memory amounts = uniswapV2Router.getAmountsOut(amount, path);

        return Reward(amounts[1], block.timestamp);
    }

    function order(uint _menuId, uint _tokenId) public checkMenu(_menuId) {
        require(franchise.exists(_tokenId), "Invalid nft");
        uint price = getPizzaPrice(_menuId);
        
        _pay(_tokenId, price);
    }

    function orders(uint[] memory _menuIds, uint[] memory _amounts, uint _tokenId) public {
        require(franchise.exists(_tokenId), "Invalid nft");

        uint price = getPizzasPrice(_menuIds, _amounts);
        _pay(_tokenId, price);
    }

    function _pay(uint _tokenId, uint price) private {
        require(pizza.allowance(_msgSender(), address(this)) >= price, "Not approved.");

        if(checkDistributionReward(_tokenId)) {
            distribute(_tokenId);
        }

        pizza.transferFrom(_msgSender(), address(this), price * 50 / 1000);
        
        pizza.transferFrom(_msgSender(), getStoreOwnerAddress(_tokenId), price * 900 / 1000);
        pizza.transferFrom(_msgSender(), owner(), price * 25 / 1000);
        pizza.transferFrom(_msgSender(), 0x000000000000000000000000000000000000dEaD, price * 25 / 1000);

        reward[_tokenId] += price * 50 / 1000;
    }

    function getRewardHistory(uint _tokenId) public view returns(Reward[] memory ) {
        return rewardHistory[_tokenId];
    }
    
    function getCurrentReward(uint _tokenId) public view returns(uint) {
        return reward[_tokenId];
    }
}