import { useEffect, useState } from "react";
import MenuCard from "../components/Menu/MenuCard";
import menu from "../lib/menu.json";

// import { useOutletContext } from "react-router-dom";

function MenuDetail() {
  //   const { signer, provider, setSigner } = useOutletContext<OutletContext>();

  const [tab, setTab] = useState(1);

  return (
    <section className=" h-[100vh] flex flex-col mt-[100px] w-full  px-16 bg-white items-center">
      <div className="w-full flex  border-b border-[#121212]/[0.08] z-40 max-w-[1200px]">
        <ul className="flex gap-2  py-6 w-full ">
          <li
            className={`px-6 py-3 font-semibold text-[16px] cursor-pointer  ${
              tab == 1
                ? "bg-[#121212]/[0.04] rounded-[10px] text-[#121212]   "
                : "text-[#545454] hover:text-[#121212]"
            }`}
            onClick={() => setTab(1)}
          >
            피자
          </li>
          <li
            className={`px-6 py-3 font-semibold text-[16px] cursor-pointer  ${
              tab == 2
                ? "bg-[#121212]/[0.04] rounded-[10px] text-[#121212]   "
                : "text-[#545454] hover:text-[#121212]"
            }`}
            onClick={() => setTab(2)}
          >
            사이드디시
          </li>
          <li
            className={`px-6 py-3 font-semibold text-[16px] cursor-pointer  ${
              tab == 3
                ? "bg-[#121212]/[0.04] rounded-[10px] text-[#121212]   "
                : "text-[#545454] hover:text-[#121212]"
            }`}
            onClick={() => setTab(3)}
          >
            음료
          </li>
        </ul>
      </div>
      <div className="w-full grid grid-cols-4 mt-12 gap-8   max-w-[1200px]">
        {menu
          .filter((v) => v.type == tab)
          .map((v) => (
            <MenuCard
              key={v.id}
              id={v.id ? v.id : 0}
              src={v.src ? v.src : ""}
              name={v.name}
            />
          ))}{" "}
      </div>
    </section>
  );
}

export default MenuDetail;
