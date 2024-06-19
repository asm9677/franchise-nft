import { formatUnits } from "ethers";
import { FC, useEffect, useState } from "react";
import { MdClose, MdOutlineAdd, MdOutlineRemove } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

interface CartCardProps {
  id: number;
  src: string;
  name: string;
  amount: number;
}

const CartCard: FC<CartCardProps> = ({ id, src, name, amount }) => {
  const { changeCart, removeCart, orderContract } =
    useOutletContext<OutletContext>();
  const [purchasesCount, _setPurchasesCount] = useState<string>(String(amount));
  const [price, setPrice] = useState(0n);

  useEffect(() => {
    if (!orderContract) return;
    orderContract.getPizzaUSDPrice(id).then(setPrice);
  }, []);

  const setPurchasesCount = (v: string) => {
    if (!Number.isInteger(Number(v))) return;
    if (Number(v) < 1) _setPurchasesCount("1");
    else _setPurchasesCount(v);
    changeCart(id, Number(v));
  };

  const addPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + 1));
  };

  const subPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + -1));
  };

  return (
    <div className=" px-16 py-10 overflow-hidden border border-[#E2E2E2]  rounded-lg cursor-pointer flex gap-4 text-[14px] font-semibold text-[#121212] items-center justify-between relative">
      <div className="absolute top-3 right-3 text-[#545454]/[0.6]">
        <button onClick={() => removeCart(id)}>
          <MdClose size={24} />
        </button>
      </div>
      <div className=" overflow-hidden h-28 flex-[1]">
        <img
          src={src}
          className={`
          h-full object-cover inset-0`}
        />
      </div>

      <p className="flex-[2]">{name}</p>

      <div className="flex justify-between items-center flex-[1] h-[60px] p-3 border border-[#E2E2E2] rounded-[12px]">
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

      <p className="my-2  flex-[1] h-[20px] text-end">
        {formatUnits(price * BigInt(amount), 8)} USD
      </p>
    </div>
  );
};

export default CartCard;
