import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Slider from "react-slick";
import BannerCard from "../components/BannerCard";
import Trending from "../components/Home/Trending";
import Latest from "../components/Home/Latest";
import HighestReward from "../components/Home/HighestReward";

const banners = [
  {
    src: "/banner/1.jpg",
    title: "피자를 맛있게 즐기는 방법!",
    description: "모두가 원하는 바로 그 맛!",
    color: "text-white",
  },
  {
    src: "/banner/1.jpg",
    title: "피자를 맛있게 즐기는 방법!",
    description: "모두가 원하는 바로 그 맛!",
    color: "text-white",
  },
];

interface Reward {
  tokenId: number;
  value: BigInt;
}

const Home: FC = () => {
  const { provider, nftContract, marketContract, orderContract } =
    useOutletContext<OutletContext>();

  const [listingIds, setListingIds] = useState<number[]>([]);
  const [soldIds, setSoldIds] = useState<number[]>([]);

  const [listingItems, setListingItems] = useState<Item[]>([]);
  const [soldItems, setSoldItems] = useState<Item[]>([]);

  const [rewards, setRewards] = useState<Reward[]>([]);

  const getSoldCount = () => {
    const countArr = Array.from({ length: 26 }).map((_, i) => ({
      tokenId: i,
      count: 0,
      price:
        BigInt(
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
        ),
    }));

    soldItems.forEach((v) => {
      countArr[v.tokenId].count++;
      countArr[v.tokenId].price =
        countArr[v.tokenId].price > v.price
          ? v.price
          : countArr[v.tokenId].price;
    });

    countArr.sort((a, b) => b.count - a.count);
    return countArr.filter((v) => v.tokenId != 0).slice(0, 10);
  };

  const getLatestListings = () => {
    const listings = Array.from({ length: 26 }).map((_, i) => ({
      tokenId: i,
      timestamp: 0,
    }));

    listingItems.forEach(
      (v) =>
        (listings[v.tokenId].timestamp =
          listings[v.tokenId].timestamp < Number(v.timestamp)
            ? Number(v.timestamp)
            : listings[v.tokenId].timestamp)
    );

    listings.sort((a, b) => b.timestamp - a.timestamp);
    return listings.filter((v) => v.tokenId != 0).slice(0, 10);
  };

  const getHighestRewardNFT = () => {
    rewards.sort((a, b) => {
      if (a.value < b.value) {
        return 1;
      } else if (a.value > b.value) {
        return -1;
      } else {
        return 0;
      }
    });
    return rewards.filter((v) => v.tokenId != 0).slice(0, 10);
  };

  useEffect(() => {
    if (!nftContract) return;
  }, [nftContract]);

  useEffect(() => {
    if (!marketContract) return;

    marketContract.getListingIds().then(setListingIds);
    marketContract.getSoldIds().then(setSoldIds);
  }, [marketContract]);

  useEffect(() => {
    if (listingIds.length === 0) return;

    Promise.all(
      listingIds.map(async (v) => await marketContract.getListingItem(v))
    ).then(setListingItems);
  }, [listingIds]);

  useEffect(() => {
    if (soldIds.length === 0) return;

    Promise.all(
      soldIds.map(async (v) => await marketContract.getListingItem(v))
    ).then(setSoldItems);
  }, [soldIds]);

  useEffect(() => {
    if (!orderContract) return;

    Promise.all(
      Array.from({ length: 25 }).map(
        async (_, i) => await orderContract.getCurrentReward(i + 1)
      )
    ).then((res) =>
      setRewards(
        res.map((v, i) => ({
          tokenId: i + 1,
          value: v,
        }))
      )
    );
  }, [orderContract]);

  useEffect(() => {
    if (soldItems.length === 0 || listingItems.length === 0) return;
    getSoldCount();
    getLatestListings();
  }, [soldItems, listingItems]);

  return (
    <div className="mt-[100px] w-full">
      <Slider dots={false} slidesToShow={1} arrows={false}>
        {banners.map((v) => (
          <BannerCard
            src={v.src}
            color={v.color}
            title={v.title}
            description={v.description}
          />
        ))}
      </Slider>

      <Trending getSoldCount={getSoldCount} />
      <Latest
        getLatestListings={getLatestListings}
        listingItems={listingItems}
        soldItems={soldItems}
      />
      <HighestReward
        getHighestRewardNFT={getHighestRewardNFT}
        listingItems={listingItems}
        soldItems={soldItems}
      />
      <div className="mb-32"></div>
    </div>
  );
};

export default Home;
