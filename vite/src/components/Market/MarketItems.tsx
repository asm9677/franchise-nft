import { FC, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import MarketCard from "./MarketCard";
import NavCollection from "../NavCollection";
import MarketItemMenu from "./MarketItemMenu";

import store from "../../lib/address.json";
import { Contract } from "ethers";
import { useOutletContext } from "react-router-dom";

const MarketItems: FC = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const [showType, setShowType] = useState(0);

  const [checkList, setCheckList] = useState<boolean[]>(
    store.map((v, _) => false)
  );

  const [checkedCount, setCheckedCount] = useState<number>(0);
  const [soldIds, setSoldIds] = useState<number[]>([]);
  const [listingIds, setListingIds] = useState<number[]>([]);

  const [soldItems, setSoldItems] = useState<Item[]>([]);
  const [listingItems, setListingItems] = useState<Item[]>([]);

  const { provider, marketContract, nftContract } =
    useOutletContext<OutletContext>();

  useEffect(() => {
    if (!marketContract) return;
    marketContract.getSoldIds().then(setSoldIds);
    marketContract.getListingIds().then(setListingIds);
  }, marketContract);

  useEffect(() => {
    Promise.all(
      listingIds.map(async (v) => await marketContract.getListingItem(v))
    ).then(setListingItems);
  }, [listingIds]);

  useEffect(() => {
    Promise.all(
      soldIds.map(async (v) => await marketContract.getListingItem(v))
    ).then(setSoldItems);
  }, [soldIds]);

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
                soldItems={soldItems}
                listingItems={listingItems}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketItems;
