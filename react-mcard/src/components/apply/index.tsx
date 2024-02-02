import BasicInfo from '@/components/apply/BasicInfo'
import CardInfo from '@/components/apply/CardInfo'
import Terms from '@/components/apply/Terms'
import useUser from '@/hooks/auth/useUser'
import { ApplyValues, APPLY_STATUS } from '@/models/apply'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProgressBar from '@shared/ProgressBar'

const LAST_STEP = 3

const Apply = ({
  onSubmit,
}: {
  onSubmit: (applyValues: ApplyValues) => void
}) => {
  const user = useUser()
  const { id } = useParams() as { id: string }

  const storageKey = `applied-${user?.uid}-${id}`
  //applied - 유저id - 카드id

  const [applyValues, setApplyValues] = useState<Partial<ApplyValues>>(() => {
    /*초기값에 localStorage.getItem()을 바로 쓸 수도 있지만 리액트는 상태가 바뀌면 리렌더링이 됨
    따라서 불필요하게 localStorage.getItem()계속 실행하게 됨 이렇게 함수로 넣게 되면
    리렌더링이 되더라도 최초에 단한번만 실행되는 함수가 됨(더 좋은 방법!)*/

    const applied = localStorage.getItem(storageKey)

    if (applied == null) {
      //값이 없으면 기본값을 넘겨줌
      return {
        userId: user?.uid,
        cardId: id,
        step: 0,
      }
    }

    return JSON.parse(applied)
    //값이 있으면 저장할때 string으로 했으니 다시 돌려서 기본값으로 넘겨줌
  })

  useEffect(() => {
    if (applyValues.step === 3) {
      localStorage.removeItem(storageKey)
      //임시값을 삭제 후 서버로 데이터를 보내 저장

      onSubmit({
        ...applyValues,
        appliedAt: new Date(),
        status: APPLY_STATUS.REDAY,
      } as ApplyValues) //완성된 데이터라고 as 타입을 하지 않으면 ts오류남
    } else {
      /*이미 applyValues를 감시하고 있고 특정한 step에 따라 이미 동작하고 있음
      그래서 step 3에 도달하기 전에 localStorage에 값을 저장해놓고 step 3일때는 서버로 보내도록 설정*/

      localStorage.setItem(storageKey, JSON.stringify(applyValues))
      //localStorage는 key도 value도 string으로 넣어야 하기 때문에 JSON.stringify로 감싸서 저장
    }
  }, [applyValues, onSubmit])

  const handleTermsChange = (terms: ApplyValues['terms']) => {
    //약관목록에 대한 완성된 데이터 후속작업
    setApplyValues((prevValues) => ({
      ...prevValues,
      terms,
      step: (prevValues.step as number) + 1,
      //Partial로 부분적으로 가져오기 때문에 step이 없을수도 있다고 ?로 되어있어 type 지정명시
    }))
  }

  const handleBasicInfoChange = (
    infoValues: Pick<ApplyValues, 'salary' | 'creditScore' | 'payDate'>,
  ) => {
    //유저 정보 옵션에 대한 완성된 데이터 후속작업

    setApplyValues((prevValues) => ({
      ...prevValues,
      infoValues,
      step: (prevValues.step as number) + 1,
    }))
  }

  const handleCardInfoChange = (
    cardInfoValues: Pick<ApplyValues, 'isHipass' | 'isMaster' | 'isRf'>,
  ) => {
    //카드 옵션에 대한 완성된 데이터 후속작업

    setApplyValues((prevValues) => ({
      ...prevValues,
      cardInfoValues,
      step: (prevValues.step as number) + 1,
    }))
  }

  return (
    <div>
      <ProgressBar progress={(applyValues.step as number) / LAST_STEP} />
      {/* Partial<ApplyValues>로 되어있어 ts 오류가 나 as문으로 타입 정의*/}
      {applyValues.step === 0 ? <Terms onNext={handleTermsChange} /> : null}
      {/* 해당 약관에 대한 처리는 Terms 컴포넌트가 하되
      특정시점에서 데이터가 어떻게 변하는지는 ApplyPage에서 알수 있으며
      어떤 값을 넘겨주는지도 한눈에 볼수 있음*/}
      {applyValues.step === 1 ? (
        <BasicInfo onNext={handleBasicInfoChange} />
      ) : null}
      {applyValues.step === 2 ? (
        <CardInfo onNext={handleCardInfoChange} />
      ) : null}
    </div>
  )
}

export default Apply
