import { css } from '@emotion/react'
import React from 'react'
import Flex from './Flex'
import Text from './Text'

interface ListRowProps {
  left?: React.ReactNode
  contents: React.ReactNode
  right?: React.ReactNode
  withArrow?: boolean
  onClick?: () => void
  as?: 'div' | 'li'
}

const ListRow = ({
  left,
  contents,
  right,
  withArrow,
  onClick,
  as = 'li',
}: ListRowProps) => {
  return (
    <Flex align="center" as={as} css={listRowContainerStyles} onClick={onClick}>
      {/* 지금은 div이기 때문에 li로 사용하고 싶어서 as=li */}
      <Flex css={listRowLeftStyles}>{left}</Flex>
      <Flex css={listRowContentsStyles}>{contents}</Flex>
      <Flex>{right}</Flex>
      {withArrow ? <IconArrowRight /> : null}
    </Flex>
  )
}

const listRowContainerStyles = css`
  padding: 8px 24px;
`

const listRowLeftStyles = css`
  padding-right: 14px;
`

const listRowContentsStyles = css`
  flex: 1;
`

const ListRowTexts = ({
  title,
  subTitle,
}: {
  title: string
  subTitle: string
}) => {
  return (
    <Flex direction="column">
      <Text bold={true}>{title}</Text>
      <Text typography="t7">{subTitle}</Text>
    </Flex>
  )
}

const IconArrowRight = () => {
  return (
    <svg
      height={25}
      viewBox="0 0 48 48"
      width={25}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z" />
      <path d="M0-.25h48v48h-48z" fill="none" />
    </svg>
  )
}

ListRow.Texts = ListRowTexts
//함수도 객체이기 때문에 키와 밸류를 이용해서 컴포넌트를 넣어 줄 수 있음
export default ListRow
