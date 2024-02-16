import { useState } from 'react'
import { useMutation } from 'react-query'

import useCreditCheck from '@components/credit/hooks/useCreditCheck'
import { useAlertContext } from '@contexts/AlertContext'
import FullPageLoader from '@shared/FullPageLoader'
import { CHECK_STATUS } from '@constants/credit'
import useUser from '@hooks/useUser'
import { updateCredit } from '@remote/credit'
import FixedBottomButton from '@shared/FixedBottomButton'

function CreditCheckPage() {
  const { open } = useAlertContext()
  const [readyToPoll, setReadyToPoll] = useState(true)
  //폴링에 대한 준비가 되었는지 판단하는 값
  const user = useUser()

  const { mutate } = useMutation((creditScore: number) =>
    updateCredit({ creditScore, userId: user?.id as string }),
  )

  const { data: status } = useCreditCheck({
    onSuccess: (creditScore) => {
      setReadyToPoll(false)
      mutate(creditScore)
    },
    onError: () => {
      setReadyToPoll(false)
      open({
        title: '신용점수 조회에 실패했어요',
        description: '잠시 후 다시 시도해주세요',
        onButtonClick: () => {
          window.history.back()
        },
      })
    },
    enabled: readyToPoll,
  })

  return (
    <div>
      <FullPageLoader message={STATUS_CHECK_MESSAGE[status ?? 'REDAY']} />
      {/* status가 없으면 기본적으롤는 REDAY메세지 사용 */}
      {status === CHECK_STATUS.COMPLETE ? (
        //신용 조회가 완료 되었다면 신용점수 페이지 돌아가기
        <FixedBottomButton
          label="확인"
          onClick={() => {
            window.history.back()
          }}
        />
      ) : null}
    </div>
  )
}

const STATUS_CHECK_MESSAGE = {
  [CHECK_STATUS.REDAY]: '신용점수 조회를 위해 정보를 준비하고있어요',
  [CHECK_STATUS.PROGRESS]: '신용점수를 조회중입니다. 잠시만 기다려주세요',
  [CHECK_STATUS.COMPLETE]: '신용점수 조회가 완료되었습니다',
}

export default CreditCheckPage
