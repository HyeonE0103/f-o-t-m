import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import validator from 'validator'

import Button from '@shared/Button'
import Flex from '@shared/Flex'
import Spacing from '@shared/Spacing'
import Text from '@shared/Text'
import TextField from '@shared/TextField'
import { colors } from '@/styles/colorPalette'
import { FormValues } from '@/models/signin'

import { ChangeEvent, useCallback, useMemo, useState } from 'react'

const Form = ({ onSubmit }: { onSubmit: (formValues: FormValues) => void }) => {
  const [formValues, setFormValues] = useState({ email: '', password: '' })

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const errors = useMemo(() => validate(formValues), [formValues])
  //에러가 있다면 제출이 가능하지 않은 상태

  const isDone = Object.keys(errors).length === 0

  return (
    <Flex direction="column" css={formContainerStyle}>
      <TextField
        label="이메일"
        name="email"
        placeholder="olaf@gmail.com"
        onChange={handleChange}
        value={formValues.email}
      />
      <Spacing size={16} />
      <TextField
        type="password"
        name="password"
        onChange={handleChange}
        value={formValues.password}
      />
      <Spacing size={32} />
      <Button
        size="medium"
        disabled={isDone === false}
        onClick={() => onSubmit(formValues)}
      >
        로그인
      </Button>
      <Spacing size={12} />
      <Link to="/signup" css={linkStyles}>
        <Text typography="t7">아직 계정이 없으신가요?</Text>
      </Link>
    </Flex>
  )
}
export default Form

function validate(formValues: FormValues) {
  let errors: Partial<FormValues> = {}

  //기존에 회원가입에서는 유저에게 정보를 알려주어야 했지만 현재는 정보를 안알려주는것이 좋아서 error 메세지 변경
  if (validator.isEmail(formValues.email) === false) {
    errors.email = 'true'
  }

  if (formValues.password.length < 1) {
    errors.password = 'true'
  }

  return errors
}

const formContainerStyle = css`
  padding: 24px;
`

const linkStyles = css`
  text-align: center;
  & > span:hover {
    color: ${colors.blue};
  }
  /* 해당 컴포넌트 안에 있는 span */
`
