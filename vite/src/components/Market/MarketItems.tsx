import { FC, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import MarketCard from "./MarketCard";
import NavCollection from "../NavCollection";
import MarketItemMenu from "./MarketItemMenu";

import store from "../../lib/address.json";

const MarketItems: FC = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const [showType, setShowType] = useState(0);

  const [checkList, setCheckList] = useState<boolean[]>(
    store.map((v, _) => false)
  );

  const [checkedCount, setCheckedCount] = useState<number>(0);

  return (
    <div className="w-full ">
      <NavCollection
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        showType={showType}
        setShowType={setShowType}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <div className="flex mt-6  ">
        {menuOpen && (
          <div className="min-w-[300px] max-h-full overflow-y-hidden">
            <MarketItemMenu
              checkList={checkList}
              setCheckList={setCheckList}
              checkedCount={checkedCount}
              setCheckedCount={setCheckedCount}
            />
          </div>
        )}
        <div>
          <div className="grid grid-cols-5 gap-4 overflow-y-hidden">
            {store.map((v, i) => (
              <MarketCard
                key={i}
                market={v}
                checked={checkList[i] || checkedCount === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketItems;
