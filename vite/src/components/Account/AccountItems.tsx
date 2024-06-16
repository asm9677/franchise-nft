import { FC, useState } from "react";

import AccountCard from "./AccountCard";
import NavCollection from "../NavCollection";
import Modal from "./Modal";

const AccountItems: FC = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [showType, setShowType] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full ">
      <NavCollection
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        showType={showType}
        setShowType={setShowType}
      />
      <div className="flex mt-6 ">
        <div className="grid grid-cols-6 gap-4 overflow-y-hidden">
          {Array.from({ length: 10 }, (v, i) => (
            <AccountCard key={i} />
          ))}
        </div>
      </div>
      {/* opacity: 1; pointer-events: auto; transition: opacity 0.3s ease-in-out 0s;
      background-color: rgba(0, 0, 0, 0.8); */}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AccountItems;
