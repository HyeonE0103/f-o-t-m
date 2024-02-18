import { useQuery } from 'react-query'

import { CHECK_STATUS } from '@constants/credit'

interface useCreditCheckProps {
  onSuccess: (creditScore: number) => void
  //성공했을때 동작하는 함수, creditScore는 조회한 신용점수
  onError: () => void
  //실패했을때 동작하는 함수
  enabled: boolean
  //폴링(polling)을 할지말지 동작하는 값
}

function useCreditCheck({ onSuccess, onError, enabled }: useCreditCheckProps) {
  return useQuery(['useCreditCheck'], () => getCheckStatus(), {
    enabled,
    //폴링을 할지 말지 즉, 계속 호출을 할지 말지 여부
    refetchInterval: 2_000,
    //refetchInterval을 사용해서 2초마다 호출
    staleTime: 0,
    //폴링인께 캐시는 하지 않음
    onSuccess: (status) => {
      // 조회성공 !
      if (status === CHECK_STATUS.COMPLETE) {
        onSuccess(getCreditScore(200, 1000))
      }
    },
    onError,
  })
}

function getCheckStatus() {
  //상태 랜덤 함수
  const values = [
    CHECK_STATUS.REDAY,
    CHECK_STATUS.PROGRESS,
    CHECK_STATUS.COMPLETE,
    CHECK_STATUS.REJECT,
  ]

  const status = values[Math.floor(Math.floor(Math.random() * values.length))]

  if (status === CHECK_STATUS.REJECT) {
    //상태가 REJECT라면 에러 쓰로우
    throw new Error('신용점수 조회에 실패했습니다.')
  }

  return status
}

// ex. 200 ~ 1000점
function getCreditScore(min: number, max: number) {
  //유저 신용점수 랜덤 함수
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default useCreditCheck
