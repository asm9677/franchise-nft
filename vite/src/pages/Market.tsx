import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MarketItems from "../components/Market/MarketItems";
import MarketHistory from "../components/Market/MarketHistory";
import NavNFT from "../components/NavNFT";
import { Contract } from "ethers";
import { marketAddress, nftAddress } from "../lib/contractAddress";
import marketABI from "../contracts/Market.json";
import nftABI from "../contracts/NFT.json";

function Market() {
  const { signer, provider } = useOutletContext<OutletContext>();
  const [marketContract, setMarketContract] = useState<Contract | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (signer) {
      setMarketContract(new Contract(marketAddress, marketABI, signer));
      setNftContract(new Contract(nftAddress, nftABI, signer));
    } else if (provider) {
      setMarketContract(new Contract(marketAddress, marketABI, provider));
      setNftContract(new Contract(nftAddress, nftABI, provider));
    }
  }, [signer, provider]);

  const [tab, setTab] = useState(0);
  return (
    <section className=" h-[100vh] flex flex-col mt-[100px] w-full  px-16 bg-white">
      <NavNFT tab={tab} setTab={setTab} />

      {tab == 0 && <MarketItems />}
      {tab == 1 && (
        <MarketHistory
          marketContract={marketContract}
          nftContract={nftContract}
        />
      )}
    </section>
  );
}

export default Market;
