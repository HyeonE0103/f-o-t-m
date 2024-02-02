import Apply from '@components/apply'
import useAppliedCard from '@components/apply/hooks/useAppliedCard'
import useApplyCardMutation from '@components/apply/hooks/useApplyCardMutation'
import usePollApplyStatus from '@components/apply/hooks/usePollApplyStatus'
import FullPageLoader from '@shared/FullPageLoader'
import { useAlertContext } from '@contexts/AlertContext'
import useUser from '@hooks/auth/useUser'
import { APPLY_STATUS } from '@models/apply'
import { updateApplyCard } from '@remote/apply'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const STATUS_MESSAGE = {
  [APPLY_STATUS.REDAY]: '카드 심사를 준비하고 있습니다',
  [APPLY_STATUS.PROGRESS]: '카드를 심사중입니다 잠시만 기다려주세요',
  [APPLY_STATUS.COMPLETE]: '카드 신청이 완료되었습니다',
}

const ApplyPage = () => {
  const navigate = useNavigate()
  const { open } = useAlertContext()

  const [readyToPoll, setReadyToPoll] = useState(false)

  const user = useUser()
  const { id } = useParams() as { id: string }
  const storageKey = `applied-${user?.uid}-${id}`

  const { data } = useAppliedCard({
    userId: user?.uid as string,
    cardId: id,
    options: {
      onSuccess: (applied) => {
        //applied에는 ApplyValue | null 반환
        if (applied == null) {
          //카드를 신청한적이 없기에 카드를 신청하도록 함
          return
        }

        localStorage.removeItem(storageKey)
        if (applied.status === APPLY_STATUS.COMPLETE) {
          //이미 카드가 발급되어있음 카드를 신청하지 못하도록 함

          open({
            title: '이미 발급 완료된 카드입니다',
            onButtonClick: () => {
              window.history.back()
            },
          })

          return
        }

        setReadyToPoll(true) //카드 신청은 했고 회사에서 심사중일 경우(혹은 재심사)
      },
      onError: () => {},
      suspense: true,
      /*react-query는 처음에 값이 undefined였다가 데이터가 오면 해당 데이터가 오는데
       처음부터 값이 정해져있으면 좋겠어서 suspense를 사용. suspense 방출이 감지되면 fullback이 동작됨*/
    },
  })

  const { data: status } = usePollApplyStatus({
    onSuccess: async () => {
      await updateApplyCard({
        //업데이트의 경우 Promise를 내보내기 때문에 async-await사용
        userId: user?.uid as string,
        cardId: id,
        applyValues: {
          status: APPLY_STATUS.COMPLETE,
          //카드신청의 상태를 성공으로 변경
        },
      })
      navigate('/apply/done?success=true', {
        //카드 심사는 마쳤지만 그에 따른 성공 여부를 쿼리로 표현
        replace: true,
        //replace를 true로 두어 history에 남지 안도록 설정(카드 신청 진행 페이지는 기록에 남기지 않음)
      })
    },
    onError: async () => {
      await updateApplyCard({
        userId: user?.uid as string,
        cardId: id,
        applyValues: {
          status: APPLY_STATUS.REJECT,
          //카드신청의 상태를 실패로 변경
        },
      })
      navigate('/apply/done?success=false', {
        //카드 심사는 마쳤지만 그에 따른 성공 여부를 쿼리로 표현
        replace: true,
      })
    },
    enabled: readyToPoll,
  })

  const { mutate, isLoading: 카드를신청중인가 } = useApplyCardMutation({
    //선언적. 로직이 너무 안으로 숨겨져 버리면 뭐하는지 한눈에 안보이고 가독성이 떨어짐
    onSuccess: () => {
      //값이 추가되었을때: 폴링시작
      setReadyToPoll(true)
    },
    onError: () => {
      //실패했을때: 폴링시작
      //실패했을 경우 alert을 띄우고 alert에 버튼을 눌렀을시 뒤로 가도록 설정
      window.history.back()
    },
  })

  if (data != null && data.status === APPLY_STATUS.COMPLETE) {
    //데이터가 있고 해당 데이터의 상태가 회사 심사 완료상태라면 아무것도 띄우지 않음
    return null
  }

  if (readyToPoll || 카드를신청중인가) {
    //카드가 신청중인지 혹은 카드사에서 심사중인지
    return <FullPageLoader message={STATUS_MESSAGE[status ?? 'REDAY']} />
    //status값이 undefined일수도 있어도 그럴경우 'REDAY'상태
  }

  return <Apply onSubmit={mutate} />
}

export default ApplyPage
