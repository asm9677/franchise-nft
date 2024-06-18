import { useEffect, useState } from "react";
import MenuCard from "../components/Menu/MenuCard";
import cart from "../lib/cart.json";
import CartCard from "../components/CartView/CartCard";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import { PiShoppingCartLight } from "react-icons/pi";
import { getKakaoMapAddress } from "../lib/utils";

import store from "../lib/address.json";
import { formatEther, formatUnits } from "ethers";
import { BigNumberish } from "ethers";
import { orderAddress } from "../lib/contractAddress";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useOutletContext } from "react-router-dom";

function CartView() {
  const {
    cartList,
    clearCart,
    signer,
    navigate,
    myLatitude,
    myLongitude,
    notify,
    orderContract,
    tokenContract,
  } = useOutletContext<OutletContext>();
  const [homeAddress, setHomeAddress] = useState<string>("");
  const [storeAddress, setStoreAddress] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<BigNumberish>(0n);
  const [totalUSD, setTotalUSD] = useState<BigNumberish>(0n);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allowance, setAllowance] = useState(0n);
  const [balanceOf, setbalanceOf] = useState(0n);
  const [tokenId, setTokenId] = useState(0);

  useEffect(() => {
    if (!signer) {
      navigate("/");
    }
    let id = sessionStorage.getItem("id");
    if (!id) {
      notify("매장을 선택해주세요!");
      navigate("/search");
    }
    setTokenId(Number(id));
    let s = store.find((v) => v.id == Number(id));
    setStoreAddress(`(${s?.title}) ${s?.address}`);
  }, []);

  useEffect(() => {
    getKakaoMapAddress(myLatitude, myLongitude).then(setHomeAddress);
  }, []);

  useEffect(() => {
    if (!tokenContract) return;
    tokenContract.allowance(signer.address, orderAddress).then(setAllowance);
    tokenContract.balanceOf(signer.address).then(setbalanceOf);
  }, [tokenContract]);

  useEffect(() => {}, [balanceOf]);

  useEffect(() => {
    if (!cartList.length) return;
    const menuIds: number[] = cartList.map((v) => v.id);
    const amounts: number[] = cartList.map((v) => v.amount);

    orderContract.getPizzasPrice(menuIds, amounts).then(setTotalPrice);
    orderContract.getPizzasUSDPrice(menuIds, amounts).then(setTotalUSD);
  }, [cartList]);

  const order = async () => {
    if (balanceOf < BigInt(totalPrice) || isLoading) return;

    setIsLoading(true);

    try {
      if (allowance < BigInt(totalPrice)) {
        const tx = await tokenContract?.approve(
          orderAddress,
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
        );
        await tx.wait();
        notify("Approve가 완료되었어요!");
      }

      const menuIds: number[] = cartList.map((v) => v.id);
      const amounts: number[] = cartList.map((v) => v.amount);
      console.log(menuIds, amounts, tokenId);
      orderContract
        .orders(menuIds, amounts, tokenId)
        .then((tx: any) =>
          tx
            .wait()
            .then(() => {
              notify("주문이 완료되었어요!");
              clearCart();
            })
            .finally(() => {
              setIsLoading(false);
            })
        )
        .catch((error: any) => {
          setIsLoading(false);
          console.log(error);
          notify("에러가 발생했어요. 다시시도해주세요!");
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      notify("에러가 발생했어요. 다시시도해주세요!");
    }
  };

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
          <div className="flex items-center mb-2">
            <span className="w-32">매장</span>
            <span className="px-1">{storeAddress}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32">주소</span>
            <span className="px-1">{homeAddress}</span>
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
          {cartList.length ? (
            cartList.map((v, i) => (
              <CartCard
                key={i}
                id={v.id}
                src={v.src}
                name={v.name}
                amount={v.amount}
              />
            ))
          ) : (
            <div className=" flex flex-col items-center justify-center gap-2">
              <PiShoppingCartLight size={150} />
              <div className="text-[32px] text-[#121212]">
                장바구니가 비어 있습니다.
              </div>
              <div className="text-[14px] text-[#545454]">
                맛있는 메뉴를 마음껏 골라 담으세요
              </div>
              <button
                className="bg-default-color text-white text-[20px] font-semibold w-[375px] h-[56px] rounded-[6px] mt-4"
                onClick={() => navigate("/search")}
              >
                메뉴 추가하기
              </button>
            </div>
          )}
        </div>
      </div>
      {cartList.length && (
        <div className="fixed bottom-0 left-0 w-full h-[96px] border-t border-[#E2E2E2] bg-white shadow-top py-5 px-9 ">
          <div className="flex justify-around items-center text-[14px] text-[#767678]">
            <span>주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</span>
            <button
              className={`bg-default-color text-white text-[20px] font-semibold w-[375px] h-[56px] rounded-[6px] flex justify-center items-center ${
                balanceOf < BigInt(totalPrice)
                  ? "bg-default-color/50 cursor-not-allowed"
                  : "bg-default-color"
              }`}
              onClick={order}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                `${Number(formatEther(totalPrice)).toFixed(
                  2
                )}PIZZA ($${formatUnits(totalUSD, 8)}) 결제`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartView;
