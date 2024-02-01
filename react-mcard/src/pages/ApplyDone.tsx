import { parse } from 'qs'
//쿼리스트링을 손쉽게 가져올수 있도록 하는 라이브러리

import Flex from '@shared/Flex'
import Text from '@shared/Text'
import FixedBottomButton from '@shared/FixedBottomButton'
import Spacing from '@/components/shared/Spacing'

function ApplyDone() {
  const { success } = parse(window.location.search, {
    ignoreQueryPrefix: true, //쿼리에 ?까지 포함이기 때문에 이 옵션을 true로 사용해 ?제거
  }) as { success: string }

  return (
    <Flex
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      justify="center"
      align="center"
    >
      <Flex direction="column" align="center">
        <img
          width={120}
          src="https://cdn.pixabay.com/animation/2023/06/13/15/13/15-13-37-55_512.gif"
          alt="Card issuance"
        />

        <Spacing size={120} />
        <Text bold={true} typography="t4">
          {success === 'true'
            ? '카드가 발급되었습니다'
            : '카드 발급에 실패했습니다'}
        </Text>
      </Flex>
      <FixedBottomButton
        label="확인"
        onClick={() => {
          window.history.back()
        }}
      />
    </Flex>

    // <Flex
    //   style={{
    //     position: 'fixed',
    //     top: 0,
    //     right: 0,
    //     bottom: 0,
    //     left: 0,
    //   }}
    //   justify="center"
    //   align="center"
    // >
    //   <Text bold={true}>
    //     {success === 'true'
    //       ? '카드가 발급되었습니다'
    //       : '카드 발급에 실패했습니다'}
    //   </Text>

    //   <FixedBottomButton
    //     label="확인"
    //     onClick={() => {
    //       window.history.back()
    //     }}
    //   />
    // </Flex>
  )
}

export default ApplyDone
