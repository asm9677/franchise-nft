import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface LocationCheckBoxProps {
  title: string;
  value: string;
  index: number;
  checkList: boolean[];
  setCheckList: Dispatch<SetStateAction<boolean[]>>;
}

const LocationCheckBox: FC<LocationCheckBoxProps> = ({
  title,
  value,
  index,
  checkList,
  setCheckList,
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    setCheckList(checkList.map((v, i) => (index == i ? checked : v)));
  }, [checked]);
  return (
    <button
      className={`rounded-[12px] px-2 py-4 hover:bg-default-color/10 ${
        !title.match(value) && "hidden"
      }`}
      onClick={() => setChecked(!checked)}
    >
      <label
        htmlFor="checkbox"
        className="flex justify-between items-center gap-2 pr-2 text-[#545454] font-semibold cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-6 rounded-[16px] text-[3px] bg-red-100"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <span>{title}</span>
        </div>
        <span className="text-[14px]">1</span>
      </label>
    </button>
  );
};

export default LocationCheckBox;
