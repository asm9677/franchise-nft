import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { MdOutlineAccountCircle, MdOutlineWallet } from "react-icons/md";
import { SlBasket } from "react-icons/sl";
import { useNavigate, useOutletContext } from "react-router-dom";

interface HeaderProps {
  signer: JsonRpcSigner | undefined;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | undefined>>;
  provider: BrowserProvider | undefined;
  setProvider: Dispatch<SetStateAction<BrowserProvider | undefined>>;
  cartList: Cart[];
  navigate: (url: string) => void;
}

const Header: FC<HeaderProps> = ({
  signer,
  setSigner,
  provider,
  setProvider,
  cartList,
  navigate,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("Login");

  const handleScroll = () => {
    setScrolled(window.scrollY > 0);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    setProvider(new BrowserProvider(window.ethereum));
  }, []);

  useEffect(() => {
    if (!signer) {
      setButtonMessage("Login");
    } else {
      setButtonMessage(
        `${signer.address.substring(0, 7)}...${signer.address.substring(
          signer.address.length - 5
        )}`
      );
    }
  }, [signer]);

  return (
    <>
      <nav
        className={`header bg-transparent w-full fixed top-0 left-0 ${
          scrolled && "header-scrolled font-bold "
        } duration-150 z-50 bg-white border-b border-[#121212]/[0.08]`}
      >
        <div
          className={`flex justify-between items-center h-[100px] text-[20px] font-[400] px-16 mx-auto  `}
        >
          <div className="flex text-default-color max-h-[100px]  overflow-hidden ">
            <img
              className="w-[200px] max-h-[100px] object-cover cursor-pointer mr-8 mb-1"
              src="/pizza_logo.png"
              onClick={() => navigate("/")}
            />

            <button
              className="px-[30px] font-[700] "
              onClick={() => navigate("/swap")}
            >
              스왑
            </button>
            <button
              className="px-[30px] font-[700]"
              onClick={() => navigate("/market")}
            >
              마켓
            </button>
            <button
              className="px-[30px] font-[700]"
              onClick={() => navigate("/search")}
            >
              주문
            </button>
          </div>
          <div className="flex gap-3 text-default-color">
            <button
              className="flex items-center gap-3 rounded-[12px] px-3 bg-default-color/10 hover:bg-default-color/15"
              onClick={() => !signer && provider?.getSigner().then(setSigner)}
            >
              <MdOutlineWallet size={24} />
              <span className="text-[16px] h-6 font-[900] leading-3 flex items-center">
                {buttonMessage}
              </span>
            </button>
            <button
              className="bg-default-color/10 hover:bg-default-color/15 rounded-[12px] p-3 relative"
              onClick={() => navigate("/cart")}
            >
              {cartList.length != 0 && (
                <div className="absolute -top-2 -right-2 rounded-full bg-default-color text-white flex items-center justify-center w-6 h-6 text-[16px]">
                  {cartList.length}
                </div>
              )}
              <SlBasket size={24} />
            </button>
            <button
              className="bg-default-color/10 hover:bg-default-color/15 rounded-[12px] p-3"
              onClick={() => navigate("/account")}
            >
              <MdOutlineAccountCircle size={24} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
