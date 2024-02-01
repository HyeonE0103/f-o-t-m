import { forwardRef, SelectHTMLAttributes } from 'react'

import Flex from './Flex'
import Text from './Text'
import styled from '@emotion/styled'
import { colors } from '@styles/colorPalette'
import { Option } from '@models/apply'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  //Select속성들 상속으로 다 받아오기
  label?: string
  options: Option[]
  placeholder?: string //props부분에서 placeholder없다고 ts오류나서 따로 추가
}

const BaseSelect = styled.select`
  height: 52px;
  background-color: ${colors.gray};
  border: none;
  border-radius: 16px;
  padding: 0 16px;
  cursor: pointer;

  &:required:invalid {
    //값이 없거나 값이 온전치 안다면
    color: ${colors.darkgray};
  }
`
//<어떤 Ref를 받을지, 어떤 props를 받을지>
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  //외부로부터 ref를 받을 수 있도록 forwardRef사용
  { label, options, placeholder, value, ...props },
  // props외에도 select에 여러가지 속성들이 들어올 수 있어 ...props로 받아옴
  ref,
) {
  return (
    <Flex direction="column">
      {label ? (
        <Text
          typography="t7"
          color="black"
          display="inline-block"
          style={{ marginBottom: 6 }}
        >
          {label}
        </Text>
      ) : null}
      <BaseSelect required={true} ref={ref} value={value} {...props}>
        {/* select에 required를 주면 값이 필수인 select가 됨 */}
        <option disabled={true} hidden={true} value="">
          {placeholder}
          {/* 값이 선택되지 않았을때 placeholder를 보여줌. 또한 placeholder는 값이 아닌 보여주기 위한 용도임을 명시*/}
        </option>
        {options.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </BaseSelect>
    </Flex>
  )
})

export default Select
