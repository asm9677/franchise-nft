import { Contract, formatEther, parseEther } from "ethers";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdClose, MdOutlineAdd, MdOutlineRemove } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import { marketAddress } from "../../lib/contractAddress";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: NftData;
  nftContract: Contract | null;
  marketContract: Contract | null;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  nft,
  nftContract,
  marketContract,
}) => {
  // if (!isOpen) return;

  const { signer } = useOutletContext<OutletContext>();
  const [purchasesCount, _setPurchasesCount] = useState<string>("1");
  const [value, _setValue] = useState<string>("0");
  const [balance, setBalance] = useState<BigInt>();
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!nftContract) return;
    nftContract?.balanceOf(signer.address, nft.id).then(setBalance);
    nftContract
      ?.isApprovedForAll(signer.address, marketAddress)
      .then(setIsApprovedForAll);
  }, [nftContract]);

  const setValue = (v: string) => {
    if (!isNaN(Number(v))) _setValue(v);
  };

  const setPurchasesCount = (v: string) => {
    if (!Number.isInteger(Number(v)) || !balance) return;
    if (Number(v) < 1) _setPurchasesCount("1");
    else if (Number(v) > Number(balance))
      _setPurchasesCount(balance.toString());
    else _setPurchasesCount(v);
  };

  const addPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + 1));
  };

  const subPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + -1));
  };

  const getTotalCount = () => {
    try {
      return formatEther(parseEther(value) * BigInt(purchasesCount));
    } catch {
      return "0";
    }
  };

  const listing = async () => {
    if (Number(value) <= 0) return;
    setIsLoading(true);

    try {
      if (!isApprovedForAll) {
        const tx = await nftContract?.setApprovalForAll(marketAddress, true);
        await tx.wait();
      }

      marketContract
        ?.listing(nft.id, parseEther(getTotalCount()), purchasesCount)
        .then((tx) =>
          tx
            .wait()
            .then()
            .finally(() => {
              setIsLoading(false);
              onClose();
            })
        )
        .catch(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex  items-center justify-center z-50 overflow-hidden text-[#121212]">
      <div
        className="fixed inset-0 bg-black opacity-80"
        onClick={() => !isLoading && onClose()}
      ></div>
      <div className="bg-white rounded-[12px] z-10 w-[550px] flex flex-col">
        <div className="px-6 pt-8 pb-4 flex justify-between">
          <h1 className="text-[24px]  font-bold">리스팅</h1>
          <button
            className=" hover:text-[#545454]"
            onClick={() => !isLoading && onClose()}
          >
            <MdClose size={24} />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="px-4 py-2 flex gap-7 border-b border-[#ECECEC] pb-6">
            <div className="w-fit border border-[#E2E2E2] rounded-[10px]">
              <img src="/nft.png" className="w-[72px] object-contain" />
            </div>
            <div className="flex flex-col grow justify-center">
              <div className="text-[16px] text-[#121212] font-semibold">
                {nft?.name}
              </div>
              <div className="text-[14px] text-[#545454]">Project 3</div>
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <h2 className="font-semibold mb-3">가격</h2>
            <div className="relative w-full mb-6">
              <input
                className="outline-none border border-[#ECECEC] rounded-[12px] h-12 p-3 w-full"
                placeholder="입력"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></input>
              <div className="absolute top-0 right-0 h-full  w-[116px] rounded-r-[12px] p-3 font-semibold border-l border-[#E2E2E2]">
                ETH
              </div>
            </div>

            <h2 className="font-semibold mb-3">개수</h2>
            <div className="flex justify-between items-center w-full h-[48px] p-3 border border-[#E2E2E2] rounded-[12px] mb-6">
              <button className="w-6 h-6" onClick={subPurchasesCount}>
                <MdOutlineRemove size={"full"} />
              </button>
              <input
                className="outline-none w-[76px] text-center bg-white"
                value={purchasesCount}
                onChange={(e) => setPurchasesCount(e.target.value)}
              />
              <button className="w-6 h-6" onClick={addPurchasesCount}>
                <MdOutlineAdd size={"full"} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold mb-3">총 가격</h2>
              <h2 className="font-semibold mb-3">{getTotalCount()} ETH</h2>
            </div>
            <div className="py-2 w-full">
              <button
                className="bg-default-color rounded-[12px] text-white font-bold h-12 w-full flex justify-center items-center"
                onClick={listing}
              >
                {isLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  <span>{isApprovedForAll ? "등록" : "승인"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
