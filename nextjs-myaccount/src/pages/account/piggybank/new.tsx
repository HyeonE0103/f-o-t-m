import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { useMutation } from 'react-query'

import withAuth from '@hooks/withAuth'

import TextField from '@shared/TextField'
import Flex from '@shared/Flex'
import { Piggybank } from '@models/piggybank'
import useUser from '@hooks/useUser'
import { createPiggybank } from '@remote/piggybank'
import { useAlertContext } from '@contexts/AlertContext'

const FixedBottomButton = dynamic(
  () => import('@/components/shared/FixedBottomButton'),
  {
    ssr: false,
  },
)

function NewPiggybankPage() {
  const { open } = useAlertContext()
  const [formValues, setFormValues] = useState({
    name: '',
    endDate: '',
    goalAmount: '',
  })

  const user = useUser()

  const { mutate, isLoading } = useMutation(
    (newPiggybank: Piggybank) => createPiggybank(newPiggybank),
    {
      onSuccess: () => {
        open({
          title: '새로운 저금통을 만들었어요',
          onButtonClick: () => {
            window.history.back()
          },
        })
      },
      onError: () => {
        open({
          title: '저금통을 만들지 못했어요',
          description: '잠시 후 다시 시도해주세요',
          onButtonClick: () => {
            window.history.back()
          },
        })
      },
    },
  )

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const handleSubmit = () => {
    const newPiggybank = {
      ...formValues,
      goalAmount: Number(formValues.goalAmount),
      //string으로 되어있어 Number타입으로 변경
      userId: user?.id as string,
      startDate: new Date(),
      endDate: new Date(formValues.endDate),
      ////string으로 되어있어 Date타입으로 변경
      balance: 0,
    } as Piggybank

    mutate(newPiggybank)
  }

  const minDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  return (
    <div>
      <Flex direction="column">
        <TextField
          name="name"
          label="통장이름"
          value={formValues.name}
          onChange={handleFormValues}
        />
        <TextField
          name="endDate"
          type="date"
          label="종료일자"
          min={minDate}
          //min을 넣어주면 최소 이날부터 선택할수 있음
          value={formValues.endDate}
          onChange={handleFormValues}
        />
        <TextField
          name="goalAmount"
          type="number"
          label="목표금액"
          value={formValues.goalAmount}
          onChange={handleFormValues}
        />
      </Flex>

      <FixedBottomButton
        disabled={isLoading === true}
        //mutate되는 동안 즉, 통장이 DB에 올라가는 동안은 버튼 disable
        label="저금통 생성하기"
        onClick={handleSubmit}
      />
    </div>
  )
}

export default withAuth(NewPiggybankPage)
