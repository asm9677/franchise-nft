import { FC, useEffect, useState } from "react";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { Contract } from "ethers";
import {
  marketAddress,
  nftAddress,
  orderAddress,
  routerAddress,
  tokenAddress,
} from "../../lib/contractAddress";

import marketABI from "../../contracts/Market.json";
import nftABI from "../../contracts/NFT.json";
import orderABI from "../../contracts/Order.json";
import tokenABI from "../../contracts/ERC20.json";
import uniswapABI from "../../contracts/uniswapV2.json";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { MdError } from "react-icons/md";

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [provider, setProvider] = useState<BrowserProvider>();

  const [myLatitude, setMyLatitude] = useState<number>(37.5709908);
  const [myLongitude, setMyLongitude] = useState<number>(126.9789309);

  const [marketContract, setMarketContract] = useState<Contract | null>();
  const [nftContract, setNftContract] = useState<Contract | null>();
  const [orderContract, setOrderContract] = useState<Contract | null>();
  const [tokenContract, setTokenContract] = useState<Contract | null>();
  const [uniswapContract, setUniswapContract] = useState<Contract | null>();

  const [cartList, setCartList] = useState<Cart[]>([]);
  const _navigate = useNavigate();

  const navigate = (url: string) => {
    if (url === "/search") {
      if (!signer) {
        notify("지갑을 연결해주세요!");
        return;
      }
    } else if (url === "/cart") {
      if (!signer) {
        notify("지갑을 연결해주세요!");
        return;
      }
    } else if (url === "/account") {
      if (!signer) {
        notify("지갑을 연결해주세요!");
        return;
      }
    }
    _navigate(url);
  };

  const addCart = (item: Cart) => {
    if (cartList.find((v) => v.id == item.id)) {
      setCartList(
        cartList.map((v) => {
          if (v.id == item.id) v.amount += item.amount;
          return v;
        })
      );
    } else {
      setCartList([...cartList, item]);
    }
  };

  const removeCart = (id: number) => {
    setCartList(cartList.filter((v) => v.id != id));
  };

  const clearCart = () => {
    setCartList([]);
  };

  const changeCart = (id: number, amount: number) => {
    if (amount < 1) return;
    setCartList(
      cartList.map((v) => {
        if (v.id == id) v.amount = amount;
        return v;
      })
    );
  };

  const notify = (text: string) => {
    toast.success(text, {
      position: "bottom-right",
      autoClose: 3000,
      icon: <MdError size={24} />,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "bg-default-color text-white",
      bodyClassName: "font-bold",
      progressClassName: "bg-violet-500",
    });
  };

  useEffect(() => {
    if (!window.ethereum) return;

    setProvider(new ethers.BrowserProvider(window.ethereum));
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLatitude(position.coords.latitude);
      setMyLongitude(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    if (signer) {
      setMarketContract(new Contract(marketAddress, marketABI, signer));
      setNftContract(new Contract(nftAddress, nftABI, signer));
      setOrderContract(new Contract(orderAddress, orderABI, signer));
      setTokenContract(new Contract(tokenAddress, tokenABI, signer));
      setUniswapContract(new Contract(routerAddress, uniswapABI, signer));
    } else if (provider) {
      setMarketContract(new Contract(marketAddress, marketABI, provider));
      setNftContract(new Contract(nftAddress, nftABI, provider));
      setOrderContract(new Contract(orderAddress, orderABI, provider));
      setTokenContract(new Contract(tokenAddress, tokenABI, provider));
      setUniswapContract(new Contract(routerAddress, uniswapABI, provider));
    }
  }, [signer, provider]);

  useEffect(() => {
    sessionStorage.clear();
  }, [signer]);

  return (
    <div className="ralative ">
      <Header
        signer={signer}
        setSigner={setSigner}
        provider={provider}
        setProvider={setProvider}
        cartList={cartList}
        navigate={navigate}
      />
      <div className="">
        <Outlet
          context={{
            signer,
            provider,
            setSigner,
            myLatitude,
            setMyLatitude,
            myLongitude,
            setMyLongitude,
            marketContract,
            nftContract,
            orderContract,
            tokenContract,
            uniswapContract,
            addCart,
            removeCart,
            clearCart,
            changeCart,
            cartList,
            notify,
            navigate,
          }}
        />
      </div>
      {/* <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => notify("지갑을 연결해주세요!")}
      >
        Show Toast
      </button> */}
      <ToastContainer />
    </div>
  );
};

export default Layout;
