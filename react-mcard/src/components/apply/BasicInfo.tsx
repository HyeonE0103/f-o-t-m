import { ChangeEvent, useCallback, useState } from 'react'
import Select from '@shared/Select'

import FixedBottomButton from '@shared/FixedBottomButton'

import { 연소득옵션, 신용점수옵션, 결제일옵션 } from '@constants/apply'
import { ApplyValues } from '@models/apply'
import { css } from '@emotion/react'

type InfoValues = Pick<ApplyValues, 'salary' | 'creditScore' | 'payDate'>
//ApplyValues에서 type을 뽑아옴

//옵션에 대한 데이터의 관리
function BasicInfo({ onNext }: { onNext: (infoValues: InfoValues) => void }) {
  const [infoValues, setInfoValues] = useState<InfoValues>({
    salary: '', //연소득
    creditScore: '', //신용점수
    payDate: '', //결제일
  })

  const handleInfoChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setInfoValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const 모든정보가선택되었는가 = Object.values(infoValues).every(
    (value) => value,
  )

  return (
    <div css={containerStyles}>
      <Select
        name="salary"
        label="연소득"
        options={연소득옵션}
        placeholder={연소득옵션[0].label} //아직 선택된것이 없어 첫번째 옵션을 가이드로 줌
        value={infoValues.salary}
        onChange={handleInfoChange}
      />
      <Select
        name="creditScore"
        label="신용점수"
        options={신용점수옵션}
        placeholder={신용점수옵션[0].label}
        value={infoValues.creditScore}
        onChange={handleInfoChange}
      />
      <Select
        name="payDate"
        label="결제일"
        options={결제일옵션}
        placeholder={결제일옵션[0].label}
        value={infoValues.payDate}
        onChange={handleInfoChange}
      />

      <FixedBottomButton
        label="다음"
        onClick={() => {
          onNext(infoValues)
        }}
        disabled={모든정보가선택되었는가 === false}
      />
    </div>
  )
}
export default BasicInfo

const containerStyles = css`
  padding: 24px;
`
