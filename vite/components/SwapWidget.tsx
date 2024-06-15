import {
  JsonRpcSigner,
  ethers,
  formatEther,
  parseEther,
  parseUnits,
} from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import uniswapAbi from "../contracts/uniswapV2.json";
import ERC20Abi from "../contracts/ERC20.json";
import { Contract } from "ethers";
import { BrowserProvider } from "ethers";

const routerAddress = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
const tokenAddress = "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0";
const ethAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

interface SwapWidgetProps {
  signer: JsonRpcSigner;
  provider: BrowserProvider;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner>>;
}

const buttonMessage = ["Connect", "Insufficient ETH balance", "Swap"];

const SwapWidget: FC<SwapWidgetProps> = ({ signer, provider, setSigner }) => {
  const [inputValue, _setInputValue] = useState("");
  const [outputValue, _setOutputValue] = useState("");
  const [uniswapContract, setUniswapContract] = useState<Contract>();

  const [tokenContract, setTokenContract] = useState<Contract>();

  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState("USDT");

  const [buttonType, setButtonType] = useState(0);

  const setInputValue = async (value: string) => {
    _setInputValue(value);
    if (!uniswapContract || !value) return;
    uniswapContract
      .getAmountsOut(parseEther(value), [ethAddress, tokenAddress])
      .then((v) => _setOutputValue(ethers.formatUnits(v[1], decimals)));
  };

  const setOutputValue = async (value: string) => {
    _setOutputValue(value);
    if (!uniswapContract || !value) return;

    uniswapContract
      .getAmountsIn(parseUnits(value, decimals), [ethAddress, tokenAddress])
      .then((v) => _setInputValue(formatEther(v[0])));
  };

  const onClickButton = () => {
    if (buttonType == 0) {
      console.log(provider);
      provider.getSigner().then((s) => {
        console.log(setSigner);
        setSigner(s);
        console.log(s);
      });
    }
  };

  useEffect(() => {
    console.log(signer);
    if (!signer) {
      setButtonType(0);
      return;
    }

    setButtonType(1);
  }, [signer]);

  useEffect(() => {
    if (!tokenContract) return;

    tokenContract.decimals().then(setDecimals);
    tokenContract.symbol().then(setSymbol);
  }, [tokenContract]);

  useEffect(() => {
    if (!provider) return;

    provider.getNetwork().then(async (network) => {
      if (network.chainId !== 11155111n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0xaa36a7",
                    chainName: "Sepolia Test Network",
                    rpcUrls: ["https://rpc.sepolia.org/"],
                    nativeCurrency: {
                      name: "SepoliaETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                  },
                ],
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    });

    setUniswapContract(new Contract(routerAddress, uniswapAbi, provider));
    setTokenContract(new Contract(tokenAddress, ERC20Abi, provider));
  }, [provider]);

  return (
    <div className="flex flex-col gap-2 bg-white w-[550px] rounded-[20px] p-4">
      <span className="mb-2 font-semibold">Swap</span>
      <div className="bg-[#F9F9F9] w-full h-[120px] rounded-2xl p-3 relative">
        <button className="absolute left-1/2 -translate-x-[14px] -bottom-4 rounded-full bg-[#e9e9e9] w-7 h-7 flex items-center justify-center z-50">
          <svg
            width="20"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.14 6.13978L9.34997 3.35978C9.14997 3.16978 8.83997 3.16978 8.63997 3.35978L5.84997 6.13978C5.52997 6.44978 5.75997 6.98978 6.19997 6.98978L7.99997 6.98978L7.99997 12.9998C7.99997 13.5498 8.44997 13.9998 8.99997 13.9998C9.54997 13.9998 9.99997 13.5498 9.99997 12.9998L9.99997 6.98978L11.79 6.98978C12.24 6.98978 12.46 6.44978 12.14 6.13978ZM15.35 20.6498L18.14 17.8698C18.46 17.5598 18.23 17.0198 17.79 17.0198L16 17.0198L16 10.9998C16 10.4498 15.55 9.99979 15 9.99979C14.45 9.99979 14 10.4498 14 10.9998L14 17.0098L12.21 17.0098C11.76 17.0098 11.54 17.5498 11.86 17.8598L14.65 20.6398C14.84 20.8398 15.16 20.8398 15.35 20.6498Z"
              className="fill-[#A9A9A9]"
            ></path>
          </svg>
        </button>
        <div className="absolute bottom-4 left-4 w-[93%]  flex justify-between">
          <input
            className="outline-none bg-transparent flex-grow text-3xl"
            placeholder="0"
            value={inputValue}
            onChange={(e) => {
              if (Number(e.target.value) || e.target.value == "") {
                setInputValue(e.target.value);
              }
            }}
          />
          <button className="flex items-center justify-center rounded-[18px] bg-white p-1 gap-1 font-[700] text-[20px] h-9 min-w-24  shadow-token-button border border-token-button">
            <img src="/eth_icon.png" className="w-6 h-6" />
            ETH
          </button>
        </div>
      </div>
      <div className="bg-[#F9F9F9] w-full h-[120px] rounded-2xl p-3 relative">
        <div className="absolute bottom-4 left-4 w-[93%]  flex justify-between  ">
          <input
            className="outline-none bg-transparent  flex-grow  text-3xl"
            placeholder="0"
            value={outputValue}
            onChange={(e) => {
              if (Number(e.target.value) || e.target.value == "") {
                setOutputValue(e.target.value);
              }
            }}
          />
          <button className="flex items-center justify-center rounded-[18px] bg-white p-1 gap-1 font-[700] text-[20px] h-9 min-w-24  shadow-token-button border border-token-button ">
            <img src="/token_icon.png" className="w-6 h-6" />
            {symbol}
          </button>
        </div>
      </div>
      <button
        className="w-full  h-12 bg-default-color text-white text-[16px] font-[500] rounded-xl mt-2"
        onClick={onClickButton}
      >
        <span>{buttonMessage[buttonType]}</span>
        {/* 
        Insufficient {symbol} balance
        Swap
        Connect

         */}
      </button>
    </div>
  );
};

export default SwapWidget;
