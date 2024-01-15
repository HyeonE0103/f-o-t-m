import { useState } from "react";

import Map from "@/components/Map";
import Markers from "@/components/Markers";
import StoreBox from "@/components/StoreBox";
import { StoreType } from "@/interface";
import axios from "axios";

export default function Home({ stores }: { stores: any }) {
  const [map, setMap] = useState(null);
  const [currentStore, setCurrentStore] = useState(null);
  return (
    <>
      <Map setMap={setMap} />
      <Markers stores={stores} map={map} setCurrentStore={setCurrentStore} />
      <StoreBox store={currentStore} setStore={setCurrentStore} />
    </>
  );
}

//정적페이지 생성을 위한 데이터를 가져오는 사전 렌더링 함수
export async function getStaticProps() {
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
  //fetch대신 axios를 사용했기 때문에 json으로 바꾼 부분은 없앰
  return {
    props: { stores: stores.data }, //axios response에서 data만 추출해서 사용
    revalidate: 60 * 60, //60분 즉 한시간 마다 업데이트
  };
}
