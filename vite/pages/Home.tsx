import { FC, useState } from "react";
import KakaoMap from "../components/KakaoMap";
const markers = [
  {
    lat: 37.5646872,
    lng: 126.9932306,
    title: "명동점",
  },
  {
    lat: 37.5647872,
    lng: 126.9933306,
    title: "명동점2",
  },
];

const Home: FC = () => {
  const [latitude, setLatitude] = useState<number>(37.5709908);
  const [longitude, setLongitude] = useState<number>(126.9789309);
  return (
    <div className="min-h-screen flex justify-center items-center">
      <KakaoMap lat={latitude} lng={longitude} markers={markers} />
    </div>
  );
};

export default Home;
