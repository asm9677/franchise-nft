import { FC, useEffect } from "react";
import TrendingCard from "./TrendingCard";
import { BigNumberish } from "ethers";

interface TrendingProps {
  getSoldCount: () => { tokenId: number; price: BigNumberish }[];
}

const Trending: FC<TrendingProps> = ({ getSoldCount }) => {
  useEffect(() => {}, []);

  return (
    <div className="flex flex-col w-full mt-10">
      <h1 className="px-16 pb-4 text-[28px] text-[#121212] font-semibold">
        트렌딩
      </h1>
      <div className="flex justify-between w-full text-[14px] text-[#545454] px-16 gap-20 mb-1">
        <div className="flex  w-1/2 border-b  border-[#E2E2E2] py-3 px-4">
          <div className="flex-[1]">Rank</div>
          <div className="flex-[6]">Collection</div>
          <div className="flex-[1] text-end">Floor Price</div>
        </div>

        <div className="flex  w-1/2 border-b border-[#E2E2E2] py-3 px-4">
          <div className="flex-[1]">Rank</div>
          <div className="flex-[6]">Collection</div>
          <div className="flex-[1] text-end">Floor Price</div>
        </div>
      </div>
      {getSoldCount().map((_, i, arr) => {
        if (i < 5) {
          return (
            <div
              key={i}
              className="flex justify-between w-full text-[14px] text-[#545454] px-16 gap-20"
            >
              <TrendingCard
                rank={i + 1}
                id={arr[i].tokenId}
                price={arr[i].price}
              />
              <TrendingCard
                rank={i + 6}
                id={arr[i + 5].tokenId}
                price={arr[i + 5].price}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default Trending;
