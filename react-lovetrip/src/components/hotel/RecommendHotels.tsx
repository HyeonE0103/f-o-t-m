import { useState } from 'react'

import { css } from '@emotion/react'
import Text from '@shared/Text'
import Spacing from '@shared/Spacing'
import ListRow from '@shared/ListRow'
import addDelimiter from '@utils/addDelimiter'

import Button from '@shared/Button'
import { Hotel } from '@/models/hotel'
import useRecommendHotels from './hook/useRecommendHotels'
import { useNavigate } from 'react-router-dom'

const RecommendHotels = ({
  recommendHotels,
}: {
  recommendHotels: string[]
}) => {
  const { data, isLoading } = useRecommendHotels({ hotelIds: recommendHotels })
  const [showMore, setShowMore] = useState(false)
  const navigator = useNavigate()

  if (data == null || isLoading) {
    return null
  }

  const 호텔리스트 = data.length < 3 || showMore ? data : data.slice(0, 3)
  //3개 초과는 많아보여 일단 3개만 보여주기 위해 3개이하라면 그냥 쓰고
  //3개보다 많으면 3개까지만 짤라서 보여주었다가 버튼 클릭으로 상태가 변할시 추천호텔 다 보여줌

  return (
    <div style={{ margin: '24px 0' }}>
      <Text bold={true} typography="t4" style={{ padding: '0 24px' }}>
        추천 호텔
      </Text>
      <Spacing size={16} />
      <ul>
        {호텔리스트.map((hotel: Hotel) => (
          <ListRow
            key={hotel.id}
            style={css`
              cursor: pointer;
            `}
            onClick={() => {
              navigator(`/hotel/${hotel.id}`)
            }}
            left={
              <img
                src={hotel.mainImageUrl}
                alt={`${hotel.name} 이미지`}
                css={imageStyles}
              />
            }
            contents={
              <ListRow.Texts
                title={hotel.name}
                subTitle={`${addDelimiter(hotel.price)}원`}
              />
            }
          />
        ))}
      </ul>
      {data.length > 3 && showMore === false ? (
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <Button
            full={true}
            weak={true}
            onClick={() => {
              setShowMore(true)
            }}
          >
            더보기
          </Button>
        </div>
      ) : null}
    </div>
  )
}

const imageStyles = css`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`

export default RecommendHotels
