import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { css } from '@emotion/react'

import { Event } from '@models/event'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Button from '@shared/Button'
import { typographyMap } from '@styles/typography'

const FixedBottomButton = dynamic(() => import('@shared/FixedBottomButton'), {
  ssr: false,
  //portal과 document에 접근을 하고 있기 때문에 서버측에서 에러나
  //서버 사이드에서는 그리지 않고 클라이언트 사이드에서 그리도록 함
})

function Preview({ data, mode }: { data: Event; mode: 'preview' | 'edit' }) {
  const { title, subTitle, buttonLabel, link, contents } = data
  const router = useRouter()

  return (
    <Flex direction="column">
      <Flex style={{ padding: '12px 24px' }} direction="column">
        <Text bold={true}>{title}</Text>
        <Text typography="t6">{subTitle}</Text>
      </Flex>

      <div css={markdownStyles}>
        <ReactMarkdown>{contents}</ReactMarkdown>
      </div>

      {mode === 'preview' ? (
        //portal을 사용해서 컴포넌트를 뚫고 최상단에 그려지고 있기에 조건에 따라 안보이도록
        <FixedBottomButton
          label={buttonLabel}
          onClick={() => {
            router.push(link)
          }}
        />
      ) : (
        <Button>{buttonLabel}</Button>
      )}
    </Flex>
  )
}

const markdownStyles = css`
  padding: 24px;
  ${typographyMap.t6};

  h1 {
    ${typographyMap.t3};
    font-weight: bold;
    margin: 24px;
  }

  h2 {
    ${typographyMap.t4};
    font-weight: bold;
    margin: 18px;
  }

  ul {
    padding-inline-start: 20px;
    margin: 18px 0;
  }

  li {
    list-style-type: disc;
  }

  p {
    margin: 18px 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`

export default Preview
