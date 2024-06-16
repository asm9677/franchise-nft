import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountCard: FC = () => {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="rounded-[10px] overflow-hidden shadow-card cursor-pointer relative pb-10"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate("/market/1")}
    >
      <div className=" overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[#F7F8FF]"></div>
        <img
          src="/nft.png"
          className={`${
            isHover && "scale-110 "
          }   w-full h-full object-cover inset-0 duration-200`}
        />
      </div>
      <div className="p-4 text-[14px] font-semibold text-[#121212]">
        <p>Pudgy Penguin #6446</p>
        <p className="my-2 h-[20px]">10.29 ETH</p>
        <p className="h-[20px] text-[#545454]">Last sale: 0.05 ETH</p>
      </div>
      <button
        className={`absolute bg-default-color h-10 bottom-0 left-0 w-full ${
          isHover ? "-bottom-0" : "-bottom-10"
        } duration-100 text-white font-semibold text-[14px]`}
        onClick={(e) => e.stopPropagation()}
      >
        List for sale
      </button>
    </div>
  );
};

export default AccountCard;
