import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import {
  QueryClient,
  dehydrate,
  useQuery,
  useMutation,
  useQueryClient,
} from 'react-query'
import { useMemo } from 'react'

import { getTerms } from '@remote/account'
import { User } from '@models/user'
import useUser from '@/hooks/useUser'
import { 약관목록 } from '@constants/account'
import Top from '@shared/Top'
import Text from '@shared/Text'
import ListRow from '@shared/ListRow'
import Button from '@shared/Button'
import { updateTerms } from '@remote/account'

function TermsPage() {
  const user = useUser()
  const client = useQueryClient()

  const { data } = useQuery(
    ['terms', user?.id],
    () => getTerms(user?.id as string),
    {
      enabled: user != null,
      //유저가 존재할때만 약관 가져오기
    },
  )

  const { mutate, isLoading } = useMutation(
    (termIds: string[]) => updateTerms(user?.id as string, termIds),
    {
      onSuccess: () => {
        client.invalidateQueries(['terms', user?.id])
        //성공했을 경우에는 해당 쿼리키가 상했다고 판단하여 재갱신시킴
      },
      onError: () => {
        // TODO
      },
    },
  )

  const 동의한약관목록 = useMemo(() => {
    if (data == null) {
      //data가 없다는 것은 동의한 약관목록이 없다는 것
      return null
    }

    const 동의전체약관목록 = 약관목록.filter(({ id }) =>
      data.termIds.includes(id),
    )

    const 필수약관목록 = 동의전체약관목록.filter(
      ({ mandatory }) => mandatory === true,
    )
    const 선택약관목록 = 동의전체약관목록.filter(
      ({ mandatory }) => mandatory === false,
    )

    return { 필수약관목록, 선택약관목록 }
  }, [data])

  const handleDisagree = (selectedTermId: string) => {
    // data?.termIds = [1,2,3], selectedTermId(삭제되길 원하는 값) = 2
    //[1,2,3].filter(n => n!==2) => [1,3]
    const updatedTermIds = data?.termIds.filter(
      (termId) => selectedTermId !== termId,
    )

    if (updatedTermIds != null) {
      //undefined일 수도 있기때문에 null이 아닐 경우에만
      mutate(updatedTermIds)
    }
  }

  return (
    <div>
      <Top title="약관" subTitle="약관 리스트 및 철회" />

      {동의한약관목록 == null ? (
        <Text>동의한 약관 목록이 없습니다.</Text>
      ) : (
        <ul>
          {동의한약관목록.필수약관목록.map((term) => (
            <ListRow
              key={term.id}
              contents={
                <ListRow.Texts title={`[필수] ${term.title}`} subTitle="" />
              }
            />
          ))}
          {동의한약관목록.선택약관목록.map((term) => (
            <ListRow
              key={term.id}
              contents={
                <ListRow.Texts title={`[선택] ${term.title}`} subTitle="" />
              }
              right={
                <Button
                  onClick={() => handleDisagree(term.id)}
                  disabled={isLoading === true}
                  //mutate 중이면 버튼 비활성화
                >
                  철회
                </Button>
              }
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  //getSession에 context를 넣어 session에 정보를 가져옴

  if (session != null && session.user != null) {
    const client = new QueryClient()

    await client.prefetchQuery(['terms', (session.user as User).id], () =>
      getTerms((session.user as User).id),
    )

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(client))),
      },
    }
  }

  return {
    props: {},
  }
}

export default TermsPage
