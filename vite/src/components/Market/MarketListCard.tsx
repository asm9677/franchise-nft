import { Contract, formatEther } from "ethers";
import { FC, useEffect, useState } from "react";
import { MdOutlineSell } from "react-icons/md";
import store from "../../lib/address.json";
import { useOutletContext } from "react-router-dom";
import { formatDate } from "../../lib/utils";

interface MarketListCardProps {
  nftContract: Contract | null;
  marketContract: Contract | null;
  id: number;
}

const MarketListCard: FC<MarketListCardProps> = ({
  nftContract,
  marketContract,
  id,
}) => {
  const [item, setItem] = useState<Item>();
  const { navigate } = useOutletContext<OutletContext>();
  useEffect(() => {
    if (!marketContract) return;
    marketContract.getListingItem(id).then(setItem);
  }, [marketContract]);

  return (
    <button className="flex items-center justify-between w-full rounded-[8px] border-b border-[#E2E2E2] h-[82px] p-4 hover:bg-[#F5F5F5]">
      <div className="flex items-center px-[2px] flex-[1]">
        <MdOutlineSell size={18} />
        <div className="flex flex-col justify-center items-center ml-2 text-[16px] font-semibold">
          <span>{item?.sold ? "Sell" : "List"}</span>
        </div>
      </div>

      <div className="flex items-center px-[2px] flex-[2]">
        <img src="/nft.png" className="w-12 h-12 object-cover rounded-[10px]" />
        <div className="flex flex-col justify-center items-center ml-2 truncate">
          <span className="text-[16px] font-semibold text-[#121212] w-full ">
            {item && store[item.tokenId].title} # {item?.tokenId.toString()}
          </span>
          <span className="text-[12px] font-normal text-[#121212] w-full text-start">
            Pizza
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-end items-end  ml-2 flex-[2]">
        <span className="text-[16px] font-semibold text-[#121212] w-full truncate text-end">
          {item && formatEther(item.price)} ETH
        </span>
        <span className="text-[12px] font-normal text-[#121212] w-full truncate text-end">
          {item && `$${formatEther(item.price * 3555n)}`}
        </span>
      </div>

      <div
        className="min-w-[76px] text-end text-blue-600 flex-[2]"
        onClick={() => navigate(`/account/${item?.seller}`)}
      >
        {item?.seller.substring(2, 8)}
      </div>

      <div className="min-w-[76px] text-[#121212] text-end flex-[2]">---</div>

      <div className="min-w-[76px] text-[#121212] text-end flex-[2]">
        {item && formatDate(item?.timestamp.toString())}
      </div>
    </button>
  );
};

export default MarketListCard;
