import { colors } from '@/styles/colorPalette'
import styled from '@emotion/styled'

const Input = styled.input`
  padding: 0 16px;
  font-size: 15px;
  height: 48px;
  font-weight: 500;
  border: 1px solid ${colors.gray};
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.blue};
  }

  &[aria-invalid='true'] {
    //input의 값이 정확하지 않은 값이라고 표현하는 것
    border-color: ${colors.red};
  }
`

export default Input
