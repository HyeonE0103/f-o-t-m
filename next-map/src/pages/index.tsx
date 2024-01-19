import { useState } from "react";

import Map from "@/components/Map";
import Markers from "@/components/Markers";
import StoreBox from "@/components/StoreBox";
import axios from "axios";

export default function Home({ stores }: { stores: any }) {
  return (
    <>
      <Map />
      <Markers stores={stores} />
      <StoreBox />
    </>
  );
}

export async function getServerSideProps() {
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
  //fetch대신 axios를 사용했기 때문에 json으로 바꾼 부분은 없앰
  return {
    props: { stores: stores.data }, //axios response에서 data만 추출해서 사용
  };
}
