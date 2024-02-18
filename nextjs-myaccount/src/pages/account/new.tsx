import { useState } from 'react'
import { useRouter } from 'next/router'

import Terms from '@components/account/Terms'
import ProgressBar from '@shared/ProgressBar'
import useUser from '@hooks/useUser'
import { createAccount, getAccount, getTerms, setTerms } from '@remote/account'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { User } from '@models/user'
import Form from '@components/account/Form'
import { Account } from '@models/account'
import FullPageLoader from '@shared/FullPageLoader'
import FixedBottomButton from '@shared/FixedBottomButton'
import withAuth from '@hooks/withAuth'

// STEP 0 = 약관동의
// STEP 1 = 계좌 개설 폼 페이지
// STEP 2 = 완료페이지
const LAST_STEP = 2 // 완료페이지

function AccountNew({ initialStep }: { initialStep: number }) {
  const [step, setStep] = useState(initialStep)
  const user = useUser()
  const navigate = useRouter()

  return (
    <div>
      <ProgressBar progress={step / LAST_STEP} />
      {step === 0 ? (
        <Terms
          onNext={async (termIds) => {
            await setTerms({ userId: user?.id as string, termIds })

            setStep(step + 1)
          }}
        />
      ) : null}

      {step === 1 ? (
        <Form
          onNext={async (formValues) => {
            const newAccount = {
              ...formValues,
              accountNumber: Date.now(),
              //계좌번호를 일단 시간으로 관리
              balance: 0,
              status: 'READY',
              userId: user?.id as string,
            } as Account

            await createAccount(newAccount)

            setStep(step + 1)
          }}
        />
      ) : null}

      {step === 2 ? (
        <>
          <FullPageLoader message="계좌개설 신청이 완료되었어요" />
          <FixedBottomButton
            label="확인"
            onClick={() => {
              navigate.push('/')
            }}
          />
        </>
      ) : null}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  const agreedTerms = await getTerms((session?.user as User).id)

  if (agreedTerms == null) {
    return {
      props: {
        initialStep: 0,
      },
    }
  }

  const account = await getAccount((session?.user as User).id)

  if (account == null) {
    return {
      props: {
        initialStep: 1,
      },
    }
  }

  return {
    props: {
      initialStep: 2,
    },
  }
}

export default withAuth(AccountNew)
