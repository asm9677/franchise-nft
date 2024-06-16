import { useState } from "react";
import MenuCard from "../components/Menu/MenuCard";
import cart from "../lib/cart.json";
import CartCard from "../components/CartView/CartCard";
import { MdKeyboardArrowDown } from "react-icons/md";

// import { useOutletContext } from "react-router-dom";

function CartView() {
  //   const { signer, provider, setSigner } = useOutletContext<OutletContext>();

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="mt-[120px] max-w-[1200px] w-full flex flex-col ">
        <h1 className="text-[30px] mb-10 pb-6 border-b border-[#E2E2E2] text-[#121212]">
          장바구니
        </h1>
        <h2 className="text-[20px] mb-6 font-semibold  text-[#121212]">
          수령정보
        </h2>
        <div className="flex flex-col gap-4 border border-[#E2E2E2] rounded-[10px] py-8 px-10 w-full text-[#333333] text-[14px] font-[600]">
          <div className="flex items-center">
            <span className="w-32">주소</span>
            <span className="px-1">
              서울특별시 종로구 종로3길 17, 광화문 D타워 D1동 16층, 17층
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-32">요청 사항</span>
            <button className="flex justify-between h-12 items-center rounded-xl p-3 text-[14px]  font-semibold w-[400px] border transition duration-200 focus-within:shadow-none focus-within:hover:shadow-none border-[#E2E2E2] hover:border-[#B2B2B2] focus-within:border-[#B2B2B2] focus:outline-none">
              <span>문 앞에 두고 문자주세요.</span>
              <MdKeyboardArrowDown size={24} />
            </button>
          </div>
        </div>
        <h2 className="text-[20px] mt-10 mb-6 font-semibold  text-[#121212]">
          주문상품
        </h2>
        <div className="grid grid-cols-1 gap-2 border border-[#E2E2E2] rounded-[10px] py-4 px-4 mb-32">
          {cart.map((v, i) => (
            <CartCard
              key={i}
              id={v.id}
              src={v.src}
              name={v.name}
              amount={v.amount}
            />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-[96px] border-t border-[#E2E2E2] bg-white shadow-top py-5 px-9 ">
        <div className="flex justify-around items-center text-[14px] text-[#767678]">
          <span>주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</span>
          <button className="bg-default-color text-white text-[20px] font-semibold w-[375px] h-[56px] rounded-[6px]">
            20,890원 결제
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartView;
