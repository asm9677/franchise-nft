import { ethers, formatEther, parseEther, parseUnits } from "ethers";
import { FC, useEffect, useState } from "react";
import uniswapAbi from "../../contracts/uniswapV2.json";
import ERC20Abi from "../../contracts/ERC20.json";

import { Contract } from "ethers";
import {
  ethAddress,
  routerAddress,
  tokenAddress,
} from "../../lib/contractAddress";
import { BigNumberish } from "ethers";
import SwapInput from "./SwapInput";
import { changeNetwork } from "../../lib/metamask";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";

interface Token {
  address: string;
  isETH: boolean;
  logo: string;
  symbol?: string;
  decimals?: number;
  balance?: BigNumberish;
}

const SwapWidget: FC = () => {
  const { notify, signer, setSigner, provider } =
    useOutletContext<OutletContext>();
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [allowance, setAllowance] = useState<BigNumberish>(0n);
  const [inputBalance, setInputBalance] = useState<BigNumberish>(0n);

  const [inputValue, _setInputValue] = useState("0");
  const [outputValue, _setOutputValue] = useState("0");
  const [isInputMethod, setIsInputMethod] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [uniswapContract, setUniswapContract] = useState<Contract>();
  const [showMessage, setShowMessage] = useState<string>("");

  const [tokenPair, setTokenPair] = useState<Token[]>([
    { address: ethAddress, isETH: true, logo: "/symbol/eth_icon.png" },
    { address: tokenAddress, isETH: false, logo: "/symbol/token_icon.png" },
  ]);

  const [buttonType, setButtonType] = useState(0);

  const setInputValue = async (value: string) => {
    if (value !== "") _setInputValue(value);
    else _setInputValue("0");

    if (!uniswapContract) return;
    if (Number(value) === 0) {
      _setOutputValue("0");
      return;
    }
    uniswapContract
      .getAmountsOut(parseEther(value), [
        tokenPair[0].address,
        tokenPair[1].address,
      ])
      .then((v) => _setOutputValue(ethers.formatEther(v[1])))
      .finally(() => setIsInputMethod(true));
  };

  const setOutputValue = async (value: string) => {
    if (value !== "") _setOutputValue(value);
    else _setOutputValue("0");
    if (!uniswapContract || !value) return;
    if (value === "" || value === "0" || value === "0.") {
      _setInputValue("0");
      return;
    }

    uniswapContract
      .getAmountsIn(parseUnits(value, 18), [
        tokenPair[0].address,
        tokenPair[1].address,
      ])
      .then((v) => _setInputValue(formatEther(v[0])))
      .finally(() => setIsInputMethod(false));
  };

  const onClickButton = () => {
    let tx = null;
    switch (buttonType) {
      case 0:
        provider
          .getSigner()
          .then(setSigner)
          .finally(() => setIsLoading(false));
        break;
      case 1:
      case 2:
        break;
      case 3:
        tx = tokenContract?.approve(
          routerAddress,
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
        );
        break;
      case 4:
        const deadline = (Math.floor(Date.now() / 1000) + 600).toString();

        if (tokenPair[0].isETH) {
          const path = [ethAddress, tokenAddress];
          if (isInputMethod) {
            tx = uniswapContract?.swapExactETHForTokens(
              parseEther("0"),
              path,
              signer.address,
              deadline,
              {
                value: parseEther(inputValue),
              }
            );
          } else {
            tx = uniswapContract?.swapETHForExactTokens(
              parseEther(outputValue),
              path,
              signer.address,
              deadline,
              {
                value: parseEther(inputValue),
              }
            );
          }
        } else {
          const path = [tokenAddress, ethAddress];
          if (isInputMethod) {
            tx = uniswapContract?.swapExactTokensForETH(
              parseEther(inputValue),
              "0",
              path,
              signer.address,
              deadline
            );
          } else {
            tx = uniswapContract?.swapTokensForExactETH(
              parseEther(outputValue),
              parseEther(inputValue),
              path,
              signer.address,
              deadline
            );
          }
        }
    }
    setIsLoading(true);

    tx?.then((res) =>
      res
        .wait()
        .then(() => notify("트랜잭션이 성공적으로 처리되었어요!"))
        .finally(() => {
          setIsLoading(false);
          provider.getSigner().then(setSigner);
        })
    ).catch((error: any) => {
      setIsLoading(false);
      console.error(error);
    });
  };

  useEffect(() => {
    setInputValue(outputValue);
  }, [tokenPair]);

  useEffect(() => {
    if (!signer) {
      setTokenContract(null);
      return;
    }
    setTokenContract(new Contract(tokenAddress, ERC20Abi, signer));
    setUniswapContract(new Contract(routerAddress, uniswapAbi, signer));
  }, [signer]);

  useEffect(() => {
    if (!tokenContract) return;
    tokenContract.allowance(signer.address, routerAddress).then(setAllowance);
    if (tokenPair[0].isETH)
      provider.getBalance(signer.address).then(setInputBalance);
    else tokenContract.balanceOf(signer.address).then(setInputBalance);
  }, [tokenContract, tokenPair]);

  useEffect(() => {
    if (!provider) return;

    provider.getNetwork().then(changeNetwork);

    if (signer) return;
    setUniswapContract(new Contract(routerAddress, uniswapAbi, provider));
  }, [provider]);

  useEffect(() => {
    try {
      if (!signer) {
        setButtonType(0);
        setShowMessage("Connect");
      } else if (Number(inputValue) === 0) {
        setButtonType(1);
        setShowMessage("Invalid amount");
      } else if (parseEther(inputValue) > BigInt(inputBalance.toString())) {
        setButtonType(2);
        setShowMessage(
          `Insufficient ${tokenPair[0].isETH ? "ETH" : "PIZZA"} balance`
        );
      } else if (
        !tokenPair[0].isETH &&
        BigInt(allowance.toString()) < parseEther(inputValue)
      ) {
        setButtonType(3);
        setShowMessage("Approve");
      } else {
        setButtonType(4);
        setShowMessage("Swap");
      }
    } catch (error) {
      console.error(error);
    }
  }, [signer, inputValue, tokenPair]);

  return (
    <div className="flex flex-col gap-2 bg-white w-[550px] rounded-[20px] p-4 relative">
      <span className="mb-2 font-semibold text-[18px] text-default-color/95">
        Swap
      </span>
      <div className="flex flex-col gap-2 relative">
        <button
          className=" flex items-center justify-center z-50 absolute top-1/2 -translate-y-[24px]  left-1/2 -translate-x-[24px] w-12 h-12  bg-[#F7F8FF] hover:bg-[#F0F0FF] border-[8px] border-white rounded-[12px]"
          onClick={() => setTokenPair([tokenPair[1], tokenPair[0]])}
        >
          <svg
            width="20"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.14 6.13978L9.34997 3.35978C9.14997 3.16978 8.83997 3.16978 8.63997 3.35978L5.84997 6.13978C5.52997 6.44978 5.75997 6.98978 6.19997 6.98978L7.99997 6.98978L7.99997 12.9998C7.99997 13.5498 8.44997 13.9998 8.99997 13.9998C9.54997 13.9998 9.99997 13.5498 9.99997 12.9998L9.99997 6.98978L11.79 6.98978C12.24 6.98978 12.46 6.44978 12.14 6.13978ZM15.35 20.6498L18.14 17.8698C18.46 17.5598 18.23 17.0198 17.79 17.0198L16 17.0198L16 10.9998C16 10.4498 15.55 9.99979 15 9.99979C14.45 9.99979 14 10.4498 14 10.9998L14 17.0098L12.21 17.0098C11.76 17.0098 11.54 17.5498 11.86 17.8598L14.65 20.6398C14.84 20.8398 15.16 20.8398 15.35 20.6498Z"
              className="fill-default-color/85 "
            ></path>
          </svg>
        </button>
        <SwapInput
          provider={provider}
          address={tokenPair[0].address}
          isETH={tokenPair[0].isETH}
          logo={tokenPair[0].logo}
          value={inputValue}
          setValue={setInputValue}
          signer={signer}
        />
        <SwapInput
          provider={provider}
          address={tokenPair[1].address}
          isETH={tokenPair[1].isETH}
          logo={tokenPair[1].logo}
          value={outputValue}
          setValue={setOutputValue}
          signer={signer}
        />
      </div>
      <button
        className={`w-full  h-12  text-white text-[16px] font-[500] rounded-xl mt-2 flex justify-center items-center ${
          buttonType > 0 && buttonType < 3
            ? "bg-default-color/70 cursor-default"
            : "bg-default-color"
        }`}
        onClick={onClickButton}
      >
        {isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <span>{showMessage}</span>
        )}
      </button>
    </div>
  );
};

export default SwapWidget;
