import { useForm } from 'react-hook-form'

import { Hotel, ReservationForm } from '@models/hotel'

import FixedBottomButton from '@shared/FixedBottomButton'
import Text from '@shared/Text'
import TextField from '@shared/TextField'
import Select from '@shared/Select'
import { Fragment, useCallback } from 'react'
import Spacing from '@shared/Spacing'

type FormData = {
  //1. 폼에 type 정의
  [key: string]: string
}

const Form = ({
  forms,
  onSubmit,
  buttonLabel,
}: {
  forms: Hotel['forms']
  onSubmit: (formValues: FormData) => void
  //4. 따라서 onSubmit도 formValues에 FormData로 맞춤
  buttonLabel: string
}) => {
  const { register, formState, handleSubmit } = useForm<FormData>({
    // 2.폼 type을 useForm에 제너릭에 할당하면 handleSubmit에서 FormData를 전달받음
    mode: 'onBlur',
    //mode를 onBlur로 해놓으면 onBlur가 일어났을때 유효성을 검사해줌
  })

  const component = useCallback(
    //폼은 type을 가지고 있어 type에 맞는 폼 그리기
    (form: ReservationForm) => {
      if (form.type === 'TEXT_FIELD') {
        return (
          <TextField
            label={form.label}
            helpMessage={
              (formState.errors[form.id]?.message as string) || form.helpMessage
              //에러메세지가 있다면 에러메세지를 우선적으로 보여주고 없으면 기본 helpMessage 보여줌
            }
            hasError={formState.errors[form.id] != null}
            //formState에 해당 id인 폼에 error가 비어있지 않다면 에러있음
            {...register(form.id, {
              //키값
              required: form.required,
              //필수여부
              pattern: VALIDATION_MESSAGE_MAP[form.id],
            })}
          />
        )
      } else if (form.type === 'SELECT') {
        return (
          <Select
            label={form.label}
            // hasError={formState.errors[form.id] != null}
            options={form.options}
            {...register(form.id, {
              required: form.required,
              pattern: VALIDATION_MESSAGE_MAP[form.id],
            })}
          />
        )
      } else {
        //type이 둘다 아닌 즉 이상한 경우에는 null
        return null
      }
    },
    [register, formState.errors],
  )

  return (
    <div style={{ padding: 24 }}>
      <Text bold={true}>예약정보</Text>

      <Spacing size={16} />

      <form>
        {forms.map((form) => {
          return (
            <Fragment key={form.id}>
              {component(form)}
              <Spacing size={8} />
            </Fragment>
          )
        })}
      </form>

      <Spacing size={80} />

      <FixedBottomButton label={buttonLabel} onClick={handleSubmit(onSubmit)} />
      {/* 3.onSubmit에 폼 type 정의가 내려옴 */}
    </div>
  )
}

const VALIDATION_MESSAGE_MAP: {
  [key: string]: {
    value: RegExp
    //정규식 타입은 RegExp
    message: string
  }
} = {
  name: {
    value: /^[가-힣]+$/,
    //정규식 - 한글만
    message: '한글명을 확인해주세요',
  },
  email: {
    value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    //정규식 - 이메일 형식
    message: '이메일 형식을 확인해주세요',
  },
  phone: {
    value: /^\d+$/,
    //정규식 - 숫자만
    message: '휴대전화번호를 확인해주세요',
  },
}

export default Form
