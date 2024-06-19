import { Contract } from "ethers";
import { BigNumberish } from "ethers";
import { JsonRpcSigner, formatEther } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { MdClose, MdOutlineLogout } from "react-icons/md";

import store from "../lib/address.json";

interface WalletMenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  signer: JsonRpcSigner | undefined;
  tokenContract: Contract | undefined;
  nftContract: Contract | undefined;
  orderContract: Contract | undefined;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | undefined>>;
}

const WalletMenu: FC<WalletMenuProps> = ({
  isOpen,
  setIsOpen,
  signer,
  tokenContract,
  nftContract,
  orderContract,
  setSigner,
}) => {
  const [ethBalance, setEthBalance] = useState(0n);
  const [tokenBalance, setTokenBalance] = useState(0n);
  const [nftBalance, setNftBalance] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [myReward, setMyReward] = useState(0n);

  const onClickLogout = () => {
    localStorage.setItem("isLogin", "0");
    setSigner(undefined);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!signer) return;
    signer.provider.getBalance(signer.address).then(setEthBalance);
  }, [signer]);

  useEffect(() => {
    if (!tokenContract || !signer) return;

    tokenContract.balanceOf(signer.address).then(setTokenBalance);
  }, [tokenContract, signer]);

  useEffect(() => {
    if (!nftContract || !signer) return;

    Promise.all(
      Array.from({ length: 25 }).map(
        async (_, i) => await nftContract.balanceOf(signer.address, i + 1)
      )
    ).then(setNftBalance);
  }, [nftContract, signer]);

  useEffect(() => {
    if (!orderContract || !signer) return;

    Promise.all(
      Array.from({ length: 25 }).map(
        async (_, i) => await orderContract.getCurrentReward(i + 1)
      )
    ).then(setRewards);
  }, [orderContract, signer]);

  useEffect(() => {
    if (nftBalance.length != rewards.length) return;

    setMyReward(
      nftBalance
        .map((v: any, i: number) => {
          return v * rewards[i];
        })
        .reduce(
          (accumulator: any, currentValue: any) => accumulator + currentValue,
          0n
        ) / 100n
    );
  }, [nftBalance, rewards]);

  if (!isOpen) return;
  return (
    <div
      className="absolute top-0  right-0 translate-y-16 bg-[#F0F0FE]  w-[400px] h-[550px]  rounded-[12px] z-50 flex flex-col text-[#545454] overflow-y-hidden border border-[E2E2E2] shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center p-6 pb-3">
        <button className="flex items-center gap-2 hover:bg-default-color/15 p-3 rounded-[12px]">
          <img src="/metamask-fox.svg" className="w-5 h-5" />
          <span className="text-[16px] font-semibold">
            {`${signer?.address.substring(0, 7)}...${signer?.address.substring(
              signer?.address.length - 5
            )}`}
          </span>
        </button>
        <button
          className="flex items-center gap-2 hover:bg-default-color/15 p-3 rounded-[12px]"
          onClick={onClickLogout}
        >
          <MdOutlineLogout size={24} />
          <span className="text-[16px] font-semibold">Logout</span>
        </button>
      </div>
      <div className="flex flex-col  px-9 pb-3">
        {/* <span className="text-[20px]">Wallet balance</span> */}
        <div className="flex items-center gap-1 ">
          <img src="/symbol/eth_icon.png" className="w-6 h-6" />
          <span className="text-[24px] text-[#121212] font-bold translate-y-[1px]">
            {Number(formatEther(ethBalance)).toFixed(3)} ETH
          </span>
        </div>
        <div className="flex items-center gap-1 ">
          <img
            src="/symbol/token_icon.png"
            className="w-6 h-6 bg-transparent"
          />
          <span className="text-[24px] text-[#121212] font-bold translate-y-[1px]">
            {Number(formatEther(tokenBalance)).toFixed(2)} PIZZA
          </span>
        </div>
        <div className="text-[14px] text-[#545454] font-bold translate-y-[1px] pl-8">
          Unclaimed: {Number(formatEther(myReward)).toFixed(2)} PIZZA
        </div>
      </div>
      <div className="h-full bg-white rounded-[12px] p-3 flex flex-col overflow-y-auto">
        {nftBalance.map((v: bigint, i) => {
          if (v > 0n)
            return (
              <button
                key={i}
                className="flex items-start justify-between gap-3 hover:bg-default-color/15 p-3 rounded-[12px] "
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`/nft/${i + 1}.png`}
                    className="w-12 rounded-[12px]"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-[18px] text-[#121212] font-semibold">
                      {store[i].title} #{i + 1}
                    </span>
                    <span className="text-[14px]">PIZZA</span>
                  </div>
                </div>
                <div>{v.toString()}</div>
              </button>
            );
        })}
      </div>
    </div>
  );
};

export default WalletMenu;
