import { LocationType, SearchType, StoreType } from "@/interface";
import { atom } from "recoil";

const DEFAULT_LAT = "37.497625203";
const DEFAULT_LNG = "127.03088379";
const DEFAULT_ZOOM = 3;

export const mapState = atom({
  key: "map",
  default: null,
  dangerouslyAllowMutability: true,
  /*리코일은 기본적으로 상태의 불변성을 유지하기 때문에 상태가 변경이 되었을때
  리코일이 해당 변경사항을 감지하고 관련 컴포넌트를 렌더링함
  리코일 상태를 직접적으로 변경하는 kakao Map의 함수를 사용(marker.setMap(map))하기 때문에
  읽기 전용의 상태도 수정할 수 있도록 옵션을 추가해주어야 함
  */
});

export const currentStoreState = atom<StoreType | null>({
  key: "store",
  default: null,
});

export const locationState = atom<LocationType>({
  key: "location",
  default: {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    zoom: DEFAULT_ZOOM,
  },
});

export const searchState = atom<SearchType | null>({
  key: "search",
  default: null,
});
