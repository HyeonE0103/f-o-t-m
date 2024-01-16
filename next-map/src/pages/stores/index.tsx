import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import Loading from "@/components/Loading";
import Loader from "@/components/Loader";
import { StoreType } from "@/interface";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import SearchFilter from "@/components/SearchFilter";

export default function StoreListPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting; //화면의 마지막 게시물까지 왔는지
  const [q, setQ] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  const searchParams = {
    q: q,
    district: district,
  };

  const fetchStores = async ({ pageParam = 1 }) => {
    //page는 1부터 시작
    const { data } = await axios(`/api/stores?page=${pageParam}`, {
      params: {
        limit: 10, //10개의 게시물
        page: pageParam, //현재 페이지
        ...searchParams,
      },
    });

    return data;
  };

  const {
    data: stores,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["stores", searchParams], fetchStores, {
    getNextPageParam: (lastPage: any) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
  });

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      //가져오는 중에 에러 발생하면 알수 있도록
      console.log(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isPageEnd && hasNextPage) {
      //게시물 마지막까지 왔고 다음페이지가 있다면
      timerId = setTimeout(() => {
        fetchNext();
      }, 500);
      //너무 빨리 불러오면 로더 휙하고 지나가기 때문에 0.5초 정도 이후에 다음 게시물 불러오기
    }

    return () => clearTimeout(timerId);
    //클린업 함수를 이용하여 timer 깨끗하게 정리하기
  }, [fetchNext, isPageEnd, hasNextPage]);

  if (isError)
    return (
      <span className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요
      </span>
    );
  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <SearchFilter setQ={setQ} setDistrict={setDistrict} />
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          stores?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((store: StoreType, i: number) => (
                <li className="flex justify-between gap-x-6 py-5" key={i}>
                  <div className="flex gap-x-4">
                    <Image
                      src={
                        store?.category
                          ? `/images/markers/${store?.category}.png`
                          : "/images/markers/default.png"
                      }
                      width={48}
                      height={48}
                      alt="아이콘 이미지"
                    />
                    <div>
                      <div className="text-sm font-semibold leading-6 text-gray-900">
                        {store?.name}
                      </div>
                      <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                        {store?.storeType}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <div className="text-sm font-semibold leading-6 text-gray-900">
                      {store?.address}
                    </div>
                    <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                      {store?.phone || "번호없음"} | {store?.foodCertifyName} |{" "}
                      {store?.category}
                    </div>
                  </div>
                </li>
              ))}
            </React.Fragment>
          ))
        )}
      </ul>
      {/* 로딩중이고 다음페이지가 있을 경우 로더  */}
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </div>
  );
}

export async function getServerSideProps() {
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);

  return {
    props: { stores: stores.data },
  };
}
