import { StoreType } from "@/interface";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useQuery } from "react-query";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface LikeProps {
  storeId: number;
}

export default function Like({ storeId }: LikeProps) {
  const { data: session, status } = useSession();

  const fetchStore = async () => {
    const { data } = await axios(`/api/stores?id=${storeId}`);
    return data as StoreType;
  };

  const { data: store, refetch } = useQuery<StoreType>(
    `like-store-${storeId}`,
    fetchStore,
    {
      enabled: !!storeId,
      refetchOnWindowFocus: false,
    }
  );

  const toggleLike = async () => {
    // 찜하기/찜취소 로직
    if (session?.user && store) {
      //로그을 했고 가게가 있다면
      try {
        const like = await axios.post("/api/likes", {
          storeId: store.id, //body에 storeId값을 함께 보냄
        });

        if (like.status === 201) {
          toast.success("가게를 찜했습니다.");
        } else {
          toast.warn("찜을 취소했습니다.");
        }
        refetch();
        //찜하기를해도 이전에 가져온 데이터가 유지되기 때문에 새롭게 refetch함
      } catch (e) {
        console.log(e);
      }
    } else if (status === "unauthenticated") {
      //로그인을 하지 않은 경우
      toast.warning("로그인 후 이용해 주세요");
    }
  };

  return (
    <button type="button" onClick={toggleLike}>
      {/* 로그인된 사용자가 좋아요를 눌렀다면? */}
      {status === "authenticated" && store?.likes?.length ? ( //로그인되어있고 좋아요가 되어있다면 붉은하트
        // 특정 유저가 찜한 like 데이터는 각 스토어별로 최대 하나씩 있음
        <AiFillHeart className="hover:text-red-600 focus:text-red-600 text-red-500" />
      ) : (
        <AiOutlineHeart className="hover:text-red-600 focus:text-red-600" />
      )}
    </button>
  );
}
