import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MarketItems from "../components/Market/MarketItems";
import MarketHistory from "../components/Market/MarketHistory";

function Market() {
  const { signer, provider, setSigner } = useOutletContext<OutletContext>();

  const [tab, setTab] = useState(0);
  return (
    <section className=" h-[100vh] flex flex-col mt-[100px] w-full  px-16 bg-white">
      <div className="w-full flex  border-b border-[#121212]/[0.08] z-40">
        <ul className="flex gap-2  py-6 w-full">
          <li
            className={`px-6 py-3 font-semibold text-[16px] cursor-pointer  ${
              tab == 0
                ? "bg-[#121212]/[0.04] rounded-[10px] text-[#121212]   "
                : "text-[#545454] hover:text-[#121212]"
            }`}
            onClick={() => setTab(0)}
          >
            Items
          </li>
          <li
            className={`px-6 py-3 font-semibold text-[16px] cursor-pointer  ${
              tab == 1
                ? "bg-[#121212]/[0.04] rounded-[10px] text-[#121212]   "
                : "text-[#545454] hover:text-[#121212]"
            }`}
            onClick={() => setTab(1)}
          >
            History
          </li>
        </ul>
      </div>

      {tab == 0 && <MarketItems />}
      {tab == 1 && <MarketHistory />}
    </section>
  );
}

export default Market;
