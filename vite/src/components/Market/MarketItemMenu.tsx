import { Dispatch, FC, SetStateAction, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import LocationTab from "../LocationTab";

interface MarketItemMenuProps {
  checkList: boolean[];
  setCheckList: Dispatch<SetStateAction<boolean[]>>;
  checkedCount: number;
  setCheckedCount: Dispatch<SetStateAction<number>>;
}

const MarketItemMenu: FC<MarketItemMenuProps> = ({
  checkList,
  setCheckList,
  checkedCount,
  setCheckedCount,
}) => {
  const [priceOpen, setPriceOpen] = useState<boolean>(false);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  return (
    <div className="min-w-[300px] pr-4 overflow-y-auto">
      <div className="pb-4 overflow-y-auto">
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
        <div
          className={`${
            priceOpen ? " h-[128px]" : " h-0"
          } flex flex-col duration-200 overflow-y-hidden pl-2`}
        >
          <div className="flex items-center justify-between flex-nowrap my-4">
            <input
              className="inline-block border border-[#E2E2E2] rounded-[12px] outline-none h-12 w-[90px] text-center"
              placeholder="Min"
            />
            <span className="text-[18px] text-[#121212] font-semibold mx-2">
              to
            </span>
            <input
              className="inline-block border border-[#E2E2E2] rounded-[12px] outline-none h-12  w-[90px] text-center"
              placeholder="Max"
            />
            <span className="text-[18px] text-[#121212] font-semibold ml-2">
              ETH
            </span>
          </div>
          <button className="bg-default-color text-white rounded-[12px] w-full h-12  hover:bg-default-color/90">
            Apply
          </button>
        </div>
      </div>
      <div className="w-full border-b border-[#ECECEC]"></div>
      <div className="h-10 px-[10px] w-full font-semibold mt-6 ">Traits</div>
      <LocationTab
        locationOpen={locationOpen}
        setLocationOpen={setLocationOpen}
        checkList={checkList}
        setCheckList={setCheckList}
        setCheckedCount={setCheckedCount}
      />
    </div>
  );
};

export default MarketItemMenu;
