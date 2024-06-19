export const formatDate = (timestamp: string) => {
  const target = Number(timestamp);

  const curTime = Date.now() / 1000;
  const res = curTime - target;

  if (res < 60) {
    return `${res.toFixed(0)} seconds ago`;
  } else if (res < 60 * 60) {
    return `${(res / 60).toFixed(0)} minutes ago`;
  } else if (res < 60 * 60 * 24) {
    return `${(res / 60 / 60).toFixed(0)} hours ago`;
  } else if (res < 60 * 60 * 24 * 30) {
    return `${(res / 60 / 60 / 24).toFixed(0)} days ago`;
  } else if (res < 60 * 60 * 24 * 30 * 365) {
    return `${(res / 60 / 60 / 24 / 30).toFixed(0)} months ago`;
  } else return `${(res / 60 / 60 / 24 / 30 / 365).toFixed(0)} years ago`;
};

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function getDiffDistance(p1: pointer, p2: pointer) {
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

import axios from "axios";

export async function getKakaoMapAddress(lat: number, lng: number) {
  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`;
  const headers = {
    Authorization: `KakaoAK ${"9654f3f04595554c597a09a085a90fd0"}`,
  };

  try {
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const address = response.data.documents[0].address.address_name;
      return address;
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching KakaoMap address:", error);
    return null;
  }
}
