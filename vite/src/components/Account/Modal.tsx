import { FC, useState } from "react";
import { MdClose, MdOutlineAdd, MdOutlineRemove } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [purchasesCount, setPurchasesCount] = useState<string>("1");

  return (
    <div className="fixed inset-0 flex  items-center justify-center z-50 overflow-hidden text-[#121212]">
      <div
        className="fixed inset-0 bg-black opacity-80"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-[12px] z-10 w-[550px] flex flex-col">
        <div className="px-6 pt-8 pb-4 flex justify-between">
          <h1 className="text-[24px]  font-bold">리스팅</h1>
          <button className=" hover:text-[#545454]" onClick={onClose}>
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
                초록색 슬라임
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
              ></input>
              <div className="absolute top-0 right-0 h-full  w-[116px] rounded-r-[12px] p-3 font-semibold border-l border-[#E2E2E2]">
                ETH
              </div>
            </div>

            <h2 className="font-semibold mb-3">개수</h2>
            <div className="flex justify-between items-center w-full h-[48px] p-3 border border-[#E2E2E2] rounded-[12px] mb-6">
              <button className="w-6 h-6">
                <MdOutlineRemove size={"full"} />
              </button>
              <input
                className="outline-none w-[76px] text-center"
                value={purchasesCount}
                onChange={(e) => setPurchasesCount(e.target.value)}
              />
              <button className="w-6 h-6">
                <MdOutlineAdd size={"full"} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold mb-3">총 가격</h2>
              <h2 className="font-semibold mb-3">1 ETH</h2>
            </div>
            <div className="py-2 w-full">
              <button className="bg-default-color rounded-[12px] text-white font-bold h-12 w-full">
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
