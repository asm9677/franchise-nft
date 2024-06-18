import { FC, useEffect, useState } from "react";
import KakaoMap from "../components/KakaoMap";
import address from "../lib/address.json";
import { MdLocationOn } from "react-icons/md";
import { useNavigate, useOutletContext } from "react-router-dom";

interface pointer {
  lat: number;
  lng: number;
}

const Menu: FC = () => {
  const { myLatitude, setMyLatitude, myLongitude, setMyLongitude, notify } =
    useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [stores, setStores] = useState<Address[]>(address);
  const [isSorted, setIsSorted] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number>(37.5709908);
  const [longitude, setLongitude] = useState<number>(126.9789309);

  function FormatDistance(dis: number) {
    if (dis < 1000) return `${dis}M`;
    else return `${(dis / 1000).toFixed(1)}KM`;
  }

  function toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  function getDiffDistance(p1: pointer, p2: pointer) {
    const R = 6371e3; // 지구의 반지름 (미터 단위)

    const radLat1 = toRadians(p1.lat);
    const radLat2 = toRadians(p2.lat);
    const deltaLat = toRadians(p2.lat - p1.lat);
    const deltaLon = toRadians(p2.lng - p1.lng);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(radLat1) *
        Math.cos(radLat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // 거리 계산 (미터 단위)
    return Math.round(distance);
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
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLatitude(position.coords.latitude);
      setMyLongitude(position.coords.longitude);
    });
  }, []);

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
                    onClick={() => navigate("/menu/1")}
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
