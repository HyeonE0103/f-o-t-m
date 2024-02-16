import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'
import { getSession } from 'next-auth/react'
import { QueryClient, dehydrate } from 'react-query'

import Account from '@components/home/Account'
import { BannerSkeleton } from '@components/home/EventBanners'
import { CreditScoreSkeleton } from '@components/home/CreditScore'
import Spacing from '@shared/Spacing'
import { CardListSkeleton } from '@components/home/CardList'
import { User } from '@models/user'
import { getAccount } from '@remote/account'

const EventBanners = dynamic(() => import('@/components/home/EventBanners'), {
  ssr: false,
  loading: () => <BannerSkeleton />,
  //파일을 불러올때부터 들썩이게 하고 싶지 않아서
})

const CreditScore = dynamic(() => import('@/components/home/CreditScore'), {
  ssr: false,
  loading: () => <CreditScoreSkeleton />,
})

const CardList = dynamic(() => import('@/components/home/CardList'), {
  ssr: false,
  loading: () => <CardListSkeleton />,
})

export default function Home() {
  return (
    <>
      <EventBanners />
      <Account />
      <Spacing size={8} backgroundColor="gray100" />
      <CreditScore />
      <Spacing size={8} backgroundColor="gray100" />
      <CardList />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (session != null && session.user != null) {
    const client = new QueryClient()

    await client.prefetchQuery(['account', (session.user as User).id], () =>
      getAccount((session.user as User).id),
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
