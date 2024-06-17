import { FC, useEffect, useState } from "react";

import AccountCard from "./AccountCard";
import NavCollection from "../NavCollection";
import Modal from "./Modal";

import store from "../../lib/address.json";
import { Contract } from "ethers";
import { useOutletContext } from "react-router-dom";

interface AccountItemsProps {
  nftContract: Contract | null;
  marketContract: Contract | null;
  address?: string;
}

const AccountItems: FC<AccountItemsProps> = ({
  marketContract,
  nftContract,
  address,
}) => {
  const { signer } = useOutletContext<OutletContext>();
  const [sortOpen, setSortOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showType, setShowType] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NftData>({
    name: "",
    id: 0,
  });

  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {}, []);

  useEffect(() => {
    if (!nftContract) return;
  }, [nftContract]);

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
      <div className="flex mt-6 ">
        <div className="grid grid-cols-6 gap-4 ">
          {store.map((v, i) => (
            <AccountCard
              key={i}
              setIsModalOpen={setIsModalOpen}
              nft={{ name: v.title, id: v.id }}
              setSelectedItem={setSelectedItem}
              nftContract={nftContract}
              address={address}
            />
          ))}
        </div>
      </div>
      {/* opacity: 1; pointer-events: auto; transition: opacity 0.3s ease-in-out 0s;
      background-color: rgba(0, 0, 0, 0.8); */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          nft={selectedItem}
          nftContract={nftContract}
          marketContract={marketContract}
        />
      )}
    </div>
  );
};

export default AccountItems;
