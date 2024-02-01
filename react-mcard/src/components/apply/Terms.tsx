import React, { MouseEvent, useCallback, useState } from 'react'
import Agreement from '@shared/Agreement'
import { 약관목록 } from '@/constants/apply'
import FixedBottomButton from '../shared/FixedBottomButton'
import { ApplyValues } from '@/models/apply'

const Terms = ({
  onNext,
}: {
  onNext: (terms: ApplyValues['terms']) => void
}) => {
  const [termsAgreements, setTermsAgreements] = useState(() => {
    return 약관목록.reduce<Record<string, boolean>>(
      //Record Type은 Record<Key, Type> 형식으로 키가 Key이고 값이 Type인 객체 타입
      // 약관목록 루프를 돌면서 default value를 만듬
      (prev, term) => ({
        ...prev, //기존의 값 누적
        [term.id]: false, //약관의 id를 false로 세팅
      }),
      {},
    )
  })

  const handleAllAgreement = useCallback(
    //모든 term을 토글링(전체 동의, 전체 동의 해제)
    (_: MouseEvent<HTMLElement>, checked: boolean) => {
      //앞은 e인데 안써서 _로 생략(타입은 적어주어야 함)
      setTermsAgreements((prevTerms) => {
        return Object.keys(prevTerms).reduce(
          (prev, key) => ({
            ...prev,
            [key]: checked,
          }),
          {},
        )
      })
    },
    [],
  )

  const 모든약관이_동의되었는가 = Object.values(termsAgreements).every(
    (동의여부) => 동의여부,
  ) //every는 각 요소가 해당 조건에서 true면 true 반환 아니면 false

  return (
    <div>
      <Agreement>
        <Agreement.Title
          checked={모든약관이_동의되었는가}
          onChange={handleAllAgreement}
        >
          약관에 모두 동의
        </Agreement.Title>
        {약관목록.map(({ id, title, link }) => (
          <Agreement.Description
            key={id}
            link={link}
            checked={termsAgreements[id]}
            onChange={(_, checked) => {
              //해당 함수가 Agreement.Description에 onChange props로 내려짐을 명심
              setTermsAgreements((prevTerms) => ({
                ...prevTerms,
                [id]: checked, //현재 체크한 term에 checked를 변경(토글링)
              }))
            }}
          >
            {title}
          </Agreement.Description>
        ))}
      </Agreement>
      <FixedBottomButton
        label="약관동의"
        disabled={모든약관이_동의되었는가 === false}
        onClick={() => onNext(Object.keys(termsAgreements))}
        //해당 term에 id값을 사용
      />
    </div>
  )
}

export default Terms
