import { colors } from '@/styles/colorPalette'
import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { createPortal } from 'react-dom'
import Button from './Button'

interface FixedBottomButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}
const FixedBottomButton = ({
  label,
  onClick,
  disabled,
}: FixedBottomButtonProps) => {
  const $portalRoot = document.getElementById('root-portal')

  if ($portalRoot == null) return null

  return createPortal(
    <Container>
      <Button
        disabled={disabled}
        size="medium"
        full={true}
        onClick={onClick}
        css={buttonStyles}
      >
        {label}
      </Button>
    </Container>,
    $portalRoot,
  )
}

export default FixedBottomButton

const slideup = keyframes`
  to{
    transform: translateY(0);
  }
`

const Container = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${colors.white};
  padding: 20px 10px 8px;
  transform: translateY(100%);
  animation: ${slideup} 0.5s ease-in-out forwards;
  //forwards를 안주면 100 - 0 - 100으로 원상태로 돌아와 transform: translateY(100%)상태임
`

const buttonStyles = css`
  border-radius: 8px;
`
