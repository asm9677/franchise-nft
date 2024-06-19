import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import NavNFT from "../components/NavNFT";
import MarketHistory from "../components/Market/MarketHistory";
import MarketItems from "../components/Market/MarketItems";

function Account() {
  const { signer, provider, navigate, nftContract, marketContract } =
    useOutletContext<OutletContext>();

  const { address } = useParams();
  const [account, setAccount] = useState<string>();

  useEffect(() => {
    // console.log(address);
    if (!address) {
      if (!signer) {
        navigate("/");
      } else {
        navigate(`/account/${signer.address}`);
        setAccount(signer.address);
      }
    } else {
      setAccount(address);
    }
    if (!provider) return;
  }, []);

  useEffect(() => {
    // console.log(account);
  }, [account]);

  const [tab, setTab] = useState(0);
  return (
    <section className=" h-[100vh] flex flex-col mt-[100px] w-full  px-16 bg-white">
      <NavNFT tab={tab} setTab={setTab} />

      {tab == 0 && <MarketItems account={account} />}
      {tab == 1 && (
        <MarketHistory
          marketContract={marketContract}
          nftContract={nftContract}
          account={account}
        />
      )}
    </section>
  );
}

export default Account;
