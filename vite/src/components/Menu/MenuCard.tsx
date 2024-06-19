import { FC, useEffect, useState } from "react";
import {
  MdOutlineAdd,
  MdOutlineRemove,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { useOutletContext } from "react-router-dom";

interface MenuCardProps {
  id: number;
  src: string;
  name: string;
  type?: number;
}

const MenuCard: FC<MenuCardProps> = ({ id, src, name, type }) => {
  const { orderContract, signer, notify, addCart } =
    useOutletContext<OutletContext>();
  const [menu, setMenu] = useState<Menu>();
  const [isHover, setIsHover] = useState(false);
  const [purchasesCount, _setPurchasesCount] = useState<string>("1");

  const setPurchasesCount = (v: string) => {
    if (!Number.isInteger(Number(v))) return;
    if (Number(v) < 1) _setPurchasesCount("1");
    else _setPurchasesCount(v);
  };

  const addPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + 1));
  };

  const subPurchasesCount = () => {
    setPurchasesCount(String(Number(purchasesCount) + -1));
  };

  const put = () => {
    if (!signer) {
      notify("지갑을 연결해주세요!");
      return;
    }
    addCart({
      amount: Number(purchasesCount),
      id,
      name,
      src,
    });
    setPurchasesCount("1");
    notify("장바구니에 추가되었어요!");
  };

  useEffect(() => {
    if (!orderContract) return;
    orderContract.getMenu(id).then(setMenu);
  }, [orderContract]);

  useEffect(() => {
    if (!orderContract) return;
    orderContract.getMenu(id).then(setMenu);
  }, []);

  return (
    <div
      className="rounded-[10px] overflow-hidden shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
        <p>{menu?.name}</p>
        <p className="my-2 h-[20px]">
          {menu && `$${(Number(menu.price) / 10 ** 8).toString()}`}
        </p>
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="flex justify-between items-center grow h-[40px] p-3 border border-[#E2E2E2] rounded-[12px]">
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
          <button
            className="w-[60px] h-[40px] p-3 bg-default-color rounded-lg text-white flex items-center justify-center"
            onClick={put}
          >
            <MdOutlineShoppingCart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
