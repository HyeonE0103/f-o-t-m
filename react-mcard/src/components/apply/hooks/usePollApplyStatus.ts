import { useQuery } from 'react-query'
import { APPLY_STATUS } from '@models/apply'

interface usePollApplyStatusProps {
  onSuccess: () => void
  onError: () => void
  enabled: boolean
}

const usePollApplyStatus = ({
  enabled,
  onSuccess,
  onError,
}: usePollApplyStatusProps) => {
  return useQuery(['applyStatus'], () => getApplyStatus(), {
    enabled,
    refetchInterval: 2_000, //2초마다 폴링
    staleTime: 0, //캐시하지 않음
    onSuccess: (status) => {
      console.log('status', status)
      if (status === APPLY_STATUS.COMPLETE) {
        //apply상태가 성공일때
        onSuccess()
      }
    },
    onError: () => {
      onError()
    },
  })
}

function getApplyStatus() {
  //랜덤하게 상태값을 주는 목 데이터
  const values = [
    APPLY_STATUS.REDAY,
    APPLY_STATUS.PROGRESS,
    APPLY_STATUS.COMPLETE,
    APPLY_STATUS.REJECT,
  ]

  const status = values[Math.floor(Math.random() * values.length)]

  if (status === APPLY_STATUS.REJECT) {
    throw new Error('카드 발급에 실패했습니다.')
  }

  return status //실패했을때 외는 상태값리턴
}

export default usePollApplyStatus
