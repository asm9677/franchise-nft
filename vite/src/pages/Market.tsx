import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MarketItems from "../components/Market/MarketItems";
import MarketHistory from "../components/Market/MarketHistory";
import NavNFT from "../components/NavNFT";

function Market() {
  // const { signer, provider, setSigner } = useOutletContext<OutletContext>();

  const [tab, setTab] = useState(0);
  return (
    <section className=" h-[100vh] flex flex-col mt-[100px] w-full  px-16 bg-white">
      <NavNFT tab={tab} setTab={setTab} />

      {tab == 0 && <MarketItems />}
      {tab == 1 && <MarketHistory />}
    </section>
  );
}

export default Market;
