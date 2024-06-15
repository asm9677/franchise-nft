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
}

contract Pizza is ERC20, Ownable {
    IUniswapV2Router02 internal uniswapV2Router;

    constructor() ERC20("Pizza","Pizza") Ownable(_msgSender()) {
        uniswapV2Router = IUniswapV2Router02(0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98);
    }

    function burnFrom(address account, uint256 value) internal {
        _spendAllowance(account, _msgSender(), value);
        _transfer(account, address(0), value);
    }

    function openTrading() external onlyOwner {
        _approve(address(this), address(uniswapV2Router), totalSupply());
        address uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(address(this), uniswapV2Router.WETH());
        uniswapV2Router.addLiquidityETH{value: address(this).balance}(address(this),balanceOf(address(this)),0,0,owner(),block.timestamp);
        IERC20(uniswapV2Pair).approve(address(uniswapV2Router), type(uint).max);
    }

    function deposit() external payable{

    }
}