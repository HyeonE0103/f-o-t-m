import { useRouter } from 'next/router'

import withSusepnse from '@/hooks/withSuspense'
import Text from '@shared/Text'

import ListRow from '@shared/ListRow'
import Badge from '@shared/Badge'
import Button from '@shared/Button'
import Skeleton from '@shared/Skeleton'

import useCards from './hooks/useCards'

function CardList() {
  const { data } = useCards()
  const navigate = useRouter()

  const isShowMoreButton = data?.items.length ?? 0 > 5
  //data 객체 안에 5개 이상의 항목이 있는지 확인하는데 undefined/null 이면 길이를 0으로 간주

  return (
    <div style={{ padding: '24px 0' }}>
      <Text
        bold={true}
        style={{ padding: '12px 24px', display: 'inline-block' }}
      >
        추천 카드
      </Text>
      <ul>
        {data?.items.slice(0, 5).map((card, index) => (
          //5개를 짤라서 보여줌
          <ListRow
            key={card.id}
            contents={
              <ListRow.Texts title={`${index + 1}위`} subTitle={card.name} />
            }
            right={card.payback != null ? <Badge label={card.payback} /> : null}
            withArrow={true}
            onClick={() => {
              navigate.push(`/card/${card.id}`)
              //navigate.push를 이용해서 card 상세페이지로 이동
            }}
          />
        ))}
      </ul>
      {isShowMoreButton ? (
        <div style={{ padding: '12px 24px 0 24px' }}>
          <Button
            full={true}
            weak={true}
            size="medium"
            onClick={() => {
              navigate.push('/card')
              //navigate.push를 이용해서 card 페이지로 이동
            }}
          >
            더보기
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function CardListSkeleton() {
  return (
    <div style={{ padding: '24px 0' }}>
      <Text
        bold={true}
        style={{ padding: '12px 24px', display: 'inline-block' }}
      >
        추천 카드
      </Text>
      {[...new Array(5)].map((_, idx) => (
        <ListRow
          key={idx}
          contents={
            <ListRow.Texts
              title={<Skeleton width={30} height={25} />}
              subTitle={<Skeleton width={45} height={20} />}
            />
          }
        />
      ))}
    </div>
  )
}

export default withSusepnse(CardList, { fallback: <CardListSkeleton /> })
