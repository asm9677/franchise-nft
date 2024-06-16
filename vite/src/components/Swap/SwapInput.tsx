import { BigNumberish, formatEther, formatUnits } from "ethers";
import { Contract } from "ethers";
import { Provider } from "ethers";
import { FC, useEffect, useState } from "react";
import ERC20Abi from "../../contracts/ERC20.json";
import { JsonRpcSigner } from "ethers";

interface SwapInput {
  provider: Provider;
  signer?: JsonRpcSigner;
  address: string;
  logo: string;
  isETH: boolean;
  value: string;
  setValue: (value: string) => void;
}

const SwapInput: FC<SwapInput> = ({
  provider,
  signer,
  address,
  logo,
  isETH,
  value,
  setValue,
}) => {
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState<BigNumberish>(0n);

  const [tokenContract, setTokenContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!provider) return;
    setTokenContract(new Contract(address, ERC20Abi, provider));
  }, [provider, address]);

  useEffect(() => {
    if (Number(value) >= 1 && value[0] == "0") setValue(String(Number(value)));
  }, [value]);

  useEffect(() => {
    if (!tokenContract) return;
    setSymbol(isETH ? "ETH" : "PIZZA");

    if (signer) {
      if (isETH) provider.getBalance(signer.address).then(setBalance);
      else tokenContract.balanceOf(signer.address).then(setBalance);
    }
  }, [tokenContract]);

  useEffect(() => {
    if (!tokenContract || !signer) return;

    if (isETH) provider.getBalance(signer.address).then(setBalance);
    else tokenContract.balanceOf(signer.address).then(setBalance);
  }, [signer]);

  return (
    <div className="bg-[#F7F8FF]  w-full h-[120px] rounded-2xl p-3 relative text-default-color/80">
      <div className="absolute bottom-4 left-4 w-[93%]  flex justify-between">
        <input
          className="outline-none bg-transparent text-3xl w-[380px] "
          placeholder="0"
          value={value}
          onChange={(e) => {
            if (
              !Number.isNaN(Number(e.target.value)) &&
              e.target.value.substring(0, 2) !== "00"
            ) {
              setValue(e.target.value);
            }
          }}
        />
        <button className="flex items-center justify-start rounded-[18px] bg-white p-1 px-2 gap-1 font-[700] text-[20px] h-10 min-w-28  shadow-token-button border border-token-button">
          <img src={logo} className="w-6 h-6 mr-1" />
          {symbol}
        </button>
      </div>
      <button
        className="absolute top-2 right-2 text-[14px]  font-semibold"
        onClick={() => setValue(formatEther(balance))}
      >
        balance: {Number(formatUnits(balance)).toFixed(balance ? 3 : 0)}
      </button>
    </div>
  );
};

export default SwapInput;
