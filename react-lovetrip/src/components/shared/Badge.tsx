import { colors } from '@/styles/colorPalette'
import styled from '@emotion/styled'
import React from 'react'
import Text from './Text'

interface BadgeProps {
  label: string
}

const Badge = ({ label }: BadgeProps) => {
  return (
    <Container>
      <Text bold={true} typography="t7" color="white">
        {label}
      </Text>
    </Container>
  )
}

export default Badge

const Container = styled.div`
  border-radius: 12px;
  background-color: ${colors.blue};
  padding: 2px 8px;
`
