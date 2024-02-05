import { Fragment } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import useHotels from '@components/hotelList/hooks/useHotels'

import Top from '@shared/Top'
import Spacing from '@shared/Spacing'
import HotelItem from '@/components/hotelList/HotelItem'
import useLike from '@/hooks/like/useLike'

function HotelListPage() {
  const { data: hotels, hasNextPage, loadMore } = useHotels()
  const { data: likes, mutate: like } = useLike()

  return (
    <div>
      <Top title="인기 호텔" subTitle="호텔부터 펜션까지 최저가" />

      <InfiniteScroll
        dataLength={hotels?.length ?? 0} //데이터 갯수
        hasMore={hasNextPage} //다음페이지가 있는지
        loader={<></>} //로딩중일때는
        next={loadMore} //다음호출
        scrollThreshold="100px" //어느 위치에서 트리거
      >
        <ul>
          {hotels?.map((hotel, i) => (
            <Fragment key={hotel.id}>
              <HotelItem
                hotel={hotel}
                onLike={like}
                isLike={Boolean(
                  likes?.find((like) => like.hotelId === hotel.id),
                )}
                // find는 조건에 맞는 값 중 첫번째 값을 리턴하고 없으면 undefined 리턴
              />
              {hotels.length - 1 === i ? null : ( //맨 마지막 요소에는 구분자가 없도록
                <Spacing
                  size={8}
                  backgroundColor="gray100"
                  style={{ margin: '20px 0' }}
                />
              )}
            </Fragment>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  )
}

export default HotelListPage
