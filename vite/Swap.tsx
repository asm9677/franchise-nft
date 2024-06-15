import { useOutletContext } from "react-router-dom";
import SwapWidget from "../components/SwapWidget";

function Swap() {
  const { signer, provider, setSigner } = useOutletContext<OutletContext>();

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <SwapWidget signer={signer} provider={provider} setSigner={setSigner} />
    </div>
  );
}

export default Swap;
