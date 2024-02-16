import { useState, MouseEvent } from 'react'

import { 약관목록 } from '@constants/account'
import { Term } from '@models/account'
import Agreement from '@shared/Agreement'
import dynamic from 'next/dynamic'

const FixedBottomButton = dynamic(() => import('@shared/FixedBottomButton'), {
  ssr: false,
})

function Terms({ onNext }: { onNext: (termIds: string[]) => void }) {
  const [termsAgreements, setTermsAgreements] = useState(() =>
    generateIntitalValues(약관목록),
  )

  const handleAgreement = (id: string, checked: boolean) => {
    setTermsAgreements((prevTerms) => {
      return prevTerms.map(
        (term) => (term.id === id ? { ...term, checked } : term),
        //해당 선택한 약관이면 checked를 변경해주고 아니면 기존 약관 상태 그대로
      )
    })
  }

  const handleAllAgreement = (_: MouseEvent<HTMLElement>, checked: boolean) => {
    setTermsAgreements((prevTerms) => {
      //전체 요소 업데이트
      return prevTerms.map((term) => ({ ...term, checked }))
    })
  }

  const 모든약관이_동의되었는가 = termsAgreements.every((term) => term.checked)
  const 모든필수약관이_동의되었는가 = termsAgreements
    //필수약관만 걸러서 걸러진 약관들에 checked가 전부 true인지 확인
    .filter((term) => term.mandatory)
    .every((term) => term.checked)

  return (
    <div>
      <Agreement>
        <Agreement.Title
          checked={모든약관이_동의되었는가}
          onChange={handleAllAgreement}
        >
          약관 모두 동의
        </Agreement.Title>
        {termsAgreements.map((term) => (
          <Agreement.Description
            key={term.id}
            link={term.link}
            checked={term.checked}
            onChange={(_, checked) => handleAgreement(term.id, checked)}
          >
            {term.mandatory ? '[필수]' : '[선택]'} {term.title}
          </Agreement.Description>
        ))}
      </Agreement>
      <FixedBottomButton
        label="약관동의"
        disabled={모든필수약관이_동의되었는가 === false}
        onClick={() => {
          onNext(
            termsAgreements.filter((term) => term.checked).map(({ id }) => id),
            //약관을 순회하면서 선택된 요소들의 id값만 뽑아 함수 인자로 넣어줌
          )
        }}
      />
    </div>
  )
}

function generateIntitalValues(terms: Term[]) {
  return terms.map((term) => ({ ...term, checked: false }))
}

export default Terms
