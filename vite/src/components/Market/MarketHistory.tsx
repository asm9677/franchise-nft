import { FC, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import MarketListCard from "./MarketListCard";
import NavHistory from "../NavHistory";
import { Contract } from "ethers";

interface MarketHistoryProps {
  nftContract: Contract | null;
  marketContract: Contract | null;
}

const MarketHistory: FC<MarketHistoryProps> = ({
  nftContract,
  marketContract,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [listingIds, setListingIds] = useState<number[]>([]);

  useEffect(() => {
    if (!marketContract) return;

    marketContract
      ?.getSoldIds()
      .then((r1: number[]) =>
        marketContract
          ?.getListingIds()
          .then((r2: number[]) => setListingIds([...r1, ...r2]))
      );
  }, [marketContract]);

  return (
    <div className="w-full">
      <NavHistory sortOpen={sortOpen} setSortOpen={setSortOpen} />
      <div className="flex mt-6 w-full ">
        <div className="w-[300px]  h-full pr-4">
          <button
            className="flex justify-between items-center h-12 px-[10px] w-full font-semibold outline-none hover:bg-[#F5F5F5] rounded-[10px]"
            onClick={() => setEventOpen(!eventOpen)}
          >
            <span>Event Type</span>
            <MdKeyboardArrowDown
              size={24}
              className={`duration-200 ${eventOpen && "rotate-180"}`}
            />{" "}
          </button>
          <div className="w-full border-b border-[#ECECEC]"></div>
        </div>
        <div className="w-full">
          <div className="flex justify-between p-4 text-[#545454] border-b border-[#E2E2E2] ">
            {/* <div className="w-[140px]"></div>
            <div className="w-[160px]">Item</div>
            <div className="w-[87px] text-end">Price</div>
            <div className="w-[76px] text-end">From</div>
            <div className="w-[76px] text-end">To</div>
            <div className="w-[76px] text-end">Time</div> */}
            <div className="flex-[1] text-start"></div>
            <div className="flex-[2] text-start">Item</div>
            <div className="flex-[2] text-end">Price</div>
            <div className="flex-[2] text-end">From</div>
            <div className="flex-[2] text-end">To</div>
            <div className="flex-[2] text-end">Time</div>
          </div>
          {listingIds.map((v, i) => (
            <MarketListCard
              key={i}
              nftContract={nftContract}
              marketContract={marketContract}
              id={v}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketHistory;
