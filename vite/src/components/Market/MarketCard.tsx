import { BigNumberish, formatEther } from "ethers";
import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

interface MarketCardProps {
  market: Address;
  checked: boolean;
  soldItems: Item[];
  listingItems: Item[];
}

const MarketCard: FC<MarketCardProps> = ({
  market,
  checked,
  soldItems,
  listingItems,
}) => {
  const { provider, marketContract, nftContract } =
    useOutletContext<OutletContext>();
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const [lastPrice, setLastPrice] = useState<BigNumberish>();
  const [curPrice, setCurPrice] = useState<BigNumberish>();

  useEffect(() => {
    const sold = soldItems.filter((v) => Number(v.tokenId) === market.id);
    if (sold.length)
      setLastPrice(sold[sold.length - 1].price / sold[sold.length - 1].amount);
  }, [soldItems]);

  useEffect(() => {
    const listing = listingItems.filter((v) => Number(v.tokenId) === market.id);

    if (listing.length) setCurPrice(listing[0].price / listing[0].amount);
  }, [listingItems]);

  if (!checked) return;
  return (
    <div
      className="rounded-[10px] overflow-hidden shadow-card cursor-pointer"
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
    </div>
  );
};

export default MarketCard;
