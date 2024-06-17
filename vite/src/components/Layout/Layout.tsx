import { FC, useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { Contract } from "ethers";
import { marketAddress, nftAddress } from "../../lib/contractAddress";

import marketABI from "../../contracts/Market.json";
import nftABI from "../../contracts/NFT.json";

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [provider, setProvider] = useState<BrowserProvider>();

  const [myLatitude, setMyLatitude] = useState<number>(37.5709908);
  const [myLongitude, setMyLongitude] = useState<number>(126.9789309);

  const [marketContract, setMarketContract] = useState<Contract | null>();
  const [nftContract, setNftContract] = useState<Contract | null>();

  useEffect(() => {
    if (!window.ethereum) return;

    setProvider(new ethers.BrowserProvider(window.ethereum));
  }, []);

  useEffect(() => {
    if (signer) {
      setMarketContract(new Contract(marketAddress, marketABI, signer));
      setNftContract(new Contract(nftAddress, nftABI, signer));
    } else if (provider) {
      setMarketContract(new Contract(marketAddress, marketABI, provider));
      setNftContract(new Contract(nftAddress, nftABI, provider));
    }
  }, [signer, provider]);

  return (
    <div className="">
      <Header
        signer={signer}
        setSigner={setSigner}
        provider={provider}
        setProvider={setProvider}
      />
      <div className="zzz">
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
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
