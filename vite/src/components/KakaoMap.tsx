import { FC, useEffect, useState } from "react";

const { kakao } = window;

interface KakaoMapProps {
  lat: number;
  lng: number;
  markers: Address[];
  w: number;
  h: number;
}

const KakaoMap: FC<KakaoMapProps> = ({ lat, lng, markers, w, h }) => {
  const [latitude, setLatitude] = useState<number>(37.5709908);
  const [longitude, setLongitude] = useState<number>(126.9789309);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!map) return;
    var moveLatLng = new kakao.maps.LatLng(latitude, longitude);
    map.panTo(moveLatLng);
  }, [latitude, longitude]);

  useEffect(() => {
    setLatitude(lat);
    setLongitude(lng);
  }, [lat, lng]);

  useEffect(() => {
    if (!kakao.maps.Map) return;
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };

    var m = new kakao.maps.Map(container, options);
    setMap(m);
    markers.forEach((v) => {
      var markerPosition = new kakao.maps.LatLng(v.lat, v.lng);
      var imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
        imageSize = new kakao.maps.Size(64, 69),
        imageOption = { offset: new kakao.maps.Point(27, 69) };

      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(m);

      // 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
        content:
          // '<div style="display:flex; justify-content:center; width:220px; padding-top:22px; padding-bottom:22px;">' +
          // '<div class="overlaybox">' +
          // `<span style="font-size:16px; font-weight:600; color:#111111;">${v.title}</span>` +
          // "</div>",
          '<div class="overlaybox">' +
          '    <div class="boxtitle">금주 영화순위</div>' +
          '    <div class="first">' +
          '        <div class="triangle text">1</div>' +
          '        <div class="movietitle text">드래곤 길들이기2</div>' +
          "    </div>" +
          "    <ul>" +
          '        <li class="up">' +
          '            <span class="number">2</span>' +
          '            <span class="title">명량</span>' +
          '            <span class="arrow up"></span>' +
          '            <span class="count">2</span>' +
          "        </li>" +
          "        <li>" +
          '            <span class="number">3</span>' +
          '            <span class="title">해적(바다로 간 산적)</span>' +
          '            <span class="arrow up"></span>' +
          '            <span class="count">6</span>' +
          "        </li>" +
          "        <li>" +
          '            <span class="number">4</span>' +
          '            <span class="title">해무</span>' +
          '            <span class="arrow up"></span>' +
          '            <span class="count">3</span>' +
          "        </li>" +
          "        <li>" +
          '            <span class="number">5</span>' +
          '            <span class="title">안녕, 헤이즐</span>' +
          '            <span class="arrow down"></span>' +
          '            <span class="count">1</span>' +
          "        </li>" +
          "    </ul>" +
          "</div>",
        xAnchor: 0.3,
        yAnchor: 0.91,
      });

      // 마커에 클릭 이벤트를 등록합니다
      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(m, marker);
      });
    });
  }, []);

  useEffect(() => {
    if (!map) return;
  }, []);

  return (
    <>
      <div id="map" style={{ width: `${w}px`, height: `${h}px` }}></div>
    </>
  );
};

export default KakaoMap;
