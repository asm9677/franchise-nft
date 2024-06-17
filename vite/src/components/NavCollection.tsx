import { Dispatch, FC, SetStateAction, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  MdKeyboardArrowDown,
  MdMenu,
  MdOutlineAutoAwesomeMosaic,
  MdOutlineGridOn,
  MdOutlineWindow,
} from "react-icons/md";

interface NavCollectionProps {
  sortOpen: boolean;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  showType: number;
  setShowType: Dispatch<SetStateAction<number>>;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const NavCollection: FC<NavCollectionProps> = ({
  sortOpen,
  setSortOpen,
  showType,
  setShowType,
  menuOpen,
  setMenuOpen,
}) => {
  //   const { signer, provider, setSigner } = useOutletContext<OutletContext>();

  return (
    <div className="h-[72px] flex items-center">
      <button
        className="p-3 rounded-[12px] bg-[#F5F5F5] hover:bg-[#ECECEC] mr-4 ml-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <MdMenu size={24} />
      </button>
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
            showType == 0 && "text-[#121212] rounded-[10px] bg-white shadow-sm"
          }`}
          onClick={() => setShowType(0)}
        >
          <MdOutlineGridOn size={24} />{" "}
        </button>
        <button
          className={`px-[10px] hover:text-[#121212] ${
            showType == 1 && "text-[#121212] rounded-[10px] bg-white shadow-sm"
          }`}
          onClick={() => setShowType(1)}
        >
          <MdOutlineWindow size={24} />{" "}
        </button>
        <button
          className={`px-[10px] hover:text-[#121212] ${
            showType == 2 && "text-[#121212] rounded-[10px] bg-white shadow-sm"
          }`}
          onClick={() => setShowType(2)}
        >
          <MdOutlineAutoAwesomeMosaic size={24} />{" "}
        </button>
      </div>
    </div>
  );
};

export default NavCollection;
