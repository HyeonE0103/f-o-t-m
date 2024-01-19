"use client";

import { mapState } from "@/atom";
import { useState } from "react";
import { MdOutlineMyLocation } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import FullPageLoader from "./FullPageLoader";

export default function CurrentLocationButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const map = useRecoilValue(mapState);

  const handleCurrentPosition = () => {
    setLoading(true); //로딩중 로더 보여주기

    // geolocation으로 현재위치 가져오기

    const options = {
      enableHighAccuracy: false, //정확도가 높아지지만 느려져서 false
      timeout: 5000, //5초
      maximumAge: Infinity, //캐싱함
    };

    if (navigator.geolocation && map) {
      //map이 있고 사용자 동의를 받았을 경우
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //성공시
          const currentPosition = new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          if (currentPosition) {
            //유저 좌표가 있다면
            setLoading(false);
            map.panTo(currentPosition); //panTo는 중심 좌표를 이동하는 메서드
            //map any타입을 지정해주니 panTo에 일어난 타입 에러 없어짐
            toast.success("현재 위치로 이동되었습니다.");
          }

          return currentPosition;
        },
        () => {
          //실패시
          toast.error("현재 위치를 가져올 수 없습니다.");
          setLoading(false);
        },
        options //옵션
      );
    }
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <button
        type="button"
        onClick={handleCurrentPosition}
        className="fixed z-10 p-2 shadow right-10 bottom-20 bg-white rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-200"
      >
        <MdOutlineMyLocation className="w-5 h-5" />
      </button>
    </>
  );
}
