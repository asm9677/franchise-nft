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

const MarketItems: FC = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [showType, setShowType] = useState(0);
  return (
    <div className="w-full">
      <div className="h-[72px] flex items-center">
        <button className="p-3 rounded-[12px] bg-[#F5F5F5] hover:bg-[#ECECEC] mr-4 ml-2">
          <MdMenu size={24} />
        </button>
        <div className="flex items-center justify-center w-fit">
          <div className="w-4 h-4 bg-[#34c77b] animate-livePulse rounded-full mr-3" />
          <span className="text-[16px] text-[#121212] font-semibold">Live</span>
          <span className="text-[16px] text-[#545454] font-semibold mx-6">
            8,888 results
          </span>
        </div>
        <div className="flex h-12 grow items-center rounded-xl p-3 text-md border transition duration-200 focus-within:shadow-none focus-within:hover:shadow-none border-[#E2E2E2] hover:border-[#B2B2B2] focus-within:border-[#B2B2B2] focus:outline-none">
          <AiOutlineSearch size={24} color="#545454" />
          <input
            placeholder="Search by name or trait"
            className="w-full border-0 bg-transparent outline-none min-h-[26px] text-[16px] leading-[26px] ml-3"
          />
        </div>
        <button
          className="flex justify-between ml-3 h-12 items-center rounded-xl p-3 text-[16px] font-semibold w-60 border transition duration-200 focus-within:shadow-none focus-within:hover:shadow-none border-[#E2E2E2] hover:border-[#B2B2B2] focus-within:border-[#B2B2B2] focus:outline-none"
          onClick={() => setSortOpen(!sortOpen)}
          onBlur={() => setSortOpen(false)}
        >
          <span>Price low to high</span>
          <MdKeyboardArrowDown
            size={24}
            className={`duration-200 ${sortOpen && "rotate-180"}`}
          />
        </button>
        <div className="relative inline-flex h-12 rounded-xl bg-[#F5F5F5] p-0.5 ml-3 text-[#545454]">
          <button
            className={`px-[10px] hover:text-[#121212] ${
              showType == 0 &&
              "text-[#121212] rounded-[10px] bg-white shadow-sm"
            }`}
            onClick={() => setShowType(0)}
          >
            <MdOutlineGridOn size={24} />{" "}
          </button>
          <button
            className={`px-[10px] hover:text-[#121212] ${
              showType == 1 &&
              "text-[#121212] rounded-[10px] bg-white shadow-sm"
            }`}
            onClick={() => setShowType(1)}
          >
            <MdOutlineWindow size={24} />{" "}
          </button>
          <button
            className={`px-[10px] hover:text-[#121212] ${
              showType == 2 &&
              "text-[#121212] rounded-[10px] bg-white shadow-sm"
            }`}
            onClick={() => setShowType(2)}
          >
            <MdOutlineAutoAwesomeMosaic size={24} />{" "}
          </button>
        </div>
      </div>
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
