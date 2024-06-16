import { FC, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  MdKeyboardArrowDown,
  MdMenu,
  MdOutlineAutoAwesomeMosaic,
  MdOutlineGridOn,
  MdOutlineWindow,
} from "react-icons/md";
import MarketCard from "./MarketCard";
import NavCollection from "../NavCollection";

const MarketItems: FC = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [showType, setShowType] = useState(0);
  return (
    <div className="w-full">
      <NavCollection
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        showType={showType}
        setShowType={setShowType}
      />
      <div className="flex mt-6 ">
        <div className="w-[300px]  h-full pr-4">
          <button
            className="flex justify-between items-center h-12 px-[10px] w-full font-semibold outline-none hover:bg-[#F5F5F5] rounded-[10px]"
            onClick={() => setPriceOpen(!priceOpen)}
          >
            <span>Price</span>
            <MdKeyboardArrowDown
              size={24}
              className={`duration-200 ${priceOpen && "rotate-180"}`}
            />{" "}
          </button>
          <div className="w-full border-b border-[#ECECEC]"></div>
          <div className="h-10 px-[10px] w-full font-semibold mt-6 ">
            Traits
          </div>
          <button
            className="flex justify-between items-center h-12 px-[10px] w-full font-semibold outline-none hover:bg-[#F5F5F5] rounded-[10px]"
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <span>Location</span>
            <MdKeyboardArrowDown
              size={24}
              className={`duration-200 ${locationOpen && "rotate-180"}`}
            />{" "}
          </button>
        </div>
        <div className="grid grid-cols-6 gap-4 ">
          {Array.from({ length: 10 }, (v, i) => (
            <MarketCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketItems;
