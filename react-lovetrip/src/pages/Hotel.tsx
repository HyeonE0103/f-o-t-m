import ActionButtons from '@/components/hotel/ActionButtons'
import Carousel from '@/components/hotel/Carousel'
import Contents from '@/components/hotel/Contents'
import useHotel from '@/components/hotel/hook/useHotel'
import Map from '@/components/hotel/Map'
import RecommendHotels from '@/components/hotel/RecommendHotels'
import Review from '@/components/hotel/Review'
import Rooms from '@/components/hotel/Rooms'
import Top from '@/components/shared/Top'
import { useParams } from 'react-router-dom'

const HotelPage = () => {
  const { id } = useParams() as { id: string }
  //id값은 string이라고 명시

  const { isLoading, data } = useHotel({ id })

  if (data == null || isLoading) {
    return <div>Loading...</div>
  }

  const { name, comment, images, contents, location, recommendHotels } = data

  return (
    <div>
      <Top title={name} subTitle={comment} />
      <Carousel images={images} />
      <ActionButtons hotel={data} />
      <Rooms hotelId={id} />
      <Contents contents={contents} />
      <Map location={location} />
      <RecommendHotels recommendHotels={recommendHotels} />
      <Review hotelId={id} />
    </div>
  )
}

export default HotelPage
