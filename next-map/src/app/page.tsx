import Map from "@/components/Map";
import Markers from "@/components/Markers";
import StoreBox from "@/components/StoreBox";
import CurrentLocationButton from "@/components/CurrentLocationButton";
import { StoreType } from "@/interface";

export default async function Home() {
  const stores: StoreType[] = await getData();
  return (
    <>
      <Map />
      <Markers stores={stores} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  );
}

async function getData() {
  try {
    //초기 빌드시 API URL이 없어서 빌드 에러가나서 배포 불가능 하므로 try-catch로 감싸서 해결
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
      cache: "no-store",
      //매번 요청마다 원서버에 요청이 가도록
    });

    if (!res.ok) {
      //정상적으로 fetch를 못한 경우에는
      throw new Error("Failed to fetch data");
    }

    return res.json(); //json 형식으로 보냄
  } catch (e) {
    console.log(e);
  }
}
