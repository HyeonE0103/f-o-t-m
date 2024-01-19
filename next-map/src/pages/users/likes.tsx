import Loading from "@/components/Loading";
import { LikeApiResponse, LikeInterface } from "@/interface";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination";
import StoreList from "@/components/StoreList";

export default function LikesPage() {
  const router = useRouter();
  const { page = "1" }: any = router.query;

  const fetchLikes = async () => {
    const { data } = await axios(`/api/likes?limit=10&page=${page}`);
    return data as LikeApiResponse;
  };

  const {
    data: likes,
    isError,
    isLoading,
  } = useQuery(`likes-${page}`, fetchLikes);
  //likes라고만 하면 각각의 키를 갖고 있지 않고 캐싱이 되서 다시 오는 시간이 오래 걸림
  //그래서 각각 이름을 주어 페이지별로 query키를 줌

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <h3 className="text-lg font-semibold">찜한 맛집</h3>
      <div className="mt-1 text-gray-500 text-sm">찜한 가게 리스트입니다.</div>
      <ul role="list" className="divide-y divide-gray-100 mt-10">
        {isLoading ? (
          <Loading />
        ) : (
          likes?.data.map((like: LikeInterface, index) => (
            <StoreList store={like.store} key={index} />
          ))
        )}
      </ul>
      {likes?.totalPage && likes?.totalPage > 0 && (
        //페이지네이션이 필요한 경우에만 데이터가 적을 경우에는 필요없음
        <Pagination
          total={likes?.totalPage}
          page={page}
          pathname="/users/likes"
        />
      )}
    </div>
  );
}
