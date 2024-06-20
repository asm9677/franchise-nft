import { Contract, formatEther } from "ethers";
import { FC, useEffect, useState } from "react";
import { MdOutlineSell } from "react-icons/md";
import store from "../../lib/address.json";
import { useOutletContext } from "react-router-dom";
import { formatDate } from "../../lib/utils";

interface MarketListCardProps {
  marketContract: Contract | null;
  id: number;
  account?: string | undefined;
}

const MarketListCard: FC<MarketListCardProps> = ({
  marketContract,
  id,
  account,
}) => {
  const [item, setItem] = useState<Item>();
  const { navigate } = useOutletContext<OutletContext>();
  const [isShow, setIsShow] = useState<boolean>(true);
  useEffect(() => {
    if (!marketContract) return;
    marketContract.getListingItem(id).then(setItem);
  }, [marketContract]);

  useEffect(() => {
    if (account === undefined || item === undefined) return;

    setIsShow(
      !(
        account.toLowerCase() !== item.seller.toLocaleLowerCase() &&
        account.toLowerCase() !== item.buyer.toLocaleLowerCase()
      )
    );
  }, [item]);

  if (!isShow) return;
  return (
    <button
      className="flex items-center justify-between w-full rounded-[8px] border-b border-[#E2E2E2] h-[82px] p-4 hover:bg-[#F5F5F5]"
      onClick={() => navigate(`/market/${item?.tokenId}`)}
    >
      <div className="flex items-center px-[2px] flex-[1]">
        <MdOutlineSell size={18} />
        <div className="flex flex-col justify-center items-center ml-2 text-[16px] font-semibold">
          <span>{item?.sold ? "Sell" : "List"}</span>
        </div>
      </div>

      <div className="flex items-center px-[2px] flex-[2]">
        <img
          src={`/nft/${item?.tokenId}.png`}
          className="w-12 h-12 object-cover rounded-[10px]"
        />
        <div className="flex flex-col justify-center items-center ml-2 truncate">
          <span className="text-[16px] font-semibold text-[#121212] w-full ">
            {item && store[Number(item.tokenId) - 1].title} #{" "}
            {item?.tokenId.toString()}
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
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/account/${item?.seller}`);
        }}
      >
        {item?.seller.substring(2, 8)}
      </div>

      {item?.sold ? (
        <div
          className="min-w-[76px] text-end text-blue-600 flex-[2]"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/account/${item?.buyer}`);
          }}
        >
          {item?.buyer.substring(2, 8)}
        </div>
      ) : (
        <div className="min-w-[76px] text-[#121212] text-end flex-[2]">---</div>
      )}

      <div className="min-w-[76px] text-[#121212] text-end flex-[2]">
        {item && formatDate(item?.timestamp.toString())}
      </div>
    </button>
  );
};

export default MarketListCard;
