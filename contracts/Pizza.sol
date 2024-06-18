// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Franchise.sol";

interface IUniswapV2Factory {
// Interface for the Uniswap V2 factory
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Router02 {
// Interface for the Uniswap V2 router
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
}

contract Pizza is ERC20, Ownable {
    IUniswapV2Router02 internal uniswapV2Router;
    address public uniswapV2Pair;

    constructor() ERC20("Pizza","Pizza") Ownable(_msgSender()) payable  {
        uniswapV2Router = IUniswapV2Router02(0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008);
        _mint(address(this), 18000 * 10**decimals());
    }

    function burnFrom(address account, uint256 value) public {
        _spendAllowance(account, _msgSender(), value);
        _transfer(account, address(0), value);
    }

    function openTrading() external onlyOwner {
        _approve(address(this), address(uniswapV2Router), totalSupply());
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(address(this), uniswapV2Router.WETH());
        uniswapV2Router.addLiquidityETH{value: address(this).balance}(address(this),balanceOf(address(this)),0,0,address(this),block.timestamp);
        IERC20(uniswapV2Pair).approve(address(uniswapV2Router), type(uint).max);
    }

    function removeLP() external onlyOwner {
        uniswapV2Router.removeLiquidityETH(address(this), IERC20(uniswapV2Pair).balanceOf(address(this)), 0, 0, owner(), block.timestamp);

        

    }

    function withdraw() external onlyOwner {        
        payable(owner()).transfer(address(this).balance);
    }

    function deposit() external payable{

    }
}