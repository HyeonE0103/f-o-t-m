import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import React, { MouseEvent } from 'react'
import Flex from './Flex'
import Text from './Text'

/**
 * <Agreement>
 *  <Agreement.Title> 약관에 모두 동의 </Agreement.Title>
 *  <Agreement.Description> 약관1 </Agreement.Description>
 *  <Agreement.Description> 약관2 </Agreement.Description>
 * </Agreement>
 */

const Agreement = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex as="ul" direction="column" css={agreementContainerStyles}>
      {children}
    </Flex>
  )
}

const AgreementTitle = ({
  children,
  checked,
  onChange,
}: {
  children: React.ReactNode
  checked: boolean
  onChange: (e: MouseEvent<HTMLElement>, checked: boolean) => void
}) => {
  return (
    <Flex as="li" onClick={(e) => onChange(e, !checked)}>
      {/* 해당 요소를 li로 */}
      <IconCheck withCircle={true} checked={checked} />
      <Text bold={true}>{children}</Text>
      {/* 안에 내용은 자유롭게 쓰되 정해진 Text 스타일을 가져감 */}
    </Flex>
  )
}

const AgreementDescription = ({
  children,
  checked,
  onChange,
  link,
}: {
  link?: string
  children: React.ReactNode
  checked: boolean
  onChange: (e: MouseEvent<HTMLElement>, checked: boolean) => void
}) => {
  return (
    <Flex as="li">
      {/* 해당 요소를 li로 */}
      <Flex //영역분리
        onClick={(e) => {
          onChange(e, !checked)
        }}
      >
        <IconCheck checked={checked} />
        <Text typography="t6">{children}</Text>
      </Flex>
      {link != null ? (
        //링크가 있다면
        <a href={link} target="_blank" rel="noreferrer">
          {/* 새창으로 열기 */}
          <Text typography="t6">링크</Text>
        </a>
      ) : null}
    </Flex>
  )
}

Agreement.Title = AgreementTitle
Agreement.Description = AgreementDescription

export default Agreement

const IconCheck = ({
  checked,
  withCircle = false,
  // withCircle이 true라면 svg에 원을 생기게
}: {
  checked: boolean
  withCircle?: boolean
}) => {
  return (
    <svg id="Layer_1" version="1.1" viewBox="0 0 64 64" width={24} height={24}>
      <g>
        <g id="Icon-Check" transform="translate(328.000000, 278.000000)">
          {withCircle ? (
            <path
              d="M-296-222.6c-12.9,0-23.4-10.5-23.4-23.4c0-12.9,10.5-23.4,23.4-23.4     c12.9,0,23.4,10.5,23.4,23.4C-272.6-233.1-283.1-222.6-296-222.6L-296-222.6z M-296-266.9c-11.5,0-20.9,9.4-20.9,20.9     s9.4,20.9,20.9,20.9s20.9-9.4,20.9-20.9S-284.5-266.9-296-266.9L-296-266.9z"
              id="Fill-43"
              fill={checked ? colors.blue : colors.gray}
            />
          ) : null}
          <polyline
            id="Fill-44"
            points="-298.8,-235.9 -310.7,-247.9 -308.9,-249.7 -298.8,-239.5 -283.1,-255.2      -281.3,-253.4 -298.8,-235.9    "
            fill={checked ? colors.blue : colors.gray}
          />
        </g>
      </g>
    </svg>
  )
}

const agreementContainerStyles = css`
  padding: 24px;

  & li {
    //내부에 있는 li
    cursor: pointer;
  }
`
