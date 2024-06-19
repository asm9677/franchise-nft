import { FC, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import MarketCard from "./MarketCard";
import NavCollection from "../NavCollection";
import MarketItemMenu from "./MarketItemMenu";

import store from "../../lib/address.json";
import { Contract } from "ethers";
import { useOutletContext } from "react-router-dom";
import Modal from "../Account/Modal";

interface MarketItemProps {
  account?: string | undefined;
}

const MarketItems: FC<MarketItemProps> = ({ account }) => {
  const { marketContract, nftContract } = useOutletContext<OutletContext>();
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const [showType, setShowType] = useState(0);

  const [checkList, setCheckList] = useState<boolean[]>(
    store.map((_) => false)
  );

  const [checkedCount, setCheckedCount] = useState<number>(0);
  const [soldIds, setSoldIds] = useState<number[]>([]);
  const [listingIds, setListingIds] = useState<number[]>([]);

  const [soldItems, setSoldItems] = useState<Item[]>([]);
  const [listingItems, setListingItems] = useState<Item[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NftData>({
    name: "",
    id: 0,
  });
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!marketContract) return;
    marketContract.getSoldIds().then(setSoldIds);
    marketContract.getListingIds().then(setListingIds);
  }, [marketContract]);

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
          <div className="min-w-[300px] max-h-full overflow-y-auto">
            <MarketItemMenu
              checkList={checkList}
              setCheckList={setCheckList}
              checkedCount={checkedCount}
              setCheckedCount={setCheckedCount}
            />
          </div>
        )}
        <div>
          <div className="grid grid-cols-5 gap-4 ">
            {store.map((v, i) => (
              <MarketCard
                key={i}
                market={v}
                nft={{ name: v.title, id: v.id }}
                checked={checkList[i] || checkedCount === 0}
                soldItems={soldItems}
                listingItems={listingItems}
                setIsModalOpen={setIsModalOpen}
                setSelectedItem={setSelectedItem}
                account={account}
              />
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          nft={selectedItem}
          nftContract={nftContract}
          marketContract={marketContract}
        />
      )}
    </div>
  );
};

export default MarketItems;
