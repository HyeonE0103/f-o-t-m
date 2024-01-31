import BasicInfo from '@/components/apply/BasicInfo'
import CardInfo from '@/components/apply/CardInfo'
import Terms from '@/components/apply/Terms'
import React, { useState } from 'react'

const ApplyPage = () => {
  const [step, setStep] = useState(0)

  const handleTermsChange = (terms: string[]) => {
    console.log(terms)
  }

  return (
    <div>
      {step === 0 ? <Terms onNext={handleTermsChange} /> : null}
      {/* 해당 약관에 대한 처리는 Terms 컴포넌트가 하되
      특정시점에서 데이터가 어떻게 변하는지는 ApplyPage에서 알수 있으며
      어떤 값을 넘겨주는지도 한눈에 볼수 있음*/}
      {step === 1 ? <BasicInfo /> : null}
      {step === 2 ? <CardInfo /> : null}
    </div>
  )
}

export default ApplyPage
