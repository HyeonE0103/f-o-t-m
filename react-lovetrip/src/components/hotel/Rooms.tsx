import qs from 'qs'
import { useNavigate } from 'react-router-dom'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useAlertContext } from '@/contexts/AlertContext'
import useUser from '@/hooks/auth/useUser'
import useRooms from './hook/useRooms'

import Flex from '@shared/Flex'
import Text from '@shared/Text'
import ListRow from '@shared/ListRow'
import Spacing from '@shared/Spacing'
import Tag from '@shared/Tag'
import Button from '@shared/Button'
import addDelimiter from '@/utils/addDelimiter'
import withSusepnse from '../shared/hocs/withSusepnse'

const Rooms = ({ hotelId }: { hotelId: string }) => {
  const { data } = useRooms({ hotelId })
  const user = useUser()
  const { open } = useAlertContext()
  const navigate = useNavigate()

  return (
    <Container>
      <Header justify="space-between" align="center">
        <Text bold={true} typography="t4">
          객실정보
        </Text>
        <Text typography="t6" color="gray400">
          1박, 세금 포함
        </Text>
      </Header>
      <ul>
        {data?.map((room) => {
          const 마감임박인가 = room.avaliableCount === 1
          const 매진인가 = room.avaliableCount === 0

          const params = qs.stringify(
            {
              roomId: room.id,
              hotelId,
            },
            { addQueryPrefix: true },
          )

          return (
            <ListRow
              key={room.id}
              left={
                <img
                  src={room.imageUrl}
                  alt={`${room.roomName} 의 객실 이미지`}
                  css={imageStyles}
                />
              }
              contents={
                <ListRow.Texts
                  title={
                    <Flex>
                      <Text>{room.roomName}</Text>
                      {마감임박인가 === true ? (
                        <>
                          <Spacing size={6} direction="horizontal" />
                          <Tag backgroundColor="red">마감임박</Tag>
                        </>
                      ) : null}
                    </Flex>
                  }
                  subTitle={`${addDelimiter(room.price)}원 / `.concat(
                    room.refundable ? '환불가능' : '환불불가',
                  )}
                />
              }
              right={
                <Button
                  size="medium"
                  disabled={매진인가}
                  onClick={() => {
                    if (user == null) {
                      // 로그인전
                      open({
                        title: '로그인이 필요한 기능입니다',
                        onButtonClick: () => {
                          navigate('/signin')
                        },
                      })

                      return
                    }

                    navigate(`/schedule${params}`)
                  }}
                >
                  {매진인가 === true ? '매진' : '선택'}
                </Button>
              }
            />
          )
        })}
      </ul>
    </Container>
  )
}

const Container = styled.div`
  //동적으로 변하는게 아니기 때문에 css형식이어도 무방
  margin: 40px 0;
`

const Header = styled(Flex)`
  //여기서 Flex는 내가 정의한 공통 컴포넌트인데 그대로 넘겨주어서 사용가능
  //이렇게 사용하면 Flex의 props는 그대로 사용가능하되 스타일이 확장됨
  padding: 0 24px;
  margin-bottom: 20px;
`

const imageStyles = css`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`

export default withSusepnse(Rooms, { fallback: <div>룸 불러오는중...</div> })
