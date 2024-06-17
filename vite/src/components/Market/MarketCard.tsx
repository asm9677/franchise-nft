import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MarketCardProps {
  market: Address;
  checked: boolean;
}

const MarketCard: FC<MarketCardProps> = ({ market, checked }) => {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

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
        <p className="my-2 h-[20px]">10.29 ETH</p>
        <p className="h-[20px] text-[#545454]">Last sale: 0.05 ETH</p>
      </div>
    </div>
  );
};

export default MarketCard;
