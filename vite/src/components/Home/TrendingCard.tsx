import { FC } from "react";
import { useOutletContext } from "react-router-dom";
import store from "../../lib/address.json";
import { BigNumberish, formatEther } from "ethers";

interface TrendingCardProps {
  id: number;
  rank: number;
  price: BigNumberish;
}

const TrendingCard: FC<TrendingCardProps> = ({ id, rank, price }) => {
  const { navigate } = useOutletContext<OutletContext>();
  return (
    <button
      className="flex  w-1/2  py-3 text-[16px] text-[#121212] items-center font-semibold px-4 rounded-[8px] hover:bg-default-color/10"
      onClick={() => navigate(`/market/${id}`)}
    >
      <div className="flex-[1] text-start">{rank}</div>
      <div className="flex-[6] flex items-center">
        <img src={`/nft/${id}.png`} className="rounded-[12px] w-[70px]" />
        <span className="ml-6">
          {store[id - 1].title} #{id}{" "}
        </span>
      </div>
      <div className="flex-[1] text-end">
        {0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn ==
        price
          ? "---"
          : `${formatEther(price)} ETH`}
      </div>
    </button>
  );
};

export default TrendingCard;
