import { BigNumberish } from "ethers";
import { Contract } from "ethers";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useOutletContext } from "react-router-dom";

interface AccountCardProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  nft: NftData;
  setSelectedItem: Dispatch<SetStateAction<NftData>>;
  nftContract: Contract | null;
  address?: string;
}

const AccountCard: FC<AccountCardProps> = ({
  setIsModalOpen,
  nft,
  setSelectedItem,
  nftContract,
  address,
}) => {
  const { signer, navigate } = useOutletContext<OutletContext>();
  const [isHover, setIsHover] = useState(false);
  const [balance, setBalance] = useState<BigNumberish>(0n);

  useEffect(() => {
    nftContract?.balanceOf(address, nft.id).then(setBalance);
  }, [nftContract]);

  if (balance == 0n) return;
  return (
    <div
      className="rounded-[10px]  shadow-card cursor-pointer relative pb-10 overflow-hidden"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate("/market/1")}
    >
      <div className="relative overflow-hidden">
        <div className="absolute top-2 right-2 bg-[#9f9f9f]/[0.4] rounded-[8px] z-20 text-white p-[6px]">
          x{balance.toString()}
        </div>
        <img
          src="/nft.png"
          className={`${
            isHover && "scale-110 "
          }   w-full h-full object-cover inset-0 duration-200 z-10`}
        />
      </div>
      <div className="p-4 text-[14px] font-semibold text-[#121212]">
        <p>
          {nft.name} #{nft.id}
        </p>
        <p className="my-2 h-[20px]">10.29 ETH</p>
        <p className="h-[20px] text-[#545454]">Last sale: 0.05 ETH</p>
      </div>
      <button
        className={`absolute bg-default-color h-10 left-0 w-full ${
          isHover ? "bottom-0" : "-bottom-14"
        } duration-100 text-white font-semibold text-[14px] ${
          address?.toLowerCase() !== signer?.address?.toLowerCase() && "hidden"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
          setSelectedItem(nft);
        }}
      >
        List for sale
      </button>
    </div>
  );
};

export default AccountCard;
