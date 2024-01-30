import AdBanners from '@/components/home/AdBanners'
import CardList from '@/components/home/CardList'
import Top from '@/components/shared/Top'

const HomePage = () => {
  return (
    <div>
      <Top
        title="혜택 좋은 카드"
        subTitle="회원님을 위한 혜택 좋은 카드를 추천해드려요"
      />
      <AdBanners />
      <CardList />
    </div>
  )
}

export default HomePage
