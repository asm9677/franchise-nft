import { FC, useState } from "react";
import { MdOutlineSell } from "react-icons/md";

const MarketListCard: FC = () => {
  return (
    <button className="flex items-center justify-between w-full rounded-[8px] border-b border-[#E2E2E2] h-[82px] p-4 hover:bg-[#F5F5F5]">
      <div className="flex items-center px-[2px]">
        <MdOutlineSell size={18} />
        <div className="flex flex-col justify-center items-center w-[110px] ml-2 text-[16px] font-semibold">
          <span>List</span>
        </div>
      </div>

      <div className="flex items-center px-[2px]">
        <img
          src="https://i.seadn.io/gcs/files/75d7ded3251ab3c712a0090e12bba36b.png"
          className="w-12 h-12 object-cover rounded-[10px]"
        />
        <div className="flex flex-col justify-center items-center ml-2 truncate">
          <span className="text-[16px] font-semibold text-[#121212] w-full ">
            Pudgy Penguin #5235
          </span>
          <span className="text-[12px] font-normal text-[#121212] w-full text-start">
            Pudgy Penguins
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-end items-end  ml-2 ">
        <span className="text-[16px] font-semibold text-[#121212] w-full truncate self-end">
          12.990 ETH
        </span>
        <span className="text-[12px] font-normal text-[#121212] w-full truncate text-end">
          $47,889.58
        </span>
      </div>

      <div className="min-w-[76px] text-end">8BF23E</div>

      <div className="min-w-[76px] text-[#121212] text-end">---</div>

      <div className="min-w-[76px] text-[#121212] text-end"> 4h ago</div>
    </button>
  );
};

export default MarketListCard;
