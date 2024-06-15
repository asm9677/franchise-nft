import { FC, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import {
  MdClose,
  MdOutlineAdd,
  MdOutlineRemove,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface CartCardProps {
  id: number;
  src: string;
  name: string;
  amount?: number;
}

const CartCard: FC<CartCardProps> = ({ id, src, name, amount }) => {
  const [isHover, setIsHover] = useState(false);
  const [purchasesCount, setPurchasesCount] = useState<string>(String(amount));
  const navigate = useNavigate();

  return (
    <div
      className=" px-16 py-10 overflow-hidden border border-[#E2E2E2]  rounded-lg cursor-pointer flex text-[14px] font-semibold text-[#121212] items-center justify-between relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="absolute top-3 right-3 text-[#545454]/[0.6]">
        <MdClose size={24} />
      </div>
      <div className=" overflow-hidden h-20">
        <img
          src={src}
          className={`
          h-full object-cover inset-0`}
        />
      </div>

      <p>{name}</p>

      <div className="flex justify-between items-center w-[150px] h-[60px] p-3 border border-[#E2E2E2] rounded-[12px]">
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

      <p className="my-2 h-[20px]">10.29 ETH</p>
    </div>
  );
};

export default CartCard;
