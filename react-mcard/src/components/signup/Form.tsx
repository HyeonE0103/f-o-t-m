import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { css } from '@emotion/react'
import validator from 'validator'

import { FormValues } from '@/models/signup'
import FixedBottomButton from '@shared/FixedBottomButton'
import Flex from '@shared/Flex'
import Spacing from '@shared/Spacing'
import TextField from '@shared/TextField'

const Form = ({ onSubmit }: { onSubmit: (formValues: FormValues) => void }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
    rePassword: '',
    name: '',
  })
  const [dirty, setDirty] = useState<Partial<FormValues>>({})

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDirty((prevDirty) => ({
      ...prevDirty, //기존 값은 그대로
      [e.target.name]: 'true', //true라면 유저가 해당 input을 건드림
      //FormValues에 해당 값들이 string으로 되어있기 때문에 true보단 'true'로 설정
    }))
  }, [])

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    /*상태값이 변하기 때문에 계속 리렌더링이 일어나 함수가 새롭게 생성되는데
    해당 함수는 바깥에 값이 의존하고 있지 않기 때문에 useCallback으로 만드는게 이득*/
    setFormValues((prevFormValues) => ({
      ...prevFormValues, //기존 값은 그대로
      [e.target.name]: e.target.value, //변경된 input만 바꾸기
    }))
  }, [])

  const errors = useMemo(() => validate(formValues), [formValues])
  //useMemo를 사용해서 formValues가 변할때마다 의존성 체크

  const isDone = Object.keys(errors).length === 0

  return (
    <Flex direction="column" css={formContainerStyle}>
      <TextField
        label="이메일"
        placeholder="olaf@gmail.com"
        value={formValues.email}
        onChange={handleFormValues}
        name="email" //어떤 input이 변경되고 있는지 확인할 수 있도록 name지정
        hasError={Boolean(dirty.email) && Boolean(errors.email)} //빈문자열이 아니라면 true로 판단
        helpMessage={Boolean(dirty.email) && errors.email} //해당 input을 유저가 건드렸을때 잘못한 경우에 에러를 보여주는 방식
        onBlur={handleBlur} //포커스가 해지되었다면 input을 건드려봤다는 의미
      />
      <Spacing size={16} />
      <TextField
        label="패스워드"
        type="password"
        value={formValues.password}
        onChange={handleFormValues}
        name="password"
        hasError={Boolean(dirty.password) && Boolean(errors.password)}
        helpMessage={Boolean(dirty.password) && errors.password}
        onBlur={handleBlur}
      />
      <Spacing size={16} />
      <TextField
        label="패스워드 재확인"
        type="password"
        value={formValues.rePassword}
        onChange={handleFormValues}
        name="rePassword"
        hasError={Boolean(dirty.rePassword) && Boolean(errors.rePassword)}
        helpMessage={Boolean(dirty.rePassword) && errors.rePassword}
        onBlur={handleBlur}
      />
      <Spacing size={16} />
      <TextField
        label="이름"
        placeholder="올라프"
        value={formValues.name}
        onChange={handleFormValues}
        name="name"
        hasError={Boolean(dirty.name) && Boolean(errors.name)}
        helpMessage={Boolean(dirty.name) && errors.name}
        onBlur={handleBlur}
      />
      <FixedBottomButton
        label="회원가입"
        onClick={() => {
          onSubmit(formValues)
        }}
        disabled={isDone === false}
      />
    </Flex>
  )
}
export default Form

const formContainerStyle = css`
  padding: 24px;
`
const validate = (formValues: FormValues) => {
  let errors: Partial<FormValues> = {}
  //부분적으로 FormValues type을 가지고 있을 수 있음
  //{}, {email:'이메일 형식을 확인해주세요, rePassword:'비밀번호를 확인해주세요'}

  if (validator.isEmail(formValues.email) === false) {
    errors.email = '이메일 형식을 확인해주세요'
  }
  if (formValues.password.length < 8) {
    errors.password = '비밀번호는 8글자 이상 입력해주세요'
  }
  if (formValues.rePassword.length < 8) {
    errors.rePassword = '비밀번호는 8글자 이상 입력해주세요'
  } else if (
    validator.equals(formValues.password, formValues.rePassword) === false
  ) {
    errors.rePassword = '비밀번호를 확인해주세요'
  }
  if (formValues.name.length < 2) {
    errors.name = '이름은 2글자 이상 입력해주세요'
  }
  return errors
}
