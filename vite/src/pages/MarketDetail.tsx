import { FC, useEffect, useState } from "react";
import {
  MdKeyboardArrowDown,
  MdOutlineAdd,
  MdOutlineBallot,
  MdOutlineRemove,
  MdTimeline,
} from "react-icons/md";

import Chart from "../components/MarketDetail/Chart";
import { marketAddress, nftAddress } from "../lib/contractAddress";
import { useOutletContext, useParams } from "react-router-dom";
import { Contract, formatEther, parseEther } from "ethers";
import marketABI from "../contracts/Market.json";
import nftABI from "../contracts/NFT.json";
import store from "../lib/address.json";
import { formatDate } from "../lib/utils";
import { BigNumberish } from "ethers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  const { signer, provider, navigate, marketContract, nftContract } =
    useOutletContext<OutletContext>();
  const { tokenId } = useParams();
  const [purchasesCount, _setPurchasesCount] = useState<string>("1");
  const [purchasesValue, _setPurchasesValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<BigNumberish>(0n);
  const [maxBuyCount, setMaxBuyCount] = useState<number>(0);
  const [buyList, setBuyList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();

  const setPurchasesValue = (v: string) => {
    if (!isNaN(Number(v))) _setPurchasesValue(v);
  };

  useEffect(() => {
    let tmp = 0n;
    let count = 0;
    let value = parseEther(purchasesValue);
    const list: number[] = [];
    for (let item of sortedListings) {
      if (
        Number(item.amount) + count <= parseInt(purchasesCount) &&
        item.price / item.amount <= value &&
        item.listingId
      ) {
        count += Number(item.amount);
        tmp += item.price;
        list.push(item.listingId);
      }
    }
    setMaxValue(tmp);
    setMaxBuyCount(count);
    setBuyList(list);
  }, [purchasesValue, purchasesCount]);

  const setPurchasesCount = (v: string) => {
    if (!Number.isInteger(Number(v))) return;
    else if (Number(v) < 1) _setPurchasesCount("1");
    else _setPurchasesCount(v);
  };

  const addPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + 1));
  };

  const subPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) - 1));
  };

  const [listingIds, setListingIds] = useState<number[]>([]);

  const [listings, setListings] = useState<Item[]>([]);
  const [sortedListings, setSortedListings] = useState<Item[]>([]);

  useEffect(() => {
    if (!marketContract) return;
    marketContract.getListingIds().then(setListingIds);
  }, [marketContract]);

  useEffect(() => {
    if (!marketContract || !listingIds.length) return;

    Promise.all(
      listingIds.map(async (v, _) => await marketContract.getListingItem(v))
    ).then((res) => {
      setListings(
        res.map((v, i) => {
          return {
            listingId: listingIds[i],
            seller: v.seller,
            tokenId: v.tokenId,
            price: v.price,
            amount: v.amount,
            timestamp: v.timestamp,
            sold: v.sold,
          };
        })
      );
    });
  }, [marketContract, listingIds]);

  useEffect(() => {
    if (!marketContract || !listings.length) return;
    setSortedListings(
      listings
        .filter((v) => v.tokenId.toString() === tokenId)
        .sort((a, b) => Number(a.price) - Number(b.price))
    );
  }, [marketContract, listings]);

  const purchase = () => {
    if (!marketContract || maxBuyCount === 0) return;
    console.log({ value: maxValue }, buyList);
    setIsLoading(true);

    marketContract
      .multiPurchase(buyList, { value: maxValue })
      .then((tx: any) =>
        tx
          .wait()
          .then()
          .finally(() => setIsLoading(false))
      )
      .catch((error: any) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  return (
    <article className="pt-[100px]  min-h-[100vh] px-16">
      <div className="flex gap-5">
        <div className="flex flex-col gap-6 w-[43%]">
          <div className="flex items-center justify-center w-full  border border-[#E2E2E2] rounded-[10px] overflow-hidden">
            <img src="/nft.png" className="object-cover w-full" />
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
                <a
                  className="text-[14px] font-semibold text-[#338BE4]"
                  href={`https://sepolia.etherscan.io/address/${nftAddress}`}
                  target="_blank"
                >
                  {`${nftAddress.substring(0, 6)}...${nftAddress.substring(
                    nftAddress.length - 4
                  )}`}
                </a>
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
            pizza
          </div>
          <div className="h-9 font-bold text-[30px] text-[#121212] mb-10">
            {tokenId && store[Number(tokenId)].title} #{tokenId}
          </div>
          <div className="flex flex-col justify-center w-full border border-[#E2E2E2] rounded-[10px] overflow-hidden text-[#121212] p-5 ">
            <div className="flex justify-between items-center min-h-[44px]">
              <div className="flex flex-col">
                <span className="text-[#545454]">Max price</span>
                <span className="text-[#121212] text-[32px] font-semibold">
                  {formatEther(maxValue)} ETH
                </span>
              </div>
              <div className="flex justify-between items-center w-[150px] h-[48px] p-3 border border-[#E2E2E2] rounded-[12px]">
                <button className="w-6 h-6" onClick={subPurchasesCount}>
                  <MdOutlineRemove size={"full"} />
                </button>
                <input
                  className="outline-none w-[76px] text-center"
                  value={purchasesCount}
                  onChange={(e) => setPurchasesCount(e.target.value)}
                />
                <button className="w-6 h-6" onClick={addPurchasesCount}>
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
            <button
              className="w-full bg-default-color text-white rounded-[12px] h-[60px] mt-5 font-semibold outline-none flex items-center justify-center"
              onClick={purchase}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <span>Buy {maxBuyCount} now</span>
              )}
            </button>
          </div>
          <div className="flex flex-col justify-center w-full border border-[#E2E2E2] rounded-[10px] overflow-hidden text-[#121212] mt-6 overflow-y-hidden ">
            <button className="flex justify-between p-5 min-h-[44px] border-b border-[#E2E2E2]">
              <div className="flex items-center">
                <MdTimeline size={24} />
                <span className="font-bold ml-[10px]">Listings</span>
              </div>
              <div>
                <MdKeyboardArrowDown size={24} />
              </div>
            </button>
            <div className="flex flex-col border-b border-[#E2E2E2] ">
              <div className="flex p-5 pt-2 pb-1 text-[#545454] font-semibold">
                <div className="flex-[1]">Unit Price</div>
                <div className="flex-[1]">USD Unit Price</div>
                <div className="flex-[1]">Quantity</div>
                <div className="flex-[1]">Time</div>
                <div className="flex-[1]"> From</div>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto whitespace-nowrap">
              {sortedListings.map((v: Item, i) => (
                <div
                  key={i}
                  className="flex border-b border-[#E2E2E2] px-5 py-4 font-semibold text-[#121212]  h-[57px]"
                >
                  <div className="flex-[1]">{formatEther(v.price)} ETH</div>
                  <div className="flex-[1]">
                    ${formatEther(v.price * 3555n)}
                  </div>
                  <div className="flex-[1]">{v.amount.toString()}</div>
                  <div className="flex-[1]">
                    {formatDate(v.timestamp.toString())}
                  </div>
                  <div
                    className="flex-[1] text-[#2081E2]"
                    onClick={() => navigate(`/account/${v.seller}`)}
                  >
                    {v.seller.substring(v.seller.length - 6)}
                  </div>
                </div>
              ))}
            </div>
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
