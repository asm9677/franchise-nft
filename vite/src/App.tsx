import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Swap from "./pages/Swap";
import Market from "./pages/Market";
import MarketDetail from "./pages/MarketDetail";
import SearchStore from "./pages/SearchStore";
import Menu from "./pages/Menu";
import CartView from "./pages/CartView";
import Account from "./pages/Account";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market/:tokenId" element={<MarketDetail />} />
          <Route path="/search" element={<SearchStore />} />
          <Route path="/menu/:tokenId" element={<Menu />} />
          <Route path="/menu/:tokenId/" element={<Menu />} />
          <Route path="/menu/:tokenId/:menuId" element={<Menu />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/account" element={<Account />}>
            <Route path="/account/:address" element={<Account />}></Route>
          </Route>
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
