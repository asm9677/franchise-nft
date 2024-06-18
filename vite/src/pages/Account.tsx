import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import NavNFT from "../components/NavNFT";
import AccountItems from "../components/Account/AccountItems";
import AccountHistory from "../components/Account/AccountHistory";

function Account() {
  const { signer, provider, navigate, nftContract, marketContract } =
    useOutletContext<OutletContext>();
  const { address } = useParams();

  useEffect(() => {
    if (!address) {
      if (!signer) navigate("/");
      else navigate(`/account/${signer.address}`);
    }
    if (!provider) return;
  }, []);

  const [tab, setTab] = useState(0);
  return (
    <section className=" h-[100vh] flex flex-col mt-[100px] w-full  px-16 bg-white">
      <NavNFT tab={tab} setTab={setTab} />
      {tab == 0 && (
        <AccountItems
          nftContract={nftContract}
          marketContract={marketContract}
          address={address}
        />
      )}
      {tab == 1 && <AccountHistory />}
    </section>
  );
}

export default Account;
