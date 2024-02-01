import { useMutation } from 'react-query'

import { applyCard } from '@remote/apply'
import { ApplyValues } from '@models/apply'

import { useAlertContext } from '@contexts/AlertContext'

interface useApplyCardMutationProps {
  onSuccess: () => void
  onError: () => void
  //ApplyCard는 카드신청에 대한 정보만 저장하는 역할을 하고 그외에 후속 작업 처리는 다른놈이 맡음
}

function useApplyCardMutation({
  onSuccess,
  onError,
}: useApplyCardMutationProps) {
  const { open } = useAlertContext()

  return useMutation((applyValues: ApplyValues) => applyCard(applyValues), {
    onSuccess: () => {
      onSuccess()
    },
    onError: () => {
      open({
        title: '카드를 신청하지 못했어요. 나중에 다시 시도해주세요.',
        onButtonClick: () => {
          onError()
        },
      })
    },
  })
}

export default useApplyCardMutation
