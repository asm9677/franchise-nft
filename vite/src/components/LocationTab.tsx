import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import store from "../lib/address.json";
import LocationCheckBox from "./LocationCheckBox";
interface LocationTabProps {
  locationOpen: boolean;
  setLocationOpen: Dispatch<SetStateAction<boolean>>;

  checkList: boolean[];
  setCheckList: Dispatch<SetStateAction<boolean[]>>;
  checkedCount: number;
  setCheckedCount: Dispatch<SetStateAction<number>>;
}

const LocationTab: FC<LocationTabProps> = ({
  locationOpen,
  setLocationOpen,
  checkList,
  setCheckList,
  checkedCount,
  setCheckedCount,
}) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setCheckedCount(
      checkList.reduce(
        (accumulator, currentValue) =>
          currentValue ? accumulator + 1 : accumulator,
        0
      )
    );
  }, [checkList]);

  return (
    <>
      <button
        className="flex justify-between items-center h-12 px-[10px] w-full font-semibold outline-none hover:bg-[#F5F5F5] rounded-[10px]"
        onClick={() => setLocationOpen(!locationOpen)}
      >
        <span>Location</span>
        <MdKeyboardArrowDown
          size={24}
          className={`duration-200 ${locationOpen && "rotate-180"}`}
        />
      </button>
      <div
        className={`${
          locationOpen ? "h-fit" : " h-0"
        } flex flex-col duration-200 overflow-y-hidden pl-2`}
      >
        <div className="flex items-center justify-between flex-nowrap my-4 relative">
          <input
            className="inline-block border border-[#E2E2E2] rounded-[12px] outline-none h-12 pl-10 pr-12 w-full"
            placeholder="검색"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <AiOutlineSearch
            size={24}
            className="absolute left-2 top-1/2 -translate-y-3"
          />
          <button
            onClick={() => setValue("")}
            className={`${!value && "hidden"}`}
          >
            <MdClose
              size={16}
              className="absolute right-4 top-1/2 -translate-y-2 hover:text-[#545454]"
            />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {store.map((v, i) => (
            <LocationCheckBox
              key={i}
              title={v.title}
              value={value}
              index={i}
              checkList={checkList}
              setCheckList={setCheckList}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationTab;
