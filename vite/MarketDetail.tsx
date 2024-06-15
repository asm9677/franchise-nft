import { FC, useState } from "react";
import {
  MdKeyboardArrowDown,
  MdOutlineAdd,
  MdOutlineBallot,
  MdOutlineRemove,
  MdTimeline,
} from "react-icons/md";

import Chart from "../components/MarketDetail/Chart";

const data = [
  { date: "Jan 15", value: 10 },
  { value: 15 },
  { date: "Mar 30", value: 20 },
  { date: "Apr 6", value: 30 },
  { date: "Apr 13", value: 15 },
  { date: "Apr 20", value: 25 },
  { date: "Jan 15", value: 10 },
  { value: 15 },
  { date: "Mar 30", value: 20 },
  { date: "Apr 6", value: 30 },
  { date: "Apr 13", value: 15 },
  { date: "Apr 20", value: 25 },
  { date: "Jan 15", value: 10 },
  { value: 15 },
  { date: "Mar 30", value: 20 },
  { date: "Apr 6", value: 30 },
  { date: "Apr 13", value: 15 },
  { date: "Apr 20", value: 25 },
];
const MarketDetail: FC = () => {
  const [purchasesCount, setPurchasesCount] = useState<string>("1");
  const [purchasesValue, setPurchasesValue] = useState<string>("1");
  return (
    <article className="pt-[100px]  min-h-[100vh] px-16">
      <div className="flex gap-5">
        <div className="flex flex-col gap-6 w-[43%]">
          <div className="flex items-center justify-center w-full  border border-[#E2E2E2] rounded-[10px] overflow-hidden">
            <img
              src="https://akamai.pizzahut.co.kr/2020pizzahut-prod/public/img/menu/RPPZ1894_s.png"
              className="object-cover w-full"
            />
          </div>
          <div className="flex flex-col justify-center w-full border border-[#E2E2E2] rounded-[10px] overflow-hidden text-[#121212]">
            <button className="flex justify-between p-5 min-h-[44px] border-b border-[#E2E2E2]">
              <div className="flex items-center">
                <MdOutlineBallot size={24} />
                <span className="font-bold ml-[10px]">Details</span>
              </div>
              <div>
                <MdKeyboardArrowDown size={24} />
              </div>
            </button>
            <div className="h-[170px] p-5 flex flex-col">
              <div className="flex justify-between mt-2">
                <span>Contract Address</span>
                <span className="text-[14px] font-semibold text-[#338BE4]">
                  0xe706...8e43
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Token ID</span>
                <span className="text-[14px] font-semibold text-[#338BE4]">
                  5
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Token Standard</span>
                <span className="text-[14px] ">ERC-1155</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Chain</span>
                <span className="text-[14px] ">Ethereum</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col grow w-1/2">
          <div className="h-12 text-[#2081E2] font-semibold flex items-center mb-[1px] ">
            Notable Pepes
          </div>
          <div className="h-9 font-bold text-[30px] text-[#121212] mb-10">
            Pepe Invasion
          </div>

          <div className="flex flex-col justify-center w-full border border-[#E2E2E2] rounded-[10px] overflow-hidden text-[#121212] p-5 ">
            <div className="flex justify-between items-center min-h-[44px]">
              <div className="flex flex-col">
                <span className="text-[#545454]">Max price</span>
                <span className="text-[#121212] text-[32px] font-semibold">
                  0.0181 ETH
                </span>
              </div>
              <div className="flex justify-between items-center w-[150px] h-[48px] p-3 border border-[#E2E2E2] rounded-[12px]">
                <button className="w-6 h-6">
                  <MdOutlineRemove size={"full"} />
                </button>
                <input
                  className="outline-none w-[76px] text-center"
                  value={purchasesCount}
                  onChange={(e) => setPurchasesCount(e.target.value)}
                />
                <button className="w-6 h-6">
                  <MdOutlineAdd size={"full"} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 items-center mt-5">
              <span className="text-[#545454] text-nowrap">
                Max price per listing
              </span>
              <div className="flex w-full h-[48px] p-3 border border-[#E2E2E2] rounded-[12px]">
                <input
                  className="outline-none grow"
                  value={purchasesValue}
                  onChange={(e) => setPurchasesValue(e.target.value)}
                />
                <span className="text-[#121212]">ETH</span>
              </div>
            </div>
            <button className="w-full bg-default-color text-white rounded-[12px] h-[60px] mt-5 font-semibold outline-none">
              Buy {purchasesCount} now
            </button>
          </div>
          <div className="flex flex-col justify-center w-full border border-[#E2E2E2] rounded-[10px] overflow-hidden text-[#121212] mt-6">
            <button className="flex justify-between p-5 min-h-[44px] border-b border-[#E2E2E2]">
              <div className="flex items-center">
                <MdTimeline size={24} />
                <span className="font-bold ml-[10px]">Price History</span>
              </div>
              <div>
                <MdKeyboardArrowDown size={24} />
              </div>
            </button>
            <div className="p-5 pl-0 pt-9">
              <Chart data={data} label="Price (ETH)" />
            </div>
          </div>
          <div className="flex flex-col justify-center w-full border border-[#E2E2E2] rounded-[10px] overflow-hidden text-[#121212] mt-6">
            <button className="flex justify-between p-5 min-h-[44px] border-b border-[#E2E2E2]">
              <div className="flex items-center">
                <MdTimeline size={24} />
                <span className="font-bold ml-[10px]">Reword History</span>
              </div>
              <div>
                <MdKeyboardArrowDown size={24} />
              </div>
            </button>
            <div className="p-5 pl-0 pt-9">
              <Chart data={data} label="Price (ETH)" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MarketDetail;
