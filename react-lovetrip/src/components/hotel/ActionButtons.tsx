import { CopyToClipboard } from 'react-copy-to-clipboard'

import { css } from '@emotion/react'
import Flex from '@shared/Flex'
import Spacing from '@shared/Spacing'
import Text from '@shared/Text'

import useShare from '@hooks/useShare'
import { Hotel } from '@models/hotel'
import useLike from '@/hooks/like/useLike'

function ActionButtons({ hotel }: { hotel: Hotel }) {
  const share = useShare()
  const { data: likes, mutate: like } = useLike()

  const isLike = Boolean(likes?.find((like) => like.hotelId === hotel.id))
  /*상세 목록 찜하기인데 해당 좋아요가 아닌 좋아요의 전체 리스트를 가져와 찾고 있음
  지금은 찜하기 목록도 별로 없고 상세 목록도 별로 없어서 이렇게 간단하게 처리하지만
  리스트가 커질경우 단일만 가져오는 방법을 선택할 수도 있음. 여기서 리스트를
  땡겨온 이유는 캐시된 데이터에 싱크를 맞추고 캐싱 데이터를 사용하기 위함*/

  const { name, comment, mainImageUrl, id } = hotel

  return (
    <Flex css={containerStyles}>
      <Button
        label="찜하기"
        onClick={() => {
          like({
            hotel: {
              name,
              mainImageUrl,
              id,
            },
          })
        }}
        iconUrl={
          isLike
            ? 'https://cdn4.iconfinder.com/data/icons/twitter-29/512/166_Heart_Love_Like_Twitter-64.png'
            : 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-heart-outline-64.png'
        }
      />
      <Button
        label="공유하기"
        onClick={() => {
          share({
            title: name,
            description: comment,
            imageUrl: mainImageUrl,
            buttonLabel: 'Love Trip에서 보기',
          })
        }}
        iconUrl="https://cdn1.iconfinder.com/data/icons/rounded-social-media/512/kakao-64.png"
      />
      <CopyToClipboard
        text={window.location.href}
        onCopy={() => {
          alert('링크가 복사되었습니다.')
        }}
      >
        {/* 이 영역이 클릭됬을때 해당 text가 복사됨 */}
        <Button
          label="링크복사"
          iconUrl="https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/paste-clipboard-copy-512.png"
        />
      </CopyToClipboard>
    </Flex>
  )
}

function Button({
  //공통 버튼 컴포넌트안쓰고 새로 정의
  label,
  iconUrl,
  onClick,
}: {
  label: string
  iconUrl: string
  onClick?: () => void
}) {
  return (
    <Flex direction="column" align="center" onClick={onClick}>
      <img src={iconUrl} alt="" width={30} height={30} />
      {/* 아이콘 */}
      <Spacing size={6} />
      <Text typography="t7">{label}</Text>
    </Flex>
  )
}

const containerStyles = css`
  padding: 24px;
  cursor: pointer;

  & * {
    /* 아래있는 모든 요소들에 flex를 1로 주어서 균등하게 배치 */
    flex: 1;
  }
`

export default ActionButtons
