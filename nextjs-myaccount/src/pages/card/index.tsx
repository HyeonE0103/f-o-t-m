import { QueryClient, dehydrate, useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

import { getCards } from '@remote/card'
import ListRow from '@shared/ListRow'
import Badge from '@shared/Badge'
import Top from '@shared/Top'
import Input from '@shared/Input'

function CardListPage() {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(['cards'], ({ pageParam }) => getCards(pageParam), {
    getNextPageParam: (snapshot) => {
      return snapshot.lastVisible
    },
  })
  //서버사이드 단계에서 액션호출하고 호출된 액션값을 클라이언트까지 전달
  //서버측에서 이미 한번 실행해서 데이터를 채워놨기 때문에 콘솔로 데이터를
  //확인하면 비어있지 않고 채어 있는 상태에서 시작함

  const navigate = useRouter()

  const loadMore = useCallback(() => {
    if (hasNextPage === false || isFetching) {
      //다음페이지 없거나 fetch중이면
      return
    }

    fetchNextPage()
  }, [hasNextPage, fetchNextPage, isFetching])

  if (data == null) {
    return null
  }

  const cards = data?.pages.map(({ items }) => items).flat()
  //데이터 플랫하게 펼쳐주기

  return (
    <div>
      <Top title="추천카드" subTitle="회원님을 위해 준비했어요" />
      <div style={{ padding: '0 24px 12px 24px' }}>
        <Input
          onFocus={() => {
            navigate.push('/card/search')
          }}
        />
      </div>
      <InfiniteScroll
        dataLength={cards.length}
        hasMore={hasNextPage}
        loader={<ListRow.Skeleton />}
        next={loadMore}
        scrollThreshold="100px"
      >
        <ul>
          {cards.map((card, index) => (
            <ListRow
              key={card.id}
              contents={
                <ListRow.Texts title={`${index + 1}위`} subTitle={card.name} />
              }
              right={
                card.payback != null ? <Badge label={card.payback} /> : null
              }
              withArrow={true}
              onClick={() => {
                navigate.push(`/card/${card.id}`)
              }}
            />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  )
}

export async function getServerSideProps() {
  //서버에서 실행이 되는 단계(getServerSideProps -> app -> Component의 pageProps로 내려가도록)
  console.log('getServerSideProps')

  const client = new QueryClient()

  await client.prefetchInfiniteQuery(['cards'], () => getCards())
  //prefetchInfiniteQuery는 무한 쿼리를 미리 가져오고 캐싱할 때 사용되는 훅
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(client))),
      //서버에서 수행한 데이터를 json형태로 전달
    },
  }
}

export default CardListPage
