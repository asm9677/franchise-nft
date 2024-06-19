import { FC, useEffect, useState } from "react";
import KakaoMap from "../components/KakaoMap";
import address from "../lib/address.json";
import { MdLocationOn } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import { getDiffDistance } from "../lib/utils";

const Menu: FC = () => {
  const { myLatitude, myLongitude, navigate } =
    useOutletContext<OutletContext>();
  const [stores, setStores] = useState<Address[]>(address);
  const [isSorted, setIsSorted] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number>(37.5709908);
  const [longitude, setLongitude] = useState<number>(126.9789309);

  function FormatDistance(dis: number) {
    if (dis < 1000) return `${dis}M`;
    else return `${(dis / 1000).toFixed(1)}KM`;
  }

  const sortStores = () => {
    if (stores.length === 0 || isSorted) return;

    const temp = [...stores];

    setStores(
      temp.sort(
        (p1, p2) =>
          getDiffDistance(p1, { lat: myLatitude, lng: myLongitude }) -
          getDiffDistance(p2, { lat: myLatitude, lng: myLongitude })
      )
    );
    setIsSorted(true);
  };

  useEffect(() => {
    let id = sessionStorage.getItem("id");
    if (id) moveMenu(id);
  }, []);

  const moveMenu = (id: string) => {
    sessionStorage.setItem("id", id);
    navigate(`/menu/${id}`);
  };

  useEffect(() => {
    setLatitude(myLatitude);
    setLongitude(myLongitude);
    setIsSorted(false);
  }, [myLatitude, myLongitude]);

  useEffect(() => {
    if (!isSorted) sortStores();
  }, [isSorted]);

  return (
    <div className="min-h-screen flex justify-center ">
      <div className="mt-[120px] ">
        <h1 className="text-[30px] mb-20 pb-6 border-b border-[#E2E2E2] text-[#545454]">
          매장 찾기
        </h1>
        <div className="flex">
          <div className="w-[450px] h-[750px] border border-[#E2E2E2] overflow-y-auto">
            {stores.map((v, i) => (
              <div
                key={i}
                className="flex p-5 border-b border-[#E2E2E2] cursor-pointer w-full"
                onClick={() => {
                  setLatitude(v.lat);
                  setLongitude(v.lng);
                }}
              >
                <div className="flex flex-col w-full">
                  <div className="flex text-[#121212] font-[700] items-end">
                    <span>{v.title}</span>
                    <span className="mx-[6px]"></span>
                    <span className="text-[14px] font-[500]">{v.tel}</span>
                  </div>
                  <div className="flex justify-between items-end w-full">
                    <div className="flex items-end text-[#888888] mt-2 text-[14px] leading-[15px] gap-1">
                      <div className="text-default-color">
                        <MdLocationOn size={18} className="" />
                      </div>
                      <div className=" font-[500]">{v.address}</div>
                    </div>
                    <div className="text-default-color text-[14px] font-[600] mx-2 leading-[15px] flex justify-end ">
                      {FormatDistance(
                        getDiffDistance(v, {
                          lat: myLatitude,
                          lng: myLongitude,
                        })
                      )}
                    </div>
                  </div>
                  <button
                    className="bg-default-color rounded-sm h-10 mt-4 text-white font-semibold"
                    onClick={() => moveMenu(v.id.toString())}
                  >
                    주문하기
                  </button>
                </div>
              </div>
            ))}
          </div>
          <KakaoMap
            w={750}
            h={750}
            lat={latitude}
            lng={longitude}
            markers={address}
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
