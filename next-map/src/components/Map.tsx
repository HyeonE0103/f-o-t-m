/*global kakao*/
import { Dispatch, SetStateAction, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_LAT = 37.497625203;
const DEFAULT_LNG = 127.03088379;

interface MapProps {
  setMap: Dispatch<SetStateAction<any>>; //지도는 type정의를 안했으므로 any
}

export default function Map({ setMap }: MapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      /*v3 스크립트를 동적으로 로드하기 위해 사용함
      스크립트의 로딩이 끝나기 전에 v3의 객체에 접근하려고 하면 에러가 발생하기 때문에
      로딩이 끝나느 시점에 콜백을 통해 객체에 접근할 수 있도록 해줌
      비동기 통신으로 페이지에 v3을 동적으로 삽입할 경우에 주로 사용함
      v3 로딩 스크립트 주소에 파라메터로 autoload=false를 지정해주어야 함*/
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: 3,
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
