import dynamic from 'next/dynamic'
import Account from '@/components/home/Account'
import { BannerSkeleton } from '@/components/home/EventBanners'
import { CreditScoreSkeleton } from '@/components/home/CreditScore'
import Spacing from '@/components/shared/Spacing'
import { CardListSkeleton } from '@/components/home/CardList'

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
