import { FC, useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ethers } from "ethers";

const Layout: FC = () => {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
  const [provider, setProvider] = useState<ethers.BrowserProvider>();

  const [myLatitude, setMyLatitude] = useState<number>(37.5709908);
  const [myLongitude, setMyLongitude] = useState<number>(126.9789309);

  useEffect(() => {
    if (!window.ethereum) return;

    setProvider(new ethers.BrowserProvider(window.ethereum));
  }, []);

  return (
    <div className="">
      <Header />
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
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
