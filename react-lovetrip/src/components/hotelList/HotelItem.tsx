import { css } from '@emotion/react'

import { Hotel } from '@models/hotel'
//Hotel이름이 거쳐서 별칭 사용 interface의 i를 땀
import ListRow from '@shared/ListRow'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Spacing from '@shared/Spacing'
import Tag from '@shared/Tag'
import { useEffect, useState } from 'react'
import { differenceInMilliseconds, parseISO } from 'date-fns'
import formatTime from '@/utils/formatTime'
import { Link } from 'react-router-dom'
import addDelimiter from '@/utils/addDelimiter'

const HotelItem = ({ hotel }: { hotel: Hotel }) => {
  const [remainedTime, setRemainedTime] = useState(0)

  useEffect(() => {
    if (hotel.events == null || hotel.events.promoEndTime == null) {
      //이벤트가 없거나 이벤트 시간이 존재하지 않으면 아무것도 하지 않음
      return
    }

    const promoEndTime = hotel.events.promoEndTime

    const timer = setInterval(() => {
      // setInterval은 어떤 코드를 일정한 시간 간격을 두고 반복해서 실행하고 싶을때 사용
      const 남은초 = differenceInMilliseconds(
        //1초마다 남은 시간 계산
        parseISO(promoEndTime),
        //promoEndTime: 023-10-23T00:00:00+09:00, parseISO(promoEndTime): Mon Oct 23 2023 00:00:00 GMT+0900 (한국 표준시)
        new Date(),
      )
      if (남은초 < 0) {
        clearInterval(timer)
        //시간이 끝나면 타이머 종료
        return
      }
      setRemainedTime(남은초)
      //유저가 계속 1초씩 줄어드는것을 볼수 있도록 상태값 변경
    }, 1_000) //주기는 1초

    return () => {
      clearInterval(timer)
      //컴포넌트가 언마운트 될때 타이머 종료
    }
  }, [hotel.events])

  const tagComponent = () => {
    // tag는 이벤트가 있을경우만 그리기 때문에 조건문이 들어가게 되어
    // 밑에 렌더링에 넣으면 지저분해질꺼 같아 따로뺌
    if (hotel.events == null) {
      return null
    }

    const { name, tagThemeStyle } = hotel.events

    const promotionTxt =
      remainedTime > 0 ? ` - ${formatTime(remainedTime)} 남음` : ''
    //이벤트가 종료됬거나 프로모션이 진행중이 아니면 빈문자열을 진행중이라면 남은시간을 보여줌

    return (
      <div>
        <Tag
          color={tagThemeStyle.fontColor}
          backgroundColor={tagThemeStyle.backgroundColor}
        >
          {name.concat(promotionTxt)}
          {/* name에 concat을 사용해 promotionTxt붙임 */}
        </Tag>
        <Spacing size={8} />
      </div>
    )
  }

  return (
    <div>
      <Link to={`/hotel/${hotel.id}`}>
        <ListRow
          contents={
            <Flex direction="column">
              {tagComponent()}
              <ListRow.Texts
                title={hotel.name}
                subTitle={hotel.comment}
              ></ListRow.Texts>
              <Spacing size={4} />
              <Text typography="t7" color="gray600">
                {hotel.starRating}성급
              </Text>
            </Flex>
          }
          right={
            <Flex direction="column" align="flex-end">
              <img src={hotel.mainImageUrl} alt="" css={imageStyles} />
              <Spacing size={8} />
              <Text bold={true}>{addDelimiter(hotel.price)}원</Text>
            </Flex>
          }
          style={containerStyles}
        />
      </Link>
    </div>
  )
}

const containerStyles = css`
  align-items: flex-start; //박스 중앙에 위치에 있는것을 상단으로 처음부터
`

const imageStyles = css`
  /*css를 태그안에 넣을수도 있지만 그렇게 되면 리렌더링 할때마다 스타일을 새롭게
생성하기 때문에 고정된 스타일의 경우 한번 만들어놓고 갖다 쓰는 것이 좋음*/
  width: 90px;
  height: 110px;
  border-radius: 8px;
  object-fit: cover; //이미지 확대하여 비율은 고정된 크기로 남는 부분 크기에 맞게 잘림
  margin-left: 16px;
`

export default HotelItem
