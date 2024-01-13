/*global kakao*/
import Script from "next/script";
import { useRef } from "react";
import * as stores from "@/data/store_data.json";

declare global {
  interface Window {
    //Window객체에서 kakao를 인식할수 있도록 type선언
    kakao: any;
  }
}

const DEFAULT_LAT = 37.534429967212446; //위도
const DEFAULT_LNG = 126.83634640358318; //경도

export default function Map() {
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
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LAT),
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      //식당 데이터 마커 띄우기
      stores?.["DATA"]?.map((store) => {
        //마커가 표시될 위치
        var markerPosition = new window.kakao.maps.LatLng(
          store?.y_dnts,
          store?.x_cnts
        );

        //마커 생성
        var marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        //마커가 지도 위에 표시되도록 설정
        marker.setMap(map);
      });
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
