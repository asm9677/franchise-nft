import { BigNumberish, formatEther, getAddress } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

interface MarketCardProps {
  market: Address;
  checked: boolean;
  soldItems: Item[];
  listingItems: Item[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<NftData>>;
  nft: NftData;
  account?: string;
}

const MarketCard: FC<MarketCardProps> = ({
  market,
  checked,
  soldItems,
  listingItems,
  setIsModalOpen,
  setSelectedItem,
  nft,
  account,
}) => {
  const [isHover, setIsHover] = useState(false);
  const { navigate, nftContract, signer } = useOutletContext<OutletContext>();

  const [lastPrice, setLastPrice] = useState<BigNumberish>();
  const [curPrice, setCurPrice] = useState<BigNumberish>();

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [balance, setBalance] = useState(0n);

  useEffect(() => {
    const sold = soldItems.filter((v) => Number(v.tokenId) === market.id);
    if (sold.length)
      setLastPrice(sold[sold.length - 1].price / sold[sold.length - 1].amount);
  }, [soldItems]);

  useEffect(() => {
    const listing = listingItems.filter((v) => Number(v.tokenId) === market.id);

    if (listing.length) setCurPrice(listing[0].price / listing[0].amount);
  }, [listingItems]);

  useEffect(() => {
    if (!signer) return;
    nftContract
      .balanceOf(signer.address, market.id)
      .then((res: BigInt) => res != 0n && setIsOwner(true));
  }, [signer]);

  useEffect(() => {
    if (!nftContract) return;
    console.log(account);
    if (account === undefined || account === "") return;
    // console.log(account);
    // console.log(getAddress(account), market.id);
    nftContract.balanceOf(getAddress(account), market.id).then(setBalance);
  }, [nftContract, account]);

  useEffect(() => {
    // console.log(balance, market.id, account && getAddress(account), account);
  }, [balance]);

  if (balance == 0n && account != undefined) return;

  if (!checked) return;
  return (
    <div
      className="rounded-[10px] overflow-hidden shadow-card cursor-pointer relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate(`/market/${market.id}`)}
    >
      <div className=" overflow-hidden relative">
        <img
          src="/nft.png"
          className={`${
            isHover && "scale-110 duration-200"
          }   w-full h-full object-cover inset-0`}
        />
      </div>
      <div className="p-4 text-[14px] font-semibold text-[#121212]">
        <p>
          {market.title} #{market.id}
        </p>
        <p className="my-2 h-[20px]">
          {curPrice != undefined && `${formatEther(curPrice)} ETH`}
        </p>
        <p className="h-[20px] text-[#545454]">
          {lastPrice != undefined && `Last sale: ${formatEther(lastPrice)} ETH`}
        </p>
      </div>
      <button
        className={`absolute bg-default-color h-10 left-0 w-full ${
          isHover ? "bottom-0" : "-bottom-14"
        } duration-100 text-white font-semibold text-[14px] 
        ${!isOwner && "hidden"}
        `}
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

export default MarketCard;
