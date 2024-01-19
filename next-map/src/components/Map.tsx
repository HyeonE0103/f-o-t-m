"use client";

/*global kakao*/
import { Dispatch, SetStateAction, useRef } from "react";
import Script from "next/script";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { locationState, mapState } from "@/atom";

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_LAT = 37.497625203;
const DEFAULT_LNG = 127.03088379;
const DEFAULT_ZOOM = 3;

interface MapProps {
  lat?: string | null;
  lng?: string | null;
  zoom?: number;
}

export default function Map({ lat, lng, zoom }: MapProps) {
  const setMap = useSetRecoilState(mapState);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const location = useRecoilValue(locationState);

  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      /*v3 스크립트를 동적으로 로드하기 위해 사용함
      스크립트의 로딩이 끝나기 전에 v3의 객체에 접근하려고 하면 에러가 발생하기 때문에
      로딩이 끝나느 시점에 콜백을 통해 객체에 접근할 수 있도록 해줌
      비동기 통신으로 페이지에 v3을 동적으로 삽입할 경우에 주로 사용함
      v3 로딩 스크립트 주소에 파라메터로 autoload=false를 지정해주어야 함*/
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new window.kakao.maps.LatLng(
          lat ?? location.lat,
          lng ?? location.lng
        ),
        level: zoom ?? location.zoom,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      setMap(map);
    });
  };
  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
        //페이지가 다 로드가 되고 태그가 생겨야 해당 태그에 추가가 되야 되기 때문
        onReady={loadKakaoMap}
        //페이지가 준비가 되었을때 kakaoMap을 추가
      />
      <div ref={mapRef} className="w-full h-screen"></div>
    </>
  );
}
