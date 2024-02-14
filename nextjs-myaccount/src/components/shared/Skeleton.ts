import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { colors } from '@styles/colorPalette'

const opacity = keyframes`
//opacity를 조절하여 깜빡깜빡 하는것처럼 보이게 함
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
`

const Skeleton = styled.div<{
  width: number | string
  height: number | string
}>(({ width, height }) => ({
  width,
  height,
  backgroundColor: colors.gray100,
  animation: `${opacity} 2s ease-in-out 0.5s infinite`,
}))

export default Skeleton
