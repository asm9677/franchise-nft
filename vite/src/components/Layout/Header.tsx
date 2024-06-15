import { useEffect, useState } from "react";
import { CiWallet } from "react-icons/ci";
import { SlBasket } from "react-icons/sl";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 0);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <nav
        className={`header bg-transparent w-full fixed top-0 left-0 ${
          scrolled && "header-scrolled font-bold "
        } duration-150 z-50`}
      >
        <div
          className={`flex justify-between items-center h-[100px] text-[20px] font-[400] px-16 mx-auto  `}
        >
          <div className="flex text-default-color max-h-[100px]  overflow-hidden ">
            <img
              className="w-[200px] max-h-[100px] object-cover cursor-pointer mr-8 mb-1"
              src="pizza_logo.png"
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
              onClick={() => navigate("/menu")}
            >
              주문
            </button>
          </div>
          <div className="flex gap-[30px] text-default-color">
            <button className="">
              <SlBasket size={30} />
            </button>
            <button className="flex items-center gap-2 border-2 rounded-md p-2 bg-gray-400">
              <CiWallet size={20} />
              <span className="text-[14px] font-bold">Connect</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
