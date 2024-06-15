import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Swap from "./pages/Swap";
import Market from "./pages/Market";
import MarketDetail from "./pages/MarketDetail";
import Menu from "./pages/Menu";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market/:id" element={<MarketDetail />} />
          <Route path="/menu" element={<Menu />} />
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
