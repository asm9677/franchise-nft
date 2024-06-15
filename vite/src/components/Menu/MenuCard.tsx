import { FC, useState } from "react";
import {
  MdOutlineAdd,
  MdOutlineRemove,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  id: number;
  src: string;
  name: string;
  type?: number;
}

const MenuCard: FC<MenuCardProps> = ({ id, src, name, type }) => {
  const [isHover, setIsHover] = useState(false);
  const [purchasesCount, setPurchasesCount] = useState<string>("1");
  const navigate = useNavigate();
  return (
    <div
      className="rounded-[10px] overflow-hidden shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate("/menu/1/1")}
    >
      <div className=" overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-default-color/10 "></div>
        <img
          src={src}
          className={`${
            isHover && "scale-110 duration-200"
          }   w-full h-full object-cover inset-0`}
        />
      </div>
      <div className="p-4 text-[14px] font-semibold text-[#121212]">
        <p>{name}</p>
        <p className="my-2 h-[20px]">10.29 ETH</p>
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex justify-between items-center grow h-[40px] p-3 border border-[#E2E2E2] rounded-[12px]">
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
          <button className="w-[60px] h-[40px] p-3 bg-default-color rounded-lg text-white flex items-center justify-center">
            <MdOutlineShoppingCart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
