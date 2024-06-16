import { FC, useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [provider, setProvider] = useState<BrowserProvider>();

  const [myLatitude, setMyLatitude] = useState<number>(37.5709908);
  const [myLongitude, setMyLongitude] = useState<number>(126.9789309);

  useEffect(() => {
    if (!window.ethereum) return;

    setProvider(new ethers.BrowserProvider(window.ethereum));
  }, []);

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
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
