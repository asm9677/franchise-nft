import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import NavNFT from "../components/NavNFT";
import AccountItems from "../components/Account/AccountItems";
import AccountHistory from "../components/Account/AccountHistory";
import { Contract } from "ethers";
import marketABI from "../contracts/Market.json";
import nftABI from "../contracts/NFT.json";
import { marketAddress, nftAddress } from "../lib/contractAddress";

function Account() {
  const { signer, provider } = useOutletContext<OutletContext>();
  const { address } = useParams();
  const navigate = useNavigate();
  const [marketContract, setMarketContract] = useState<Contract | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!address) {
      if (!signer) navigate("/");
      else navigate(`/account/${signer.address}`);
    }
    if (!provider) return;
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

  useEffect(() => {
    console.log(nftContract?.runner);
  }, [nftContract]);

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
