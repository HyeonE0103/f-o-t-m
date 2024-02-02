import { useQuery } from 'react-query'
import { useInView } from 'react-intersection-observer'

import Skeleton from '@shared/Skeleton'
import Spacing from '@shared/Spacing'
import { css } from '@emotion/react'

function Review() {
  const { ref, inView } = useInView({
    //ref는 보여지는곳을 캐칭하고 싶은곳에 넣음, inView는 해당 요소가 보이는지 여부
    triggerOnce: true,
    //최초에 한번만 동작(원래는 보이면 true고 안보이면 false로 계속 바뀌는데 보이면 고정 true로 고정)
  })

  const { data = [], isLoading } = useQuery(
    ['review'],
    () => {
      return new Promise<string[]>((resolve) => {
        setTimeout(() => {
          resolve(['너무 좋아요', '꼭 신청하세요 !!'])
        }, 2_000)
      })
    },
    {
      enabled: inView, //enabled에 inView를 넣어 ref가 보여질때 네트워크 요청
    },
  )

  return (
    <div ref={ref} css={ContainerStyles}>
      {isLoading ? (
        <>
          <Skeleton width={30} height={10} />
          <Spacing size={3} />
          <Skeleton width={30} height={10} />
        </>
      ) : (
        data.map((review, i) => <div key={i}>{review}</div>)
      )}
    </div>
  )
}

const ContainerStyles = css`
  padding: 0 24px 80px 24px;
`

export default Review
