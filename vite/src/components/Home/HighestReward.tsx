import { FC, useEffect, useRef, useState } from "react";
import MarketCard from "../Market/MarketCard";
import store from "../../lib/address.json";
import Modal from "../Account/Modal";
import { useOutletContext } from "react-router-dom";
import Slider from "react-slick";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface HighestRewardProps {
  getHighestRewardNFT: () => { tokenId: number; value: BigInt }[];
  listingItems: Item[];
  soldItems: Item[];
}

const HighestReward: FC<HighestRewardProps> = ({
  getHighestRewardNFT,
  listingItems,
  soldItems,
}) => {
  const { nftContract, marketContract } = useOutletContext<OutletContext>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [selectedItem, setSelectedItem] = useState<NftData>({
    name: "",
    id: 0,
  });

  useEffect(() => {}, []);

  const sliderRef = useRef<Slider>(null);

  const handlePrev = () => {
    sliderRef?.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef?.current?.slickNext();
  };

  return (
    <div className="flex flex-col w-full mt-16">
      <h1 className="px-16 pb-4 text-[28px] text-[#121212] font-semibold ">
        최근 보상이 제일 많은 NFT
      </h1>
      <div className="relative w-full overflow-x-hidden">
        <button
          className="absolute h-full left-6 hover:bg-[#F0F0FE] rounded-[12px] z-50"
          onClick={handlePrev}
        >
          <MdChevronLeft size={48} />
        </button>
        <button
          className="absolute h-full right-6 hover:bg-[#F0F0FE] rounded-[12px] z-50"
          onClick={handleNext}
        >
          <MdChevronRight size={48} />
        </button>
        <Slider
          ref={sliderRef}
          dots={false}
          slidesToShow={5}
          className="max-w-full px-16"
        >
          {getHighestRewardNFT().map((v, i) => {
            return (
              <MarketCard
                key={i}
                checked={true}
                listingItems={listingItems}
                market={store[v.tokenId - 1]}
                nft={{ name: store[v.tokenId - 1].title, id: v.tokenId }}
                setIsModalOpen={setIsModalOpen}
                setSelectedItem={setSelectedItem}
                soldItems={soldItems}
                account={undefined}
              />
            );
          })}
        </Slider>
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

export default HighestReward;
